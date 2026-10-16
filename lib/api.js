import { CONFIG } from "./config";

// Token da tutora (só ela altera; sem token o diário é só para ver)
const CHAVE_TOKEN = "tokenEditora";
export const token = {
  ler: () => { try { return localStorage.getItem(CHAVE_TOKEN); } catch { return null; } },
  guardar: (t) => { try { localStorage.setItem(CHAVE_TOKEN, t); } catch {} },
  apagar: () => { try { localStorage.removeItem(CHAVE_TOKEN); } catch {} },
};

async function req(caminho, opcoes = {}) {
  const t = token.ler();
  let r;
  try {
    r = await fetch(`${CONFIG.api}/api${caminho}`, {
      ...opcoes,
      headers: { "Content-Type": "application/json", ...(t ? { Authorization: `Bearer ${t}` } : {}) },
    });
  } catch {
    throw new Error("Não consegui falar com o servidor. Confira a internet e tente de novo.");
  }
  const dados = await r.json().catch(() => ({}));
  if (r.status === 401 && t && caminho !== "/login") token.apagar();
  if (!r.ok) throw new Error(dados.erro || "O servidor respondeu com erro. Tente de novo.");
  return dados;
}
const corpo = (d) => JSON.stringify(d);

export const api = {
  login: (senha) => req("/login", { method: "POST", body: corpo({ senha }) }),
  sessao: () => req("/sessao"),
  listar: () => req("/jabutis"),
  ver: (id) => req(`/jabutis/${id}`),
  criar: (d) => req("/jabutis", { method: "POST", body: corpo(d) }),
  editar: (id, d) => req(`/jabutis/${id}`, { method: "PATCH", body: corpo(d) }),
  apagar: (id) => req(`/jabutis/${id}`, { method: "DELETE" }),
  registrar: (id, d) => req(`/jabutis/${id}/registros`, { method: "POST", body: corpo(d) }),
  apagarRegistro: (rid) => req(`/registros/${rid}`, { method: "DELETE" }),
};
