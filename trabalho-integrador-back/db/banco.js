import pgp_promise from 'pg-promise';
import dotenv from 'dotenv';

dotenv.config();
const pgp = pgp_promise({}); //gratidão zuio

if (!process.env.DATABASE_KEY) {
  throw new Error('Você precisa das credenciais do banco no .env');
}

const dbKey = process.env.DATABASE_KEY;

// pra não ficar importando as credenciais em todos os arquivos de rotas, basta importar database
export const database = pgp(
  `postgresql://postgres.cflabsfmtiztwceovrek:${dbKey}@aws-0-sa-east-1.pooler.supabase.com:6543/postgres`
);
console.log('AIZAAAAAA JÃO, SÓ NA SINUQUINHA ENTÃO');
