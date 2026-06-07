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
      profiles: {
        Row: {
          id: string
          full_name: string
          phone: string
          role: 'owner' | 'customer'
          created_at: string
        }
        Insert: {
          id: string
          full_name: string
          phone: string
          role: 'owner' | 'customer'
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          phone?: string
          role?: 'owner' | 'customer'
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          category: string
          price: number
          stock_quantity: number
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category: string
          price: number
          stock_quantity: number
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: string
          price?: number
          stock_quantity?: number
          image_url?: string | null
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          customer_id: string
          status: 'pending' | 'accepted' | 'completed' | 'cancelled'
          total_items: number
          total_price: number
          created_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          status?: 'pending' | 'accepted' | 'completed' | 'cancelled'
          total_items: number
          total_price: number
          created_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          status?: 'pending' | 'accepted' | 'completed' | 'cancelled'
          total_items?: number
          total_price?: number
          created_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price_at_order: number
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price_at_order: number
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price_at_order?: number
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
