"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { KeyRound, LogOut } from "lucide-react";
import { useJabuti } from "@/components/JabutiProvider";
import Tortoise from "@/components/Tortoise";

function Entrar() {
  const { editora, entrar, sair, atual } = useJabuti();
  const volta = useSearchParams().get("volta");
  const router = useRouter();
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    setErro(""); setEnviando(true);
    try {
      await entrar(senha);
      // só caminhos internos, para o link não mandar para outro site
      router.push(volta?.startsWith("/") && !volta.startsWith("//") ? volta : "/meu-dia");
    } catch (er) { setErro(er.message); setEnviando(false); }
  }

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
          <h1 className="titulo-pagina mt-4">Entrar para editar</h1>
          <p className="mt-2 text-xl">Quem recebe o link só consegue ver o diário. Para anotar, digite a senha.</p>
          <label className="rotulo mt-8 text-left">Senha
            <input className="campo mt-2 text-2xl" type="password" autoComplete="current-password" value={senha}
              onChange={(e) => setSenha(e.target.value)} autoFocus required />
          </label>
          {erro && <p role="alert" className="mt-4 rounded-2xl bg-brasa/15 p-3 text-lg font-bold text-brasa">{erro}</p>}
          <button className="botao mt-6 w-full text-xl" disabled={enviando}><KeyRound /> {enviando ? "Entrando…" : "Entrar"}</button>
        </form>
      )}
    </main>
  );
}

export default function Pagina() {
  return <Suspense><Entrar /></Suspense>;
}
