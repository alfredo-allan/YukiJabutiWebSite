"use client";
import { useRef, useState } from "react";
import { Camera, Video } from "lucide-react";
import { lerMidia, reduzirFoto } from "@/lib/imagem";

// Botão grande para tirar/escolher mídia; devolve uma data URL e seu tipo.
export default function FotoInput({ aoEscolher, texto = "Tirar ou escolher foto ou vídeo", className = "", somenteFoto = false }) {
  const input = useRef(null);
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState("");

  async function escolheu(e) {
    const arq = e.target.files?.[0];
    e.target.value = "";
    if (!arq) return;
    setErro(""); setOcupado(true);
    try {
      await aoEscolher(somenteFoto ? await reduzirFoto(arq) : await lerMidia(arq));
    }
    catch (er) { setErro(er.message); }
    finally { setOcupado(false); }
  }

  return (
    <div className={className}>
      <input ref={input} type="file" accept={somenteFoto ? "image/*" : "image/*,video/mp4,video/webm,video/quicktime"} capture="environment" className="sr-only" onChange={escolheu} tabIndex={-1} />
      <button type="button" className="botao bg-folha" onClick={() => input.current.click()} disabled={ocupado}>
        {ocupado ? <Camera size={26} /> : <><Camera size={26} /><Video size={22} /></>} {ocupado ? "Preparando a mídia…" : texto}
      </button>
      {erro && <p role="alert" className="mt-2 font-bold text-brasa">{erro}</p>}
    </div>
  );
}
