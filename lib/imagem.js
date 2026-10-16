// Reduz a foto no próprio aparelho antes de enviar (fica ~60–150 kB).
export async function reduzirFoto(arquivo, lado = 640, qualidade = 0.82) {
  if (!arquivo?.type?.startsWith("image/")) throw new Error("Escolha uma foto (imagem).");
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
