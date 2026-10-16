import { Baloo_2 } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import JabutiProvider from "@/components/JabutiProvider";
import { ConfirmacaoProvider } from "@/components/Confirmacao";
import Cabecalho from "@/components/Cabecalho";

const baloo = Baloo_2({ subsets: ["latin"], weight: ["400", "600", "700", "800"], variable: "--font-baloo" });

export const metadata = {
  title: "Yuki Jabuti",
  description: "Aprenda a cuidar do seu jabuti e acompanhe como ele cresce.",
};
export const viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#3E8C30" };

const temaInicial = `(function(){try{var t=localStorage.getItem('tema');if(!t){t=matchMedia('(prefers-color-scheme: dark)').matches?'escuro':'claro'}if(t==='escuro')document.documentElement.classList.add('dark')}catch(e){}})()`;

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={baloo.variable} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: temaInicial }} /></head>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <JabutiProvider>
            <ConfirmacaoProvider>
              <Cabecalho />
              {children}
            </ConfirmacaoProvider>
          </JabutiProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
