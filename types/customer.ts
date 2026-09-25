export interface Customer {
  _id: string;
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
  lastActiveDate?: string;
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
  createdDate?: string;
  assignedRM?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomerFilters {
  search?: string;
  segment?: string;
  riskSegment?: string;
  status?: string;
  loyaltyLevel?: string;
  attritionFlag?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface Interaction {
  _id: string;
  customerId: string;
  clientNum: number;
  rmId: string;
  rmName?: string;
  type: 'call' | 'meeting' | 'email' | 'query' | 'note';
  date: string;
  notes: string;
  outcome?: string;
  duration?: number;
  createdAt?: string;
}

export interface FollowUp {
  _id: string;
  customerId: string;
  clientNum: number;
  assignedTo: string;
  assignedBy: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  title: string;
  notes?: string;
  completedAt?: string;
  createdAt?: string;
  customer?: { fullName: string; clientNum: number };
}
