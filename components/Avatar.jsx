import Tortoise from "./Tortoise";

export default function Avatar({ jabuti, tamanho = "h-12 w-12" }) {
  return (
    <span className={`${tamanho} grid shrink-0 place-items-center overflow-hidden rounded-full border-4 border-casco bg-ceu`}>
      {jabuti?.foto
        ? <img src={jabuti.foto} alt={`Foto de ${jabuti.nome}`} className="h-full w-full object-cover" />
        : <Tortoise especie={jabuti?.especie} className="w-[85%]" id={`av-${jabuti?.id ?? "x"}`} />}
    </span>
  );
}
