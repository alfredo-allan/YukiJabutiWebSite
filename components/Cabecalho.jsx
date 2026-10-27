"use client";
import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import Avatar from "./Avatar";
import { useJabuti } from "./JabutiProvider";

export default function Cabecalho() {
  const [aberto, setAberto] = useState(false);
  const botao = useRef(null);
  const { atual } = useJabuti();
  const fechar = useCallback(() => setAberto(false), []);

  return (
    <>
      <header className="sticky top-0 z-40 bg-fundo/85 backdrop-blur" style={{ paddingTop: "env(safe-area-inset-top)" }}>
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-2">
          <button ref={botao} onClick={() => setAberto(true)} aria-label="Abrir menu" aria-expanded={aberto}
            className="flex h-14 items-center gap-2 rounded-full bg-folha px-4 text-lg font-extrabold text-white shadow-[0_4px_0_rgb(var(--sombra-acao)/0.75)] active:translate-y-1 active:shadow-none">
            <Menu size={28} strokeWidth={3} /> Menu
          </button>
          <Link href="/carteirinha" className="flex items-center gap-2 rounded-full py-1 pl-3 pr-1 font-extrabold hover:bg-cartao">
            <span className="hidden text-xl sm:inline">{atual?.nome || "Yuki Jabuti"}</span>
            <Avatar jabuti={atual} />
          </Link>
        </div>
      </header>
      <Sidebar aberto={aberto} fechar={fechar} botaoRef={botao} />
    </>
  );
}
