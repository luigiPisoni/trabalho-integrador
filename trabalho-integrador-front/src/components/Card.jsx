import { Plus } from "lucide-react";

function Card({ nome, valor, ingredientes, onClick }) {
  // console.log(ingredientes);

  return (
    <div
      className="border-2 rounded-3xl overflow-hidden hover:cursor-pointer hover:opacity-80 transition-opacity"
      onClick={onClick}
    >
      <div className="bg-cyan-100">
        <img
          className="aspect-[4/3] object-cover"
          src="/images/placeholder.png"
          alt=""
        />
      </div>
      <div className="px-4 py-2 bg-light-green">
        {nome ? <p className="font-bold">{nome}</p> : <Plus />}
        {valor && (
          <p className="font-semibold text-default-green">R$ {valor}</p>
        )}
        {/* <p className="truncate">{ingredientes}</p> */}
      </div>
    </div>
  );
}

export default Card;
