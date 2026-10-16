"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock } from "lucide-react";
import { useJabuti } from "./JabutiProvider";

// Mostra o conteúdo só para a tutora logada. Para visitantes, um aviso (ou nada, com aviso={false}).
export default function SoEditora({ children, aviso = "Só a tutora pode anotar aqui.", apenasAviso = false }) {
  const { editora, senhaCriada } = useJabuti();
  const rota = usePathname();
  if (editora) return apenasAviso ? null : children;
  if (editora === null || !aviso) return null;
  return (
    <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-blob bg-cartao p-5 text-lg font-bold">
      <span className="flex items-center gap-3"><Lock className="shrink-0" /> {aviso}</span>
      <Link href={`/entrar?volta=${encodeURIComponent(rota)}`} className="botao-sec">{senhaCriada ? "Entrar" : "Criar senha"}</Link>
    </div>
  );
}
