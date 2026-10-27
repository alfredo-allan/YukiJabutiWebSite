function tipoDaMidia(midia, tipo) {
  if (tipo === "video" || midia?.startsWith("data:video/")) return "video";
  return "imagem";
}

export default function Midia({ src, tipo, alt, className = "", controls = true }) {
  if (!src) return null;
  if (tipoDaMidia(src, tipo) === "video") {
    return <video src={src} className={className} controls={controls} preload="metadata" playsInline aria-label={alt} />;
  }
  return <img src={src} alt={alt} className={className} />;
}
