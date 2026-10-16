"use client";
import { createContext, useContext, useEffect, useState } from "react";

const TemaContext = createContext({ tema: "claro", alternar: () => {} });

export default function ThemeProvider({ children }) {
  const [tema, setTema] = useState("claro");
  useEffect(() => setTema(document.documentElement.classList.contains("dark") ? "escuro" : "claro"), []);

  const alternar = () => {
    const novo = tema === "escuro" ? "claro" : "escuro";
    setTema(novo);
    document.documentElement.classList.toggle("dark", novo === "escuro");
    try { localStorage.setItem("tema", novo); } catch {}
  };
  return <TemaContext.Provider value={{ tema, alternar }}>{children}</TemaContext.Provider>;
}
export const useTema = () => useContext(TemaContext);
