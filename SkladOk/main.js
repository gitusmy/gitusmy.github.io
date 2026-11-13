/* =========================================================
   SkladOk — landing interactions
   ========================================================= */

(() => {
  "use strict";

  const doc = document.documentElement;
  const body = document.body;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  /* ---------- Sticky header ---------- */

  const header = document.querySelector("[data-header]");
  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 16);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  /* ---------- Mobile menu ---------- */

  const menu = document.querySelector("[data-menu]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const focusableSelector =
    'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';
  let lastFocusedElement = null;

  const setMenu = (open) => {
    if (!menu || !menuToggle) return;

    if (open) {
      lastFocusedElement = document.activeElement;
      menu.classList.add("is-open");
      menu.removeAttribute("inert");
      menu.setAttribute("aria-hidden", "false");
      menuToggle.setAttribute("aria-expanded", "true");
      menuToggle.setAttribute(
        "aria-label",
        menuToggle.dataset.menuLabelClose || "Закрити меню"
      );
      doc.classList.add("menu-open");
      body.classList.add("menu-open");

      const firstFocusable = menu.querySelector(focusableSelector);
      if (firstFocusable) {
        // The panel transitions from visibility:hidden, so wait until it is
        // focusable before moving focus into the menu.
        setTimeout(() => {
          if (menu.classList.contains("is-open")) {
            firstFocusable.focus({ preventScroll: true });
          }
        }, 80);
      }
    } else {
      menu.classList.remove("is-open");
      menu.setAttribute("aria-hidden", "true");
      menu.setAttribute("inert", "");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute(
        "aria-label",
        menuToggle.dataset.menuLabelOpen || "Відкрити меню"
      );
      doc.classList.remove("menu-open");
      body.classList.remove("menu-open");

      if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
        lastFocusedElement.focus({ preventScroll: true });
      }
    }
  };

  if (menu) {
    menu.setAttribute("inert", "");
  }

  menuToggle?.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    setMenu(!isOpen);
  });

  menu?.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      setMenu(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!menu?.classList.contains("is-open")) return;

    if (event.key === "Escape") {
      event.preventDefault();
      setMenu(false);
      return;
    }

    if (event.key !== "Tab") return;

    const focusable = [...menu.querySelectorAll(focusableSelector)].filter(
      (element) => element.offsetParent !== null
    );

    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 900 && menu?.classList.contains("is-open")) {
      setMenu(false);
    }
  });

  /* ---------- Scroll spy ---------- */

  const navLinks = [...document.querySelectorAll(".nav__link")];
  const spySections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && spySections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const targetId = `#${entry.target.id}`;
          navLinks.forEach((link) => {
            const isActive = link.getAttribute("href") === targetId;
            link.classList.toggle("is-active", isActive);
            if (isActive) {
              link.setAttribute("aria-current", "location");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );

    spySections.forEach((section) => spy.observe(section));
  }

  /* ---------- Reveal on scroll ---------- */

  const revealElements = [...document.querySelectorAll(".reveal")];

  if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.06 }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  }

  /* ---------- Gallery prefetch ---------- */
  /* Keep the gallery out of the initial load, but start fetching its screens
     before the section scrolls into view so navigation is instant. */

  const gallerySection = document.querySelector("#screens");

  if (gallerySection && "IntersectionObserver" in window) {
    const galleryImages = [
      ...gallerySection.querySelectorAll("[data-gallery-viewport] img"),
    ];

    const prefetchGallery = new IntersectionObserver(
      (entries, observer) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;

        galleryImages.forEach((image) => {
          image.loading = "eager";
          if (typeof image.decode === "function") {
            image.decode().catch(() => {});
          }
        });

        observer.disconnect();
      },
      { rootMargin: "1200px 0px" }
    );

    prefetchGallery.observe(gallerySection);
  }

  /* ---------- Hero parallax ---------- */

  const heroStage = document.querySelector("[data-hero-stage]");

  if (heroStage && !reduceMotion.matches && finePointer.matches) {
    let parallaxFrame = null;

    const moveStage = (event) => {
      const rect = heroStage.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      if (parallaxFrame) cancelAnimationFrame(parallaxFrame);

      parallaxFrame = requestAnimationFrame(() => {
        heroStage.style.setProperty("--px", `${x * 9}px`);
        heroStage.style.setProperty("--py", `${y * 9}px`);
        parallaxFrame = null;
      });
    };

    const resetStage = () => {
      if (parallaxFrame) cancelAnimationFrame(parallaxFrame);
      heroStage.style.setProperty("--px", "0px");
      heroStage.style.setProperty("--py", "0px");
    };

    heroStage.addEventListener("pointermove", moveStage);
    heroStage.addEventListener("pointerleave", resetStage);
  }

  /* ---------- Screens gallery ---------- */

  const gallery = document.querySelector("[data-gallery]");

  if (gallery) {
    const viewport = gallery.querySelector("[data-gallery-viewport]");
    const slides = viewport
      ? [...viewport.querySelectorAll(".gallery__slide")]
      : [];
    const previousButton = gallery.querySelector("[data-gallery-prev]");
    const nextButton = gallery.querySelector("[data-gallery-next]");
    const dots = [...gallery.querySelectorAll("[data-gallery-dot]")];
    const currentLabel = gallery.querySelector("[data-gallery-current]");
    const totalLabel = gallery.querySelector("[data-gallery-total]");

    if (viewport && slides.length) {
      let activeIndex = 0;
      let scrollFrame = null;

      if (totalLabel) {
        totalLabel.textContent = String(slides.length).padStart(2, "0");
      }

      const slideOf = viewport.dataset.slideOf || "з";

      slides.forEach((slide, index) => {
        slide.setAttribute(
          "aria-label",
          `${index + 1} ${slideOf} ${slides.length}`
        );
      });

      const setActive = (index) => {
        activeIndex = Math.max(0, Math.min(slides.length - 1, index));

        slides.forEach((slide, slideIndex) => {
          slide.classList.toggle("is-active", slideIndex === activeIndex);
        });

        dots.forEach((dot, dotIndex) => {
          if (dotIndex === activeIndex) {
            dot.setAttribute("aria-current", "true");
          } else {
            dot.removeAttribute("aria-current");
          }
        });

        if (currentLabel) {
          currentLabel.textContent = String(activeIndex + 1).padStart(2, "0");
        }

        if (previousButton) {
          previousButton.disabled = activeIndex === 0;
        }

        if (nextButton) {
          nextButton.disabled = activeIndex === slides.length - 1;
        }
      };

      const scrollToIndex = (index) => {
        const target = Math.max(0, Math.min(slides.length - 1, index));
        const viewportRect = viewport.getBoundingClientRect();
        const slideRect = slides[target].getBoundingClientRect();
        const left = slideRect.left - viewportRect.left + viewport.scrollLeft;

        viewport.scrollTo({
          left,
          behavior: reduceMotion.matches ? "auto" : "smooth",
        });

        setActive(target);
      };

      const updateFromScroll = () => {
        if (scrollFrame) return;

        scrollFrame = requestAnimationFrame(() => {
          scrollFrame = null;
          const viewportLeft = viewport.getBoundingClientRect().left;
          let closestIndex = 0;
          let closestDistance = Infinity;

          slides.forEach((slide, index) => {
            const distance = Math.abs(
              slide.getBoundingClientRect().left - viewportLeft
            );
            if (distance < closestDistance) {
              closestDistance = distance;
              closestIndex = index;
            }
          });

          setActive(closestIndex);
        });
      };

      viewport.addEventListener("scroll", updateFromScroll, { passive: true });

      previousButton?.addEventListener("click", () => {
        scrollToIndex(activeIndex - 1);
      });

      nextButton?.addEventListener("click", () => {
        scrollToIndex(activeIndex + 1);
      });

      dots.forEach((dot, index) => {
        dot.addEventListener("click", () => scrollToIndex(index));
      });

      viewport.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollToIndex(activeIndex - 1);
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollToIndex(activeIndex + 1);
        } else if (event.key === "Home") {
          event.preventDefault();
          scrollToIndex(0);
        } else if (event.key === "End") {
          event.preventDefault();
          scrollToIndex(slides.length - 1);
        }
      });

      setActive(0);
    }
  }

  /* ---------- Footer year ---------- */

  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });
})();
