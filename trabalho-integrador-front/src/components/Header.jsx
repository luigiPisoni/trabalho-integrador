import React, { useEffect, useState } from "react";
import { LogOut } from "lucide-react";

function Header() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  useEffect(() => {
    const cargo = localStorage.getItem("cargo");

    if (localStorage.getItem("token")) {
      setIsLogged(true);
    }

    if (cargo == "true") {
      setIsAdmin(true);
    }
  }, []);
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
        <div className="ml-auto flex gap-5 px-4 py-2 bg-light-green rounded-lg">
          <p className="text-default-green font-bold">Gerência</p>
          <a href="/dashboard" className="hover:font-semibold transition-all">
            Dashboard
          </a>
          <a href="/controle" className="hover:font-semibold transition-all">
            Controle
          </a>
          <a href="/listar-pedidos" className="hover:font-semibold transition-all">
            Pedidos
          </a>
        </div>
      )}
      <div className={!isAdmin && "ml-auto"}>
        {isLogged ? (
          <a
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
            className="hover:font-semibold hover:cursor-pointer transition-all"
          >
            Sair
          </a>
        ) : (
          <a href="/login" className="hover:font-semibold transition-all">
            Login
          </a>
        )}
      </div>
      <div>
        <a
          href="./novo-pedido"
          className="bg-default-green p-3 text-white rounded-lg hover:opacity-75"
        >
          Novo pedido
        </a>
      </div>
    </header>
  );
}

export default Header;
