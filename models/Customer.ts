import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICustomer extends Document {
  clientNum: number;
  fullName: string;
  age: number;
  gender: string;
  email?: string;
  phone?: string;
  address?: string;
  originProvince?: string;
  occupation?: string;
  maritalStatus?: string;
  educationLevel?: string;
  dependentCount?: number;
  incomeCategory?: string;
  // Financial
  balance?: number;
  creditScore?: number;
  creditLimit?: number;
  totalRevolvingBal?: number;
  avgOpenToBuy?: number;
  avgUtilizationRatio?: number;
  monthlyIncome?: number;
  // Products
  cardCategory?: string;
  numsCards?: number;
  numsServices?: number;
  totalRelationshipCount?: number;
  // Engagement
  monthsOnBook?: number;
  monthsInactive12Mon?: number;
  contactsCount12Mon?: number;
  totalTransAmt?: number;
  totalTransCt?: number;
  totalAmtChngQ4Q1?: number;
  totalCtChngQ4Q1?: number;
  engagementScore?: number;
  loyaltyLevel?: string;
  digitalBehavior?: string;
  isActiveMember?: boolean;
  lastActiveDate?: Date;
  lastTransactionMonth?: number;
  // Segmentation / Churn
  customerSegment?: string;
  clusterGroup?: number;
  attritionFlag?: string;
  churnProbability?: number;
  // Risk
  riskScore?: number;
  riskSegment?: string;
  // Meta
  status?: 'active' | 'inactive' | 'churned';
  tenureYears?: number;
  createdDate?: Date;
  assignedRM?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const CustomerSchema = new Schema<ICustomer>(
  {
    clientNum: { type: Number, required: true, unique: true, index: true },
    fullName: { type: String, required: true, index: true },
    age: { type: Number },
    gender: { type: String },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    originProvince: { type: String },
    occupation: { type: String },
    maritalStatus: { type: String },
    educationLevel: { type: String },
    dependentCount: { type: Number },
    incomeCategory: { type: String },
    // Financial
    balance: { type: Number },
    creditScore: { type: Number },
    creditLimit: { type: Number },
    totalRevolvingBal: { type: Number },
    avgOpenToBuy: { type: Number },
    avgUtilizationRatio: { type: Number },
    monthlyIncome: { type: Number },
    // Products
    cardCategory: { type: String },
    numsCards: { type: Number },
    numsServices: { type: Number },
    totalRelationshipCount: { type: Number },
    // Engagement
    monthsOnBook: { type: Number },
    monthsInactive12Mon: { type: Number },
    contactsCount12Mon: { type: Number },
    totalTransAmt: { type: Number },
    totalTransCt: { type: Number },
    totalAmtChngQ4Q1: { type: Number },
    totalCtChngQ4Q1: { type: Number },
    engagementScore: { type: Number },
    loyaltyLevel: { type: String },
    digitalBehavior: { type: String },
    isActiveMember: { type: Boolean },
    lastActiveDate: { type: Date },
    lastTransactionMonth: { type: Number },
    // Segmentation / Churn
    customerSegment: { type: String, index: true },
    clusterGroup: { type: Number },
    attritionFlag: { type: String },
    churnProbability: { type: Number },
    // Risk
    riskScore: { type: Number },
    riskSegment: { type: String },
    // Meta
    status: { type: String, enum: ['active', 'inactive', 'churned'], default: 'active' },
    tenureYears: { type: Number },
    createdDate: { type: Date },
    assignedRM: { type: String },
  },
  {
    timestamps: true,
    collection: 'customers',
  }
);

// Text search index
CustomerSchema.index({ fullName: 'text', email: 'text' });

const Customer: Model<ICustomer> =
  mongoose.models.Customer || mongoose.model<ICustomer>('Customer', CustomerSchema);

export default Customer;
