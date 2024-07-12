export interface userType {
  email: string
  first_name: string
  last_name: string
  password: string
}

export interface User {
  id: number
  first_name: string
  last_name: string
  password: string
  email: string
  profile_image?: string
}

export interface update {
  first_name: string
  last_name: string
  user_id?: string
}
