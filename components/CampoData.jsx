"use client";

const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
const seletor = "campo mt-0 text-lg px-3";

// Seletor de data no tema do site (dia / mês / ano). Trocamos o <input type="date">
// nativo porque em alguns aparelhos ele devolve valor vazio e a data "escolhida"
// não chega a ser salva. Com três <select> o valor é sempre garantido.
// valor e saída no formato "AAAA-MM-DD" (ou "" quando incompleto).
export default function CampoData({ valor = "", aoMudar, max, anosAtras = 60 }) {
  const [a = "", m = "", d = ""] = valor ? valor.split("-") : [];
  const anoMax = Number((max || String(new Date().getFullYear())).slice(0, 4));
  const anos = Array.from({ length: anosAtras + 1 }, (_, i) => anoMax - i);
  const diasNoMes = a && m ? new Date(Number(a), Number(m), 0).getDate() : 31;
  const dias = Array.from({ length: diasNoMes }, (_, i) => i + 1);

  function mudar(parte, v) {
    const n = { a, m, d, [parte]: v };
    if (!n.a || !n.m || !n.d) return aoMudar("");
    // Corrige o dia que não existe no mês escolhido (ex.: 31 de fevereiro).
    const ultimo = new Date(Number(n.a), Number(n.m), 0).getDate();
    const dia = Math.min(Number(n.d), ultimo);
    aoMudar(`${n.a}-${n.m}-${String(dia).padStart(2, "0")}`);
  }

  return (
    <div className="mt-2 grid grid-cols-[1fr_1.5fr_1.1fr] gap-2">
      <select aria-label="Dia" className={seletor} value={d ? String(Number(d)) : ""} onChange={(e) => mudar("d", String(e.target.value).padStart(2, "0"))}>
        <option value="">Dia</option>
        {dias.map((n) => <option key={n} value={n}>{n}</option>)}
      </select>
      <select aria-label="Mês" className={seletor} value={m ? String(Number(m)) : ""} onChange={(e) => mudar("m", String(e.target.value).padStart(2, "0"))}>
        <option value="">Mês</option>
        {MESES.map((nome, i) => <option key={nome} value={i + 1}>{nome}</option>)}
      </select>
      <select aria-label="Ano" className={seletor} value={a} onChange={(e) => mudar("a", e.target.value)}>
        <option value="">Ano</option>
        {anos.map((n) => <option key={n} value={n}>{n}</option>)}
      </select>
    </div>
  );
}
