"use client";
import { useRef } from "react";
import { gsap, useGSAP, semMovimento } from "@/lib/gsap";
import { dataBR, num } from "@/lib/datas";

export default function GrowthChart({ registros, campo, unidade }) {
  const ref = useRef(null);
  const pontos = registros.filter((r) => r[campo] != null);

  useGSAP(() => {
    const linha = ref.current?.querySelector(".linha");
    if (!linha || semMovimento()) return;
    const t = linha.getTotalLength();
    gsap.fromTo(linha, { strokeDasharray: t, strokeDashoffset: t }, { strokeDashoffset: 0, duration: 1.2, ease: "power2.out" });
    gsap.from(".ponto", { scale: 0, stagger: 0.06, delay: 0.3, transformOrigin: "center", transformBox: "fill-box", ease: "back.out(3)" });
  }, { scope: ref, dependencies: [campo, pontos.length], revertOnUpdate: true });

  if (pontos.length < 2) {
    return <p className="grid h-48 place-items-center rounded-blob border-4 border-dashed border-folha/30 p-6 text-center text-xl">Faça pelo menos 2 medidas para o gráfico aparecer.</p>;
  }
  const L = 600, A = 260, m = { e: 54, d: 20, t: 20, b: 40 };
  const vals = pontos.map((p) => p[campo]);
  const min = Math.min(...vals), max = Math.max(...vals), folga = (max - min || 1) * 0.15;
  const y = (v) => m.t + (A - m.t - m.b) * (1 - (v - (min - folga)) / (max - min + 2 * folga));
  const x = (i) => m.e + ((L - m.e - m.d) * i) / (pontos.length - 1);
  const d = pontos.map((p, i) => `${i ? "L" : "M"}${x(i)},${y(p[campo])}`).join(" ");
  const curta = (s) => dataBR(s, { day: "2-digit", month: "short" });

  return (
    <div ref={ref} className="overflow-x-auto">
      <svg viewBox={`0 0 ${L} ${A}`} className="min-w-[480px]" role="img" aria-label={`Gráfico de ${unidade === "g" ? "peso" : "tamanho"}`}>
        {[min, (min + max) / 2, max].map((v, i) => (
          <g key={i}>
            <line x1={m.e} x2={L - m.d} y1={y(v)} y2={y(v)} className="stroke-tinta/15" strokeWidth="2" strokeDasharray="6 8" />
            <text x={m.e - 8} y={y(v) + 5} textAnchor="end" className="fill-tinta/70 text-[14px] font-semibold">{num(v)}</text>
          </g>
        ))}
        <path d={d} className="linha stroke-folha" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {pontos.map((p, i) => (
          <g key={p.id}>
            <circle className="ponto fill-casco stroke-terra" strokeWidth="3" cx={x(i)} cy={y(p[campo])} r="9"><title>{`${num(p[campo])} ${unidade} em ${curta(p.data)}`}</title></circle>
            {(pontos.length <= 8 || i % Math.ceil(pontos.length / 8) === 0) && (
              <text x={x(i)} y={A - 12} textAnchor="middle" className="fill-tinta/70 text-[13px] font-semibold">{curta(p.data)}</text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
