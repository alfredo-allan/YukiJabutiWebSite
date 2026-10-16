"use client";
import { useRef } from "react";
import { Droplets } from "lucide-react";
import { gsap, useGSAP, semMovimento } from "@/lib/gsap";
import Secao from "./Secao";
import Tortoise from "../Tortoise";

export default function Agua({ especieId }) {
  const raiz = useRef(null);
  useGSAP(() => {
    if (semMovimento()) { gsap.set(".nivel", { scaleY: 1 }); return; }
    gsap.timeline({ scrollTrigger: { trigger: ".bacia", start: "top 75%", end: "bottom 45%", scrub: 0.8 } })
      .fromTo(".nivel", { scaleY: 0 }, { scaleY: 1, ease: "none" })
      .fromTo(".linha-queixo", { opacity: 0, x: -20 }, { opacity: 1, x: 0 }, ">-0.2")
      .from(".bolha", { y: 30, opacity: 0, stagger: 0.1 }, "<");
  }, { scope: raiz });

  return (
    <div ref={raiz}>
      <Secao id="agua" placa={2} Icone={Droplets} cor="bg-agua" titulo="Água e banho">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div className="bacia relative mx-auto w-full max-w-md">
            <svg viewBox="0 0 400 230" className="w-full" aria-label="Jabuti num banho rasinho">
              <clipPath id="dentro-bacia"><path d="M30 60 L370 60 L340 210 L60 210 Z" /></clipPath>
              <path d="M30 60 L370 60 L340 210 L60 210 Z" className="fill-cartao" />
              <g clipPath="url(#dentro-bacia)">
                <rect x="0" y="130" width="400" height="90" className="nivel fill-agua/60" style={{ transformOrigin: "200px 220px", transformBox: "view-box" }} />
                {[[120, 175], [250, 185], [300, 160]].map(([x, y], i) => <circle key={i} className="bolha fill-white/70" cx={x} cy={y} r="6" />)}
              </g>
              <path d="M30 60 L370 60 L340 210 L60 210 Z" fill="none" className="stroke-terra" strokeWidth="8" strokeLinejoin="round" />
              <g className="linha-queixo">
                <line x1="40" x2="360" y1="130" y2="130" className="stroke-brasa" strokeWidth="4" strokeDasharray="12 10" />
              </g>
            </svg>
            <Tortoise especie={especieId} id="banho" className="pointer-events-none absolute left-[22%] top-[22%] w-[56%]" />
            <p className="linha-queixo mt-2 text-center text-lg font-extrabold text-brasa">Até aqui: abaixo do queixo</p>
          </div>
          <ul className="space-y-4 text-xl leading-relaxed">
            <li className="rounded-blob bg-cartao p-5"><b>Banho morninho e rasinho</b>, 1 ou 2 vezes por semana, por uns 15 minutos. Filhote pode tomar mais vezes.</li>
            <li className="rounded-blob bg-cartao p-5"><b>Pote de água raso</b> na casa dele, que ele consiga entrar e sair sozinho. Troque a água todo dia.</li>
            <li className="rounded-blob bg-brasa/15 p-5"><b>Nunca</b> deixe o jabuti sozinho na água, e a água nunca pode cobrir a cabeça.</li>
          </ul>
        </div>
      </Secao>
    </div>
  );
}
