"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { RotateCw, Pencil } from "lucide-react";
import { gsap, useGSAP, semMovimento } from "@/lib/gsap";
import { useJabuti } from "@/components/JabutiProvider";
import PrecisaJabuti from "@/components/PrecisaJabuti";
import SoEditora from "@/components/SoEditora";
import FotoInput from "@/components/FotoInput";
import Tortoise from "@/components/Tortoise";
import { especie } from "@/lib/especies";
import { dataBR, diasDesde, num } from "@/lib/datas";
import { festa } from "@/lib/festa";

const SEXO = { macho: "Macho", femea: "Fêmea", "nao-sei": "Ainda não sei" };

// Padrão de placas de casco no fundo da carteirinha
const fundoCasco = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='48' viewBox='0 0 56 48'%3E%3Cpath d='M14 0h28l14 24-14 24H14L0 24z' fill='none' stroke='%23000' stroke-opacity='.06' stroke-width='3'/%3E%3C/svg%3E")`;

function Campo({ rotulo, valor, grande }) {
  return (
    <div>
      <p className="text-sm font-bold text-tinta/60">{rotulo}</p>
      <p className={`${grande ? "text-2xl" : "text-lg"} font-extrabold leading-tight`}>{valor || "—"}</p>
    </div>
  );
}

function Carteirinha() {
  const { atual, atualizar } = useJabuti();
  const raiz = useRef(null);
  const [verso, setVerso] = useState(false);
  const [erro, setErro] = useState("");
  const e = especie(atual.especie);

  const { contextSafe } = useGSAP(() => {
    if (semMovimento()) return;
    gsap.timeline()
      .from(".cartao-registro", { y: -120, rotate: -8, opacity: 0, duration: 0.9, ease: "bounce.out" })
      .fromTo(".brilho", { xPercent: -150 }, { xPercent: 420, duration: 0.9, ease: "power2.inOut" }, ">-0.2")
      .from(".carimbo", { scale: 3, opacity: 0, rotate: 30, duration: 0.45, ease: "back.out(2)" }, "<0.2");
  }, { scope: raiz });

  const virar = contextSafe(() => {
    const novo = !verso;
    setVerso(novo);
    gsap.to(".miolo-cartao", { rotateY: novo ? 180 : 0, duration: semMovimento() ? 0 : 0.8, ease: "back.out(1.3)" });
  });

  const novaFoto = contextSafe(async (foto) => {
    setErro("");
    try {
      await atualizar({ foto });
      festa(["📸", "⭐", "🌺"]);
      if (!semMovimento()) gsap.fromTo(".brilho", { xPercent: -150 }, { xPercent: 420, duration: 0.9 });
    } catch (er) { setErro(er.message); }
  });

  const dias = diasDesde(atual.chegada);

  return (
    <main ref={raiz} className="mx-auto max-w-3xl px-5 py-8">
      <h1 className="titulo-pagina">Carteirinha de {atual.nome}</h1>
      <p className="mt-1 text-xl text-tinta/70">Toque na carteirinha para ver o verso.</p>

      <div className="virar mt-8">
        <div className="cartao-registro">
        <button onClick={virar} aria-label={verso ? "Mostrar a frente" : "Mostrar o verso"} className="miolo-cartao grid w-full text-left" style={{ transformStyle: "preserve-3d" }}>
          {/* Frente */}
          <div className="face relative overflow-hidden rounded-[2rem] border-4 border-terra/30 bg-cartao shadow-2xl" style={{ backgroundImage: fundoCasco }}>
            <div className="flex items-center justify-between gap-2 bg-folha px-5 py-3 text-white">
              <span className="text-lg font-extrabold leading-tight sm:text-xl">Carteira de Registro do Jabuti</span>
              <span className="shrink-0 whitespace-nowrap rounded-full bg-white/20 px-3 py-1 font-mono text-base font-bold">{atual.codigo}</span>
            </div>
            <div className="grid gap-5 p-5 sm:grid-cols-[minmax(0,200px)_1fr]">
              <div className="relative mx-auto w-48 sm:w-full">
              <div className="aspect-[4/5] overflow-hidden rounded-2xl border-[6px] border-casco bg-ceu">
                {atual.foto ? <img src={atual.foto} alt={`Foto de ${atual.nome}`} className="h-full w-full object-cover" />
                  : <div className="grid h-full place-items-center"><Tortoise especie={atual.especie} id="cart" className="w-4/5" /></div>}
              </div>
                <span className="carimbo absolute -bottom-3 -right-4 sm:-right-2 grid h-[78px] w-[78px] rotate-[-14deg] place-items-center rounded-full border-4 border-brasa bg-cartao/70 text-center text-[11px] font-extrabold leading-tight text-brasa">
                  JABUTI<br />REGISTRADO
                </span>
              </div>
              <div className="grid grid-cols-2 content-start gap-x-4 gap-y-3">
                <div className="col-span-2"><Campo rotulo="Nome" valor={atual.nome} grande /></div>
                <div className="col-span-2">
                  <p className="text-sm font-bold text-tinta/60">Espécie</p>
                  <p className="text-lg font-extrabold leading-tight">{e.nome}</p>
                  <p className="text-base italic text-tinta/70">{e.cientifico}</p>
                </div>
                <Campo rotulo="Sexo" valor={SEXO[atual.sexo]} />
                <Campo rotulo="Nascimento" valor={atual.nascimento ? dataBR(atual.nascimento) : "Não sei"} />
                <Campo rotulo="Chegou em casa" valor={dataBR(atual.chegada)} />
                <Campo rotulo="Tutora / tutor" valor={atual.tutor} />
              </div>
            </div>
            <span className="brilho pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-white/40" aria-hidden />
          </div>

          {/* Verso */}
          <div className="face overflow-hidden rounded-[2rem] border-4 border-terra/30 bg-cartao shadow-2xl" style={{ transform: "rotateY(180deg)", backgroundImage: fundoCasco }}>
            <div className="bg-terra px-5 py-3 text-lg font-extrabold text-white sm:text-xl">Ficha de saúde</div>
            <div className="grid grid-cols-2 gap-4 p-5">
              <div className="rounded-2xl bg-ceu/60 p-4"><Campo rotulo="Peso atual" valor={atual.peso_atual_g != null ? `${num(atual.peso_atual_g, 0)} g` : null} grande /></div>
              <div className="rounded-2xl bg-casco/25 p-4"><Campo rotulo="Casco" valor={atual.tamanho_atual_cm != null ? `${num(atual.tamanho_atual_cm)} cm` : null} grande /></div>
              <Campo rotulo="Dias com a família" valor={dias != null ? `${dias} dias` : null} />
              <Campo rotulo="Dias anotados" valor={`${atual.total_registros}`} />
              <div className="col-span-2"><Campo rotulo="Microchip" valor={atual.microchip || "Não informado"} /></div>
              <div className="col-span-2 mt-2 border-t-4 border-dashed border-tinta/15 pt-4">
                <p className="text-sm font-bold text-tinta/60">Em caso de sinal de alerta</p>
                <p className="text-lg font-bold leading-snug">Chamar um adulto e levar ao veterinário de animais silvestres.</p>
              </div>
            </div>
          </div>
        </button>
        </div>
      </div>

      {erro && <p role="alert" className="mt-4 font-bold text-brasa">{erro}</p>}
      <div className="mt-8 flex flex-wrap gap-3">
        <button className="botao-sec" onClick={virar}><RotateCw /> Virar</button>
        <SoEditora aviso={false}>
          <FotoInput aoEscolher={novaFoto} somenteFoto texto={atual.foto ? "Atualizar foto" : "Colocar foto"} />
          <Link href="/ajustes" className="botao-sec"><Pencil /> Editar dados</Link>
        </SoEditora>
      </div>
    </main>
  );
}

export default function Pagina() {
  return <PrecisaJabuti><Carteirinha /></PrecisaJabuti>;
}
