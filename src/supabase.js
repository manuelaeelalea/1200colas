import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mvxtdfbfpyhjohstlsna.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12eHRkZmJmcHloam9oc3Rsc25hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyNTc4NDIsImV4cCI6MjA4MzgzMzg0Mn0.uL4rF2KZx21CRXo__P9sErL_1X23v3ljaoSKDA9KEPw'

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
)
