"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Moon, Sun, Trash2, KeyRound } from "lucide-react";
import { useJabuti } from "@/components/JabutiProvider";
import { useTema } from "@/components/ThemeProvider";
import PrecisaJabuti from "@/components/PrecisaJabuti";
import EspecieEscolha from "@/components/EspecieEscolha";
import SoEditora from "@/components/SoEditora";
import { hoje } from "@/lib/datas";

const SEXOS = [["femea", "Fêmea"], ["macho", "Macho"], ["nao-sei", "Ainda não sei"]];

// Trocar a senha desloga os outros aparelhos (este continua dentro)
function TrocarSenha() {
  const { trocarSenha } = useJabuti();
  const [senha, setSenha] = useState("");
  const [msg, setMsg] = useState("");
  const [erro, setErro] = useState("");

  async function salvar(e) {
    e.preventDefault();
    setErro(""); setMsg("");
    try { await trocarSenha(senha); setSenha(""); setMsg("Senha trocada! Os outros aparelhos vão precisar da senha nova."); }
    catch (er) { setErro(er.message); }
  }

  return (
    <form onSubmit={salvar} className="mt-14 rounded-blob bg-cartao p-5">
      <h2 className="flex items-center gap-2 text-2xl font-extrabold"><KeyRound /> Trocar senha</h2>
      <label className="rotulo mt-4">Senha nova
        <input className="campo mt-2" type="password" autoComplete="new-password" minLength={4} value={senha} onChange={(e) => setSenha(e.target.value)} required />
      </label>
      {erro && <p role="alert" className="mt-3 font-bold text-brasa">{erro}</p>}
      {msg && <p className="mt-3 font-bold text-folha">{msg}</p>}
      <button className="botao-sec mt-4">Salvar senha nova</button>
    </form>
  );
}

function Ajustes() {
  const { atual, atualizar, apagar: apagarJabuti } = useJabuti();
  const { tema, alternar } = useTema();
  const router = useRouter();
  const [f, setF] = useState(null);
  const [msg, setMsg] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    setF({ nome: atual.nome, tutor: atual.tutor || "", especie: atual.especie, sexo: atual.sexo || "nao-sei",
      nascimento: atual.nascimento || "", chegada: atual.chegada || "", microchip: atual.microchip || "" });
  }, [atual.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!f) return null;
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));

  async function salvar(e) {
    e.preventDefault();
    setErro(""); setMsg("");
    try { await atualizar(f); setMsg("Dados salvos! A carteirinha já foi atualizada."); }
    catch (er) { setErro(er.message); }
  }

  async function apagar() {
    if (!confirm(`Apagar ${atual.nome} e todo o diário? Isso não tem volta.`)) return;
    try { await apagarJabuti(atual.id); router.push("/"); }
    catch (er) { setErro(er.message); }
  }

  return (
    <main className="mx-auto max-w-3xl px-5 py-8">
      <h1 className="titulo-pagina">Ajustes</h1>

      <button onClick={alternar} role="switch" aria-checked={tema === "escuro"} className="mt-6 flex w-full items-center justify-between rounded-blob bg-cartao p-5 text-xl font-extrabold">
        <span className="flex items-center gap-3">{tema === "escuro" ? <Moon size={30} /> : <Sun size={30} />} Tema escuro</span>
        <span className={`relative h-9 w-16 rounded-full ${tema === "escuro" ? "bg-folha" : "bg-tinta/20"}`}>
          <span className={`absolute top-1 h-7 w-7 rounded-full bg-white transition-all ${tema === "escuro" ? "left-8" : "left-1"}`} />
        </span>
      </button>

      <SoEditora aviso={`Só a tutora muda os dados de ${atual.nome}.`}>
      <form onSubmit={salvar} className="mt-8 space-y-6">
        <h2 className="text-3xl font-extrabold">Dados de {atual.nome}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="rotulo">Nome do jabuti<input className="campo mt-2" value={f.nome} onChange={(e) => set("nome", e.target.value)} maxLength={60} required /></label>
          <label className="rotulo">Tutora / tutor<input className="campo mt-2" value={f.tutor} onChange={(e) => set("tutor", e.target.value)} maxLength={60} /></label>
        </div>

        <div>
          <p className="rotulo">Espécie</p>
          <div className="mt-2"><EspecieEscolha valor={f.especie} mudar={(v) => set("especie", v)} /></div>
        </div>

        <div>
          <p className="rotulo">Sexo</p>
          <div className="mt-2 grid grid-cols-3 gap-3">
            {SEXOS.map(([k, t]) => (
              <button key={k} type="button" aria-pressed={f.sexo === k} onClick={() => set("sexo", k)}
                className={`rounded-2xl border-4 p-3 text-lg font-bold ${f.sexo === k ? "border-casco bg-casco/25" : "border-tinta/10 bg-cartao"}`}>{t}</button>
            ))}
          </div>
          <p className="mt-2 text-base text-tinta/65">Em filhotes é difícil saber; o veterinário ajuda quando ele crescer.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="rotulo">Nascimento<input className="campo mt-2" type="date" max={hoje()} value={f.nascimento} onChange={(e) => set("nascimento", e.target.value)} /></label>
          <label className="rotulo">Chegou em casa<input className="campo mt-2" type="date" max={hoje()} value={f.chegada} onChange={(e) => set("chegada", e.target.value)} /></label>
          <label className="rotulo">Microchip<input className="campo mt-2" value={f.microchip} onChange={(e) => set("microchip", e.target.value)} maxLength={40} placeholder="Número" /></label>
        </div>

        {erro && <p role="alert" className="font-bold text-brasa">{erro}</p>}
        {msg && <p className="rounded-2xl bg-folha p-4 text-xl font-extrabold text-white">{msg}</p>}
        <button className="botao w-full text-xl"><Save /> Salvar dados</button>
      </form>

      <TrocarSenha />

      <section className="mt-14 rounded-blob border-4 border-brasa/30 p-5">
        <p className="text-lg font-bold">Área do adulto</p>
        <button onClick={apagar} className="mt-3 flex items-center gap-2 rounded-full bg-brasa/15 px-5 py-3 text-lg font-bold text-brasa"><Trash2 /> Apagar {atual.nome} e o diário</button>
      </section>
      </SoEditora>
    </main>
  );
}

export default function Pagina() {
  return <PrecisaJabuti><Ajustes /></PrecisaJabuti>;
}
