/* ============================================================
   Joshua Lourens — Portfolio interactions
   Vanilla JS, no dependencies.
   ============================================================ */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- Footer year ---------- */
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Nav: scrolled state ---------- */
  const nav = $("#nav");
  const onScrollNav = () => nav.classList.toggle("is-scrolled", window.scrollY > 24);
  onScrollNav();

  /* ---------- Mobile menu ---------- */
  const toggle = $("#navToggle");
  const links = $("#navLinks");
  const closeMenu = () => {
    toggle.classList.remove("is-open");
    links.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  $$(".nav__link, .nav__cta", links).forEach(a => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });

  /* ---------- Scroll progress bar ---------- */
  const progress = $("#scrollProgress");
  const onScrollProgress = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
    progress.style.width = (scrolled * 100) + "%";
  };

  /* ---------- Back to top ---------- */
  const toTop = $("#toTop");
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" }));
  const onScrollTop = () => toTop.classList.toggle("is-visible", window.scrollY > 600);

  /* combined scroll handler (rAF-throttled) ---------- */
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      onScrollNav();
      onScrollProgress();
      onScrollTop();
      ticking = false;
    });
  }, { passive: true });

  /* ---------- Typewriter (hero role) ---------- */
  const tw = $("#typewriter");
  const roles = [
    "Junior Software Developer",
    "C# / .NET Engineer",
    "Cloud & Azure Enthusiast",
    "Problem Solver"
  ];
  if (prefersReduced) {
    tw.textContent = roles[0];
  } else {
    let r = 0, c = 0, deleting = false;
    const tick = () => {
      const word = roles[r];
      c += deleting ? -1 : 1;
      tw.textContent = word.slice(0, c);
      let delay = deleting ? 45 : 90;
      if (!deleting && c === word.length) { delay = 1700; deleting = true; }
      else if (deleting && c === 0) { deleting = false; r = (r + 1) % roles.length; delay = 350; }
      setTimeout(tick, delay);
    };
    setTimeout(tick, 600);
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$(".reveal");
  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach(el => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // small stagger for grouped elements
          const delay = Math.min(i * 60, 180);
          setTimeout(() => entry.target.classList.add("is-in"), delay);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(el => io.observe(el));
  }

  /* ---------- Animated stat counters ---------- */
  const counters = $$(".hero__stats .num");
  const runCounter = (el) => {
    const target = parseInt(el.dataset.count, 10);
    if (prefersReduced) { el.textContent = target; return; }
    const dur = 1400, start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ("IntersectionObserver" in window) {
    const cObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => { if (e.isIntersecting) { runCounter(e.target); obs.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach(c => cObs.observe(c));
  } else {
    counters.forEach(runCounter);
  }

  /* ---------- Scroll-spy (active nav link) ---------- */
  const sections = $$("main section[id]");
  const navLinks = $$(".nav__link");
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(l => l.classList.toggle("is-active", l.getAttribute("href") === "#" + id));
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(s => spy.observe(s));
  }

  /* ---------- Project filters ---------- */
  const filters = $$(".filter");
  const cards = $$("#projectsGrid .card");
  filters.forEach(btn => {
    btn.addEventListener("click", () => {
      filters.forEach(b => { b.classList.remove("is-active"); b.setAttribute("aria-selected", "false"); });
      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");
      const f = btn.dataset.filter;
      cards.forEach(card => {
        const tags = card.dataset.tags || "";
        const show = f === "all" || tags.includes(f) || card.classList.contains("card--add");
        card.classList.toggle("is-hidden", !show);
      });
    });
  });

  /* ---------- Card glow follows cursor ---------- */
  if (window.matchMedia("(hover: hover)").matches) {
    cards.forEach(card => {
      card.addEventListener("pointermove", e => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", (e.clientX - rect.left) + "px");
        card.style.setProperty("--my", (e.clientY - rect.top) + "px");
      });
    });
  }

  /* ---------- Cursor glow ---------- */
  const glow = $(".cursor-glow");
  if (glow && window.matchMedia("(hover: hover) and (pointer: fine)").matches && !prefersReduced) {
    let gx = 0, gy = 0, cx = 0, cy = 0;
    window.addEventListener("pointermove", e => {
      gx = e.clientX; gy = e.clientY; glow.style.opacity = "1";
    });
    const loop = () => {
      cx += (gx - cx) * 0.12; cy += (gy - cy) * 0.12;
      glow.style.transform = `translate(${cx}px, ${cy}px)`;
      requestAnimationFrame(loop);
    };
    loop();
  }

  /* ============================================================
     Hero canvas — constellation / particle network
     ============================================================ */
  const canvas = $("#heroCanvas");
  if (canvas && !prefersReduced) {
    const ctx = canvas.getContext("2d");
    let w, h, dpr, particles = [], raf;
    const hero = $(".hero");

    const COLORS = ["51,225,237", "108,123,255"];
    const config = () => {
      const area = w * h;
      return Math.min(90, Math.floor(area / 16000)); // density cap
    };

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = hero.offsetWidth; h = hero.offsetHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + "px"; canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      init();
    }

    function init() {
      const n = config();
      particles = [];
      for (let i = 0; i < n; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.8 + 0.6,
          c: COLORS[Math.random() < 0.7 ? 0 : 1]
        });
      }
    }

    const mouse = { x: -9999, y: -9999 };
    hero.addEventListener("pointermove", e => {
      const rect = hero.getBoundingClientRect();
      mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top;
    });
    hero.addEventListener("pointerleave", () => { mouse.x = -9999; mouse.y = -9999; });

    function draw() {
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c}, 0.7)`;
        ctx.fill();
      }

      // links
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = dx * dx + dy * dy;
          if (dist < 16000) {
            const op = (1 - dist / 16000) * 0.35;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${a.c}, ${op})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
        // link to mouse
        const a = particles[i];
        const mdx = a.x - mouse.x, mdy = a.y - mouse.y;
        const md = mdx * mdx + mdy * mdy;
        if (md < 26000) {
          const op = (1 - md / 26000) * 0.5;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(51,225,237, ${op})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
      raf = requestAnimationFrame(draw);
    }

    resize();
    draw();
    let rt;
    window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(resize, 200); });

    // pause when hero off-screen (perf)
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { if (!raf) draw(); }
        else { cancelAnimationFrame(raf); raf = null; }
      }, { threshold: 0 }).observe(hero);
    }
  }
})();
