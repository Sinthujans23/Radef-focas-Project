import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

if (supabaseUrl === "https://dummy.supabase.co") {
  console.warn("Supabase credentials not found in environment variables.");
}

// Client for public read access
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client for admin write access (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
