import { User, Session } from '@supabase/supabase-js'

export interface CarrierUser {
  id: string
  phone?: string
}

export interface CarrierSession {
  access_token: string
  refresh_token: string
}

export interface CarrierAuthResponse {
  data: {
    user?: CarrierUser | null
    session?: CarrierSession | null
  }
  error: Error | null
}
