import { gsap, semMovimento } from "./gsap";

// Chuva de folhinhas e flores para comemorar
export function festa(itens = ["🍃", "🌺", "🥬", "⭐"]) {
  if (semMovimento()) return;
  const palco = document.createElement("div");
  palco.setAttribute("aria-hidden", "true");
  palco.className = "pointer-events-none fixed inset-0 z-[100] overflow-hidden";
  document.body.appendChild(palco);
  const els = Array.from({ length: 22 }, (_, i) => {
    const s = document.createElement("span");
    s.textContent = itens[i % itens.length];
    s.className = "absolute left-1/2 top-1/2 text-4xl";
    palco.appendChild(s);
    return s;
  });
  gsap.timeline({ onComplete: () => palco.remove() })
    .to(els, {
      x: () => gsap.utils.random(-window.innerWidth / 2.2, window.innerWidth / 2.2),
      y: () => gsap.utils.random(-window.innerHeight / 2.5, -40),
      rotate: () => gsap.utils.random(-220, 220),
      duration: 0.9, ease: "power3.out",
    })
    .to(els, { y: "+=" + window.innerHeight / 1.5, opacity: 0, duration: 1, ease: "power1.in" }, ">-0.15");
}
