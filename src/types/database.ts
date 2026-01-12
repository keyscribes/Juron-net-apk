export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          invoice_number: string
          name: string
          email: string | null
          phone: string
          package_id: string | null
          monthly_fee: number
          due_date: number
          latitude: number | null
          longitude: number | null
          address: string
          status: 'active' | 'overdue' | 'inactive'
          start_date: string
          last_payment_date: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          invoice_number: string
          name: string
          email?: string | null
          phone: string
          package_id?: string | null
          monthly_fee: number
          due_date: number
          latitude?: number | null
          longitude?: number | null
          address: string
          status?: 'active' | 'overdue' | 'inactive'
          start_date?: string
          last_payment_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          invoice_number?: string
          name?: string
          email?: string | null
          phone?: string
          package_id?: string | null
          monthly_fee?: number
          due_date?: number
          latitude?: number | null
          longitude?: number | null
          address?: string
          status?: 'active' | 'overdue' | 'inactive'
          start_date?: string
          last_payment_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          customer_id: string
          invoice_number: string
          amount: number
          payment_date: string
          payment_month: string
          payment_method: string
          proof_url: string | null
          status: 'pending' | 'verified' | 'rejected'
          verified_by: string | null
          verified_at: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          invoice_number: string
          amount: number
          payment_date?: string
          payment_month: string
          payment_method: string
          proof_url?: string | null
          status?: 'pending' | 'verified' | 'rejected'
          verified_by?: string | null
          verified_at?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          invoice_number?: string
          amount?: number
          payment_date?: string
          payment_month?: string
          payment_method?: string
          proof_url?: string | null
          status?: 'pending' | 'verified' | 'rejected'
          verified_by?: string | null
          verified_at?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          date: string
          category: string
          description: string
          amount: number
          vendor: string | null
          payment_method: string
          reference_number: string | null
          receipt_url: string | null
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          date: string
          category: string
          description: string
          amount: number
          vendor?: string | null
          payment_method: string
          reference_number?: string | null
          receipt_url?: string | null
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          date?: string
          category?: string
          description?: string
          amount?: number
          vendor?: string | null
          payment_method?: string
          reference_number?: string | null
          receipt_url?: string | null
          created_by?: string
          created_at?: string
        }
      }
      income: {
        Row: {
          id: string
          date: string
          category: string
          description: string
          amount: number
          source: string | null
          payment_method: string
          reference_number: string | null
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          date: string
          category: string
          description: string
          amount: number
          source?: string | null
          payment_method: string
          reference_number?: string | null
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          date?: string
          category?: string
          description?: string
          amount?: number
          source?: string | null
          payment_method?: string
          reference_number?: string | null
          created_by?: string
          created_at?: string
        }
      }
      packages: {
        Row: {
          id: string
          name: string
          download_speed: string
          upload_speed: string
          price: number
          quota: string | null
          description: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          download_speed: string
          upload_speed: string
          price: number
          quota?: string | null
          description?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          download_speed?: string
          upload_speed?: string
          price?: number
          quota?: string | null
          description?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      tickets: {
        Row: {
          id: string
          customer_id: string
          category: string
          subject: string
          message: string
          status: 'open' | 'in_progress' | 'resolved' | 'closed'
          priority: 'low' | 'medium' | 'high'
          admin_reply: string | null
          created_at: string
          resolved_at: string | null
        }
        Insert: {
          id?: string
          customer_id: string
          category: string
          subject: string
          message: string
          status?: 'open' | 'in_progress' | 'resolved' | 'closed'
          priority?: 'low' | 'medium' | 'high'
          admin_reply?: string | null
          created_at?: string
          resolved_at?: string | null
        }
        Update: {
          id?: string
          customer_id?: string
          category?: string
          subject?: string
          message?: string
          status?: 'open' | 'in_progress' | 'resolved' | 'closed'
          priority?: 'low' | 'medium' | 'high'
          admin_reply?: string | null
          created_at?: string
          resolved_at?: string | null
        }
      }
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          role: 'super_admin' | 'admin' | 'technician'
          permissions: Json | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          role?: 'super_admin' | 'admin' | 'technician'
          permissions?: Json | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: 'super_admin' | 'admin' | 'technician'
          permissions?: Json | null
          is_active?: boolean
          created_at?: string
        }
      }
      settings: {
        Row: {
          id: string
          key: string
          value: Json
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: Json
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: Json
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
