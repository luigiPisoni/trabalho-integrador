import { useEffect, useState } from "react";

function Modal({
  open,
  close,
  handleSubmit,
  codprt,
  codpdt,
  titulo,
  nome,
  valor,
  ingredientes,
}) {
  // console.log(nome, valor);

  const [item, setItem] = useState({
    codpdt,
    codprt,
    nome,
    valor,
    ingredientes,
  });

  useEffect(() => {
    setItem({
      codpdt: codpdt || null,
      codprt: codprt || null,
      nome: nome || "",
      valor: valor || "",
      ingredientes: ingredientes || [{}, {}, {}],
    });
  }, [nome, valor, ingredientes]); // fica di olho pra quando nome, valor ou ingrediente muda.

  const handleIngrediente = (campo, i, valor) => {
    const novoIngredientes = [...item.ingredientes];
    novoIngredientes[i] = {
      ...novoIngredientes[i],
      [campo]: valor,
    };

    if (codprt !== null && i === item.ingredientes.length - 1) {
      const ultimoIngrediente = novoIngredientes[i];
      if (
        ultimoIngrediente.quantidade &&
        ultimoIngrediente.unidade &&
        ultimoIngrediente.nome
      ) {
        // Adiciona uma nova linha vazia
        novoIngredientes.push({});
      }
    }

    setItem({ ...item, ingredientes: novoIngredientes });
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-light-green bg-opacity-50 z-50">
        <div className="bg-light-green border-2 rounded-lg px-8 py-8 shadow">
          <div>
            <p className="text-xl font-bold">{titulo}</p>
          </div>
          <div className="grid grid-cols-5 gap-4 mt-4">
            <input
              className="px-4 py-2 rounded-lg border-2 col-span-3"
              type="text"
              placeholder="Nome"
              value={item.nome}
              onChange={(e) => {
                setItem({ ...item, nome: e.target.value });
              }}
            />
            <input
              className="px-4 py-2 rounded-lg border-2 col-span-2"
              type="number"
              placeholder="Valor"
              value={item.valor}
              onChange={(e) => {
                setItem({ ...item, valor: e.target.value });
              }}
            />
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {item.ingredientes.length > 0 &&
              item.ingredientes.map((ingrediente) => {
                let i = item.ingredientes.indexOf(ingrediente);

                return (
                  <>
                    <input
                      className="px-4 py-2 rounded-lg border-2 "
                      type="number"
                      placeholder="Quantidade"
                      value={ingrediente.quantidade}
                      onChange={(e) => {
                        handleIngrediente("quantidade", i, e.target.value);
                      }}
                    />
                    <input
                      className="px-4 py-2 rounded-lg border-2 "
                      type="text"
                      placeholder="Unidade"
                      value={ingrediente.unidade}
                      onChange={(e) => {
                        handleIngrediente("unidade", i, e.target.value);
                      }}
                    />
                    <input
                      className="px-4 py-2 rounded-lg border-2"
                      type="text"
                      placeholder="Nome do ingrediente"
                      value={ingrediente.nome}
                      onChange={(e) => {
                        handleIngrediente("nome", i, e.target.value);
                      }}
                    />
                  </>
                );
              })}
          </div>
          <div className="flex justify-end gap-4 mt-4">
            <button
              className="bg-gray-400 rounded-lg text-white px-4 py-2"
              onClick={close}
            >
              Fechar
            </button>
            <button
              onClick={() => handleSubmit(item)}
              className="bg-default-green rounded-lg text-white px-4 py-2 "
            >
              Concluído
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Modal;
