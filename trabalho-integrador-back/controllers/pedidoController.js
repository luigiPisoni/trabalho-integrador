import { supabase } from "../db/banco.js";

export async function novo(req, res) {
  console.log(req.body);
  res.send("alo");
}
