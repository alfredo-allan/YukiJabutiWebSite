export const ESPECIES = {
  piranga: {
    nome: "Jabuti-piranga",
    cientifico: "Chelonoidis carbonarius",
    pista: "Escamas vermelhas ou alaranjadas na cabeça e nas patas.",
    curiosidade: "Piranga quer dizer \u201cvermelho\u201d em tupi.",
    manchas: "#E0452A",
  },
  tinga: {
    nome: "Jabuti-tinga",
    cientifico: "Chelonoidis denticulatus",
    pista: "Escamas amarelas ou laranja-claro, e o casco mais comprido.",
    curiosidade: "Tinga quer dizer \u201camarelo\u201d em tupi.",
    manchas: "#F2B632",
  },
  outra: {
    nome: "Outra espécie",
    cientifico: "Pergunte ao veterinário",
    pista: "Não parece nenhum dos dois? Tudo bem!",
    curiosidade: "O veterinário descobre na primeira consulta.",
    manchas: "#B9B0A2",
  },
};
export const especie = (k) => ESPECIES[k] || ESPECIES.outra;
