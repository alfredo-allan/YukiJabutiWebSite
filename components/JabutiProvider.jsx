"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api, token } from "@/lib/api";

// Guarda a lista de jabutis e o jabuti escolhido (com registros) para todas as telas.
const Ctx = createContext(null);
const CHAVE = "jabutiAtual";

export default function JabutiProvider({ children }) {
  const [jabutis, setJabutis] = useState([]);
  const [atual, setAtual] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const abrir = useCallback(async (id) => {
    const [j, fotos] = await Promise.all([api.ver(id), api.fotos(id)]);
    const completo = { ...j, fotos };
    setAtual(completo);
    try { localStorage.setItem(CHAVE, String(id)); } catch {}
    return completo;
  }, []);

  const recarregar = useCallback(async (preferido) => {
    setErro("");
    try {
      const lista = await api.listar();
      setJabutis(lista);
      let salvo = null;
      try { salvo = Number(localStorage.getItem(CHAVE)); } catch {}
      const alvo = lista.find((j) => j.id === (preferido ?? salvo)) || lista[0];
      if (alvo) await abrir(alvo.id);
      else setAtual(null);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, [abrir]);

  useEffect(() => { recarregar(); }, [recarregar]);

  // Modo edição: só com o token da tutora; quem recebe o link só visualiza
  // null = ainda conferindo o token (evita piscar o aviso de "Entrar" para a tutora)
  const [editora, setEditora] = useState(null);
  const [senhaCriada, setSenhaCriada] = useState(true); // false = primeiro acesso, ela cria a senha
  useEffect(() => {
    api.sessao()
      .then((s) => { setEditora(s.editora); setSenhaCriada(s.senha_criada); if (!s.editora) token.apagar(); })
      .catch(() => setEditora(false));
  }, []);
  const comToken = (pedido) => async (senha) => { const { token: t } = await pedido(senha); token.guardar(t); setEditora(true); setSenhaCriada(true); };
  const entrar = comToken(api.login);
  const criarSenha = comToken(api.criarSenha);
  const trocarSenha = comToken(api.trocarSenha);
  const sair = () => { token.apagar(); setEditora(false); };
  // Se o servidor recusar o token (expirou), volta para o modo visualização
  const comSessao = (fn) => async (...a) => {
    try { return await fn(...a); } catch (e) { if (!token.ler()) setEditora(false); throw e; }
  };

  const valor = {
    jabutis, atual, carregando, erro, recarregar, editora, senhaCriada, entrar, criarSenha, sair,
    trocarSenha: comSessao(trocarSenha),
    selecionar: (id) => abrir(id).catch((e) => setErro(e.message)),
    atualizar: comSessao(async (dados) => { const j = await api.editar(atual.id, dados); setAtual(j); recarregar(j.id); return j; }),
    registrar: comSessao(async (dados) => { const r = await api.registrar(atual.id, dados); await recarregar(atual.id); return r; }),
    apagarRegistro: comSessao(async (rid) => { await api.apagarRegistro(rid); await recarregar(atual.id); }),
    adicionarFoto: comSessao(async (dados) => { const r = await api.adicionarFoto(atual.id, dados); await recarregar(atual.id); return r; }),
    editarFoto: comSessao(async (fid, dados) => { const r = await api.editarFoto(fid, dados); await recarregar(atual.id); return r; }),
    apagarFoto: comSessao(async (fid) => { await api.apagarFoto(fid); await recarregar(atual.id); }),
    criar: comSessao((dados) => api.criar(dados)),
    apagar: comSessao(async (id) => { await api.apagar(id); await recarregar(); }),
  };
  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}
export const useJabuti = () => useContext(Ctx);
