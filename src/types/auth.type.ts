export interface AuthType {
  access_token: string
  refresh_token?: string
  user_id?: number
  is_login?: boolean
}

export interface SessionType {
  accessToken: string
  username: string
  user_id: number
}
