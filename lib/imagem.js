export const TAMANHO_MAXIMO_FOTO = 20 * 1024 * 1024;
export const TAMANHO_MAXIMO_VIDEO = 100 * 1024 * 1024;
export const TIPOS_VIDEO = ["video/mp4", "video/webm", "video/quicktime"];

export function validarImagem(arquivo) {
  if (!arquivo?.type?.startsWith("image/")) throw new Error("Escolha uma foto (imagem).");
  if (arquivo.size > TAMANHO_MAXIMO_FOTO) throw new Error("Essa foto é muito grande. Escolha uma imagem de até 20 MB.");
}

export function validarVideo(arquivo) {
  if (!TIPOS_VIDEO.includes(arquivo?.type)) throw new Error("Escolha um vídeo MP4, WebM ou MOV.");
  if (arquivo.size > TAMANHO_MAXIMO_VIDEO) throw new Error("Esse vídeo é muito grande. Escolha um vídeo de até 100 MB.");
}

export function validarMidia(arquivo) {
  if (arquivo?.type?.startsWith("image/")) validarImagem(arquivo);
  else validarVideo(arquivo);
}

export function lerMidia(arquivo) {
  validarMidia(arquivo);
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onload = () => resolve({
      src: leitor.result,
      tipo: arquivo.type,
    });
    leitor.onerror = () => reject(new Error("Não consegui preparar essa mídia. Tente outra."));
    leitor.readAsDataURL(arquivo);
  });
}

// Mantido para os fluxos que precisam de uma imagem pequena, como a foto do perfil.
export async function reduzirFoto(arquivo, lado = 640, qualidade = 0.82) {
  validarImagem(arquivo);
  const url = URL.createObjectURL(arquivo);
  try {
    const img = await new Promise((ok, falha) => {
      const i = new Image();
      i.onload = () => ok(i);
      i.onerror = () => falha(new Error("Não consegui abrir essa foto. Tente outra."));
      i.src = url;
    });
    const escala = Math.min(1, lado / Math.max(img.width, img.height));
    const c = document.createElement("canvas");
    c.width = Math.round(img.width * escala);
    c.height = Math.round(img.height * escala);
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    return c.toDataURL("image/jpeg", qualidade);
  } finally {
    URL.revokeObjectURL(url);
  }
}
