"use client";
import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, semMovimento } from "@/lib/gsap";
import Tortoise from "../Tortoise";

// Jabutizinho fixo no canto: cada cuidado aprendido acende uma placa do casco.
export default function ProgressoCasco({ especieId }) {
  const raiz = useRef(null);
  const [feitas, setFeitas] = useState(0);

  useGSAP(() => {
    const placas = gsap.utils.toArray(".placa-luz", raiz.current);
    const sem = semMovimento();
    gsap.set(placas, { opacity: 0.15 });
    ScrollTrigger.create({
      trigger: "#casa", start: "top 80%", endTrigger: "#fim-guia", end: "top 60%",
      onToggle: (s) => gsap.to(raiz.current, { autoAlpha: s.isActive ? 1 : 0, y: s.isActive ? 0 : 30, duration: 0.3 }),
    });
    document.querySelectorAll(".secao-cuidado").forEach((sec) => {
      const i = Number(sec.dataset.placa);
      ScrollTrigger.create({
        trigger: sec, start: "top 55%",
        onEnter: () => {
          setFeitas((n) => Math.max(n, i + 1));
          gsap.fromTo(placas[i], { opacity: 0.15, scale: 0.3 }, { opacity: 1, scale: 1, duration: sem ? 0 : 0.6, ease: "back.out(3)" });
          if (!sem) gsap.fromTo(raiz.current, { rotate: -8 }, { rotate: 0, duration: 0.7, ease: "elastic.out(1,0.35)" });
        },
        onLeaveBack: () => { setFeitas(i); gsap.to(placas[i], { opacity: 0.15, duration: 0.3 }); },
      });
    });
  });

  return (
    <div ref={raiz} className="invisible fixed bottom-3 right-3 z-30 w-[84px] rounded-3xl bg-cartao/90 p-1.5 text-center shadow-xl backdrop-blur sm:w-36"
      style={{ marginBottom: "env(safe-area-inset-bottom)" }} aria-live="polite">
      <Tortoise especie={especieId} id="progresso" cheio={false} />
      <p className="text-xs font-extrabold leading-tight sm:text-base">{feitas} de 5<span className="hidden sm:inline"> cuidados</span></p>
    </div>
  );
}
