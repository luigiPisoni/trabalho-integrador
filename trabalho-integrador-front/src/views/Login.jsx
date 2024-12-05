import { useState } from "react";
import server from "../server";

function Login() {
  const [login, setLogin] = useState(false);
  const [formData, setFormData] = useState({
    cpf: "",
    email: "",
    endereco: "",
    senha: "",
  });

  const handleForm = async (e) => {
    e.preventDefault();
    console.log(formData);

    try {
      const rota = "/pessoa/" + (login ? "login" : "cadastro");
      const response = await server.post(rota, formData);

      alert("credenciado com sucesso");
      window.location.href = "/";
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // console.log(name, value);
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="px-24 py-24 h-screen">
      <div className="grid grid-cols-5 h-full overflow-hidden rounded-xl shadow-2xl">
        <div className="bg-light-green col-span-2 align-middle text-center flex items-center justify-center">
          <div className="">
            <p className="font-serif text-5xl">Food House</p>
            <p>Já possui conta? Faça login!</p>
            <div className="mt-8">
              <button
                className="bg-default-green px-8 py-4 rounded-xl text-white"
                onClick={() => {
                  setLogin(!login);
                }}
              >
                Login
              </button>
            </div>
          </div>
        </div>
        <div className=" col-span-3 align-middle text-center flex items-center justify-center">
          <div>
            <p className="text-4xl font-serif">
              {login ? "Login" : "Criar conta"}
            </p>
            <div>
              <form
                className="grid grid-rows-4 gap-4 mt-4"
                onSubmit={handleForm}
              >
                <input
                  className="text-lg border-2 rounded-2xl mt-2 px-4 py-2 max-w-80"
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleInputChange}
                  placeholder="CPF"
                />
                <input
                  className="text-lg border-2 rounded-2xl mt-2 px-4 py-2 max-w-80"
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  hidden={login}
                />
                <input
                  className="text-lg border-2 rounded-2xl mt-2 px-4 py-2 max-w-80"
                  type="text"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleInputChange}
                  placeholder="Endereço"
                  hidden={login}
                />
                <input
                  className="text-lg border-2 rounded-2xl mt-2 px-4 py-2 max-w-80"
                  type="password"
                  name="senha"
                  value={formData.senha}
                  onChange={handleInputChange}
                  placeholder="Senha"
                />
                <button
                  className="bg-default-green px-2 py-2 rounded-xl text-white mt-8"
                  type="submit"
                >
                  {login ? "Login" : "Cadastrar-se"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
