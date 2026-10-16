"use client";
import { useRef, useState } from "react";
import { ChevronDown, Hand } from "lucide-react";
import { gsap, useGSAP, semMovimento } from "@/lib/gsap";
import Tortoise from "../Tortoise";
import { especie } from "@/lib/especies";

export default function Hero({ nome, especieId }) {
  const raiz = useRef(null);
  const [fala, setFala] = useState(`Oi! Eu sou ${nome}!`);
  const escondida = useRef(false);

  const { contextSafe } = useGSAP(() => {
    if (semMovimento()) return;
    gsap.timeline()
      .from(".hero-yuki", { xPercent: -130, duration: 1.8, ease: "power2.out" })
      .from(".hero-yuki .pata", { y: -7, duration: 0.16, repeat: 9, yoyo: true, stagger: 0.08 }, 0)
      .from(".hero-yuki .cabeca", { x: -30, duration: 0.6, ease: "back.out(3)" }, ">-0.3")
      .from(".hero-balao", { scale: 0, transformOrigin: "20% 100%", duration: 0.5, ease: "back.out(2.5)" }, "<0.2")
      .from(".hero-texto > *", { y: 34, opacity: 0, stagger: 0.12, duration: 0.6 }, "<");

    // piscar
    gsap.timeline({ repeat: -1, repeatDelay: 2.6, delay: 2.5 })
      .to(".hero-yuki .olho", { scaleY: 0.1, duration: 0.08 })
      .to(".hero-yuki .olho", { scaleY: 1, duration: 0.12 });

    gsap.to(".seta-rolar", { y: 10, repeat: -1, yoyo: true, duration: 0.7, ease: "sine.inOut" });

    // a cabeça acompanha o dedo/mouse
    const vira = gsap.quickTo(".hero-yuki .cabeca", "rotation", { duration: 0.5, ease: "power2.out" });
    const mexe = (e) => {
      const caixa = raiz.current.querySelector(".hero-yuki").getBoundingClientRect();
      const dy = (e.clientY - (caixa.top + caixa.height * 0.55)) / window.innerHeight;
      vira(gsap.utils.clamp(-14, 14, dy * 40));
    };
    window.addEventListener("pointermove", mexe);
    return () => window.removeEventListener("pointermove", mexe);
  }, { scope: raiz });

  const tocar = contextSafe(() => {
    if (escondida.current) return;
    escondida.current = true;
    setFala("Ai! Que susto… 🙈");
    const sem = semMovimento();
    gsap.timeline({ onComplete: () => { escondida.current = false; setFala("Pode me tocar com carinho 😊"); } })
      .to(".hero-yuki .cabeca", { x: -34, scale: 0.75, transformOrigin: "200px 92px", duration: sem ? 0 : 0.25 })
      .to(".hero-yuki .pata", { y: -14, scaleY: 0.5, transformOrigin: "50% 0%", duration: sem ? 0 : 0.25 }, 0)
      .to(".hero-yuki", { rotation: -4, duration: 0.08, repeat: sem ? 0 : 5, yoyo: true }, 0.2)
      .to(".hero-yuki .cabeca, .hero-yuki .pata", { x: 0, y: 0, scale: 1, scaleY: 1, duration: sem ? 0 : 0.5, ease: "back.out(2)" }, "+=1.1");
  });

  return (
    <section ref={raiz} className="mx-auto grid min-h-[calc(100svh-80px)] max-w-5xl items-center gap-6 px-5 pb-10 pt-4 md:grid-cols-[1.1fr_1fr]">
      <div className="hero-texto order-2 md:order-1">
        <h1 className="text-5xl font-extrabold leading-[1.02] sm:text-6xl">Vamos aprender a cuidar de um jabuti</h1>
        <p className="mt-4 max-w-md text-xl leading-relaxed text-tinta/80">
          Role a tela devagar. Em cada parte tem uma coisa para tocar, mexer ou descobrir, e o casco lá embaixo vai acendendo.
        </p>
        <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-cartao px-4 py-2 text-lg font-bold">
          <span className="h-4 w-4 rounded-full" style={{ background: especie(especieId).manchas }} />
          {especie(especieId).nome}
        </p>
        <div className="mt-8 flex items-center gap-3 text-lg font-bold text-tinta/70">
          <ChevronDown className="seta-rolar" size={36} strokeWidth={3} /> Role para baixo
        </div>
      </div>

      <div className="relative order-1 md:order-2">
        <p className="hero-balao absolute -top-2 left-2 z-10 rounded-3xl rounded-bl-md bg-cartao px-5 py-3 text-xl font-extrabold shadow-lg sm:text-2xl" aria-live="polite">
          {fala}
        </p>
        <button onClick={tocar} className="block w-full pt-14" aria-label={`Tocar em ${nome}`}>
          <Tortoise especie={especieId} id="hero" className="hero-yuki w-full max-w-lg drop-shadow-[0_18px_18px_rgb(0_0_0/0.25)]" titulo={`${nome}, o jabuti`} />
        </button>
        <p className="mt-1 flex items-center justify-center gap-2 text-base font-bold text-tinta/60"><Hand size={20} /> Toque nela</p>
      </div>
    </section>
  );
}
