"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AlertTriangle } from "lucide-react";

// Diálogos no tema do site, no lugar de confirm()/alert() do navegador.
//   const confirmar = useConfirmacao(); if (await confirmar({...})) { ... }  -> Sim / Não
//   const avisar = useAviso(); await avisar({ titulo, texto })               -> só OK (ex.: erro)
// Tudo usa os tokens de tema (bg-cartao, text-tinta, bg-brasa…), então segue claro/escuro.
const Ctx = createContext(null);

export function ConfirmacaoProvider({ children }) {
  const [estado, setEstado] = useState(null);
  const resolver = useRef(null);

  const abrir = useCallback((modo, opcoes = {}) => new Promise((resolve) => {
    resolver.current = resolve;
    setEstado({
      modo,
      titulo: opcoes.titulo || (modo === "avisar" ? "Ops!" : "Tem certeza?"),
      texto: opcoes.texto || "",
      textoConfirmar: opcoes.textoConfirmar || (modo === "avisar" ? "Entendi" : "Sim"),
      textoCancelar: opcoes.textoCancelar || "Não",
      perigo: opcoes.perigo ?? true,
    });
  }), []);

  const confirmar = useCallback((opcoes) => abrir("confirmar", opcoes), [abrir]);
  const avisar = useCallback((opcoes) => abrir("avisar", opcoes), [abrir]);

  const fechar = useCallback((resposta) => {
    setEstado(null);
    resolver.current?.(resposta);
    resolver.current = null;
  }, []);

  useEffect(() => {
    if (!estado) return;
    const aoTeclar = (e) => { if (e.key === "Escape") fechar(estado.modo === "avisar"); };
    document.addEventListener("keydown", aoTeclar);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", aoTeclar); document.body.style.overflow = overflow; };
  }, [estado, fechar]);

  return (
    <Ctx.Provider value={{ confirmar, avisar }}>
      {children}
      {estado && (
        <div role="dialog" aria-modal="true" aria-label={estado.titulo}
          className="fixed inset-0 z-50 grid place-items-center bg-tinta/50 p-5 backdrop-blur-sm dark:bg-black/60"
          onClick={(e) => { if (e.target === e.currentTarget) fechar(estado.modo === "avisar"); }}>
          <div className="w-full max-w-sm rounded-blob border-4 border-casco/40 bg-cartao p-6 text-tinta shadow-2xl">
            <div className="flex items-start gap-3">
              {estado.perigo && (
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brasa/15 text-brasa"><AlertTriangle size={28} /></span>
              )}
              <div>
                <h2 className="text-2xl font-extrabold leading-tight">{estado.titulo}</h2>
                {estado.texto && <p className="mt-1 text-lg text-tinta/75">{estado.texto}</p>}
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              {estado.modo === "confirmar" && (
                <button type="button" onClick={() => fechar(false)} className="botao-sec flex-1">{estado.textoCancelar}</button>
              )}
              <button type="button" autoFocus onClick={() => fechar(estado.modo !== "avisar")}
                className={`botao flex-1 ${estado.perigo ? "bg-brasa" : ""}`}>{estado.textoConfirmar}</button>
            </div>
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}

export const useConfirmacao = () => useContext(Ctx).confirmar;
export const useAviso = () => useContext(Ctx).avisar;
