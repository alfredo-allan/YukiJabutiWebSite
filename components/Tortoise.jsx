import { especie as dadosEspecie } from "@/lib/especies";

// Jabuti em SVG no estilo da Yuki: casco escuro com o centro das placas amarelado
// e escamas coloridas (vermelhas no piranga, amarelas no tinga).
// Classes para animar: .cabeca .olho .pata .placa-luz
const PLACAS = [
  { p: "20,20 120,20 120,50 95,50 80,80 20,70", c: [78, 50] },
  { p: "120,20 220,20 220,70 160,80 145,50 120,50", c: [168, 50] },
  { p: "95,50 145,50 160,80 145,112 95,112 80,80", c: [120, 82] },
  { p: "20,70 80,80 95,112 20,115", c: [58, 96] },
  { p: "220,70 160,80 145,112 220,115", c: [184, 96] },
];

export default function Tortoise({ especie = "piranga", cheio = true, className = "", id = "j", titulo }) {
  const manchas = dadosEspecie(especie).manchas;
  const pele = "#2E2119";
  const clip = `casco-${id}`;
  const pontos = (cx, cy, lista) =>
    lista.map(([dx, dy, r], i) => <circle key={i} cx={cx + dx} cy={cy + dy} r={r} fill={manchas} />);

  return (
    <svg viewBox="0 0 262 160" className={className} role="img" aria-label={titulo || `Desenho de um ${dadosEspecie(especie).nome}`}>
      <defs>
        <clipPath id={clip}><path d="M30 110 Q30 26 120 24 Q210 26 210 110 Z" /></clipPath>
      </defs>
      <path d="M34 104 L12 112 L36 115 Z" fill={pele} />
      {[[44, 96], [80, 100], [138, 100], [172, 96]].map(([x, y], i) => (
        <g key={i} className="pata">
          <rect x={x} y={y} width="26" height="36" rx="12" fill={pele} />
          {pontos(x + 13, y + 14, [[-6, 4, 3.4], [5, 2, 3.4], [-1, 12, 3.4], [6, 13, 2.8]])}
        </g>
      ))}
      <g className="cabeca">
        <path d="M200 92 Q204 70 228 70 Q254 72 254 92 Q252 110 228 112 Q206 112 200 92Z" fill={pele} />
        {pontos(228, 90, [[-10, -14, 4.2], [4, -16, 4.6], [16, -6, 4], [-14, 2, 3.4], [12, 10, 3.6], [0, -4, 3]])}
        <g className="olho" style={{ transformOrigin: "236px 86px", transformBox: "view-box" }}>
          <circle cx="236" cy="86" r="5.2" fill="#120C08" />
          <circle cx="238" cy="84" r="1.8" fill="#fff" />
        </g>
        <path d="M238 102 q7 2 12 -3" stroke="#120C08" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      </g>
      <g clipPath={`url(#${clip})`}>
        <rect width="262" height="160" fill="#4A3424" />
        {PLACAS.map(({ c }, i) => (
          <ellipse
            key={i} cx={c[0]} cy={c[1]} rx="20" ry="15" fill="#D2A93E"
            className="placa-luz" style={{ opacity: cheio ? 1 : 0.15, transformOrigin: `${c[0]}px ${c[1]}px`, transformBox: "view-box" }}
          />
        ))}
        {PLACAS.map(({ p }, i) => (
          <polygon key={i} points={p} fill="none" stroke="#24180F" strokeWidth="4.5" strokeLinejoin="round" />
        ))}
      </g>
      <path d="M30 110 Q30 26 120 24 Q210 26 210 110 Z" fill="none" stroke="#24180F" strokeWidth="5" />
      <rect x="26" y="106" width="188" height="11" rx="5.5" fill="#3A281B" stroke="#24180F" strokeWidth="2" />
      {[50, 75, 100, 125, 150, 175, 200].map((x) => <line key={x} x1={x} x2={x} y1="107" y2="116" stroke="#24180F" strokeWidth="2" />)}
    </svg>
  );
}
