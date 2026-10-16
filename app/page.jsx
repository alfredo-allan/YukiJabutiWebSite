"use client";
import Link from "next/link";
import { CalendarHeart } from "lucide-react";
import { useJabuti } from "@/components/JabutiProvider";
import { CONFIG } from "@/lib/config";
import Hero from "@/components/aprender/Hero";
import Conheca from "@/components/aprender/Conheca";
import Temperatura from "@/components/aprender/Temperatura";
import Prato from "@/components/aprender/Prato";
import Agua from "@/components/aprender/Agua";
import Sol from "@/components/aprender/Sol";
import Saude from "@/components/aprender/Saude";
import Crescer from "@/components/aprender/Crescer";
import ProgressoCasco from "@/components/aprender/ProgressoCasco";

export default function Aprender() {
  const { atual } = useJabuti();
  const nome = atual?.nome || CONFIG.nomePadrao;
  const esp = atual?.especie || CONFIG.especiePadrao;

  return (
    <main className="overflow-x-clip">
      <Hero nome={nome} especieId={esp} />
      <Conheca especieId={esp} />
      <Temperatura />
      <Prato />
      <Agua especieId={esp} />
      <Sol especieId={esp} />
      <Saude />
      <Crescer especieId={esp} />

      <section id="fim-guia" className="mx-auto max-w-3xl px-5 py-20 text-center">
        <h2 className="text-4xl font-extrabold">Agora você sabe cuidar de um jabuti!</h2>
        <p className="mt-3 text-xl text-tinta/80">
          No diário você anota todo dia se {nome} comeu, tomou banho e tomou sol.
        </p>
        <Link href="/meu-dia" className="botao mt-8 text-2xl"><CalendarHeart size={28} /> Abrir o dia de {nome}</Link>
        <p className="mx-auto mt-10 max-w-xl rounded-blob border-4 border-dashed border-terra/40 p-5 text-lg text-tinta/80">
          <b>Para o adulto da casa:</b> no Brasil, o jabuti precisa vir de criadouro autorizado pelo IBAMA, com nota fiscal e microchip. Nunca tire um jabuti da natureza.
        </p>
      </section>
      <ProgressoCasco especieId={esp} />
    </main>
  );
}
