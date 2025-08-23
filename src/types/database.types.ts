export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          display_name: string | null
          avatar_url: string | null
          user_role: 'end_user' | 'developer' | 'verified_dev' | 'pro_subscriber' | 'enterprise' | 'admin'
          subscription_tier: 'free' | 'starter' | 'professional' | 'enterprise'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          avatar_url?: string | null
          user_role?: 'end_user' | 'developer' | 'verified_dev' | 'pro_subscriber' | 'enterprise' | 'admin'
          subscription_tier?: 'free' | 'starter' | 'professional' | 'enterprise'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string | null
          avatar_url?: string | null
          user_role?: 'end_user' | 'developer' | 'verified_dev' | 'pro_subscriber' | 'enterprise' | 'admin'
          subscription_tier?: 'free' | 'starter' | 'professional' | 'enterprise'
          created_at?: string
          updated_at?: string
        }
      }
      articles: {
        Row: {
          id: string
          slug: string
          title: string
          subtitle: string | null
          content: string
          excerpt: string | null
          cover_image_url: string | null
          category: 'market_analysis' | 'global_trends' | 'law_regulation' | 'tech_deep_dive'
          tags: string[]
          status: 'draft' | 'published' | 'archived'
          is_premium: boolean
          author_id: string
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          subtitle?: string | null
          content: string
          excerpt?: string | null
          cover_image_url?: string | null
          category: 'market_analysis' | 'global_trends' | 'law_regulation' | 'tech_deep_dive'
          tags?: string[]
          status?: 'draft' | 'published' | 'archived'
          is_premium?: boolean
          author_id: string
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          subtitle?: string | null
          content?: string
          excerpt?: string | null
          cover_image_url?: string | null
          category?: 'market_analysis' | 'global_trends' | 'law_regulation' | 'tech_deep_dive'
          tags?: string[]
          status?: 'draft' | 'published' | 'archived'
          is_premium?: boolean
          author_id?: string
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          article_id: string
          author_id: string
          content: string
          parent_id: string | null
          status: 'published' | 'pending' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          article_id: string
          author_id: string
          content: string
          parent_id?: string | null
          status?: 'published' | 'pending' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          article_id?: string
          author_id?: string
          content?: string
          parent_id?: string | null
          status?: 'published' | 'pending' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
      newsletter_subscribers: {
        Row: {
          id: string
          email: string
          name: string | null
          subscription_source: string
          tags: string[]
          is_confirmed: boolean
          is_active: boolean
          confirmed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          subscription_source?: string
          tags?: string[]
          is_confirmed?: boolean
          is_active?: boolean
          confirmed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          subscription_source?: string
          tags?: string[]
          is_confirmed?: boolean
          is_active?: boolean
          confirmed_at?: string | null
          created_at?: string
        }
      }
    }
  }
}

// 便利な型エイリアス
export type Article = Database['public']['Tables']['articles']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Comment = Database['public']['Tables']['comments']['Row']
export type NewsletterSubscriber = Database['public']['Tables']['newsletter_subscribers']['Row']