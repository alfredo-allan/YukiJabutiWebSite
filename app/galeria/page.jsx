"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Images, Trash2, Upload } from "lucide-react";
import { useJabuti } from "@/components/JabutiProvider";
import PrecisaJabuti from "@/components/PrecisaJabuti";
import SoEditora from "@/components/SoEditora";
import FotoInput from "@/components/FotoInput";
import { useConfirmacao, useAviso } from "@/components/Confirmacao";
import { dataBR, hoje } from "@/lib/datas";
import Midia from "@/components/Midia";

function Galeria() {
  const { atual, erro: erroProvider, editora, adicionarFoto, apagarFoto } = useJabuti();
  const confirmar = useConfirmacao();
  const avisar = useAviso();
  const [midia, setMidia] = useState(null);
  const [legenda, setLegenda] = useState("");
  const [data, setData] = useState(hoje());
  const [enviando, setEnviando] = useState(false);
  const fotos = atual.fotos || [];

  useEffect(() => {
    if (erroProvider) avisar({ titulo: "Não consegui carregar a galeria", texto: erroProvider });
  }, [erroProvider, avisar]);

  async function enviar(e) {
    e.preventDefault();
    if (!midia) return;
    setEnviando(true);
    try {
      await adicionarFoto({ foto: midia.src, tipo: midia.tipo, legenda: legenda.trim() || undefined, data: data || undefined });
      setMidia(null);
      setLegenda("");
      setData(hoje());
      await avisar({ titulo: "Lembrança guardada!", texto: "A mídia já está na galeria.", perigo: false });
    } catch (er) {
      avisar({ titulo: "Não consegui guardar a foto", texto: er.message });
    } finally {
      setEnviando(false);
    }
  }

  async function apagar(f) {
    if (!await confirmar({ titulo: "Apagar esta foto?", texto: "Essa lembrança vai sair da galeria.", textoConfirmar: "Apagar", textoCancelar: "Manter" })) return;
    try {
      await apagarFoto(f.id);
      await avisar({ titulo: "Foto apagada", texto: "A lembrança foi removida da galeria.", perigo: false });
    }
    catch (er) { avisar({ titulo: "Não consegui apagar", texto: er.message }); }
  }

  return (
    <main className="mx-auto max-w-4xl px-5 py-8">
      <div className="flex items-center gap-4">
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-terra text-white"><Images size={36} /></div>
        <div>
          <h1 className="titulo-pagina">Galeria de {atual.nome}</h1>
          <p className="text-xl text-tinta/70">Momentos para guardar e rever.</p>
        </div>
      </div>

      <SoEditora aviso={`Só a tutora adiciona mídias de ${atual.nome}.`}>
        <form onSubmit={enviar} className="mt-8 rounded-blob bg-cartao p-5">
          <h2 className="text-2xl font-extrabold">Guardar uma lembrança</h2>
          {midia ? (
            <div className="mt-4 flex flex-wrap items-start gap-4">
              <Midia src={midia.src} tipo={midia.tipo} alt="Prévia da nova mídia" className="h-40 w-40 rounded-2xl border-4 border-casco object-cover" />
              <div className="min-w-[220px] flex-1">
                <label className="rotulo">Legenda <span className="font-semibold text-tinta/55">(opcional)</span>
                  <input className="campo mt-2" value={legenda} onChange={(e) => setLegenda(e.target.value)} maxLength={160} placeholder="Primeiro banho de sol" />
                </label>
                <label className="rotulo mt-4 flex items-center gap-2"><CalendarDays size={22} /> Data
                  <input className="campo ml-auto max-w-[190px] text-base" type="date" value={data} max={hoje()} onChange={(e) => setData(e.target.value)} />
                </label>
                <button className="botao mt-4 w-full" disabled={enviando}><Upload size={23} /> {enviando ? "Guardando…" : "Guardar na galeria"}</button>
              </div>
            </div>
          ) : <FotoInput className="mt-4" aoEscolher={setMidia} />}
        </form>
      </SoEditora>

      {fotos.length === 0 ? (
        <section className="mt-10 rounded-blob border-4 border-dashed border-terra/35 p-8 text-center">
          <Images className="mx-auto text-terra" size={54} />
          <h2 className="mt-3 text-2xl font-extrabold">A galeria ainda está vazia</h2>
          <p className="mt-1 text-lg">As mídias do dia também aparecem aqui.</p>
        </section>
      ) : (
        <section className="mt-10">
          <h2 className="text-3xl font-extrabold">{fotos.length} {fotos.length === 1 ? "lembrança" : "lembranças"}</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {fotos.map((f) => (
              <article key={f.id} className="overflow-hidden rounded-blob bg-cartao shadow-sm">
                <Midia src={f.foto || f.media} tipo={f.tipo} alt={f.legenda || `Mídia de ${atual.nome}`} className="aspect-square w-full object-cover" />
                <div className="p-3">
                  {f.legenda && <p className="text-lg font-bold leading-tight">{f.legenda}</p>}
                  {f.data && <p className="mt-1 text-sm font-semibold text-tinta/60">{dataBR(f.data, { day: "numeric", month: "long", year: "numeric" })}</p>}
                  {editora && <button onClick={() => apagar(f)} aria-label={`Apagar ${f.legenda || "lembrança"}`} className="mt-2 flex items-center gap-1 rounded-full px-2 py-1 font-bold text-brasa hover:bg-brasa/15"><Trash2 size={18} /> Apagar</button>}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default function Pagina() {
  return <PrecisaJabuti><Galeria /></PrecisaJabuti>;
}
