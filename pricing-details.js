/* ============================================================
   APVENTURE — pricing-details.js
   Renders the detailed plan cards, comparison table, add-ons,
   and FAQ accordion on pricing-details.html.
   Reuses the same ICONS / esc() helpers pattern as script.js.
   ============================================================ */

(function () {
  "use strict";

  function esc(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  const CHECK_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';

  /* ============================================================
     DETAILED PLAN DATA
     ============================================================ */

  const PLANS = [
    {
      name: "Starter",
      price: "₹2,499",
      priceNote: "one-time · 1–3 pages",
      description: "A clean, fast static site to get your business online quickly.",
      timeline: "5–7 days",
      revisions: "1 round",
      sections: [
        { label: "What's included", items: ["Up to 3 pages", "Mobile-responsive design", "Contact form", "Basic on-page SEO", "1 round of revisions", "Domain & hosting guidance"] }
      ]
    },
    {
      name: "Growth",
      price: "₹4,499",
      priceNote: "one-time · 4–5 pages",
      description: "More room to tell your story and showcase your work.",
      timeline: "7–10 days",
      revisions: "2 rounds",
      recommended: true,
      sections: [
        { label: "Everything in Starter, plus", items: ["4–5 pages", "Contact form + map embed", "On-page SEO setup", "2 rounds of revisions", "Basic analytics integration", "Social media links & embeds"] }
      ]
    },
    {
      name: "Pro",
      price: "₹7,499",
      priceNote: "one-time · 6–10 pages",
      description: "A full static presence for established businesses.",
      timeline: "10–14 days",
      revisions: "3 rounds",
      sections: [
        { label: "Everything in Growth, plus", items: ["6–10 pages", "Advanced SEO setup", "3 rounds of revisions", "Analytics + tracking setup", "Priority support", "Speed & performance optimization"] }
      ]
    },
    {
      name: "Business",
      price: "₹9,999+",
      priceNote: "starting at · custom scope",
      description: "Dynamic websites, web apps, and e-commerce builds.",
      timeline: "Scoped per project",
      revisions: "Unlimited (scoped)",
      sections: [
        { label: "Everything in Pro, plus", items: ["Custom scope & pages", "CMS or e-commerce backend", "Database-driven features", "Unlimited revisions (scoped)", "Dedicated project manager", "Post-launch support plan"] }
      ]
    }
  ];

  /* ============================================================
     COMPARISON TABLE DATA
     ============================================================ */

  const COMPARE_ROWS = [
    { label: "Pages included", values: ["Up to 3", "4–5", "6–10", "Custom"] },
    { label: "Mobile-responsive design", values: [true, true, true, true] },
    { label: "Contact form", values: [true, true, true, true] },
    { label: "Map embed", values: [false, true, true, true] },
    { label: "On-page SEO", values: ["Basic", "Standard", "Advanced", "Advanced"] },
    { label: "Analytics integration", values: [false, "Basic", "Full tracking", "Full tracking"] },
    { label: "CMS / e-commerce backend", values: [false, false, false, true] },
    { label: "Revisions", values: ["1 round", "2 rounds", "3 rounds", "Unlimited (scoped)"] },
    { label: "Priority support", values: [false, false, true, true] },
    { label: "Dedicated project manager", values: [false, false, false, true] },
    { label: "Typical timeline", values: ["5–7 days", "7–10 days", "10–14 days", "Scoped"] }
  ];

  /* ============================================================
     ADD-ONS DATA
     ============================================================ */

  const ADDONS = [
    { name: "Extra page", price: "₹499 / page", description: "Add additional pages beyond your plan's included count." },
    { name: "Logo & brand kit", price: "₹1,999", description: "A simple logo, color palette, and font pairing for a consistent brand look." },
    { name: "Copywriting", price: "₹1,499", description: "Professional, SEO-aware copy written for your pages instead of placeholder text." },
    { name: "Blog setup", price: "₹1,999", description: "A blog section with categories, tags, and a simple publishing workflow." },
    { name: "E-commerce add-on", price: "From ₹6,999", description: "Product catalog, cart, and checkout layered onto any static or dynamic plan." },
    { name: "Monthly maintenance", price: "₹999 / month", description: "Updates, backups, and minor content edits handled for you each month." }
  ];

  /* ============================================================
     FAQ DATA
     ============================================================ */

  const FAQS = [
    { q: "Which plan should I choose?", a: "Starter and Growth suit most small businesses that need a clean, informational site. Pro fits businesses with more content and pages. Business is for anything that needs a backend — bookings, accounts, inventory, or an online store." },
    { q: "Are these prices one-time or recurring?", a: "Starter through Pro are one-time build costs for a static site. Business plans are scoped individually since features vary. Hosting, domain, and any ongoing maintenance are separate and optional." },
    { q: "What happens after the revisions run out?", a: "Extra revision rounds can be added at a small per-round rate, or we can quote any larger change as a separate small project." },
    { q: "Do you offer payment plans?", a: "For Pro and Business projects, we typically split payment into milestones — for example 50% to start and 50% on delivery. Talk to us about what works for your budget." },
    { q: "Can I upgrade my plan later?", a: "Yes. Many clients start with Starter or Growth and upgrade to Pro or Business as their business grows. You only pay the difference in scope, not the full new plan price." },
    { q: "What's not included in any plan?", a: "Domain registration, hosting fees, and premium third-party tools (like paid stock photography or premium plugins) are billed separately at cost, with no markup." }
  ];

  /* ============================================================
     RENDER: DETAILED PLAN CARDS
     ============================================================ */

  function renderPlans() {
    const grid = document.getElementById("pd-plans-grid");
    if (!grid) return;

    grid.innerHTML = PLANS.map(function (plan, i) {
      const sections = plan.sections.map(function (section) {
        const items = section.items.map(function (item) {
          return '<li class="pd-plan-feature">' + CHECK_ICON + '<span>' + esc(item) + '</span></li>';
        }).join("");
        return '<div><p class="pd-plan-section-label">' + esc(section.label) + '</p>' +
          '<ul class="pd-plan-features" style="margin-top:0.6rem">' + items + '</ul></div>';
      }).join("");

      return '<div class="reveal-init" data-anim="fade-in-up" data-delay="' + (i * 80) + '">' +
        '<div class="pd-plan-card' + (plan.recommended ? " is-recommended" : "") + '">' +
        '<div class="pd-plan-head"><h3>' + esc(plan.name) + '</h3>' +
        (plan.recommended ? '<span class="pd-plan-badge">Most Popular</span>' : "") +
        '</div>' +
        '<p class="pd-plan-desc">' + esc(plan.description) + '</p>' +
        '<div class="pd-plan-price-row"><span class="pd-plan-price">' + esc(plan.price) + '</span>' +
        '<span class="pd-plan-price-note">' + esc(plan.priceNote) + '</span></div>' +
        sections +
        '<div class="pd-plan-meta-grid">' +
        '<div class="pd-plan-meta"><span>Timeline</span><span>' + esc(plan.timeline) + '</span></div>' +
        '<div class="pd-plan-meta"><span>Revisions</span><span>' + esc(plan.revisions) + '</span></div>' +
        '</div>' +
        '<a href="index.html#contact" class="magnetic-btn ' + (plan.recommended ? "magnetic-btn--primary" : "magnetic-btn--secondary") + '"><span>Get Started</span></a>' +
        '</div></div>';
    }).join("");
  }

  /* ============================================================
     RENDER: COMPARISON TABLE
     ============================================================ */

  function renderTable() {
    const table = document.getElementById("pd-table");
    if (!table) return;

    function cell(value) {
      if (value === true) return '<td><span class="pd-check">' + CHECK_ICON + '</span></td>';
      if (value === false) return '<td><span class="pd-dash">—</span></td>';
      return '<td>' + esc(value) + '</td>';
    }

    const head = '<thead><tr><th>Feature</th>' +
      PLANS.map(function (p, i) {
        return '<th' + (p.recommended ? ' class="is-recommended-col"' : '') + '>' + esc(p.name) + '</th>';
      }).join("") + '</tr></thead>';

    const body = '<tbody>' + COMPARE_ROWS.map(function (row) {
      return '<tr><th scope="row">' + esc(row.label) + '</th>' +
        row.values.map(function (v, i) {
          const recommended = PLANS[i] && PLANS[i].recommended;
          const html = cell(v);
          return recommended ? html.replace("<td>", '<td class="is-recommended-col">') : html;
        }).join("") +
        '</tr>';
    }).join("") + '</tbody>';

    table.innerHTML = head + body;
  }

  /* ============================================================
     RENDER: ADD-ONS
     ============================================================ */

  function renderAddons() {
    const grid = document.getElementById("pd-addons-grid");
    if (!grid) return;

    grid.innerHTML = ADDONS.map(function (addon, i) {
      return '<div class="pd-addon-card reveal-init" data-anim="fade-in-up" data-delay="' + (i * 60) + '">' +
        '<div class="pd-addon-top"><h4>' + esc(addon.name) + '</h4>' +
        '<span class="pd-addon-price">' + esc(addon.price) + '</span></div>' +
        '<p>' + esc(addon.description) + '</p>' +
        '</div>';
    }).join("");
  }

  /* ============================================================
     RENDER + BEHAVIOR: FAQ ACCORDION
     ============================================================ */

  function renderFaq() {
    const list = document.getElementById("pd-faq-list");
    if (!list) return;

    list.innerHTML = FAQS.map(function (item, i) {
      return '<div class="pd-faq-item reveal-init" data-anim="fade-in-up" data-delay="' + (i * 50) + '" data-index="' + i + '">' +
        '<button class="pd-faq-question" aria-expanded="false">' +
        '<span>' + esc(item.q) + '</span>' +
        '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>' +
        '</button>' +
        '<div class="pd-faq-answer"><div class="pd-faq-answer-inner">' + esc(item.a) + '</div></div>' +
        '</div>';
    }).join("");

    list.querySelectorAll(".pd-faq-item").forEach(function (faqItem) {
      const btn = faqItem.querySelector(".pd-faq-question");
      const answer = faqItem.querySelector(".pd-faq-answer");

      btn.addEventListener("click", function () {
        const isOpen = faqItem.classList.contains("is-open");

        list.querySelectorAll(".pd-faq-item.is-open").forEach(function (openItem) {
          if (openItem !== faqItem) {
            openItem.classList.remove("is-open");
            openItem.querySelector(".pd-faq-question").setAttribute("aria-expanded", "false");
            openItem.querySelector(".pd-faq-answer").style.maxHeight = "0px";
          }
        });

        if (isOpen) {
          faqItem.classList.remove("is-open");
          btn.setAttribute("aria-expanded", "false");
          answer.style.maxHeight = "0px";
        } else {
          faqItem.classList.add("is-open");
          btn.setAttribute("aria-expanded", "true");
          answer.style.maxHeight = answer.scrollHeight + "px";
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderPlans();
    renderTable();
    renderAddons();
    renderFaq();

    // script.js's own DOMContentLoaded handler runs first (it's loaded
    // first in the page) and wires up scroll-reveal + magnetic buttons
    // before this content exists. These two hooks let the newly
    // rendered elements opt into that same behavior.
    if (typeof window.__apventureObserveReveals === "function") {
      window.__apventureObserveReveals();
    }
    if (typeof window.__apventureInitMagnetic === "function") {
      window.__apventureInitMagnetic();
    }
  });
})();
