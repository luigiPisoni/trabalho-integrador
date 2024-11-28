import { useState } from "react";

function ListCard({ nome, preco, ingredientes, adicionarPrato }) {
  const [qnt, setQnt] = useState(1);

  const handleQnt = (e) => {
    setQnt(e.target.value > 0 ? e.target.value : 1);
    console.log(qnt);
  };
  return (
    <div className="grid grid-cols-7 border-2 rounded-xl overflow-hidden">
      <div className="bg-cyan-100">
        <img className=" object-cover" src="/images/placeholder.png" alt="" />
      </div>
      <div className="col-span-5 px-4 py-2">
        <p className="font-bold">{nome}</p>
        <p className="font-semibold text-default-green truncate">
          {ingredientes}
        </p>
        <div>
          <input
            value={qnt}
            type="number"
            className="border-2 rounded-2xl mt-5 px-3 max-w-40"
            onChange={handleQnt}
          />
          <button
            className="ml-2 bg-default-green text-white px-2 rounded-2xl "
            // onClick={() => adicionarPrato(nome, preco, qnt)}
          >
            +
          </button>
        </div>
      </div>
      <div className="px-4 py-2">
        <p className="font-bold">R$ {preco}</p>
      </div>
    </div>
  );
}

export default ListCard;
