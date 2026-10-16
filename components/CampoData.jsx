"use client";
import { useEffect, useRef, useState } from "react";

const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
const seletor = "campo mt-0 text-lg px-3";
const partes = (v) => { const [a = "", m = "", d = ""] = v ? v.split("-") : []; return { a, m, d }; };

// Seletor de data no tema do site (dia / mês / ano). Trocamos o <input type="date">
// nativo porque em alguns aparelhos ele devolve valor vazio. Guardamos a escolha
// parcial aqui dentro e só avisamos o pai quando os três campos estão preenchidos,
// para que escolher um campo por vez não zere os outros.
// valor e saída no formato "AAAA-MM-DD" (ou "" enquanto incompleto).
export default function CampoData({ valor = "", aoMudar, max, anosAtras = 60 }) {
  const [p, setP] = useState(() => partes(valor));
  const emitido = useRef(valor);

  // Só re-sincroniza quando o valor vem de fora (troca de jabuti, reset do form),
  // nunca do "" que nós mesmos mandamos durante uma escolha incompleta.
  useEffect(() => {
    if (valor !== emitido.current) { setP(partes(valor)); emitido.current = valor; }
  }, [valor]);

  const anoMax = Number((max || String(new Date().getFullYear())).slice(0, 4));
  const anos = Array.from({ length: anosAtras + 1 }, (_, i) => anoMax - i);
  const diasNoMes = p.a && p.m ? new Date(Number(p.a), Number(p.m), 0).getDate() : 31;
  const dias = Array.from({ length: diasNoMes }, (_, i) => i + 1);

  function mudar(parte, v) {
    const n = { ...p, [parte]: v };
    // Corrige o dia que não existe no mês escolhido (ex.: 31 de fevereiro).
    if (n.a && n.m && n.d) {
      const ultimo = new Date(Number(n.a), Number(n.m), 0).getDate();
      if (Number(n.d) > ultimo) n.d = String(ultimo).padStart(2, "0");
    }
    setP(n);
    const iso = n.a && n.m && n.d ? `${n.a}-${n.m}-${n.d}` : "";
    emitido.current = iso;
    aoMudar(iso);
  }

  return (
    <div className="mt-2 grid grid-cols-[1fr_1.5fr_1.1fr] gap-2">
      <select aria-label="Dia" className={seletor} value={p.d ? String(Number(p.d)) : ""} onChange={(e) => mudar("d", e.target.value ? String(e.target.value).padStart(2, "0") : "")}>
        <option value="">Dia</option>
        {dias.map((n) => <option key={n} value={n}>{n}</option>)}
      </select>
      <select aria-label="Mês" className={seletor} value={p.m ? String(Number(p.m)) : ""} onChange={(e) => mudar("m", e.target.value ? String(e.target.value).padStart(2, "0") : "")}>
        <option value="">Mês</option>
        {MESES.map((nome, i) => <option key={nome} value={i + 1}>{nome}</option>)}
      </select>
      <select aria-label="Ano" className={seletor} value={p.a} onChange={(e) => mudar("a", e.target.value)}>
        <option value="">Ano</option>
        {anos.map((n) => <option key={n} value={n}>{n}</option>)}
      </select>
    </div>
  );
}
