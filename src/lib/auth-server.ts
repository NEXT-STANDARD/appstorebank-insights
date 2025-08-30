import { getSupabaseAdmin } from './supabase'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export async function getCurrentUserServer() {
  try {
    const cookieStore = await cookies()
    
    // Server-side client for session validation
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            const cookies = cookieStore.getAll()
            return cookies
          },
          setAll(cookiesToSet) {
            // For server-side auth validation, we only need to read cookies
            // Setting is handled on the client side
          }
        }
      }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { user: null, error: authError || 'No user' }
    }

    // Get profile with admin client
    const supabaseAdmin = getSupabaseAdmin()
    if (!supabaseAdmin) {
      return { user: null, error: 'Admin client not available' }
    }
    
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('display_name, user_role, avatar_url')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Error fetching profile:', profileError)
    }

    return {
      user: {
        ...user,
        profile: profile || undefined
      },
      error: null
    }
  } catch (error) {
    console.error('Auth error:', error)
    return { user: null, error: error }
  }
}