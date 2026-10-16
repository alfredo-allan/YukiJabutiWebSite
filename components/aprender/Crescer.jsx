"use client";
import { useRef } from "react";
import { Egg, Ruler } from "lucide-react";
import { gsap, useGSAP, ScrollTrigger, semMovimento } from "@/lib/gsap";
import Tortoise from "../Tortoise";

const ETAPAS = [
  { quando: "Ovo", tam: "", texto: "Fica uns 5 meses no ovo, quentinho embaixo da terra.", escala: 0 },
  { quando: "Nasceu", tam: "4 a 5 cm", texto: "Cabe na palma da mão! Do tamanho de uma tampinha grande.", escala: 0.25 },
  { quando: "1 ano", tam: "cerca de 10 cm", texto: "Já está do tamanho de um celular deitado.", escala: 0.4 },
  { quando: "5 anos", tam: "cerca de 20 cm", texto: "Cresce mais nos primeiros anos. Medir todo mês ajuda a acompanhar!", escala: 0.65 },
  { quando: "Adulto", tam: "30 cm ou mais", texto: "Pode passar dos 30 cm e viver mais de 50 anos.", escala: 1 },
];

// Linha do tempo horizontal: a seção fica parada e a rolagem anda para o lado.
export default function Crescer({ especieId }) {
  const raiz = useRef(null);
  useGSAP(() => {
    if (semMovimento()) return;
    const trilha = raiz.current.querySelector(".trilha");
    const distancia = () => trilha.scrollWidth - window.innerWidth;
    const topo = () => document.querySelector("header")?.offsetHeight || 0;
    const mover = gsap.to(trilha, {
      x: () => -distancia(), ease: "none",
      scrollTrigger: { trigger: raiz.current, pin: true, scrub: 1, start: () => `top ${topo()}`, end: () => "+=" + distancia(), invalidateOnRefresh: true },
    });
    gsap.utils.toArray(".etapa-bicho").forEach((el) => {
      gsap.from(el, { scale: 0.2, rotate: -20, opacity: 0, ease: "back.out(2)",
        scrollTrigger: { trigger: el, containerAnimation: mover, start: "left 85%", end: "left 55%", scrub: true } });
    });
    gsap.to(".barra-tempo", { scaleX: 1, ease: "none",
      scrollTrigger: { trigger: raiz.current, start: () => `top ${topo()}`, end: () => "+=" + distancia(), scrub: true } });
    return () => ScrollTrigger.refresh();
  }, { scope: raiz });

  return (
    <section ref={raiz} className="relative overflow-hidden bg-folha/15 motion-reduce:overflow-x-auto">
      <div className="mx-auto max-w-5xl px-5 pt-12">
        <div className="flex items-center gap-4">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-folha text-white"><Ruler size={38} /></span>
          <h2 className="text-3xl font-extrabold sm:text-5xl">Quanto um jabuti cresce?</h2>
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-cartao">
          <div className="barra-tempo h-full scale-x-0 rounded-full bg-casco motion-reduce:scale-x-100" style={{ transformOrigin: "left" }} />
        </div>
      </div>
      <div className="trilha flex w-max gap-6 px-5 pb-12 pt-8 sm:px-[8vw]">
        {ETAPAS.map((e) => (
          <article key={e.quando} className="flex w-[78vw] max-w-[420px] shrink-0 flex-col rounded-blob bg-cartao p-6">
            <div className="flex h-40 items-end justify-center">
              {e.escala === 0
                ? <Egg className="etapa-bicho text-casco" size={96} strokeWidth={1.8} />
                : <div className="etapa-bicho" style={{ width: `${30 + e.escala * 70}%` }}><Tortoise especie={especieId} id={`cres-${e.quando}`} /></div>}
            </div>
            <p className="mt-4 text-3xl font-extrabold">{e.quando}</p>
            {e.tam && <p className="text-2xl font-bold text-brasa">{e.tam}</p>}
            <p className="mt-2 text-lg leading-snug text-tinta/80">{e.texto}</p>
          </article>
        ))}
      </div>
      <p className="px-5 pb-8 text-center text-base font-semibold text-tinta/60">Números aproximados: cada jabuti cresce no seu ritmo.</p>
    </section>
  );
}
