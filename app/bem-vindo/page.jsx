"use client";
import { Suspense, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { gsap, useGSAP, semMovimento } from "@/lib/gsap";
import { CONFIG } from "@/lib/config";
import { especie } from "@/lib/especies";
import { festa } from "@/lib/festa";
import { useJabuti } from "@/components/JabutiProvider";
import EspecieEscolha from "@/components/EspecieEscolha";
import FotoInput from "@/components/FotoInput";
import SoEditora from "@/components/SoEditora";
import Tortoise from "@/components/Tortoise";

function Passos() {
  const novo = useSearchParams().get("novo") === "1";
  const router = useRouter();
  const { recarregar, criar: criarJabuti } = useJabuti();
  const raiz = useRef(null);
  const [passo, setPasso] = useState(0);
  // Setup inicial pré-definido (Yuki, jabuti-piranga); só o primeiro cadastro usa o nome padrão
  const [dados, setDados] = useState({ nome: novo ? "" : CONFIG.nomePadrao, tutor: "", especie: CONFIG.especiePadrao, foto: null });
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  const set = (k, v) => setDados((d) => ({ ...d, [k]: v }));

  // Valores explícitos de início e fim + clearProps: nada fica preso em opacity 0 entre passos (nem no double-run do dev)
  const { contextSafe } = useGSAP(() => {
    if (semMovimento()) return;
    gsap.fromTo(".passo", { x: 0, opacity: 1 }, { x: 0, opacity: 1, duration: 0, clearProps: "all" });
    gsap.fromTo(".passo > *", { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, clearProps: "all" });
  }, { scope: raiz, dependencies: [passo] });

  const ir = contextSafe((n) => {
    if (passo === 0 && !dados.nome.trim()) return setErro("Escreva o nome do jabuti.");
    setErro("");
    if (semMovimento()) return setPasso(n);
    gsap.fromTo(".passo", { x: 0, opacity: 1 }, { x: n > passo ? -60 : 60, opacity: 0, duration: 0.25, onComplete: () => setPasso(n) });
  });

  async function criar() {
    setSalvando(true); setErro("");
    try {
      const j = await criarJabuti(dados);
      await recarregar(j.id);
      festa();
      router.push("/carteirinha");
    } catch (e) { setErro(e.message); setSalvando(false); }
  }

  return (
    <main ref={raiz} className="mx-auto max-w-3xl px-5 py-8">
      <div className="mb-6 flex gap-2" aria-label={`Passo ${passo + 1} de 3`}>
        {[0, 1, 2].map((i) => <span key={i} className={`h-3 flex-1 rounded-full ${i <= passo ? "bg-casco" : "bg-cartao"}`} />)}
      </div>

      <div className="passo">
        {passo === 0 && (
          <>
            <Tortoise especie={dados.especie} id="bv" className="mx-auto w-48" />
            <h1 className="titulo-pagina mt-4 text-center">{novo ? "Um novo jabuti!" : "Bem-vinda ao diário!"}</h1>
            <label className="rotulo mt-8">Qual é o nome do jabuti?
              <input className="campo mt-2 text-2xl" value={dados.nome} onChange={(e) => set("nome", e.target.value)} maxLength={60} autoFocus />
            </label>
            <label className="rotulo mt-5">E o seu nome? (vai na carteirinha)
              <input className="campo mt-2" value={dados.tutor} onChange={(e) => set("tutor", e.target.value)} maxLength={60} placeholder="Seu nome" />
            </label>
          </>
        )}

        {passo === 1 && (
          <>
            <h1 className="titulo-pagina">Hora de ser detetive 🔍</h1>
            <p className="mt-2 text-xl">Olhe a cabeça e as patinhas de {dados.nome}. De que cor são as escamas?</p>
            <p className="mt-2 rounded-2xl bg-ceu/60 p-3 text-lg font-semibold">
              Já deixamos marcado <b>{especie(CONFIG.especiePadrao).nome}</b>. Se for outro, é só tocar.
            </p>
            <div className="mt-6"><EspecieEscolha valor={dados.especie} mudar={(v) => set("especie", v)} /></div>
          </>
        )}

        {passo === 2 && (
          <>
            <h1 className="titulo-pagina">Foto para a carteirinha 📸</h1>
            <p className="mt-2 text-xl">Pode pular e colocar depois.</p>
            <div className="mx-auto mt-6 grid aspect-square w-60 place-items-center overflow-hidden rounded-[2.5rem] border-8 border-casco bg-ceu">
              {dados.foto ? <img src={dados.foto} alt="Foto escolhida" className="h-full w-full object-cover" /> : <Tortoise especie={dados.especie} id="bvf" className="w-4/5" />}
            </div>
            <FotoInput className="mt-6 text-center" aoEscolher={(f) => set("foto", f)} texto={dados.foto ? "Trocar foto" : "Tirar ou escolher foto"} />
          </>
        )}
      </div>

      {erro && <p role="alert" className="mt-4 rounded-2xl bg-brasa/15 p-3 text-lg font-bold text-brasa">{erro}</p>}

      <div className="mt-10 flex justify-between gap-3">
        {passo > 0 ? <button className="botao-sec" onClick={() => ir(passo - 1)}><ArrowLeft /> Voltar</button> : <span />}
        {passo < 2
          ? <button className="botao" onClick={() => ir(passo + 1)}>Continuar <ArrowRight /></button>
          : <button className="botao bg-brasa" onClick={criar} disabled={salvando}><Sparkles /> {salvando ? "Criando…" : "Criar carteirinha"}</button>}
      </div>
    </main>
  );
}

export default function BemVindo() {
  return (
    <Suspense>
      <SoEditora aviso={false}><Passos /></SoEditora>
      <main className="mx-auto max-w-3xl px-5 py-8"><SoEditora aviso="Só a tutora pode cadastrar um jabuti." apenasAviso /></main>
    </Suspense>
  );
}
