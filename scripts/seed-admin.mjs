import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// For seeding we can use anon key if RLS allows it, or service role key.
// But assuming simple setup for now, anon key is fine.

if (!supabaseUrl || !supabaseKey) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local before seeding.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const username = (process.env.ADMIN_USERNAME || "admin").trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;

if (!password) {
  console.error("Set ADMIN_PASSWORD (and optionally ADMIN_USERNAME) in .env.local before seeding.");
  process.exit(1);
}

async function main() {
  const passwordHash = await bcrypt.hash(password, 10);
  
  // First, check if admin exists
  const { data: existingAdmin } = await supabase
    .from("admins")
    .select("id")
    .eq("username", username)
    .single();

  let admin;
  if (existingAdmin) {
    const { data, error } = await supabase
      .from("admins")
      .update({ password_hash: passwordHash })
      .eq("username", username)
      .select()
      .single();
    if (error) throw error;
    admin = data;
  } else {
    const { data, error } = await supabase
      .from("admins")
      .insert([{ username, password_hash: passwordHash }])
      .select()
      .single();
    if (error) throw error;
    admin = data;
  }

  console.log(`Admin account ready: ${admin.username}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
