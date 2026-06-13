export interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

export type Gateway = 'razorpay' | 'cashfree' | 'payu' | 'stripe'

export interface RawTransaction {
  id: string
  amount: number
  currency: string
  status: 'captured' | 'failed' | 'refunded' | 'pending'
  method: string
  bank?: string
  card_network?: string
  error_code?: string
  error_description?: string
  created_at: string
  fee?: number
  tax?: number
}

export type InsightType = 'failure_leak' | 'quick_win' | 'fee_leak' | 'insight'

export interface Insight {
  id: string
  type: InsightType
  title: string
  body: string
  impact_label: string
  impact_value: number
  direction: 'up' | 'down'
}

export interface MethodRate {
  method: string
  success_rate: number
  volume: number
  status: 'healthy' | 'warn' | 'critical'
  recommendation?: string
}

export interface AnalysisResult {
  id: string
  gateway: Gateway
  analysed_at: string
  total_transactions: number
  total_volume: number
  true_success_rate: number
  reported_success_rate: number
  total_fees: number
  insights: Insight[]
  method_rates: MethodRate[]
  monthly_recoverable: number
}
