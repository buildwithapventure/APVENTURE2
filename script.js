/* ============================================================
   APVENTURE — script.js
   Vanilla JS port of the React/Framer Motion/Three.js/GSAP/Lenis build.
   Same libraries (Three.js, GSAP+ScrollTrigger, Lenis), same easing
   curves, same timings — re-implemented without a framework.
   ============================================================ */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ============================================================
     DATA (ported 1:1 from src/data/*.ts)
     ============================================================ */

  const ICONS = {
    code: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>',
    layout: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>',
    box: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>',
    bookOpen: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>',
    cart: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>',
    edit: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>',
    file: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>',
    pie: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>',
    search: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
    clipboard: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>',
    feather: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path><line x1="16" y1="8" x2="2" y2="22"></line><line x1="17.5" y1="15" x2="9" y2="15"></line></svg>',
    cpu: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>',
    send: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>',
    zap: '<svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>',
    shield: '<svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
    users: '<svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
    trending: '<svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>',
    check: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
    arrowUpRight: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>',
    arrowRight: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>',
    star: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>'
  };

  const SERVICES = [
    { icon: "code", title: "Website Development", description: "Fast, scalable websites built on modern frameworks — engineered for performance, SEO, and growth from day one." },
    { icon: "layout", title: "Website Design", description: "Distinctive, conversion-focused interfaces that reflect your brand and guide visitors toward action." },
    { icon: "box", title: "Web Applications", description: "Custom dashboards, portals, and SaaS products built with robust architecture and intuitive UX." },
    { icon: "bookOpen", title: "Educational Websites", description: "Learning platforms and institutional sites designed for clarity, accessibility, and engagement." },
    { icon: "cart", title: "E-Commerce Solutions", description: "End-to-end online stores with seamless checkout, inventory tools, and growth-ready storefronts." },
    { icon: "edit", title: "Content Writing", description: "Strategic, SEO-aware copy that communicates your value clearly and converts readers into customers." },
    { icon: "file", title: "IT Documentation", description: "Clear technical documentation, SOPs, and knowledge bases that keep teams aligned and onboarding fast." },
    { icon: "pie", title: "Accounting Support", description: "Reliable bookkeeping and financial reporting support so you can focus on building your business." }
  ];

  const PROCESS_STEPS = [
    { icon: "search", title: "Discover", description: "We dig into your goals, audience, and market to uncover what success actually looks like." },
    { icon: "clipboard", title: "Plan", description: "A clear roadmap and scope — features, timeline, and milestones — before a single pixel is drawn." },
    { icon: "feather", title: "Design", description: "Wireframes evolve into a distinctive visual identity, refined with your feedback at every step." },
    { icon: "cpu", title: "Develop", description: "Clean, scalable code brings the design to life — built for speed, security, and growth." },
    { icon: "send", title: "Deliver", description: "We launch, test in the wild, and stay close with support as your product finds its audience." }
  ];

  const REASONS = [
    { icon: "zap", title: "Built for speed", description: "Performance-first engineering means your site loads fast and ranks higher — no bloated templates." },
    { icon: "shield", title: "Reliable by design", description: "Tested, documented, and supported. We build things that keep working long after launch day." },
    { icon: "users", title: "Startup-friendly", description: "Flexible scopes and transparent pricing that grow with you — from MVP to scale-up." },
    { icon: "trending", title: "Growth-focused", description: "Every decision, from layout to copy, is made to move a metric that matters to your business." }
  ];

  const PROJECTS = [
    { title: "Nimbus Labs", category: "Web App", description: "Analytics dashboard for distributed engineering teams.", gradient: "linear-gradient(135deg, #2563eb, #1e3a8a)" },
    { title: "Verda Market", category: "E-Commerce", description: "Headless storefront for a sustainable home goods brand.", gradient: "linear-gradient(135deg, #f97316, #c2410c)" },
    { title: "Atlas Education", category: "Education", description: "Course platform serving 40,000+ enrolled students.", gradient: "linear-gradient(135deg, #8b5cf6, #4c1d95)" },
    { title: "Strideware", category: "Website", description: "Marketing site and brand system for a fitness startup.", gradient: "linear-gradient(135deg, #0ea5e9, #075985)" },
    { title: "Hatchwise", category: "Web App", description: "Internal tooling for incubator deal-flow management.", gradient: "linear-gradient(135deg, #f59e0b, #92400e)" },
    { title: "Solace Health", category: "Website", description: "Patient-facing site for a telehealth network.", gradient: "linear-gradient(135deg, #2563eb, #8b5cf6)" }
  ];
  const PROJECT_CATEGORIES = ["All", "Website", "Web App", "E-Commerce", "Education"];

  const TESTIMONIALS = [
    { name: "Priya Raman", role: "Founder", company: "Verda Market", quote: "APVENTURE took a rough idea and turned it into a storefront that actually converts. Communication was clear at every stage and the final build exceeded what we scoped.", rating: 5, initials: "PR" },
    { name: "Daniel Okafor", role: "CTO", company: "Nimbus Labs", quote: "The web app they built handles our entire reporting pipeline now. Clean code, thorough documentation, and they're still around for support months later.", rating: 5, initials: "DO" },
    { name: "Meera Iyer", role: "Director", company: "Atlas Education", quote: "Our enrollment numbers jumped after the redesign launched. The team understood our students and built around their needs, not just ours.", rating: 5, initials: "MI" },
    { name: "Tom Whitfield", role: "Founder", company: "Strideware", quote: "Startup budget, agency-level output. APVENTURE moved fast without cutting corners on design quality — exactly what we needed pre-launch.", rating: 5, initials: "TW" }
  ];

  const PRICING_PLANS = [
    { name: "Starter", price: "₹2,499", priceNote: "1–3 pages", description: "A clean, fast static site to get your business online.", features: ["Up to 3 pages", "Mobile-responsive design", "Contact form", "Basic on-page SEO", "1 round of revisions"] },
    { name: "Growth", price: "₹4,499", priceNote: "4–5 pages", description: "More room to tell your story and showcase your work.", features: ["4–5 pages", "Mobile-responsive design", "Contact form + map embed", "On-page SEO setup", "2 rounds of revisions", "Basic analytics integration"], recommended: true },
    { name: "Pro", price: "₹7,499", priceNote: "6–10 pages", description: "A full static presence for established businesses.", features: ["6–10 pages", "Mobile-responsive design", "Advanced SEO setup", "3 rounds of revisions", "Analytics + tracking setup", "Priority support"] },
    { name: "Business", price: "₹9,999", priceNote: "Starting at", description: "Dynamic websites, web apps, and e-commerce builds.", features: ["Custom scope & pages", "CMS or e-commerce backend", "Database-driven features", "Unlimited revisions (scoped)", "Dedicated project manager", "Post-launch support plan"] }
  ];

  const BLOG_POSTS = [
    { title: "Why your startup's first website shouldn't be a template", excerpt: "A custom site costs more upfront but compounds in trust, speed, and conversion over time.", category: "Strategy", readTime: "5 min read", date: "Jun 2026" },
    { title: "The real cost of a slow website", excerpt: "Every extra second of load time chips away at conversions. Here's how we audit and fix it.", category: "Performance", readTime: "4 min read", date: "May 2026" },
    { title: "E-commerce checklist before you launch", excerpt: "Payments, inventory, SEO, and mobile UX — the details that decide whether your store converts.", category: "E-Commerce", readTime: "6 min read", date: "May 2026" }
  ];

  const COMPANIES = ["Nimbus Labs", "Orbitfy", "Strideware", "Lumen Retail", "Northbridge", "Verda", "Kindle & Co", "Atlas Education", "Hatchwise", "Solace Health"];

  /* ============================================================
     UTIL
     ============================================================ */

  function esc(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  /* ============================================================
     PAGE LOADER — fullscreen video, plays once per browser
     session (skipped on repeat visits / page navigations within
     the same tab session), always allowed to finish its full
     length before exiting. Starts muted (required for instant
     autoplay) and automatically unmutes itself on the visitor's
     first click/tap anywhere on the page — no button needs to be
     pressed deliberately. Skip Intro is available immediately.
     ============================================================ */

  function initPageLoader() {
    const loader = document.getElementById("page-loader");
    const video = document.getElementById("loader-video");
    const soundStatus = document.getElementById("loader-sound-status");
    const skipBtn = document.getElementById("loader-skip-btn");
    if (!loader) return;

    const SESSION_KEY = "apventure-loader-played";
    const SAFETY_TIMEOUT_MS = 12000; // only fires if the video stalls/fails — never cuts a healthy 10s video short
    const EXIT_TRANSITION_MS = 500;

    let alreadyPlayed = false;
    try { alreadyPlayed = sessionStorage.getItem(SESSION_KEY) === "1"; } catch (e) {}

    if (prefersReducedMotion || alreadyPlayed) {
      loader.classList.add("is-hidden");
      return;
    }

    try { sessionStorage.setItem(SESSION_KEY, "1"); } catch (e) {}

    document.body.style.overflow = "hidden";

    let finished = false;
    function finish() {
      if (finished) return;
      finished = true;
      loader.classList.add("is-exiting");
      setTimeout(function () {
        loader.classList.add("is-hidden");
        document.body.style.overflow = "";
      }, EXIT_TRANSITION_MS);
    }

    function markUnmuted() {
      if (soundStatus) {
        soundStatus.classList.add("is-unmuted");
        soundStatus.querySelector(".icon-sound-off").style.display = "none";
        soundStatus.querySelector(".icon-sound-on").style.display = "block";
        soundStatus.querySelector(".loader-sound-label").textContent = "Sound on";
      }
    }

    // First click/tap anywhere on the page unmutes the video in place —
    // no restart, no separate button to find. This is the earliest
    // point browsers allow audio to start, since it follows a real
    // user gesture.
    function unmuteOnFirstInteraction(e) {
      if (skipBtn && e.target && skipBtn.contains(e.target)) return;
      if (!video || !video.muted) return;
      video.muted = false;
      markUnmuted();
    }
    document.addEventListener("click", unmuteOnFirstInteraction, { once: true, capture: true });
    document.addEventListener("touchstart", unmuteOnFirstInteraction, { once: true, capture: true });
    document.addEventListener("keydown", unmuteOnFirstInteraction, { once: true, capture: true });

    if (skipBtn) {
      skipBtn.addEventListener("click", function () {
        clearTimeout(safetyTimer);
        if (video) video.pause();
        finish();
      });
    }

    if (!video) { finish(); return; }

    // Safety net only — set well past the video's real length so it
    // never interrupts normal playback. It only matters if the file
    // fails to load, stalls, or autoplay gets blocked entirely.
    const safetyTimer = setTimeout(finish, SAFETY_TIMEOUT_MS);

    video.addEventListener("ended", function () {
      clearTimeout(safetyTimer);
      finish();
    });
    video.addEventListener("error", function () {
      clearTimeout(safetyTimer);
      finish();
    });

    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function () {
        // Autoplay blocked even while muted (rare) — don't hold the
        // page hostage. The safety timer is still a backstop, but we
        // can also exit immediately since there's nothing to watch.
        clearTimeout(safetyTimer);
        finish();
      });
    }
  }

  /* ============================================================
     SCROLL PROGRESS BAR
     ============================================================ */

  function initScrollProgress() {
    const bar = document.getElementById("scroll-progress");
    if (!bar) return;

    function update() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      bar.style.transform = "scaleX(" + progress + ")";
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  /* ============================================================
     CUSTOM CURSOR — removed; using default browser cursor
     ============================================================ */
  /* ============================================================
     LENIS SMOOTH SCROLL + GSAP TICKER + ANCHOR LINKS
     ============================================================ */

  function initSmoothScroll() {
    if (prefersReducedMotion || typeof Lenis === "undefined") return;

    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    const lenis = new Lenis({
      duration: 1.35,
      easing: function (t) { return Math.min(1, 1 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.5,
      lerp: 0.085,
      syncTouch: true,
      syncTouchLerp: 0.085
    });

    if (typeof ScrollTrigger !== "undefined") {
      lenis.on("scroll", ScrollTrigger.update);
    }

    if (typeof gsap !== "undefined") {
      gsap.ticker.add(function (time) {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    document.addEventListener("click", function (e) {
      const target = e.target.closest("a[href^='#']");
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href || href === "#") return;
      const el = document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: -88, duration: 1.6, easing: function (t) { return Math.min(1, 1 - Math.pow(2, -10 * t)); } });
    });
  }

  /* ============================================================
     SCROLL REVEAL (IntersectionObserver — Framer Motion whileInView equivalent)
     ============================================================ */

  function initRevealAnimations() {
    if (prefersReducedMotion) {
      document.querySelectorAll(".reveal-init, .reveal, .text-reveal-inner").forEach(function (el) {
        el.classList.add("in-view");
      });
      window.__apventureObserveReveals = function (root) {
        (root || document).querySelectorAll(".reveal-init, .reveal, .text-reveal-inner").forEach(function (el) {
          el.classList.add("in-view");
        });
      };
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.dataset.delay || "0", 10);
          setTimeout(function () { el.classList.add("in-view"); }, delay);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.25 });

    document.querySelectorAll(".reveal-init, .reveal").forEach(function (el) { observer.observe(el); });
    document.querySelectorAll(".text-reveal-inner").forEach(function (el) { observer.observe(el); });

    // Exposed so pages that inject .reveal-init content after their own
    // DOMContentLoaded handler (e.g. pricing-details.js) can register
    // those new elements with this same observer.
    window.__apventureObserveReveals = function (root) {
      (root || document).querySelectorAll(".reveal-init, .reveal, .text-reveal-inner").forEach(function (el) {
        if (!el.classList.contains("in-view")) observer.observe(el);
      });
    };
  }

  /* ============================================================
     MAGNETIC BUTTONS (Framer Motion spring stiffness:150 damping:12 mass:0.4)
     ============================================================ */

  function initMagneticButtons(root) {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine || prefersReducedMotion) return;

    (root || document).querySelectorAll(".magnetic-btn").forEach(function (btn) {
      if (btn.dataset.magneticBound === "1") return;
      btn.dataset.magneticBound = "1";

      let raf = null;
      let targetX = 0;
      let targetY = 0;
      let curX = 0;
      let curY = 0;

      function animate() {
        curX += (targetX - curX) * 0.22;
        curY += (targetY - curY) * 0.22;
        btn.style.transform = "translate(" + curX + "px, " + curY + "px)";
        if (Math.abs(targetX - curX) > 0.1 || Math.abs(targetY - curY) > 0.1) {
          raf = requestAnimationFrame(animate);
        } else {
          raf = null;
        }
      }

      btn.addEventListener("mousemove", function (e) {
        const rect = btn.getBoundingClientRect();
        const relX = e.clientX - rect.left - rect.width / 2;
        const relY = e.clientY - rect.top - rect.height / 2;
        targetX = relX * 0.35;
        targetY = relY * 0.35;
        if (!raf) raf = requestAnimationFrame(animate);
      });

      btn.addEventListener("mouseleave", function () {
        targetX = 0;
        targetY = 0;
        if (!raf) raf = requestAnimationFrame(animate);
      });
    });
  }
  window.__apventureInitMagnetic = initMagneticButtons;

  /* ============================================================
     NAVBAR (scroll shrink + mobile menu)
     ============================================================ */

  function initNavbar() {
    const navbar = document.getElementById("navbar");
    const menuToggle = document.getElementById("menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");
    const iconMenu = document.getElementById("icon-menu");
    const iconClose = document.getElementById("icon-close");

    function onScroll() {
      navbar.classList.toggle("is-scrolled", window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    let menuOpen = false;
    function setMenu(open) {
      menuOpen = open;
      mobileMenu.classList.toggle("is-open", open);
      iconMenu.style.display = open ? "none" : "block";
      iconClose.style.display = open ? "block" : "none";
      document.body.style.overflow = open ? "hidden" : "";
    }

    menuToggle.addEventListener("click", function () { setMenu(!menuOpen); });
    mobileMenu.querySelectorAll(".mobile-menu-link, .magnetic-btn").forEach(function (link) {
      link.addEventListener("click", function () { setMenu(false); });
    });
  }

  /* ============================================================
     SERVICES — render grid + 3D tilt + glow border
     ============================================================ */

  function renderServices() {
    const grid = document.getElementById("services-grid");
    if (!grid) return;

    grid.innerHTML = SERVICES.map(function (s, i) {
      return '<div class="service-card reveal-init" data-anim="fade-in-up" data-delay="' + (i * 80) + '">' +
        '<div class="service-card-glow" data-role="glow"></div>' +
        '<div class="service-card-border"></div>' +
        '<div class="service-card-content">' +
        '<div class="service-card-icon">' + ICONS[s.icon] + '</div>' +
        '<h3>' + esc(s.title) + '</h3>' +
        '<p>' + esc(s.description) + '</p>' +
        '<div class="service-card-link">Learn more ' + ICONS.arrowUpRight + '</div>' +
        '</div></div>';
    }).join("");

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (fine && !prefersReducedMotion) {
      grid.querySelectorAll(".service-card").forEach(function (card) {
        const glow = card.querySelector('[data-role="glow"]');
        card.addEventListener("mousemove", function (e) {
          const rect = card.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width;
          const py = (e.clientY - rect.top) / rect.height;
          const tiltX = (py - 0.5) * -10;
          const tiltY = (px - 0.5) * 10;
          card.style.transform = "perspective(800px) rotateX(" + tiltX + "deg) rotateY(" + tiltY + "deg) translateY(-6px)";
          glow.style.background = "radial-gradient(280px circle at " + (px * 100) + "% " + (py * 100) + "%, rgba(37,99,235,0.18), transparent 60%)";
        });
        card.addEventListener("mouseleave", function () {
          card.style.transform = "";
        });
      });
    }
  }

  /* ============================================================
     PROCESS — render steps + GSAP ScrollTrigger line draw
     ============================================================ */

  function renderProcess() {
    const grid = document.getElementById("process-grid");
    if (!grid) return;

    grid.innerHTML = PROCESS_STEPS.map(function (step, i) {
      return '<div class="process-step reveal-init" data-anim="fade-in-up" data-delay="' + (i * 100) + '">' +
        '<div class="process-step-icon">' + ICONS[step.icon] + '<span class="process-step-num">' + (i + 1) + '</span></div>' +
        '<h3>' + esc(step.title) + '</h3>' +
        '<p>' + esc(step.description) + '</p>' +
        '</div>';
    }).join("");
  }

  function initProcessLineDraw() {
    if (prefersReducedMotion) return;
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

    const path = document.getElementById("process-line-draw");
    const section = document.getElementById("about");
    if (!path || !section) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", function () {
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

      const tween = gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          end: "bottom 60%",
          scrub: 0.6
        }
      });

      return function () {
        if (tween.scrollTrigger) tween.scrollTrigger.kill();
        tween.kill();
      };
    });
  }

  /* ============================================================
     WHY CHOOSE — render reasons
     ============================================================ */

  function renderReasons() {
    const grid = document.getElementById("reasons-grid");
    if (!grid) return;

    grid.innerHTML = REASONS.map(function (r, i) {
      return '<div class="reason-item reveal-init" data-anim="fade-in-up" data-delay="' + (i * 80) + '">' +
        '<div class="reason-icon">' + ICONS[r.icon] + '</div>' +
        '<div><h3>' + esc(r.title) + '</h3><p>' + esc(r.description) + '</p></div>' +
        '</div>';
    }).join("");
  }

  /* ============================================================
     TRUSTED BY MARQUEE
     ============================================================ */

  function renderMarquee() {
    const track = document.getElementById("marquee-track");
    if (!track) return;
    const doubled = COMPANIES.concat(COMPANIES);
    track.innerHTML = doubled.map(function (name) { return "<span>" + esc(name) + "</span>"; }).join("");
  }

  /* ============================================================
     PORTFOLIO — filters + grid
     ============================================================ */

  function renderPortfolio() {
    const filtersEl = document.getElementById("portfolio-filters");
    const gridEl = document.getElementById("portfolio-grid");
    if (!filtersEl || !gridEl) return;

    let active = "All";

    filtersEl.innerHTML = PROJECT_CATEGORIES.map(function (cat) {
      return '<button class="portfolio-filter-btn' + (cat === "All" ? " is-active" : "") + '" data-cat="' + esc(cat) + '" data-cursor-hover>' + esc(cat) + '</button>';
    }).join("");

    gridEl.innerHTML = PROJECTS.map(function (p, i) {
      return '<div class="portfolio-card" data-category="' + esc(p.category) + '" data-cursor-hover style="transition-delay:' + (i * 40) + 'ms">' +
        '<div class="portfolio-card-bg" style="background:' + p.gradient + '"></div>' +
        '<div class="portfolio-card-overlay"></div>' +
        '<div class="portfolio-card-content">' +
        '<div class="portfolio-card-text">' +
        '<span class="portfolio-card-category">' + esc(p.category) + '</span>' +
        '<h3 class="portfolio-card-title">' + esc(p.title) + '</h3>' +
        '<p class="portfolio-card-desc">' + esc(p.description) + '</p>' +
        '</div>' +
        '<div class="portfolio-card-arrow">' + ICONS.arrowUpRight + '</div>' +
        '</div></div>';
    }).join("");

    const cards = Array.prototype.slice.call(gridEl.querySelectorAll(".portfolio-card"));

    requestAnimationFrame(function () {
      cards.forEach(function (c) { c.classList.add("is-visible"); });
    });

    function applyFilter(cat) {
      active = cat;
      filtersEl.querySelectorAll(".portfolio-filter-btn").forEach(function (btn) {
        btn.classList.toggle("is-active", btn.dataset.cat === cat);
      });
      cards.forEach(function (card) {
        const match = cat === "All" || card.dataset.category === cat;
        if (match) {
          card.classList.remove("is-filtered-out");
          requestAnimationFrame(function () { card.classList.add("is-visible"); });
        } else {
          card.classList.remove("is-visible");
          setTimeout(function () {
            if (card.dataset.category !== active && active !== "All") {
              card.classList.add("is-filtered-out");
            }
          }, 400);
        }
      });
    }

    filtersEl.addEventListener("click", function (e) {
      const btn = e.target.closest(".portfolio-filter-btn");
      if (!btn) return;
      applyFilter(btn.dataset.cat);
    });
  }

  /* ============================================================
     TESTIMONIALS — auto-slide carousel + drag support
     ============================================================ */

  function initTestimonials() {
    const card = document.getElementById("testimonial-card");
    const dotsEl = document.getElementById("testimonial-dots");
    const prevBtn = document.getElementById("testimonial-prev");
    const nextBtn = document.getElementById("testimonial-next");
    const wrap = document.getElementById("testimonial-wrap");
    if (!card || !dotsEl || !wrap) return;

    const AUTO_SLIDE_MS = 5500;
    let index = 0;
    let paused = false;
    let intervalId = null;

    dotsEl.innerHTML = TESTIMONIALS.map(function (_, i) {
      return '<button class="testimonial-dot' + (i === 0 ? " is-active" : "") + '" data-index="' + i + '" aria-label="Go to testimonial ' + (i + 1) + '" data-cursor-hover></button>';
    }).join("");

    function render() {
      const t = TESTIMONIALS[index];
      let stars = "";
      for (let i = 0; i < t.rating; i++) stars += ICONS.star;
      card.innerHTML = '<div class="testimonial-stars">' + stars + '</div>' +
        '<p class="testimonial-quote">&ldquo;' + esc(t.quote) + '&rdquo;</p>' +
        '<div class="testimonial-author">' +
        '<div class="testimonial-avatar">' + esc(t.initials) + '</div>' +
        '<div class="testimonial-author-info"><p>' + esc(t.name) + '</p><p>' + esc(t.role) + ', ' + esc(t.company) + '</p></div>' +
        '</div>';
      dotsEl.querySelectorAll(".testimonial-dot").forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }

    function crossfade() {
      card.style.opacity = "0";
      card.style.transform = "translateX(-12px)";
      setTimeout(function () {
        render();
        card.style.transform = "translateX(12px)";
        requestAnimationFrame(function () {
          card.style.opacity = "1";
          card.style.transform = "translateX(0)";
        });
      }, 200);
    }

    function next() {
      index = (index + 1) % TESTIMONIALS.length;
      crossfade();
    }
    function prev() {
      index = (index - 1 + TESTIMONIALS.length) % TESTIMONIALS.length;
      crossfade();
    }
    function goTo(i) {
      index = i;
      crossfade();
    }

    function startAuto() {
      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(function () {
        if (!paused) next();
      }, AUTO_SLIDE_MS);
    }

    render();
    startAuto();

    wrap.addEventListener("mouseenter", function () { paused = true; });
    wrap.addEventListener("mouseleave", function () { paused = false; });

    prevBtn.addEventListener("click", prev);
    nextBtn.addEventListener("click", next);
    dotsEl.addEventListener("click", function (e) {
      const dot = e.target.closest(".testimonial-dot");
      if (!dot) return;
      goTo(parseInt(dot.dataset.index, 10));
    });

    let dragStartX = null;
    let dragging = false;

    function getX(e) {
      return e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    }

    card.addEventListener("pointerdown", function (e) {
      dragging = true;
      dragStartX = getX(e);
      card.style.transition = "none";
    });
    card.addEventListener("pointermove", function (e) {
      if (!dragging || dragStartX === null) return;
      const delta = getX(e) - dragStartX;
      card.style.transform = "translateX(" + (delta * 0.5) + "px)";
    });
    function endDrag(e) {
      if (!dragging || dragStartX === null) return;
      const delta = getX(e) - dragStartX;
      card.style.transition = "";
      card.style.transform = "";
      dragging = false;
      dragStartX = null;
      if (delta < -80) next();
      else if (delta > 80) prev();
    }
    card.addEventListener("pointerup", endDrag);
    card.addEventListener("pointerleave", function (e) {
      if (dragging) endDrag(e);
    });
  }

  /* ============================================================
     PRICING — render plans
     ============================================================ */

  function renderPricing() {
    const grid = document.getElementById("pricing-grid");
    if (!grid) return;

    grid.innerHTML = PRICING_PLANS.map(function (plan, i) {
      const features = plan.features.map(function (f) {
        return '<li class="pricing-feature">' + ICONS.check + '<span>' + esc(f) + '</span></li>';
      }).join("");
      return '<div class="reveal-init" data-anim="fade-in-up" data-delay="' + (i * 80) + '">' +
        '<div class="pricing-card' + (plan.recommended ? " is-recommended" : "") + '" data-cursor-hover>' +
        (plan.recommended ? '<span class="pricing-badge">Most Popular</span>' : "") +
        '<h3>' + esc(plan.name) + '</h3>' +
        '<p class="pricing-card-desc">' + esc(plan.description) + '</p>' +
        '<div class="pricing-price-row"><span class="pricing-price">' + esc(plan.price) + '</span>' +
        (plan.priceNote ? '<span class="pricing-price-note">' + esc(plan.priceNote) + '</span>' : "") +
        '</div>' +
        '<ul class="pricing-features">' + features + '</ul>' +
        '<a href="#contact" class="magnetic-btn ' + (plan.recommended ? "magnetic-btn--primary" : "magnetic-btn--secondary") + '" data-cursor-hover><span>Get Started</span></a>' +
        '</div></div>';
    }).join("");
  }

  /* ============================================================
     BLOG PREVIEW — render posts
     ============================================================ */

  function renderBlog() {
    const grid = document.getElementById("blog-grid");
    if (!grid) return;

    grid.innerHTML = BLOG_POSTS.map(function (post, i) {
      return '<div class="reveal-init" data-anim="fade-in-up" data-delay="' + (i * 100) + '">' +
        '<article class="blog-card" data-cursor-hover>' +
        '<div class="blog-card-meta"><span class="blog-card-category">' + esc(post.category) + '</span>' +
        '<span>' + esc(post.date) + '</span><span>&middot;</span><span>' + esc(post.readTime) + '</span></div>' +
        '<h3>' + esc(post.title) + '</h3>' +
        '<p>' + esc(post.excerpt) + '</p>' +
        '<div class="blog-card-link">Read more ' + ICONS.arrowRight + '</div>' +
        '</article></div>';
    }).join("");
  }

  /* ============================================================
     FOOTER YEAR
     ============================================================ */

  function setFooterYear() {
    const el = document.getElementById("footer-year");
    if (el) el.textContent = "© " + new Date().getFullYear() + " APVENTURE. All rights reserved.";
  }

  /* ============================================================
     INIT
     ============================================================ */

  document.addEventListener("DOMContentLoaded", function () {
    initPageLoader();
    initScrollProgress();
    initSmoothScroll();
    initNavbar();
    setFooterYear();

    renderServices();
    renderProcess();
    renderReasons();
    renderMarquee();
    renderPortfolio();
    renderPricing();
    renderBlog();
    initTestimonials();

    initRevealAnimations();
    initMagneticButtons();
    initProcessLineDraw();
  });
})();