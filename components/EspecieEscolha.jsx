"use client";
import { Check } from "lucide-react";
import { ESPECIES } from "@/lib/especies";
import Tortoise from "./Tortoise";

// Brincadeira de detetive: a criança compara as escamas e escolhe a espécie.
export default function EspecieEscolha({ valor, mudar }) {
  return (
    <div role="radiogroup" aria-label="Espécie do jabuti" className="grid gap-4 sm:grid-cols-3">
      {Object.entries(ESPECIES).map(([id, e]) => {
        const sel = valor === id;
        return (
          <button key={id} type="button" role="radio" aria-checked={sel} onClick={() => mudar(id)}
            className={`relative flex flex-col items-center rounded-blob border-4 bg-cartao p-4 text-center transition-transform ${sel ? "scale-[1.03] border-casco" : "border-transparent"}`}>
            {sel && <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-casco text-terra"><Check strokeWidth={4} /></span>}
            <span className="flex items-center gap-2 rounded-full bg-fundo px-3 py-1 text-base font-bold">
              <span className="h-5 w-5 rounded-full border-2 border-black/20" style={{ background: e.manchas }} /> escamas
            </span>
            <Tortoise especie={id} id={`esc-${id}`} className="my-2 w-40" />
            <span className="text-2xl font-extrabold">{e.nome}</span>
            <span className="mt-1 text-base leading-snug text-tinta/75">{e.pista}</span>
          </button>
        );
      })}
    </div>
  );
}
