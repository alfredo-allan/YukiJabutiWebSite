"use client";
import { useRef, useState } from "react";
import { Salad, Droplets, Sun, Trash2, Save, Check, X } from "lucide-react";
import { gsap, useGSAP, semMovimento } from "@/lib/gsap";
import { useJabuti } from "@/components/JabutiProvider";
import PrecisaJabuti from "@/components/PrecisaJabuti";
import SoEditora from "@/components/SoEditora";
import Tortoise from "@/components/Tortoise";
import { useConfirmacao, useAviso } from "@/components/Confirmacao";
import { festa } from "@/lib/festa";
import { dataBR, hoje } from "@/lib/datas";
import FotoInput from "@/components/FotoInput";
import Midia from "@/components/Midia";

const TAREFAS = [
  { k: "comeu", Icone: Salad, titulo: "Comeu", cor: "bg-folha" },
  { k: "banho", Icone: Droplets, titulo: "Tomou banho", cor: "bg-agua" },
  { k: "sol", Icone: Sun, titulo: "Tomou sol", cor: "bg-casco" },
];
const HUMORES = [["feliz", "😄", "Feliz"], ["calmo", "😌", "Calmo"], ["sonolento", "😴", "Com sono"], ["estranho", "🤒", "Estranho"]];
const VAZIO = { comeu: false, banho: false, sol: false, humor: "feliz", observacao: "", foto: null, foto_tipo: null };

function saudacao() {
  const h = new Date().getHours();
  return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
}

function MeuDia() {
  const { atual, registrar, apagarRegistro, editora } = useJabuti();
  const confirmar = useConfirmacao();
  const avisar = useAviso();
  const raiz = useRef(null);
  const [form, setForm] = useState(VAZIO);
  const [msg, setMsg] = useState("");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  // últimos 7 dias: quais têm anotação
  const datas = new Set(atual.registros.map((r) => r.data));
  const semana = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    const iso = d.toISOString().slice(0, 10);
    return { iso, feito: datas.has(iso), letra: dataBR(iso, { weekday: "narrow" }) };
  });
  let seguidos = 0;
  for (let i = 6; i >= 0 && semana[i].feito; i--) seguidos++;

  const { contextSafe } = useGSAP(() => {
    if (semMovimento()) return;
    gsap.from(".tarefa", { y: 40, opacity: 0, stagger: 0.08, duration: 0.5, ease: "back.out(1.8)" });
    gsap.from(".dia-semana", { scale: 0, stagger: 0.05, duration: 0.4, delay: 0.2, ease: "back.out(3)" });
  }, { scope: raiz });

  const alternar = contextSafe((k, el) => {
    setForm((f) => ({ ...f, [k]: !f[k] }));
    if (!semMovimento()) gsap.fromTo(el.querySelector(".ico"), { scale: 0.6, rotate: -20 }, { scale: 1, rotate: 0, duration: 0.5, ease: "back.out(3)" });
  });

  const salvar = contextSafe(async (e) => {
    e.preventDefault();
    if (salvando) return;
    setErro("");
    setMsg("");
    setSalvando(true);
    try {
      await registrar({ ...form, data: hoje() });
      const feitas = TAREFAS.filter((t) => form[t.k]).length;
      setMsg(feitas === 3 ? `Dia perfeito! ${atual.nome} está super bem cuidado 🌟` : `Dia de ${atual.nome} anotado no diário! 📒`);
      setForm(VAZIO);
      festa();
      if (!semMovimento()) gsap.fromTo(".dia-jabuti", { y: 0 }, { y: -26, duration: 0.22, yoyo: true, repeat: 3 });
    } catch (er) {
      setErro(er.message);
    } finally {
      setSalvando(false);
    }
  });

  return (
    <main ref={raiz} className="mx-auto max-w-3xl px-5 py-8">
      <div className="flex items-center gap-4">
        <Tortoise especie={atual.especie} id="dia" className="dia-jabuti w-28 shrink-0 sm:w-36" />
        <div>
          <h1 className="titulo-pagina">{saudacao()}!</h1>
          <p className="text-xl text-tinta/75">Como foi o dia de {atual.nome}?</p>
        </div>
      </div>

      <section className="mt-6 rounded-blob bg-cartao p-4">
        <p className="text-lg font-extrabold">{seguidos > 1 ? `🔥 ${seguidos} dias seguidos anotados!` : "Anote todo dia para fazer uma sequência!"}</p>
        <div className="mt-3 grid grid-cols-7 gap-2">
          {semana.map((d) => (
            <div key={d.iso} className="dia-semana flex flex-col items-center gap-1">
              <span className={`grid aspect-square w-full max-w-[52px] place-items-center rounded-full border-4 ${d.feito ? "border-folha bg-folha text-white" : "border-tinta/15"} ${d.iso === hoje() ? "ring-4 ring-casco" : ""}`}>
                {d.feito && <Check strokeWidth={4} />}
              </span>
              <span className="text-sm font-bold uppercase text-tinta/60">{d.letra}</span>
            </div>
          ))}
        </div>
      </section>

      <SoEditora aviso={`Só a tutora anota o dia de ${atual.nome}.`}>
      <form onSubmit={salvar} className="mt-8">
        <fieldset disabled={salvando} className="min-w-0">
        <div className="grid grid-cols-3 gap-3">
          {TAREFAS.map(({ k, Icone, titulo, cor }) => (
            <button key={k} type="button" aria-pressed={form[k]} onClick={(e) => alternar(k, e.currentTarget)}
              className={`tarefa flex flex-col items-center gap-2 rounded-blob border-4 p-4 text-center text-lg font-extrabold leading-tight transition-colors ${form[k] ? `${cor} border-transparent text-white` : "border-tinta/10 bg-cartao"}`}>
              <span className="ico relative"><Icone size={48} strokeWidth={2.2} />{form[k] && <Check className="absolute -right-3 -top-2 rounded-full bg-white p-0.5 text-folha" size={24} strokeWidth={4} />}</span>
              {titulo}
            </button>
          ))}
        </div>

        <p className="mt-8 text-xl font-extrabold">Ele estava…</p>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {HUMORES.map(([h, e, t]) => (
            <button key={h} type="button" aria-pressed={form.humor === h} onClick={() => setForm({ ...form, humor: h })}
              className={`flex items-center justify-center gap-2 rounded-2xl border-4 p-3 text-lg font-bold ${form.humor === h ? "border-casco bg-casco/25" : "border-tinta/10 bg-cartao"}`}>
              <span className="text-3xl" aria-hidden>{e}</span>{t}
            </button>
          ))}
        </div>
        {form.humor === "estranho" && <p className="mt-3 rounded-2xl bg-brasa/15 p-4 text-lg font-bold">Avise um adulto. Veja os sinais de alerta na tela Aprender.</p>}

        <label className="rotulo mt-8">Recadinho do dia
          <textarea className="campo mt-2" rows={2} maxLength={300} value={form.observacao} onChange={(e) => setForm({ ...form, observacao: e.target.value })} placeholder="Hoje ela comeu flor de hibisco!" />
        </label>

        <div className="mt-8">
          <p className="rotulo">Mídia do dia <span className="font-semibold text-tinta/55">(opcional)</span></p>
          {form.foto ? (
            <div className="mt-3 flex items-start gap-3">
              <Midia src={form.foto} tipo={form.foto_tipo} alt="Prévia da mídia do dia" className="h-28 w-28 rounded-2xl border-4 border-casco object-cover" />
              <button type="button" onClick={() => setForm({ ...form, foto: null, foto_tipo: null })} className="botao-sec min-h-11 px-4 py-2 text-base"><X size={20} /> Tirar mídia</button>
            </div>
          ) : <FotoInput className="mt-3" aoEscolher={(midia) => setForm((f) => ({ ...f, foto: midia.src, foto_tipo: midia.tipo }))} texto="Adicionar foto ou vídeo do dia" />}
        </div>

        {erro && <p role="alert" className="mt-4 rounded-2xl bg-brasa/15 p-3 font-bold text-brasa">{erro}</p>}
        {salvando && <p role="status" aria-live="polite" className="mt-4 rounded-2xl bg-casco/20 p-3 text-center font-bold">Salvando o dia… só um instante!</p>}
        <button className="botao mt-6 w-full rounded-[20px] text-base sm:text-lg" disabled={salvando} aria-busy={salvando}>
          <Save size={24} /> {salvando ? "Salvando…" : "Salvar o dia"}
        </button>
        </fieldset>
      </form>
      </SoEditora>
      {msg && <p className="mt-6 rounded-blob bg-folha p-5 text-center text-2xl font-extrabold text-white" aria-live="polite">{msg}</p>}

      <section className="mt-12">
        <h2 className="text-3xl font-extrabold">Últimos dias</h2>
        {atual.registros.length === 0 && <p className="mt-3 text-xl">Nada anotado ainda. Que tal começar hoje?</p>}
        <ul className="mt-4 space-y-3">
          {[...atual.registros].reverse().slice(0, 14).map((r) => (
            <li key={r.id} className="flex items-start justify-between gap-3 rounded-2xl bg-cartao p-4 text-lg">
              <div className="min-w-0">
                <p className="font-extrabold first-letter:uppercase">{dataBR(r.data, { weekday: "long", day: "numeric", month: "long" })} {HUMORES.find(([h]) => h === r.humor)?.[1]}</p>
                <p className="flex flex-wrap gap-x-3 text-tinta/80">
                  {r.comeu && <span>🥬 comeu</span>}{r.banho && <span>💧 banho</span>}{r.sol && <span>☀️ sol</span>}
                  {r.peso_g != null && <span>⚖️ {r.peso_g} g</span>}{r.comprimento_cm != null && <span>📏 {r.comprimento_cm} cm</span>}
                </p>
                {r.observacao && <p className="text-tinta/75">“{r.observacao}”</p>}
                {r.foto && <Midia src={r.foto} tipo={r.foto_tipo} alt={`Mídia de ${atual.nome} em ${dataBR(r.data)}`} className="mt-3 h-32 w-32 rounded-2xl border-4 border-casco object-cover" />}
              </div>
              {editora && (
                <button onClick={async () => {
                  if (!await confirmar({ titulo: "Apagar este dia?", texto: "O recado e as tarefas desse dia vão sumir.", textoConfirmar: "Apagar", textoCancelar: "Manter" })) return;
                  try { await apagarRegistro(r.id); } catch (er) { avisar({ titulo: "Não consegui apagar", texto: er.message }); }
                }} aria-label="Apagar este dia" className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-tinta/50 hover:bg-brasa/15 hover:text-brasa">
                  <Trash2 />
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default function Pagina() {
  return <PrecisaJabuti><MeuDia /></PrecisaJabuti>;
}
