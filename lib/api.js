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

function reqComProgresso(caminho, dados, { onProgress, signal } = {}) {
  const t = token.ler();
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    let cancelado = false;
    const terminar = () => {
      if (signal) signal.removeEventListener("abort", abortar);
    };
    const abortar = () => {
      cancelado = true;
      xhr.abort();
    };
    xhr.open("POST", `${CONFIG.api}/api${caminho}`);
    xhr.setRequestHeader("Content-Type", "application/json");
    if (t) xhr.setRequestHeader("Authorization", `******`);
    xhr.upload.onprogress = (evento) => {
      if (evento.lengthComputable) onProgress?.(Math.round((evento.loaded / evento.total) * 100));
    };
    xhr.onload = () => {
      terminar();
      const resposta = JSON.parse(xhr.responseText || "{}");
      if (xhr.status === 401 && t) token.apagar();
      if (xhr.status < 200 || xhr.status >= 300) {
        reject(new Error(resposta.erro || "O servidor respondeu com erro. Tente de novo."));
        return;
      }
      onProgress?.(100);
      resolve(resposta);
    };
    xhr.onerror = () => { terminar(); reject(new Error("Não consegui falar com o servidor. Confira a internet e tente de novo.")); };
    xhr.onabort = () => { terminar(); reject(new Error(cancelado ? "Upload cancelado." : "O upload foi interrompido.")); };
    if (signal) {
      if (signal.aborted) { abortar(); return; }
      signal.addEventListener("abort", abortar, { once: true });
    }
    xhr.send(corpo(dados));
  });
}

export const api = {
  login: (senha) => req("/login", { method: "POST", body: corpo({ senha }) }),
  sessao: () => req("/sessao"),
  criarSenha: (senha) => req("/senha", { method: "POST", body: corpo({ senha }) }),
  trocarSenha: (senha) => req("/senha", { method: "PUT", body: corpo({ senha }) }),
  listar: () => req("/jabutis"),
  ver: (id) => req(`/jabutis/${id}`),
  criar: (d) => req("/jabutis", { method: "POST", body: corpo(d) }),
  editar: (id, d) => req(`/jabutis/${id}`, { method: "PATCH", body: corpo(d) }),
  apagar: (id) => req(`/jabutis/${id}`, { method: "DELETE" }),
  registrar: (id, d) => req(`/jabutis/${id}/registros`, { method: "POST", body: corpo(d) }),
  apagarRegistro: (rid) => req(`/registros/${rid}`, { method: "DELETE" }),
  fotos: (id) => req(`/jabutis/${id}/fotos`),
  adicionarFoto: (id, d) => req(`/jabutis/${id}/fotos`, { method: "POST", body: corpo(d) }),
  adicionarFotoComProgresso: (id, d, opcoes) => reqComProgresso(`/jabutis/${id}/fotos`, d, opcoes),
  editarFoto: (id, d) => req(`/fotos/${id}`, { method: "PATCH", body: corpo(d) }),
  apagarFoto: (fid) => req(`/fotos/${fid}`, { method: "DELETE" }),
};
