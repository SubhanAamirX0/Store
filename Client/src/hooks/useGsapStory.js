import { useLayoutEffect } from "react";

export function useGsapStory(scopeRef) {
  useLayoutEffect(() => {
    if (!scopeRef.current) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    let context;
    let active = true;

    function revealWithoutGsap() {
      scopeRef.current?.querySelectorAll("[data-hero-line], [data-story-card]").forEach((element) => {
        element.style.opacity = "1";
        element.style.transform = "none";
      });
    }

    async function loadGsap() {
      let gsap;
      let ScrollTrigger;

      try {
        const [gsapModule, scrollTriggerModule] = await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger")
        ]);
        gsap = gsapModule.default;
        ScrollTrigger = scrollTriggerModule.ScrollTrigger;
      } catch {
        revealWithoutGsap();
        return;
      }

      if (!gsap || !ScrollTrigger) return;

      if (!active || !scopeRef.current) return;

      gsap.registerPlugin(ScrollTrigger);
      context = gsap.context(() => {
        gsap.set("[data-hero-line]", { opacity: 0, y: 46 });
        gsap.set("[data-story-card]", { opacity: 0, y: 56, scale: 0.95 });
        gsap.set("[data-hero-image]", { scale: 1.04 });

        gsap.to("[data-hero-line]", {
          y: 0,
          opacity: 0,
          duration: 0
        });

        gsap.to("[data-hero-line]", {
          y: 0,
          opacity: 1,
          duration: 1.05,
          ease: "power4.out",
          stagger: 0.16,
          delay: 0.08
        });

        gsap.to("[data-hero-image]", {
          scale: 1.16,
          yPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-hero]",
            start: "top top",
            end: "bottom top",
            scrub: true
          }
        });

        gsap.to("[data-story-card]", {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.95,
          ease: "power4.out",
          stagger: 0.14,
          scrollTrigger: {
            trigger: "[data-story]",
            start: "top 72%",
            toggleActions: "play none none reverse"
          }
        });
      }, scopeRef);
    }

    loadGsap();

    return () => {
      active = false;
      context?.revert();
    };
  }, [scopeRef]);
}
