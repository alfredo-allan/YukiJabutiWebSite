"use client";
import { useRef, useState } from "react";
import { Salad, RotateCcw } from "lucide-react";
import { gsap, useGSAP, semMovimento } from "@/lib/gsap";
import { festa } from "@/lib/festa";
import Secao from "./Secao";

// Jogo: toque nas comidas para montar o prato do jabuti.
const COMIDAS = [
  { id: "couve", e: "🥬", nome: "Couve", tipo: "prato", msg: "Isso! Folha verde-escura é a base do prato." },
  { id: "pao", e: "🍞", nome: "Pão", tipo: "nunca", msg: "Pão não! Faz mal para a barriga dele." },
  { id: "hibisco", e: "🌺", nome: "Flor de hibisco", tipo: "prato", msg: "Uau, flor! Jabuti ama hibisco." },
  { id: "morango", e: "🍓", nome: "Morango", tipo: "as-vezes", msg: "Fruta é sobremesa: só de vez em quando." },
  { id: "chocolate", e: "🍫", nome: "Chocolate", tipo: "nunca", msg: "Nunca! Doce de gente faz muito mal." },
  { id: "abobora", e: "🎃", nome: "Abóbora", tipo: "prato", msg: "Boa! Legume colorido faz bem." },
  { id: "leite", e: "🥛", nome: "Leite", tipo: "nunca", msg: "Jabuti não toma leite. Só água fresquinha." },
  { id: "cenoura", e: "🥕", nome: "Cenoura ralada", tipo: "prato", msg: "Isso! Ralada fica fácil de comer." },
  { id: "melancia", e: "🍉", nome: "Melancia", tipo: "as-vezes", msg: "Docinha! Mas é só sobremesa, às vezes." },
  { id: "batata", e: "🍟", nome: "Batata frita", tipo: "nunca", msg: "Não! Comida frita e salgada faz mal." },
];
const TOTAL_BONS = COMIDAS.filter((c) => c.tipo === "prato").length;

export default function Prato() {
  const raiz = useRef(null);
  const [usadas, setUsadas] = useState([]);
  const [msg, setMsg] = useState({ texto: "Toque em uma comida para dar ao jabuti.", tipo: "" });
  const noPrato = usadas.filter((id) => COMIDAS.find((c) => c.id === id).tipo === "prato");
  const naSobremesa = usadas.filter((id) => COMIDAS.find((c) => c.id === id).tipo === "as-vezes");

  const { contextSafe } = useGSAP(() => {
    if (semMovimento()) return;
    gsap.from(".comida", { scale: 0, rotate: -40, stagger: 0.05, duration: 0.5, ease: "back.out(2)",
      scrollTrigger: { trigger: ".mesa", start: "top 80%" } });
  }, { scope: raiz });

  const escolher = contextSafe((c, el) => {
    setMsg({ texto: c.msg, tipo: c.tipo });
    const sem = semMovimento();
    if (c.tipo === "nunca") {
      if (!sem) gsap.fromTo(el, { x: -10 }, { x: 10, duration: 0.07, repeat: 5, yoyo: true, clearProps: "x" });
      return;
    }
    if (usadas.includes(c.id)) return;
    const alvo = raiz.current.querySelector(c.tipo === "prato" ? ".prato" : ".tigela").getBoundingClientRect();
    const de = el.getBoundingClientRect();
    const fim = () => {
      const novas = [...usadas, c.id];
      setUsadas(novas);
      if (c.tipo === "prato" && novas.filter((id) => COMIDAS.find((x) => x.id === id).tipo === "prato").length === TOTAL_BONS) {
        setMsg({ texto: "Prato completo! O jabuti agradece 🐢💚", tipo: "prato" });
        festa(["🥬", "🌺", "🎃", "🥕"]);
      }
    };
    if (sem) return fim();
    gsap.to(el, {
      x: alvo.left + alvo.width / 2 - (de.left + de.width / 2),
      y: alvo.top + alvo.height / 2 - (de.top + de.height / 2),
      scale: 0.4, duration: 0.5, ease: "power2.in", onComplete: () => { gsap.set(el, { clearProps: "all" }); fim(); },
    });
  });

  const recomecar = () => { setUsadas([]); setMsg({ texto: "Toque em uma comida para dar ao jabuti.", tipo: "" }); };
  const corMsg = { prato: "bg-folha text-white", "as-vezes": "bg-casco text-terra", nunca: "bg-brasa text-white" }[msg.tipo] || "bg-cartao";

  return (
    <div ref={raiz}>
      <Secao id="comida" placa={1} Icone={Salad} cor="bg-folha" titulo="Monte o prato do jabuti">
        <p className="max-w-2xl text-xl leading-relaxed">
          Filhote come <b>todo dia</b>. Adulto pode comer <b>dia sim, dia não</b>. A maior parte do prato são folhas verde-escuras, legumes e flores.
        </p>

        <p className={`mt-6 rounded-2xl p-4 text-xl font-extrabold transition-colors ${corMsg}`} aria-live="polite">{msg.texto}</p>

        <div className="mesa mt-6 grid grid-cols-3 gap-3 sm:grid-cols-5">
          {COMIDAS.filter((c) => !usadas.includes(c.id)).map((c) => (
            <button key={c.id} onClick={(e) => escolher(c, e.currentTarget)}
              className="comida flex flex-col items-center rounded-blob bg-cartao p-3 text-base font-bold shadow-[0_4px_0_rgb(var(--tinta)/0.12)] active:scale-95">
              <span className="text-5xl" aria-hidden>{c.e}</span>{c.nome}
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-[1fr_auto] items-end gap-4">
          <div>
            <p className="mb-2 text-lg font-bold">Prato ({noPrato.length}/{TOTAL_BONS})</p>
            <div className="prato flex min-h-[120px] flex-wrap items-center justify-center gap-1 rounded-full border-[10px] border-cartao bg-white/70 p-4 dark:bg-white/10">
              {noPrato.map((id) => <span key={id} className="text-5xl">{COMIDAS.find((c) => c.id === id).e}</span>)}
            </div>
          </div>
          <div>
            <p className="mb-2 text-lg font-bold">Sobremesa</p>
            <div className="tigela flex h-[90px] w-[110px] flex-wrap items-center justify-center rounded-b-[60px] rounded-t-xl border-8 border-casco/60 bg-casco/20">
              {naSobremesa.map((id) => <span key={id} className="text-3xl">{COMIDAS.find((c) => c.id === id).e}</span>)}
            </div>
          </div>
        </div>
        {usadas.length > 0 && (
          <button onClick={recomecar} className="botao-sec mt-6"><RotateCcw size={22} /> Jogar de novo</button>
        )}
      </Secao>
    </div>
  );
}
