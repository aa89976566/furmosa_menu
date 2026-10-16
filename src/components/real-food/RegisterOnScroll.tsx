"use client";

import { useEffect } from "react";

/**
 * 整頁只掛一個 observer，把 [data-rf-reveal] 由 out 切到 in。
 * 伺服器端輸出 out，無 JS 時由 <noscript> 的樣式直接還原，不會有閃動。
 */
export default function RegisterOnScroll() {
  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>('[data-rf-reveal="out"]'),
    );
    if (targets.length === 0) return;

    const settle = () => {
      for (const target of targets) target.dataset.rfReveal = "in";
    };

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReduced || !("IntersectionObserver" in window)) {
      settle();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.rfReveal = "in";
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" },
    );

    for (const target of targets) observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return null;
}
