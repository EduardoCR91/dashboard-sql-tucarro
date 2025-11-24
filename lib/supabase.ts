import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hbqvnvtxylscuxpmyums.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhicXZudnR4eWxzY3V4cG15dW1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNzQ3MjIsImV4cCI6MjA3ODk1MDcyMn0.9s-JpCq41BhHJ6GtQBY_DxC8I6w_kWg3KSQVxJojg20'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)