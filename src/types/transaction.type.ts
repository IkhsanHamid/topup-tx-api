export interface balance {
  id: number
  balance: number
  user_id: number
}

export interface topupType {
  id: number
  balance: number
  user_id: number
}

export interface transactionModel {
  invoice_number: string
  transaction_type: string
  total_amount: number
  created_on?: Date
  user_id?: number
}

export interface history {
  invoice_number: string
  transaction_type: string
  total_amount: number
  created_on?: Date
  service_name: string
}

export interface txHistory {
  userId: number
  skip: number
  limit: number
}
