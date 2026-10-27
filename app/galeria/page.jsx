"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Edit3, Images, Trash2, Upload, X } from "lucide-react";
import { useJabuti } from "@/components/JabutiProvider";
import PrecisaJabuti from "@/components/PrecisaJabuti";
import SoEditora from "@/components/SoEditora";
import FotoInput from "@/components/FotoInput";
import { useConfirmacao, useAviso } from "@/components/Confirmacao";
import { dataBR, hoje } from "@/lib/datas";
import Midia from "@/components/Midia";

function Galeria() {
  const { atual, erro: erroProvider, editora, adicionarFoto, editarFoto, apagarFoto } = useJabuti();
  const confirmar = useConfirmacao();
  const avisar = useAviso();
  const [midia, setMidia] = useState(null);
  const [legenda, setLegenda] = useState("");
  const [data, setData] = useState(hoje());
  const [enviando, setEnviando] = useState(false);
  const [editando, setEditando] = useState(null);
  const [legendaEditada, setLegendaEditada] = useState("");
  const [salvandoLegenda, setSalvandoLegenda] = useState(false);
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
    } catch (er) {
      avisar({ titulo: "Não consegui apagar", texto: er.message });
    }
  }

  function iniciarEdicao(f) {
    setEditando(f);
    setLegendaEditada(f.legenda || "");
  }

  function cancelarEdicao() {
    if (salvandoLegenda) return;
    setEditando(null);
    setLegendaEditada("");
  }

  async function salvarLegenda(e) {
    e.preventDefault();
    if (!editando) return;
    setSalvandoLegenda(true);
    try {
      await editarFoto(editando.id, { legenda: legendaEditada.trim() });
      setEditando(null);
      setLegendaEditada("");
      await avisar({ titulo: "Legenda atualizada", texto: "A descrição da lembrança foi salva.", perigo: false });
    } catch (er) {
      await avisar({ titulo: "Não consegui salvar a legenda", texto: er.message });
    } finally {
      setSalvandoLegenda(false);
    }
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
              <article key={f.id} className="flex h-full flex-col overflow-hidden rounded-blob bg-cartao shadow-sm">
                <Midia src={f.foto || f.media} tipo={f.tipo} alt={f.legenda || `Mídia de ${atual.nome}`} className="aspect-square w-full object-cover" />
                <div className="flex flex-1 flex-col p-3">
                  <div className="min-h-[3.5rem]">
                    {f.legenda && <p className="text-lg font-bold leading-tight">{f.legenda}</p>}
                  </div>
                  {f.data && <p className="mt-1 text-sm font-semibold text-tinta/60">{dataBR(f.data, { day: "numeric", month: "long", year: "numeric" })}</p>}
                  {editora && (
                    <div className="mt-auto flex min-h-12 items-center gap-2 border-t-2 border-tinta/10 pt-2">
                      <button type="button" onClick={() => iniciarEdicao(f)} aria-label={`Editar ${f.legenda || "legenda"}`} className="botao-sec min-h-10 flex-1 px-2 py-2 text-sm shadow-[0_3px_0_rgb(var(--tinta)/0.2)]"><Edit3 size={17} /> Editar</button>
                      <button type="button" onClick={() => apagar(f)} aria-label={`Apagar ${f.legenda || "lembrança"}`} className="botao-sec min-h-10 flex-1 px-2 py-2 text-sm text-brasa shadow-[0_3px_0_rgb(var(--tinta)/0.2)] hover:bg-brasa/15"><Trash2 size={17} /> Apagar</button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
      {editando && (
        <div role="dialog" aria-modal="true" aria-label="Editar legenda"
          className="fixed inset-0 z-50 grid place-items-center bg-tinta/50 p-5 backdrop-blur-sm dark:bg-black/60"
          onClick={(e) => { if (e.target === e.currentTarget) cancelarEdicao(); }}>
          <form onSubmit={salvarLegenda} className="w-full max-w-md rounded-blob border-4 border-casco/40 bg-cartao p-6 text-tinta shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold">Editar legenda</h2>
                <p className="mt-1 text-lg text-tinta/70">A mídia e a data permanecem iguais.</p>
              </div>
              <button type="button" onClick={cancelarEdicao} aria-label="Cancelar edição" className="rounded-full p-2 text-tinta/60 hover:bg-tinta/10"><X /></button>
            </div>
            <label className="rotulo mt-5">Descrição
              <textarea className="campo mt-2" rows={3} maxLength={200} value={legendaEditada} onChange={(e) => setLegendaEditada(e.target.value)} autoFocus placeholder="Escreva uma legenda para esta lembrança" />
            </label>
            <div className="mt-5 flex gap-3">
              <button type="button" onClick={cancelarEdicao} className="botao-sec flex-1" disabled={salvandoLegenda}>Cancelar</button>
              <button type="submit" className="botao flex-1" disabled={salvandoLegenda}>{salvandoLegenda ? "Salvando…" : "Salvar"}</button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}

export default function Pagina() {
  return <PrecisaJabuti><Galeria /></PrecisaJabuti>;
}
