"use client";
import { useRef } from "react";
import { Footprints, Hourglass, Waves, Palette } from "lucide-react";
import { gsap, useGSAP, semMovimento } from "@/lib/gsap";
import { especie } from "@/lib/especies";

export default function Conheca({ especieId }) {
  const raiz = useRef(null);
  const e = especie(especieId);
  const fatos = [
    { Icone: Palette, cor: "bg-brasa", titulo: "Escamas coloridas", texto: e.pista },
    { Icone: Hourglass, cor: "bg-casco", titulo: "Vive muito", numero: 50, texto: "anos ou mais. Ele vai crescer junto com você!" },
    { Icone: Waves, cor: "bg-agua", titulo: "Não sabe nadar", texto: "Jabuti vive na terra. Quem nada é a tartaruga." },
    { Icone: Footprints, cor: "bg-folha", titulo: "Explorador", texto: "Anda devagar, mas adora passear e cheirar tudo." },
  ];

  useGSAP(() => {
    if (semMovimento()) return;
    gsap.from(".fato", {
      y: 60, rotate: (i) => (i % 2 ? 6 : -6), opacity: 0, stagger: 0.12, duration: 0.7, ease: "back.out(1.6)",
      scrollTrigger: { trigger: raiz.current, start: "top 70%" },
    });
    const n = { v: 0 };
    gsap.to(n, {
      v: 50, duration: 1.6, ease: "power2.out", snap: { v: 1 },
      onUpdate: () => { const el = raiz.current?.querySelector(".contador"); if (el) el.textContent = n.v; },
      scrollTrigger: { trigger: ".contador", start: "top 85%" },
    });
  }, { scope: raiz });

  return (
    <section ref={raiz} className="mx-auto max-w-5xl px-5 py-14">
      <h2 className="text-3xl font-extrabold sm:text-5xl">Conheça o {e.nome.toLowerCase()}</h2>
      <p className="mt-2 text-xl text-tinta/75"><i>{e.cientifico}</i>. {e.curiosidade}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {fatos.map(({ Icone, cor, titulo, texto, numero }) => (
          <div key={titulo} className="fato flex gap-4 rounded-blob bg-cartao p-5">
            <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${cor} text-white`}><Icone size={30} /></span>
            <div>
              <p className="text-2xl font-extrabold">{titulo}</p>
              <p className="text-lg leading-snug text-tinta/80">
                {numero != null && <span className="contador mr-1 text-4xl font-extrabold text-casco">{numero}</span>}
                {texto}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
