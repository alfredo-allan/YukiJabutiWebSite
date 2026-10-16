"use client";
import { useRef } from "react";
import { Sun, ShieldCheck } from "lucide-react";
import { gsap, useGSAP, semMovimento } from "@/lib/gsap";
import Secao from "./Secao";
import Tortoise from "../Tortoise";

export default function Sol({ especieId }) {
  const raiz = useRef(null);
  useGSAP(() => {
    if (semMovimento()) { gsap.set(".forca", { scaleX: 1 }); return; }
    const tl = gsap.timeline({ scrollTrigger: { trigger: ".ceu-sol", start: "top 75%", end: "bottom 30%", scrub: 1 } });
    tl.to(".astro", { motionPath: { path: ".caminho-sol", align: ".caminho-sol", alignOrigin: [0.5, 0.5] }, ease: "none" }, 0)
      .fromTo(".forca", { scaleX: 0.1 }, { scaleX: 1, ease: "none" }, 0)
      .fromTo(".sol-jabuti .placa-luz", { opacity: 0.25 }, { opacity: 1, stagger: 0.1 }, 0.1)
      .fromTo(".raio", { opacity: 0 }, { opacity: 1, stagger: 0.05 }, 0.2);
  }, { scope: raiz });

  return (
    <div ref={raiz}>
      <Secao id="sol" placa={3} Icone={Sun} cor="bg-casco" titulo="Sol para o casco ficar forte">
        <div className="ceu-sol relative overflow-hidden rounded-blob bg-ceu">
          <svg viewBox="0 0 600 260" className="w-full" aria-hidden>
            <path className="caminho-sol" d="M40 230 Q300 -60 560 230" fill="none" stroke="transparent" />
            <g className="astro">
              <circle r="30" fill="#FFC93C" />
              {Array.from({ length: 8 }, (_, i) => (
                <line key={i} className="raio" x1="0" y1="-42" x2="0" y2="-54" stroke="#FFC93C" strokeWidth="6" strokeLinecap="round" transform={`rotate(${i * 45})`} />
              ))}
            </g>
            <rect y="226" width="600" height="40" className="fill-folha/70" />
          </svg>
          <Tortoise especie={especieId} id="sol" cheio={false} className="sol-jabuti absolute bottom-3 left-1/2 w-32 -translate-x-1/2 sm:w-44" />
        </div>
        <div className="mt-6 flex items-center gap-3">
          <ShieldCheck className="shrink-0 text-folha" size={36} />
          <div className="h-6 flex-1 overflow-hidden rounded-full bg-cartao">
            <div className="forca h-full rounded-full bg-folha" style={{ transformOrigin: "left center" }} />
          </div>
          <span className="text-lg font-extrabold">Casco forte</span>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <p className="rounded-blob bg-cartao p-5 text-lg"><b>Sol de verdade</b>, de manhã cedinho ou no fim da tarde, com uma sombra por perto.</p>
          <p className="rounded-blob bg-cartao p-5 text-lg">O sol ajuda o corpo a <b>usar o cálcio</b>, e é o cálcio que deixa o casco duro.</p>
          <p className="rounded-blob bg-brasa/15 p-5 text-lg"><b>Pelo vidro da janela não vale</b>: o vidro segura a parte do sol que ele precisa.</p>
        </div>
      </Secao>
    </div>
  );
}
