export const hoje = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};
export const dataBR = (iso, opcoes = { day: "2-digit", month: "2-digit", year: "numeric" }) =>
  iso ? new Date(iso + "T12:00").toLocaleDateString("pt-BR", opcoes) : "—";
export const diasDesde = (iso) =>
  iso ? Math.max(0, Math.floor((Date.now() - new Date(iso + "T12:00")) / 86400000)) : null;
export const num = (n, casas = 1) =>
  n == null ? "—" : Number(n).toLocaleString("pt-BR", { maximumFractionDigits: casas });
