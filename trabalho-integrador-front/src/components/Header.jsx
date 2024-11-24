import { Wheat } from "lucide-react";
// import { Link } from "react-router-dom";
import React, { useState } from "react";

function Header() {
  const [isLogged, setIsLogged] = useState(false);

  const handleNovoPedido = () => {
    setIsLogged(!isLogged);
  };

  return (
    <header className="px-8 md:px-24 py-4 sm:py-7 sticky flex w-full top-0 z-50 items-center gap-6 md:gap-12 bg-white ">
      {/* Container da logo e título */}
      <div className="flex">
        {/* <Wheat
          className="mr-3 sm:hidden"
          color="#426B1F"
          strokeWidth={"1.75px"}
        /> */}
        <p className="text-3xl text-default-green font-serif">Food House</p>
      </div>
      <div className="ml-auto flex gap-5">
        {/* <button className="hover:border-b-2 border-default-green">
          Meu perfil
        </button> */}
        {isLogged && (
          <button className="hover:border-b-2 border-default-green">
            Gerenciar
          </button>
        )}
      </div>
      <div>
        <button
          onClick={handleNovoPedido}
          className="bg-default-green p-3 text-white rounded-md hover:opacity-75"
        >
          Novo pedido
        </button>
      </div>
    </header>
  );
}

export default Header;
