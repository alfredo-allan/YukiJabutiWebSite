"use client";
import { useRef, useState } from "react";
import { Camera } from "lucide-react";
import { reduzirFoto } from "@/lib/imagem";

// Botão grande para tirar/escolher foto; devolve a imagem já reduzida.
export default function FotoInput({ aoEscolher, texto = "Tirar ou escolher foto", className = "" }) {
  const input = useRef(null);
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState("");

  async function escolheu(e) {
    const arq = e.target.files?.[0];
    e.target.value = "";
    if (!arq) return;
    setErro(""); setOcupado(true);
    try { await aoEscolher(await reduzirFoto(arq)); }
    catch (er) { setErro(er.message); }
    finally { setOcupado(false); }
  }

  return (
    <div className={className}>
      <input ref={input} type="file" accept="image/*" capture="environment" className="sr-only" onChange={escolheu} tabIndex={-1} />
      <button type="button" className="botao bg-agua" onClick={() => input.current.click()} disabled={ocupado}>
        <Camera size={26} /> {ocupado ? "Preparando a foto…" : texto}
      </button>
      {erro && <p role="alert" className="mt-2 font-bold text-brasa">{erro}</p>}
    </div>
  );
}
