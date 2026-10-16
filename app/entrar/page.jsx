"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { KeyRound, LogOut } from "lucide-react";
import { useJabuti } from "@/components/JabutiProvider";
import Tortoise from "@/components/Tortoise";

function Entrar() {
  const { editora, senhaCriada, entrar, criarSenha, sair, atual } = useJabuti();
  const volta = useSearchParams().get("volta");
  const router = useRouter();
  const [senha, setSenha] = useState("");
  const [repetir, setRepetir] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const primeiroAcesso = !senhaCriada;

  async function enviar(e) {
    e.preventDefault();
    if (primeiroAcesso && senha !== repetir) return setErro("As duas senhas estão diferentes. Digite de novo.");
    setErro(""); setEnviando(true);
    try {
      await (primeiroAcesso ? criarSenha(senha) : entrar(senha));
      // só caminhos internos, para o link não mandar para outro site
      router.push(volta?.startsWith("/") && !volta.startsWith("//") ? volta : "/meu-dia");
    } catch (er) { setErro(er.message); setEnviando(false); }
  }

  if (editora === null) return null;

  return (
    <main className="mx-auto max-w-md px-5 py-10 text-center">
      <Tortoise especie={atual?.especie} id="entrar" className="mx-auto w-40" />
      {editora ? (
        <>
          <h1 className="titulo-pagina mt-4">Você já está dentro! 🎉</h1>
          <p className="mt-2 text-xl">Neste aparelho dá para anotar e mudar tudo.</p>
          <button className="botao-sec mx-auto mt-8" onClick={sair}><LogOut /> Sair deste aparelho</button>
        </>
      ) : (
        <form onSubmit={enviar}>
          <h1 className="titulo-pagina mt-4">{primeiroAcesso ? "Crie a sua senha" : "Entrar para editar"}</h1>
          <p className="mt-2 text-xl">
            {primeiroAcesso
              ? "Só quem sabe a senha pode anotar no diário. Quem recebe o link só consegue ver."
              : "Quem recebe o link só consegue ver o diário. Para anotar, digite a senha."}
          </p>
          <label className="rotulo mt-8 text-left">{primeiroAcesso ? "Senha nova (pelo menos 4 letras ou números)" : "Senha"}
            <input className="campo mt-2 text-2xl" type="password" autoComplete={primeiroAcesso ? "new-password" : "current-password"}
              value={senha} onChange={(e) => setSenha(e.target.value)} minLength={primeiroAcesso ? 4 : undefined} autoFocus required />
          </label>
          {primeiroAcesso && (
            <label className="rotulo mt-5 text-left">Digite a senha de novo
              <input className="campo mt-2 text-2xl" type="password" autoComplete="new-password" value={repetir} onChange={(e) => setRepetir(e.target.value)} required />
            </label>
          )}
          {erro && <p role="alert" className="mt-4 rounded-2xl bg-brasa/15 p-3 text-lg font-bold text-brasa">{erro}</p>}
          <button className="botao mt-6 w-full text-xl" disabled={enviando}>
            <KeyRound /> {enviando ? "Um instante…" : primeiroAcesso ? "Criar senha e entrar" : "Entrar"}
          </button>
        </form>
      )}
    </main>
  );
}

export default function Pagina() {
  return <Suspense><Entrar /></Suspense>;
}
