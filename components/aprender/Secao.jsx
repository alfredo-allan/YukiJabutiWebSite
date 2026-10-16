// Moldura comum das seções de cuidado. data-placa liga a seção a uma placa do casco.
export default function Secao({ id, placa, Icone, cor, titulo, children, className = "" }) {
  return (
    <section id={id} data-placa={placa} className={`secao-cuidado mx-auto max-w-5xl px-5 py-14 sm:py-20 ${className}`}>
      <div className="flex items-center gap-4">
        <span className={`icone-secao grid h-16 w-16 shrink-0 place-items-center rounded-2xl ${cor} text-white shadow-[0_5px_0_rgb(0_0_0/0.18)] sm:h-20 sm:w-20`}>
          <Icone size={40} strokeWidth={2.3} />
        </span>
        <h2 className="text-3xl font-extrabold leading-tight sm:text-5xl">{titulo}</h2>
      </div>
      <div className="mt-8">{children}</div>
    </section>
  );
}
