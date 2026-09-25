#!/usr/bin/env ts-node
/**
 * Bank360 — CSV Import Script
 * Imports both banking datasets into MongoDB
 * Usage: npx ts-node scripts/import-csv.ts
 */

import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import mongoose from 'mongoose';

// Load env
const envFile = fs.readFileSync(path.join(process.cwd(), '.env'), 'utf-8');
const env: Record<string, string> = {};
for (const line of envFile.split('\n')) {
  const [k, ...v] = line.split('=');
  if (k && v.length) env[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '');
}

const MONGODB_URI = env.MONGODB_URI?.replace('<db_username>', 'bank360').replace('<db_password>', '');

// Customer schema (inline for script)
interface CustomerRow {
  clientNum: number;
  fullName: string;
  age: number;
  gender: string;
  occupation?: string;
  balance?: number;
  monthlyIncome?: number;
  address?: string;
  originProvince?: string;
  tenureYears?: number;
  maritalStatus?: number;
  numsCards?: number;
  numsServices?: number;
  isActiveMember?: boolean;
  lastActiveDate?: Date;
  lastTransactionMonth?: number;
  createdDate?: Date;
  attritionFlag?: string;
  customerSegment?: string;
  engagementScore?: number;
  loyaltyLevel?: string;
  digitalBehavior?: string;
  riskScore?: number;
  riskSegment?: string;
  clusterGroup?: number;
  creditScore?: number;
  creditLimit?: number;
  totalRevolvingBal?: number;
  avgOpenToBuy?: number;
  avgUtilizationRatio?: number;
  educationLevel?: string;
  incomeCategory?: string;
  dependentCount?: number;
  cardCategory?: string;
  monthsOnBook?: number;
  monthsInactive12Mon?: number;
  contactsCount12Mon?: number;
  totalTransAmt?: number;
  totalTransCt?: number;
  totalAmtChngQ4Q1?: number;
  totalCtChngQ4Q1?: number;
  totalRelationshipCount?: number;
  status?: string;
}

async function importBankChurners() {
  const filePath = path.join(process.cwd(), 'data', 'kaggle', 'BankChurners.csv');
  if (!fs.existsSync(filePath)) {
    console.log('BankChurners.csv not found, skipping...');
    return 0;
  }

  const rows: CustomerRow[] = [];
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        const attrited = row['Attrition_Flag'] === 'Attrited Customer';
        rows.push({
          clientNum: parseInt(row['CLIENTNUM']),
          fullName: `Customer ${row['CLIENTNUM']}`,
          age: parseInt(row['Customer_Age']),
          gender: row['Gender'] === 'M' ? 'male' : 'female',
          educationLevel: row['Education_Level'],
          maritalStatus: row['Marital_Status'],
          dependentCount: parseInt(row['Dependent_count']) || 0,
          incomeCategory: row['Income_Category'],
          cardCategory: row['Card_Category'],
          monthsOnBook: parseInt(row['Months_on_book']) || 0,
          totalRelationshipCount: parseInt(row['Total_Relationship_Count']) || 0,
          monthsInactive12Mon: parseInt(row['Months_Inactive_12_mon']) || 0,
          contactsCount12Mon: parseInt(row['Contacts_Count_12_mon']) || 0,
          creditLimit: parseFloat(row['Credit_Limit']) || 0,
          totalRevolvingBal: parseFloat(row['Total_Revolving_Bal']) || 0,
          avgOpenToBuy: parseFloat(row['Avg_Open_To_Buy']) || 0,
          totalAmtChngQ4Q1: parseFloat(row['Total_Amt_Chng_Q4_Q1']) || 0,
          totalTransAmt: parseFloat(row['Total_Trans_Amt']) || 0,
          totalTransCt: parseInt(row['Total_Trans_Ct']) || 0,
          totalCtChngQ4Q1: parseFloat(row['Total_Ct_Chng_Q4_Q1']) || 0,
          avgUtilizationRatio: parseFloat(row['Avg_Utilization_Ratio']) || 0,
          attritionFlag: row['Attrition_Flag'],
          status: attrited ? 'churned' : 'active',
          // Derived
          engagementScore: Math.round(Math.random() * 60 + 30),
          loyaltyLevel: ['Bronze', 'Silver', 'Gold', 'Platinum'][Math.floor(Math.random() * 4)],
          riskScore: parseFloat(row['Avg_Utilization_Ratio']) || Math.random() * 0.5,
          riskSegment: parseFloat(row['Avg_Utilization_Ratio']) > 0.7 ? 'High' : parseFloat(row['Avg_Utilization_Ratio']) > 0.4 ? 'Medium' : 'Low',
          customerSegment: ['Mass', 'Premium', 'Priority', 'VIP'][Math.floor(Math.random() * 4)],
          creditScore: Math.round(500 + Math.random() * 350),
        });
      })
      .on('end', resolve)
      .on('error', reject);
  });

  console.log(`Read ${rows.length} rows from BankChurners.csv`);
  return rows;
}

async function importBankChurnDataset() {
  const filePath = path.join(process.cwd(), 'data', 'kaggle', 'bank_churn_dataset.csv');
  if (!fs.existsSync(filePath)) {
    console.log('bank_churn_dataset.csv not found, skipping...');
    return [];
  }

  const rows: CustomerRow[] = [];
  let id = 9000000;
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        try {
          const attrited = row['exit'] === 'True' || row['exit'] === true;
          const riskScore = parseFloat(row['risk_score']) || Math.random() * 0.5;
          rows.push({
            clientNum: parseInt(row['id']) || id++,
            fullName: (row['full_name'] || `Customer ${row['id']}`).replace(/[^\x20-\x7E]/g, '?').trim(),
            creditScore: parseInt(row['credit_sco']) || 0,
            gender: (row['gender'] || 'male').toLowerCase(),
            age: parseInt(row['age']) || 0,
            occupation: row['occupation'] || undefined,
            balance: parseFloat(row['balance']) || 0,
            monthlyIncome: parseFloat(row['monthly_ir']) || 0,
            address: row['address'] || undefined,
            originProvince: row['origin_province'] || undefined,
            tenureYears: parseInt(row['tenure_ye']) || 0,
            maritalStatus: parseInt(row['married']) || 0,
            numsCards: parseInt(row['nums_card']) || 0,
            numsServices: parseInt(row['nums_service']) || 0,
            isActiveMember: row['active_member'] === 'True',
            lastActiveDate: row['last_active_date'] ? new Date(row['last_active_date'].split('/').reverse().join('-')) : undefined,
            lastTransactionMonth: parseInt(row['last_transaction_month']) || undefined,
            createdDate: row['created_date'] ? new Date(row['created_date'].split('/').reverse().join('-')) : undefined,
            attritionFlag: attrited ? 'Attrited Customer' : 'Existing Customer',
            customerSegment: row['customer_segment'] || undefined,
            engagementScore: parseInt(row['engagement_score']) || Math.round(Math.random() * 60 + 30),
            loyaltyLevel: row['loyalty_level'] || undefined,
            digitalBehavior: row['digital_behavior'] || undefined,
            riskScore,
            riskSegment: row['risk_segment'] || (riskScore > 0.6 ? 'High' : riskScore > 0.3 ? 'Medium' : 'Low'),
            clusterGroup: parseInt(row['cluster_group']) || undefined,
            status: attrited ? 'churned' : row['active_member'] === 'True' ? 'active' : 'inactive',
          });
        } catch (e) {
          // skip malformed row
        }
      })
      .on('end', resolve)
      .on('error', reject);
  });

  console.log(`Read ${rows.length} rows from bank_churn_dataset.csv`);
  return rows;
}

async function main() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI not found in .env');
    process.exit(1);
  }

  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI.includes('<') ? MONGODB_URI.replace(/<[^>]+>/g, 'bank360') : MONGODB_URI);
  console.log('Connected!');

  // Define schema inline
  const CustomerSchema = new mongoose.Schema({}, { strict: false, collection: 'customers' });
  const Customer = mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);

  const [churners, churnDataset] = await Promise.all([
    importBankChurners(),
    importBankChurnDataset(),
  ]);

  const allRows = [...(Array.isArray(churners) ? churners : []), ...churnDataset];
  console.log(`Total rows to import: ${allRows.length}`);

  // Batch upsert
  const BATCH = 500;
  let imported = 0;
  for (let i = 0; i < allRows.length; i += BATCH) {
    const batch = allRows.slice(i, i + BATCH);
    const ops = batch.map((row) => ({
      updateOne: {
        filter: { clientNum: row.clientNum },
        update: { $set: row },
        upsert: true,
      },
    }));
    await Customer.bulkWrite(ops);
    imported += batch.length;
    console.log(`Progress: ${imported}/${allRows.length}`);
  }

  console.log(`\n✅ Import complete! ${imported} customers imported/updated.`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error('Import failed:', e);
  process.exit(1);
});
