import { supabase } from "../db/banco.js";

export async function lista(req, res) {
  try {
    const { data, erro } = await supabase.from("prato").select("*");
    if (erro) throw erro;

    // console.log(data);
    res.json(data);
  } catch (erro) {
    console.log("erro: ", erro);
    res.status(400).json({ erro: "Erro ao listar os pratos" });
  }
}
