export interface DashboardStats {
  totalCustomers: number;
  activeCustomers: number;
  newCustomers: number;
  highRiskCustomers: number;
  churnedCustomers: number;
  avgEngagementScore: number;
  pendingFollowUps: number;
  avgCreditScore: number;
}

export interface SegmentDistribution {
  segment: string;
  count: number;
  percentage: number;
}

export interface ChurnDistribution {
  label: string;
  count: number;
  percentage: number;
}

export interface EngagementDistribution {
  level: string;
  count: number;
}

export interface RiskDistribution {
  riskSegment: string;
  count: number;
  percentage: number;
}

export interface ProductAdoption {
  product: string;
  count: number;
}

export interface MonthlyAcquisition {
  month: string;
  count: number;
}

export interface AnalyticsData {
  stats: DashboardStats;
  segmentDistribution: SegmentDistribution[];
  churnDistribution: ChurnDistribution[];
  engagementDistribution: EngagementDistribution[];
  riskDistribution: RiskDistribution[];
  productAdoption: ProductAdoption[];
}
