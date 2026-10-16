# 🐢 Yuki Jabuti — Front-end

Interface em **Next.js 14 + React + Tailwind + GSAP** do diário da Yuki. Hospedagem: **Vercel**.
A API fica em outro repositório (`yukijabuti-backend`, no PythonAnywhere).

## Telas (menu lateral)

| Tela | Rota | O que tem |
|---|---|---|
| Aprender | `/` | Guia animado no scroll: termômetro, jogo do prato, banho, sol, cartões de alerta e linha do tempo do crescimento |
| Meu dia | `/meu-dia` | Comeu / banho / sol, humor, recadinho e sequência da semana |
| Crescimento | `/crescimento` | Medir peso e casco, comparação com objetos, gráfico e tabela |
| Carteirinha | `/carteirinha` | Carteira de registro com foto, frente e verso |
| Ajustes | `/ajustes` | Nome, espécie, sexo, datas, microchip e tema |
| Boas-vindas | `/bem-vindo` | Primeiro acesso em 3 passos (abre sozinho se não houver jabuti) |

## Setup inicial da Yuki

Já vem com **nome Yuki** e **espécie jabuti-piranga** marcados no primeiro acesso.
A criança pode trocar na hora. Para outra família, mude no `.env.local`:

```
NEXT_PUBLIC_NOME_PADRAO=Yuki
NEXT_PUBLIC_ESPECIE_PADRAO=piranga   # piranga | tinga | outra
```

## Rodar no computador

```bash
cp .env.example .env.local
npm install
npm run dev        # http://localhost:3000  (a API precisa estar em http://localhost:5000)
```

## Deploy na Vercel

1. Suba este repositório no GitHub e importe na Vercel (framework: Next.js).
2. Em *Environment Variables*, cadastre as três variáveis do `.env.example`, com
   `NEXT_PUBLIC_API_URL=https://SEUUSUARIO.pythonanywhere.com`.
3. Faça o deploy e coloque o domínio gerado em `FRONTEND_ORIGIN` no WSGI do PythonAnywhere.

## Estrutura

```
app/                      uma pasta por tela
components/
  Sidebar.jsx             menu lateral (abre 50% da tela, da esquerda)
  Cabecalho.jsx           barra com o botão Menu e a foto do jabuti
  JabutiProvider.jsx      contexto: jabuti escolhido e registros
  ThemeProvider.jsx       contexto: tema claro/escuro
  Tortoise.jsx            o jabuti em SVG (cores mudam pela espécie)
  aprender/               cada seção animada da tela Aprender
lib/
  gsap.js                 registra ScrollTrigger e MotionPath
  especies.js             dados de piranga e tinga
  imagem.js               reduz a foto no aparelho antes de enviar
```

Quem tem "reduzir movimento" ligado no aparelho vê tudo sem animação.
