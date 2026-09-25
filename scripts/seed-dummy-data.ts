import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Customer from '../models/Customer';
import Interaction from '../models/Interaction';
import FollowUp from '../models/FollowUp';

dotenv.config({ path: '.env' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable inside .env');
  process.exit(1);
}

// Helper to get random item
const sample = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
// Helper to get random number in range
const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

async function seedData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI as string);
    console.log('Connected!');

    // Clear existing for a clean slate
    console.log('Clearing existing data...');
    await Customer.deleteMany({});
    await Interaction.deleteMany({});
    await FollowUp.deleteMany({});

    console.log('Generating 150 diverse dummy customers for Analytics...');
    
    const customersToInsert = [];
    
    for (let i = 1; i <= 150; i++) {
      const isChurned = Math.random() < 0.15; // 15% churn rate
      const riskScore = isChurned ? random(70, 95) : random(10, 85);
      let riskSegment = 'Low';
      if (riskScore > 75) riskSegment = 'High';
      else if (riskScore > 40) riskSegment = 'Medium';
      
      const balance = random(1000, 150000);
      const creditLimit = random(2000, 50000);
      const avgUtilizationRatio = Number((random(0, 95) / 100).toFixed(2));
      
      const segments = ['Retail', 'Premium', 'Wealth', 'Corporate'];
      const customerSegment = sample(segments);
      
      const clientNum = 700000000 + i;

      const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Riaan', 'Krishna', 'Ishaan', 'Shaurya', 'Diya', 'Ananya', 'Saanvi', 'Aadya', 'Pari', 'Prisha', 'Avni', 'Riya', 'Aashi', 'Kriti'];
      const lastNames = ['Patel', 'Sharma', 'Singh', 'Kumar', 'Das', 'Shah', 'Gupta', 'Verma', 'Jain', 'Mehta', 'Reddy', 'Rao', 'Iyer', 'Menon', 'Nair'];

      customersToInsert.push({
        clientNum,
        fullName: `${sample(firstNames)} ${sample(lastNames)}`,
        age: random(22, 75),
        gender: sample(['M', 'F']),
        email: `customer${i}@example.com`,
        phone: `+91-9${random(10,99)}-${random(100,999)}-${random(1000,9999)}`,
        address: `${random(100, 9999)} Dummy Street, Data City`,
        originProvince: sample(['Maharashtra', 'Gujarat', 'Karnataka', 'Delhi', 'Tamil Nadu', 'Telangana']),
        occupation: sample(['Engineer', 'Teacher', 'Doctor', 'Sales', 'Manager', 'Retired', 'Student']),
        maritalStatus: sample(['Married', 'Single', 'Divorced']),
        educationLevel: sample(['High School', 'Bachelor', 'Master', 'PhD', 'Uneducated']),
        incomeCategory: sample(['Less than $40K', '$40K - $60K', '$60K - $80K', '$80K - $120K', '$120K +']),
        
        balance,
        creditScore: random(550, 850),
        creditLimit,
        totalRevolvingBal: random(0, 3000),
        avgOpenToBuy: creditLimit - (creditLimit * avgUtilizationRatio),
        avgUtilizationRatio,
        monthlyIncome: random(3000, 20000),
        
        cardCategory: sample(['Blue', 'Silver', 'Gold', 'Platinum']),
        numsCards: random(1, 4),
        numsServices: random(1, 6),
        totalRelationshipCount: random(1, 6),
        
        monthsOnBook: random(12, 60),
        monthsInactive12Mon: random(0, 6),
        contactsCount12Mon: random(1, 10),
        totalTransAmt: random(1000, 15000),
        totalTransCt: random(20, 120),
        engagementScore: random(20, 99),
        loyaltyLevel: sample(['Bronze', 'Silver', 'Gold']),
        digitalBehavior: sample(['Low', 'Medium', 'High']),
        isActiveMember: Math.random() > 0.3,
        
        customerSegment,
        attritionFlag: isChurned ? 'Attrited Customer' : 'Existing Customer',
        churnProbability: isChurned ? Number((random(70, 99) / 100).toFixed(2)) : Number((random(5, 40) / 100).toFixed(2)),
        
        riskScore,
        riskSegment,
        status: isChurned ? 'churned' : 'active',
        tenureYears: random(1, 15),
      });
    }

    const insertedCustomers = await Customer.insertMany(customersToInsert);
    console.log(`Inserted ${insertedCustomers.length} customers.`);

    console.log('Generating interactions and follow-ups...');
    const interactions = [];
    const followUps = [];

    for (let i = 0; i < 20; i++) {
      const c = insertedCustomers[i];
      for (let j = 0; j < random(1, 3); j++) {
        interactions.push({
          customerId: c._id,
          clientNum: c.clientNum,
          rmId: 'user_analyst_demo',
          type: sample(['call', 'email', 'meeting', 'note']),
          date: new Date(Date.now() - random(1, 30) * 24 * 60 * 60 * 1000),
          notes: 'Discussed portfolio performance and new credit card offers. Client is ' + sample(['interested', 'hesitant', 'very happy', 'concerned about fees']) + '.',
        });
      }

      if (Math.random() > 0.5) {
        followUps.push({
          customerId: c._id,
          clientNum: c.clientNum,
          assignedTo: 'user_analyst_demo',
          assignedBy: 'system_seed',
          title: sample(['Send new mortgage rates', 'Check in on credit limit increase', 'Follow up on wealth management inquiry']),
          notes: 'Client requested this during our last interaction.',
          dueDate: new Date(Date.now() + random(1, 14) * 24 * 60 * 60 * 1000),
          status: sample(['pending', 'completed']),
          priority: sample(['low', 'medium', 'high']),
        });
      }
    }

    await Interaction.insertMany(interactions);
    await FollowUp.insertMany(followUps);

    console.log(`Inserted ${interactions.length} interactions and ${followUps.length} follow-ups.`);
    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedData();
