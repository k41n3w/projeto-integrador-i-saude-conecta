import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Cliente para autenticação (usa o schema auth)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cliente para operações de banco de dados (usa o schema saude_conecta)
export const supabaseDb = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: "saude_conecta",
  },
})
