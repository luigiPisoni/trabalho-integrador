function Card({ nome, preco, ingredientes, onClick }) {
  return (
    <div
      className="border-2 rounded-xl overflow-hidden hover:cursor-pointer hover:opacity-80 transition-opacity"
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
        <p className="font-bold">{nome}</p>
        <p className="font-semibold text-default-green">R$ {preco}</p>
        <p className="truncate">{ingredientes}</p>
      </div>
    </div>
  );
}

export default Card;
