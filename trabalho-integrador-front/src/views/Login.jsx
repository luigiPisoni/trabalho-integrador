function Login() {
  return (
    <div className="px-24 py-24 h-screen">
      <div className="grid grid-cols-5 h-full overflow-hidden rounded-xl shadow-2xl">
        <div className="bg-light-green col-span-2 align-middle text-center flex items-center justify-center">
          <div className="">
            <p className="font-serif text-5xl">Food House</p>
            <div className="mt-8">
              <button className="bg-default-green px-12 py-4 rounded-xl text-white">
                Login
              </button>
            </div>
          </div>
        </div>
        <div className=" col-span-3 align-middle text-center flex items-center justify-center">
          <div>
            <p className="text-4xl font-serif">Criar conta</p>
            <div>
              <form action="" className="grid grid-rows-4 gap-4 mt-8">
                <input
                  className="bg-slate-200 px-12 py-2 rounded-md"
                  type="text"
                />
                <input
                  className="bg-slate-200 px-12 py-2 rounded-md"
                  type="text"
                />
                <input
                  className="bg-slate-200 px-12 py-2 rounded-md"
                  type="text"
                />
                <input
                  className="bg-slate-200 px-12 py-2 rounded-md"
                  type="password"
                />
                <button className="bg-default-green px-12 py-4 rounded-xl text-white mt-8">
                  Cadastrar-se
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
