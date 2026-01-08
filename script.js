// ARV Logam — Interactive behaviors (hamburger + reveal + slider)
(() => {
  // Footer year
  const year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();

  // Hamburger menu (accessible)
  const menuBtn = document.querySelector("[data-menu-btn]");
  const nav = document.querySelector("[data-nav]");
  const header = document.querySelector("[data-header]");

  const closeMenu = () => {
    if (!nav || !menuBtn) return;
    nav.classList.remove("mobile");
    nav.style.display = "";
    menuBtn.setAttribute("aria-expanded", "false");
  };

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      const open = nav.classList.toggle("mobile");
      nav.style.display = open ? "flex" : "";
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!nav.classList.contains("mobile")) return;
      const inside = nav.contains(e.target) || menuBtn.contains(e.target);
      if (!inside) closeMenu();
    });

    // Close when clicking a link
    nav.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (a && nav.classList.contains("mobile")) closeMenu();
    });

    // Close on Esc
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    // Close when resizing up
    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) closeMenu();
    });
  }

  // Scroll reveal
  const items = Array.from(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add("show"));
  }

  // Product slider
  const slider = document.querySelector("[data-slider]");
  if (!slider) return;

  const track = slider.querySelector("[data-track]");
  const prev = slider.querySelector("[data-prev]");
  const next = slider.querySelector("[data-next]");
  const dotsWrap = slider.querySelector("[data-dots]");

  if (!track) return;

  const cards = Array.from(track.querySelectorAll(".productCard"));

  // Build dots (one per card)
  const dots = cards.map((_, i) => {
    const d = document.createElement("button");
    d.className = "dot";
    d.type = "button";
    d.setAttribute("aria-label", `Slide ${i + 1}`);
    d.addEventListener("click", () => scrollToIndex(i));
    dotsWrap && dotsWrap.appendChild(d);
    return d;
  });

  const getCardWidth = () => {
    const card = cards[0];
    if (!card) return 300;
    const rect = card.getBoundingClientRect();
    // include gap
    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap || "0") || 0;
    return rect.width + gap;
  };

  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  let active = 0;

  function updateDots(idx) {
    active = clamp(idx, 0, cards.length - 1);
    dots.forEach((d, i) => d.classList.toggle("active", i === active));
  }

  function scrollToIndex(idx) {
    const w = getCardWidth();
    track.scrollTo({ left: w * idx, behavior: "smooth" });
  }

  // Prev/next
  prev && prev.addEventListener("click", () => scrollToIndex(active - 1));
  next && next.addEventListener("click", () => scrollToIndex(active + 1));

  // Set active on scroll (snap-aware)
  let raf = 0;
  track.addEventListener(
    "scroll",
    () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const w = getCardWidth();
        const idx = Math.round(track.scrollLeft / w);
        updateDots(idx);
      });
    },
    { passive: true }
  );

  // Keyboard support on track
  track.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollToIndex(active + 1);
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollToIndex(active - 1);
    }
    if (e.key === "Home") {
      e.preventDefault();
      scrollToIndex(0);
    }
    if (e.key === "End") {
      e.preventDefault();
      scrollToIndex(cards.length - 1);
    }
  });

  // Drag to scroll (mouse)
  let isDown = false;
  let startX = 0;
  let startLeft = 0;

  track.addEventListener("mousedown", (e) => {
    isDown = true;
    startX = e.pageX;
    startLeft = track.scrollLeft;
    track.style.cursor = "grabbing";
  });
  window.addEventListener("mouseup", () => {
    isDown = false;
    track.style.cursor = "";
  });
  track.addEventListener("mouseleave", () => {
    isDown = false;
    track.style.cursor = "";
  });
  track.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const dx = e.pageX - startX;
    track.scrollLeft = startLeft - dx;
  });

  // Init
  updateDots(0);
})();
