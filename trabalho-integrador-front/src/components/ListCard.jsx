import { useState } from "react";

function ListCard({ nome, preco, ingredientes, adicionaCarrinho }) {
  const [qnt, setQnt] = useState(1);

  const handleQnt = (e) => {
    setQnt(e.target.value > 0 ? e.target.value : 1);
  };
  return (
    <div className="grid grid-cols-5 border-2 rounded-3xl overflow-hidden">
      <div className="bg-cyan-100">
        <img
          className="aspect-square object-cover"
          src="/images/placeholder.png"
          alt=""
        />
      </div>
      <div className="col-span-3 px-6 py-4">
        <p className="font-bold">{nome}</p>
        {ingredientes && (
          <p className="font-semibold text-default-green truncate">
            {ingredientes}
          </p>
        )}
        <div>
          <input
            value={qnt}
            type="number"
            className="border-2 rounded-2xl mt-5 px-3 max-w-40"
            onChange={handleQnt}
          />
          <button
            className="ml-2 bg-default-green text-white px-2 rounded-2xl"
            onClick={() => adicionaCarrinho({ nome, preco, qnt })}
          >
            Adicionar
          </button>
        </div>
      </div>
      <div className="px-6 py-4 text-right">
        <p className="font-bold text-xl">R$ {preco.toFixed(2)}</p>
      </div>
    </div>
  );
}

export default ListCard;
