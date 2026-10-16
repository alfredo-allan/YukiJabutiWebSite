"use client";
import { useRef } from "react";
import { Stethoscope, Shell, Eye, Wind, UtensilsCrossed, Droplet, BandageIcon, RotateCw } from "lucide-react";
import { gsap, useGSAP, semMovimento } from "@/lib/gsap";
import Secao from "./Secao";

const SINAIS = [
  { Icone: Shell, titulo: "Casco mole", verso: "O casco precisa ser durinho. Pode faltar sol ou cálcio." },
  { Icone: Eye, titulo: "Olho inchado", verso: "Olho fechado ou inchado precisa de veterinário." },
  { Icone: Droplet, titulo: "Nariz escorrendo", verso: "Pode ser resfriado de jabuti. Deixe ele bem quentinho e avise um adulto." },
  { Icone: Wind, titulo: "Respira com barulho", verso: "Chiado ou boca aberta para respirar é sinal de alerta." },
  { Icone: UtensilsCrossed, titulo: "Sem comer há dias", verso: "Se ele não come por vários dias seguidos, algo não está bem." },
  { Icone: BandageIcon, titulo: "Machucado no casco", verso: "Mancha, rachadura ou ferida precisa ser vista logo." },
];

export default function Saude() {
  const raiz = useRef(null);
  const { contextSafe } = useGSAP(() => {
    if (semMovimento()) return;
    gsap.from(".carta", { y: 50, rotateY: 90, opacity: 0, stagger: 0.08, duration: 0.6, ease: "back.out(1.5)",
      scrollTrigger: { trigger: ".cartas", start: "top 75%" } });
  }, { scope: raiz });

  const virar = contextSafe((el) => {
    const virada = el.dataset.virada === "1";
    el.dataset.virada = virada ? "0" : "1";
    el.setAttribute("aria-pressed", String(!virada));
    gsap.to(el.querySelector(".miolo"), { rotateY: virada ? 0 : 180, duration: semMovimento() ? 0 : 0.6, ease: "back.out(1.4)" });
  });

  return (
    <div ref={raiz}>
      <Secao id="saude" placa={4} Icone={Stethoscope} cor="bg-terra" titulo="Sinais de alerta">
        <p className="max-w-2xl text-xl leading-relaxed">Toque em cada cartão para descobrir. Se notar qualquer um desses sinais, <b>chame um adulto</b>: quem cuida é o veterinário de animais silvestres.</p>
        <div className="cartas mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
          {SINAIS.map(({ Icone, titulo, verso }) => (
            <button key={titulo} onClick={(e) => virar(e.currentTarget)} aria-pressed="false" className="carta virar h-48 text-left sm:h-52">
              <div className="miolo relative grid h-full" style={{ transformStyle: "preserve-3d" }}>
                <div className="face flex flex-col items-center justify-center gap-2 rounded-blob bg-cartao p-4 text-center">
                  <Icone size={48} className="text-brasa" strokeWidth={2.2} />
                  <span className="text-xl font-extrabold leading-tight">{titulo}</span>
                  <RotateCw size={18} className="text-tinta/40" />
                </div>
                <div className="face flex items-center rounded-blob bg-terra p-4 text-lg font-semibold leading-snug text-white" style={{ transform: "rotateY(180deg)" }}>
                  {verso}
                </div>
              </div>
            </button>
          ))}
        </div>
        <p className="mt-6 rounded-blob bg-ceu/70 p-5 text-xl">🧼 Depois de pegar o jabuti no colo, <b>lave bem as mãos</b> com água e sabão.</p>
      </Secao>
    </div>
  );
}
