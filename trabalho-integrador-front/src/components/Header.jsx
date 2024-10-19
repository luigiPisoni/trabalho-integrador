import { Wheat } from "lucide-react";
import { Link } from "react-router-dom";
import React, { useState } from "react";

function Header() {
  const [isLogged, setIsLogged] = useState(false);

  const handleClick = () => {
    setIsLogged(!isLogged);
  };
  return (
    <header className="py-7 px-24 sticky flex w-full top-0 z-50 items-center gap-5">
      {/* Container da logo e título */}
      <div className="flex">
        <Wheat color="#426B1F" strokeWidth={"1.75px"} />
        <p className="ml-3 text-3xl text-default-green font-serif">
          Doof House
        </p>
      </div>
      <div className="ml-auto flex gap-5">
        <button className="hover:border-b-2 border-default-green">
          Meu perfil
        </button>
        {isLogged && (
          <button className="hover:border-b-2 border-default-green">
            Gerenciar
          </button>
        )}
      </div>
      <div>
        <button
          onClick={handleClick}
          className="bg-default-green p-3 text-white rounded-md hover:opacity-75"
        >
          Novo pedido
        </button>
      </div>
    </header>
  );
}

export default Header;
