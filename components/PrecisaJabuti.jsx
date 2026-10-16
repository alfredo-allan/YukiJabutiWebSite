"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useJabuti } from "./JabutiProvider";
import Tortoise from "./Tortoise";

// Envolve as telas que precisam de um jabuti cadastrado.
export default function PrecisaJabuti({ children }) {
  const { carregando, jabutis, atual, erro, recarregar } = useJabuti();
  const router = useRouter();

  useEffect(() => {
    if (!carregando && !erro && jabutis.length === 0) router.replace("/bem-vindo");
  }, [carregando, erro, jabutis.length, router]);

  if (erro) {
    return (
      <div className="mx-auto max-w-md px-5 py-16 text-center">
        <Tortoise className="mx-auto w-40 opacity-70" id="erro" />
        <p className="mt-4 text-2xl font-extrabold">{erro}</p>
        <button className="botao mt-6" onClick={() => recarregar()}>Tentar de novo</button>
      </div>
    );
  }
  if (carregando || !atual) {
    return <p className="py-24 text-center text-2xl font-bold text-tinta/60" role="status">Chamando o jabuti… 🐢</p>;
  }
  return children;
}
