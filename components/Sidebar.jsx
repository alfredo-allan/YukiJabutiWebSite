"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, CalendarHeart, TrendingUp, IdCard, Settings, X, Moon, Sun, Plus, KeyRound, LogOut } from "lucide-react";
import { gsap, useGSAP, semMovimento } from "@/lib/gsap";
import { useTema } from "./ThemeProvider";
import { useJabuti } from "./JabutiProvider";
import Avatar from "./Avatar";

export const ITENS_MENU = [
  { href: "/", titulo: "Aprender", sub: "Como cuidar de um jabuti", Icone: BookOpen, cor: "bg-folha" },
  { href: "/meu-dia", titulo: "Meu dia", sub: "Comeu? Tomou sol? Anote aqui", Icone: CalendarHeart, cor: "bg-brasa" },
  { href: "/crescimento", titulo: "Crescimento", sub: "Peso, tamanho e gráfico", Icone: TrendingUp, cor: "bg-agua" },
  { href: "/carteirinha", titulo: "Carteirinha", sub: "O registro com a foto", Icone: IdCard, cor: "bg-casco" },
  { href: "/ajustes", titulo: "Ajustes", sub: "Nome, espécie e tema", Icone: Settings, cor: "bg-terra" },
];

// Menu lateral: abre da esquerda até o meio da tela (50%).
export default function Sidebar({ aberto, fechar, botaoRef }) {
  const raiz = useRef(null);
  const tl = useRef(null);
  const rota = usePathname();
  const { tema, alternar } = useTema();
  const { jabutis, atual, selecionar, editora, sair } = useJabuti() || {};

  useGSAP(() => {
    tl.current = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } })
      .set(raiz.current, { visibility: "visible" })
      .fromTo(".menu-veu", { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0)
      .fromTo(".menu-painel", { xPercent: -100 }, { xPercent: 0, duration: 0.45 }, 0)
      .fromTo(".menu-item", { x: -40, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.05, duration: 0.35 }, 0.15)
      .fromTo(".menu-jabuti", { scale: 0.6, rotate: -10 }, { scale: 1, rotate: 0, duration: 0.5, ease: "back.out(2.5)" }, 0.1);
  }, { scope: raiz });

  useEffect(() => {
    const t = tl.current;
    if (!t) return;
    if (semMovimento()) t.timeScale(20); else t.timeScale(aberto ? 1 : 1.6);
    if (aberto) {
      t.play();
      document.body.style.overflow = "hidden";
      setTimeout(() => raiz.current?.querySelector(".menu-item a, .menu-item button")?.focus(), 60);
    } else {
      t.reverse();
      document.body.style.overflow = "";
    }
  }, [aberto]);

  useEffect(() => {
    const tecla = (e) => { if (e.key === "Escape" && aberto) { fechar(); botaoRef?.current?.focus(); } };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [aberto, fechar, botaoRef]);

  return (
    <div ref={raiz} className="invisible fixed inset-0 z-50" aria-hidden={!aberto}>
      <div className="menu-veu absolute inset-0 bg-black/45" onClick={fechar} />
      <aside
        role="dialog" aria-modal="true" aria-label="Menu"
        className="menu-painel absolute inset-y-0 left-0 flex w-1/2 min-w-[290px] flex-col overflow-y-auto
                   rounded-r-[2.5rem] bg-fundo px-4 pb-6 shadow-2xl sm:px-6"
        style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="menu-item flex min-w-0 items-center gap-3">
            <span className="menu-jabuti"><Avatar jabuti={atual} tamanho="h-16 w-16" /></span>
            <div className="min-w-0">
              <p className="truncate text-2xl font-extrabold">{atual?.nome || "Seu jabuti"}</p>
              {atual && <p className="text-base font-semibold text-tinta/60">{atual.codigo}</p>}
            </div>
          </div>
          <button onClick={fechar} aria-label="Fechar menu" className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-cartao">
            <X size={28} strokeWidth={3} />
          </button>
        </div>

        {jabutis?.length > 1 && (
          <div className="menu-item mt-4 flex gap-2 overflow-x-auto pb-1">
            {jabutis.map((j) => (
              <button key={j.id} onClick={() => selecionar(j.id)}
                className={`flex shrink-0 items-center gap-2 rounded-full border-4 py-1 pl-1 pr-3 font-bold ${j.id === atual?.id ? "border-casco" : "border-transparent bg-cartao"}`}>
                <Avatar jabuti={j} tamanho="h-8 w-8" /> {j.nome}
              </button>
            ))}
          </div>
        )}

        <nav className="mt-6 flex flex-col gap-3">
          {ITENS_MENU.map(({ href, titulo, sub, Icone, cor }) => {
            const ativo = rota === href;
            return (
              <div key={href} className="menu-item">
                <Link href={href} onClick={fechar} aria-current={ativo ? "page" : undefined}
                  className={`flex items-center gap-4 rounded-blob p-3 transition-colors ${ativo ? "bg-cartao ring-4 ring-casco" : "hover:bg-cartao/70"}`}>
                  <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${cor} text-white shadow-[0_4px_0_rgb(0_0_0/0.18)]`}>
                    <Icone size={30} strokeWidth={2.4} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xl font-extrabold leading-tight">{titulo}</span>
                    <span className="block text-base leading-snug text-tinta/65">{sub}</span>
                  </span>
                </Link>
              </div>
            );
          })}
        </nav>

        <div className="mt-auto space-y-3 pt-8">
          {editora && (
            <div className="menu-item">
              <Link href="/bem-vindo?novo=1" onClick={fechar} className="flex items-center gap-3 rounded-2xl border-4 border-dashed border-folha/40 p-3 text-lg font-bold">
                <Plus size={26} /> Cadastrar outro jabuti
              </Link>
            </div>
          )}
          <div className="menu-item">
            {editora
              ? <button onClick={sair} className="flex w-full items-center gap-3 rounded-2xl bg-cartao p-3 text-lg font-bold"><LogOut size={26} /> Sair do modo tutora</button>
              : <Link href={`/entrar?volta=${encodeURIComponent(rota)}`} onClick={fechar} className="flex items-center gap-3 rounded-2xl bg-cartao p-3 text-lg font-bold"><KeyRound size={26} /> Entrar para editar</Link>}
          </div>
          <div className="menu-item">
            <button onClick={alternar} role="switch" aria-checked={tema === "escuro"}
              className="flex w-full items-center justify-between rounded-2xl bg-cartao p-3 text-lg font-bold">
              <span className="flex items-center gap-3">{tema === "escuro" ? <Moon size={26} /> : <Sun size={26} />} Tema escuro</span>
              <span className={`relative h-8 w-14 rounded-full transition-colors ${tema === "escuro" ? "bg-folha" : "bg-tinta/20"}`}>
                <span className={`absolute top-1 h-6 w-6 rounded-full bg-white transition-all ${tema === "escuro" ? "left-7" : "left-1"}`} />
              </span>
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
