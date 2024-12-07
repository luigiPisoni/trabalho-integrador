import React, { useState } from "react";

function Header() {
  const [isAdmin, setIsAdmin] = useState(true);

  return (
    <header className="px-8 md:px-24 py-4 sm:py-7 sticky flex w-full top-0 z-50 items-center gap-6 md:gap-12 bg-white ">
      <div className="flex">
        <a
          className="text-3xl text-default-green font-serif hover:cursor-pointer"
          href="/"
        >
          Food House
        </a>
      </div>

      {isAdmin && (
        <div className="ml-auto flex gap-5 px-4 py-2 bg-light-green rounded-md">
          <p className="text-default-green font-bold">Gerência</p>
          <a href="/dashboard" className="hover:font-semibold transition-all">
            Dashboard
          </a>
          <a href="/controle" className="hover:font-semibold transition-all">
            Pratos
          </a>
          <a href="/controle" className="hover:font-semibold transition-all">
            Produtos
          </a>
        </div>
      )}
      <div>
        <a href="/login" className="hover:font-semibold transition-all">
          Login
        </a>
      </div>
      <div>
        <a
          href="./novo-pedido"
          className="bg-default-green p-3 text-white rounded-md hover:opacity-75"
        >
          Novo pedido
        </a>
      </div>
    </header>
  );
}

export default Header;
