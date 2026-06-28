/* ============================================================
   APOLLO ONCOLOGY DASHBOARD — INTERACTIONS
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Sticky header shadow on scroll ---------- */
  const header = document.getElementById("siteHeader");
  const fill = document.getElementById("scrollFill");

  function onScroll() {
    const scrollTop = window.scrollY;
    if (header) header.classList.toggle("is-scrolled", scrollTop > 10);

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (fill) fill.style.width = pct + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById("navToggle");
  const primaryNav = document.getElementById("primaryNav");
  if (navToggle && primaryNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = primaryNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
    primaryNav.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        primaryNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Active nav link on scroll (IntersectionObserver) ---------- */
  const navLinks = document.querySelectorAll("[data-nav]");
  const sections = Array.from(navLinks)
    .map(a => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = "#" + entry.target.id;
          navLinks.forEach(l => l.classList.toggle("is-active", l.getAttribute("href") === id));
        }
      });
    }, { rootMargin: "-40% 0px -50% 0px", threshold: 0 });
    sections.forEach(s => obs.observe(s));
  }

  /* ---------- Count-up animation for hero stats ---------- */
  function animateCount(el) {
    const target = parseFloat(el.getAttribute("data-count"));
    const decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    const suffix = el.getAttribute("data-suffix") || "";
    const duration = 1800;
    const start = performance.now();

    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 2.2);
      const val = target * eased;
      el.textContent = val.toFixed(decimals) + suffix;
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = target.toFixed(decimals) + suffix;
    }
    requestAnimationFrame(tick);
  }

  const heroStats = document.getElementById("heroStats");
  if (heroStats) {
    const statEls = heroStats.querySelectorAll("[data-count]");
    if ("IntersectionObserver" in window) {
      const statObs = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      statEls.forEach(el => statObs.observe(el));
    } else {
      // fallback: no IO support
      statEls.forEach(animateCount);
    }
  }

  /* ---------- Reveal-on-scroll for cards ---------- */
  const revealTargets = document.querySelectorAll(
    ".chart-card, .info-card, .journey-step, .action-card, .rank-item, .callout, .mini-card"
  );
  if ("IntersectionObserver" in window && revealTargets.length) {
    revealTargets.forEach(el => el.classList.add("reveal"));
    const revealObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealTargets.forEach(el => revealObs.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add("is-visible"));
  }

  /* ---------- Respect reduced motion ---------- */
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.classList.add("no-motion");
  }
})();
