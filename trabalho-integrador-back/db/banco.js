import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  throw new Error("Você precisa das credenciais do banco no .env");
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_KEY;

// pra não ficar importando as credenciais em todos os arquivos de rotas, basta importar supabase
export const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log("Conexão com o banco Supabase inicializada");
