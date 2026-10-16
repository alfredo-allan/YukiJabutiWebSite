"use client";
import { useRef, useState } from "react";
import { Scale, Ruler, TrendingUp, Save, Info } from "lucide-react";
import { gsap, useGSAP, semMovimento } from "@/lib/gsap";
import { useJabuti } from "@/components/JabutiProvider";
import PrecisaJabuti from "@/components/PrecisaJabuti";
import SoEditora from "@/components/SoEditora";
import GrowthChart from "@/components/GrowthChart";
import { festa } from "@/lib/festa";
import { dataBR, hoje, num } from "@/lib/datas";

// Comparações para a criança "sentir" o tamanho
const OBJETOS = [[3, "uma tampinha de garrafa"], [6, "um ovo de galinha"], [8.5, "um cartão de banco"], [12, "a palma da sua mão"], [15, "um celular"], [21, "uma folha de caderno pequena"], [30, "uma régua escolar"]];
const comparar = (cm) => (OBJETOS.reduce((melhor, o) => (Math.abs(o[0] - cm) < Math.abs(melhor[0] - cm) ? o : melhor)))[1];

function Crescimento() {
  const { atual, registrar } = useJabuti();
  const raiz = useRef(null);
  const [aba, setAba] = useState("peso_g");
  const [form, setForm] = useState({ peso_g: "", comprimento_cm: "", data: hoje() });
  const [msg, setMsg] = useState("");
  const [erro, setErro] = useState("");
  const [ajuda, setAjuda] = useState(false);

  const medidas = atual.registros.filter((r) => r.peso_g != null || r.comprimento_cm != null);
  const primeiro = (k) => medidas.find((r) => r[k] != null)?.[k];
  const ganhoPeso = atual.peso_atual_g != null && primeiro("peso_g") != null ? atual.peso_atual_g - primeiro("peso_g") : null;
  const ganhoTam = atual.tamanho_atual_cm != null && primeiro("comprimento_cm") != null ? atual.tamanho_atual_cm - primeiro("comprimento_cm") : null;

  useGSAP(() => {
    if (semMovimento()) return;
    gsap.from(".painel", { y: 30, opacity: 0, stagger: 0.1, duration: 0.5, ease: "back.out(1.6)" });
  }, { scope: raiz });

  async function salvar(e) {
    e.preventDefault();
    if (!form.peso_g && !form.comprimento_cm) return setErro("Escreva o peso, o tamanho ou os dois.");
    setErro("");
    const antes = { p: atual.peso_atual_g, t: atual.tamanho_atual_cm };
    try {
      await registrar(form);
      const partes = [];
      if (form.comprimento_cm && antes.t != null && Number(form.comprimento_cm) > antes.t) partes.push(`cresceu ${num(Number(form.comprimento_cm) - antes.t)} cm`);
      if (form.peso_g && antes.p != null && Number(form.peso_g) > antes.p) partes.push(`ganhou ${num(Number(form.peso_g) - antes.p, 0)} g`);
      setMsg(partes.length ? `Uau! ${atual.nome} ${partes.join(" e ")} desde a última medida!` : "Medida guardada! 📏");
      setForm({ peso_g: "", comprimento_cm: "", data: hoje() });
      festa(["📏", "⚖️", "⭐", "🍃"]);
    } catch (er) { setErro(er.message); }
  }

  return (
    <main ref={raiz} className="mx-auto max-w-4xl px-5 py-8">
      <h1 className="titulo-pagina">Crescimento de {atual.nome}</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="painel rounded-blob bg-ceu/70 p-5">
          <Scale size={34} className="text-agua" />
          <p className="mt-2 text-4xl font-extrabold">{atual.peso_atual_g != null ? `${num(atual.peso_atual_g, 0)} g` : "—"}</p>
          <p className="text-lg font-semibold text-tinta/70">peso agora</p>
        </div>
        <div className="painel rounded-blob bg-casco/30 p-5">
          <Ruler size={34} className="text-terra" />
          <p className="mt-2 text-4xl font-extrabold">{atual.tamanho_atual_cm != null ? `${num(atual.tamanho_atual_cm)} cm` : "—"}</p>
          <p className="text-lg font-semibold text-tinta/70">{atual.tamanho_atual_cm != null ? `mais ou menos ${comparar(atual.tamanho_atual_cm)}` : "tamanho do casco"}</p>
        </div>
        <div className="painel rounded-blob bg-folha/20 p-5">
          <TrendingUp size={34} className="text-folha" />
          <p className="mt-2 text-2xl font-extrabold leading-tight">
            {ganhoPeso != null || ganhoTam != null
              ? [ganhoTam != null && `+${num(ganhoTam)} cm`, ganhoPeso != null && `+${num(ganhoPeso, 0)} g`].filter(Boolean).join(" · ")
              : "Ainda sem comparação"}
          </p>
          <p className="text-lg font-semibold text-tinta/70">desde a primeira medida</p>
        </div>
      </div>

      <SoEditora aviso="Só a tutora guarda novas medidas.">
      <form onSubmit={salvar} className="mt-8 rounded-blob border-4 border-folha/25 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-3xl font-extrabold">Medir agora</h2>
          <button type="button" onClick={() => setAjuda(!ajuda)} aria-expanded={ajuda} className="flex items-center gap-2 rounded-full bg-cartao px-4 py-2 text-lg font-bold"><Info size={22} /> Como medir?</button>
        </div>
        {ajuda && (
          <ol className="mt-4 list-decimal space-y-1 rounded-2xl bg-ceu/50 p-4 pl-10 text-lg">
            <li>Coloque um potinho na balança de cozinha e aperte para zerar.</li>
            <li>Ponha o jabuti no pote com cuidado e anote o peso em gramas.</li>
            <li>Com a régua, meça o casco em linha reta, da frente até atrás.</li>
            <li>Meça uma vez por mês, sempre do mesmo jeito.</li>
          </ol>
        )}
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <label className="rotulo">Peso (gramas)
            <input className="campo mt-2" type="number" inputMode="decimal" min="0" step="any" value={form.peso_g} onChange={(e) => setForm({ ...form, peso_g: e.target.value })} placeholder="ex: 85" />
          </label>
          <label className="rotulo">Casco (cm)
            <input className="campo mt-2" type="number" inputMode="decimal" min="0" step="0.1" value={form.comprimento_cm} onChange={(e) => setForm({ ...form, comprimento_cm: e.target.value })} placeholder="ex: 7,5" />
          </label>
          <label className="rotulo">Dia
            <input className="campo mt-2" type="date" max={hoje()} value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} />
          </label>
        </div>
        {erro && <p role="alert" className="mt-3 font-bold text-brasa">{erro}</p>}
        <button className="botao mt-5 w-full text-xl"><Save /> Guardar medida</button>
        {msg && <p className="mt-4 rounded-2xl bg-folha p-4 text-center text-xl font-extrabold text-white" aria-live="polite">{msg}</p>}
      </form>
      </SoEditora>

      <section className="painel mt-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-3xl font-extrabold">Gráfico</h2>
          <div className="flex rounded-full bg-cartao p-1" role="tablist">
            {[["peso_g", "Peso", Scale], ["comprimento_cm", "Tamanho", Ruler]].map(([k, t, I]) => (
              <button key={k} role="tab" aria-selected={aba === k} onClick={() => setAba(k)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-lg font-bold ${aba === k ? "bg-folha text-white" : ""}`}><I size={20} /> {t}</button>
            ))}
          </div>
        </div>
        <div className="mt-4 rounded-blob bg-cartao p-4">
          <GrowthChart registros={atual.registros} campo={aba} unidade={aba === "peso_g" ? "g" : "cm"} />
        </div>
      </section>

      {medidas.length > 0 && (
        <section className="mt-10">
          <h2 className="text-3xl font-extrabold">Todas as medidas</h2>
          <div className="mt-4 overflow-x-auto rounded-blob bg-cartao">
            <table className="w-full text-left text-lg">
              <thead><tr className="border-b-4 border-fundo"><th className="p-4">Dia</th><th className="p-4">Peso</th><th className="p-4">Casco</th></tr></thead>
              <tbody>
                {[...medidas].reverse().map((r) => (
                  <tr key={r.id} className="border-b-2 border-fundo last:border-0">
                    <td className="p-4 font-bold">{dataBR(r.data)}</td>
                    <td className="p-4">{r.peso_g != null ? `${num(r.peso_g, 0)} g` : "—"}</td>
                    <td className="p-4">{r.comprimento_cm != null ? `${num(r.comprimento_cm)} cm` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}

export default function Pagina() {
  return <PrecisaJabuti><Crescimento /></PrecisaJabuti>;
}
