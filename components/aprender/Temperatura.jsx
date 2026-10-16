"use client";
import { useRef } from "react";
import { Thermometer, Snowflake, Smile, Flame } from "lucide-react";
import { gsap, useGSAP, semMovimento } from "@/lib/gsap";
import Secao from "./Secao";

const FAIXAS = [
  { Icone: Snowflake, cor: "text-agua", titulo: "Frio: menos de 20 °C", texto: "Ele fica paradinho e perde a fome." },
  { Icone: Smile, cor: "text-folha", titulo: "Perfeito: 25 °C a 32 °C", texto: "Come, passeia e fica feliz." },
  { Icone: Flame, cor: "text-brasa", titulo: "Quente: mais de 35 °C", texto: "Precisa de sombra e água fresca." },
];

export default function Temperatura() {
  const raiz = useRef(null);
  useGSAP(() => {
    if (semMovimento()) { gsap.set(".mercurio", { scaleY: 0.62 }); return; }
    gsap.timeline({ scrollTrigger: { trigger: raiz.current, start: "top 65%", end: "bottom 60%", scrub: 0.8 } })
      .fromTo(".mercurio", { scaleY: 0.05 }, { scaleY: 0.3, duration: 1 })
      .fromTo(".faixa-0", { opacity: 0.25, x: 30 }, { opacity: 1, x: 0, duration: 0.6 }, "<0.4")
      .to(".mercurio", { scaleY: 0.62, duration: 1 })
      .fromTo(".faixa-1", { opacity: 0.25, x: 30 }, { opacity: 1, x: 0, duration: 0.6 }, "<0.4")
      .to(".mercurio", { scaleY: 0.95, duration: 1 })
      .fromTo(".faixa-2", { opacity: 0.25, x: 30 }, { opacity: 1, x: 0, duration: 0.6 }, "<0.4")
      .to(".mercurio", { scaleY: 0.62, duration: 1 })
      .fromTo(".casinha", { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6 }, "<");
  }, { scope: raiz });

  return (
    <div ref={raiz}>
      <Secao id="casa" placa={0} Icone={Thermometer} cor="bg-brasa" titulo="A casa e a temperatura">
        <div className="grid items-center gap-8 md:grid-cols-[160px_1fr]">
          <svg viewBox="0 0 80 300" className="mx-auto h-72 md:h-96" aria-hidden>
            <rect x="26" y="10" width="28" height="240" rx="14" className="fill-cartao stroke-tinta/30" strokeWidth="4" />
            <rect x="32" y="20" width="16" height="230" rx="8" className="mercurio fill-brasa" style={{ transformOrigin: "40px 250px", transformBox: "view-box" }} />
            <circle cx="40" cy="262" r="28" className="fill-brasa stroke-tinta/30" strokeWidth="4" />
            {[60, 110, 160, 210].map((y) => <line key={y} x1="58" x2="70" y1={y} y2={y} className="stroke-tinta/40" strokeWidth="3" />)}
          </svg>
          <div className="space-y-4">
            {FAIXAS.map(({ Icone, cor, titulo, texto }, i) => (
              <div key={titulo} className={`faixa-${i} flex items-center gap-4 rounded-blob bg-cartao p-5`}>
                <Icone size={44} className={`${cor} shrink-0`} strokeWidth={2.4} />
                <div><p className="text-2xl font-extrabold">{titulo}</p><p className="text-lg text-tinta/80">{texto}</p></div>
              </div>
            ))}
            <p className="casinha rounded-blob border-4 border-dashed border-folha/50 p-5 text-xl leading-relaxed">
              🏡 Na casa dele precisa ter um <b>cantinho quente com sol</b>, um <b>cantinho fresco com sombra</b> e uma <b>toca</b> para dormir. Ele escolhe onde quer ficar!
            </p>
          </div>
        </div>
      </Secao>
    </div>
  );
}
