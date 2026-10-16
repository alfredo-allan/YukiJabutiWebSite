// Setup inicial pré-definido para a Yuki. Outra família muda no .env.local.
export const CONFIG = {
  api: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  nomePadrao: process.env.NEXT_PUBLIC_NOME_PADRAO || "Yuki",
  especiePadrao: process.env.NEXT_PUBLIC_ESPECIE_PADRAO || "piranga",
};
