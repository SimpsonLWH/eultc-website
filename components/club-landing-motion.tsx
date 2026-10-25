"use client";

import { useEffect } from "react";

// Reveal below-fold content once without making rendering depend on JavaScript.
export default function ClubLandingMotion({ scopeId }: { scopeId: string }) {
  useEffect(() => {
    const scope = document.getElementById(scopeId);
    if (!scope) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const targets = Array.from(
      scope.querySelectorAll<HTMLElement>("[data-reveal]")
    );

    if (!("IntersectionObserver" in window)) {
      for (const target of targets) {
        target.dataset.revealState = "in";
      }
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue;
          }
          (entry.target as HTMLElement).dataset.revealState = "in";
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    for (const target of targets) {
      if (target.getBoundingClientRect().top > window.innerHeight * 0.94) {
        target.dataset.revealState = "pending";
        observer.observe(target);
      } else {
        target.dataset.revealState = "in";
      }
    }

    return () => observer.disconnect();
  }, [scopeId]);

  return null;
}
