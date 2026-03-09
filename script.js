// ARV Logam – small UX helpers
(() => {
  const toggle = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-nav]");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("mobile");
      nav.style.display = nav.classList.contains("mobile") ? "flex" : "";
    });
  }

  // Scroll reveal
  const items = Array.from(document.querySelectorAll(".reveal"));
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("show");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  items.forEach((el) => io.observe(el));

  // Update year in footer
  const y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();
})();

// ── Pricelist Harga Beli dari Backend UMGAP ──
(function () {
  // ⚠️  GANTI URL INI dengan URL backend kamu di Render/Railway/VPS
  var BACKEND = "https://umgap.onrender.com";

  var MAT_CONFIG = {
    Tembaga: { icon: "🟤", bg: "rgba(184,135,51,.12)", dot: "#b87333" },
    Kuningan: { icon: "🟡", bg: "rgba(184,134,11,.1)", dot: "#b8860b" },
    Aluminium: { icon: "⚪", bg: "rgba(107,114,128,.09)", dot: "#9aa5b4" },
    Stainless: { icon: "🔘", bg: "rgba(96,125,139,.1)", dot: "#607d8b" },
    "Timah & Aki": { icon: "🟣", bg: "rgba(99,102,241,.09)", dot: "#6366f1" },
  };

  function rp(p) {
    var n = parseFloat(p) || 0;
    if (!n) return null;
    var parts = n.toFixed(1).split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return "Rp " + (parts[1] === "0" ? parts[0] : parts.join(","));
  }
  function esc(s) {
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function renderPricelist(data) {
    var groups = data.groups || [];
    if (!groups.length) {
      throw new Error("empty");
    }

    var maxDate = "";
    groups.forEach(function (g) {
      g.items.forEach(function (it) {
        if (it.updated_at && it.updated_at > maxDate) maxDate = it.updated_at;
      });
    });

    var html = "";
    groups.forEach(function (g) {
      var cfg = MAT_CONFIG[g.material] || {
        icon: "📦",
        bg: "rgba(15,23,42,.06)",
        dot: "#6b7280",
      };
      html += '<div class="pl-group">';
      html += '<div class="pl-mat-hd">';
      html +=
        '<div class="pl-mat-icon" style="background:' +
        cfg.bg +
        '">' +
        cfg.icon +
        "</div>";
      html += '<div><div class="pl-mat-name">' + esc(g.material) + "</div>";
      html +=
        '<div class="pl-mat-sub">' +
        g.items.length +
        " jenis barang</div></div>";
      html += "</div>";
      html += '<div class="pl-items">';
      g.items.forEach(function (it) {
        var price = rp(it.price);
        html += '<div class="pl-item reveal">';
        html += '<div class="pl-grade">' + esc(it.grade || "—") + "</div>";
        html += '<div class="pl-price-row">';
        if (price) {
          html += '<div class="pl-price">' + price + "</div>";
          html += '<div class="pl-unit">/ ' + esc(it.unit || "kg") + "</div>";
        } else {
          html += '<div class="pl-price zero">Hubungi kami</div>';
        }
        html += "</div>";
        if (it.note) html += '<div class="pl-note">' + esc(it.note) + "</div>";
        html += "</div>";
      });
      html += "</div></div>";
    });

    document.getElementById("pricelistLoading").style.display = "none";
    var content = document.getElementById("pricelistContent");
    content.innerHTML = html;
    content.style.display = "block";

    if (maxDate) {
      var badge = document.getElementById("plUpdatedBadge");
      badge.style.display = "block";
      document.getElementById("plUpdatedTxt").textContent =
        "🕐 Harga terakhir diperbarui: " + maxDate;
    }

    // apply reveal to new cards
    var io2 = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("show");
            io2.unobserve(e.target);
          }
        });
      },
      { threshold: 0.06 },
    );
    content.querySelectorAll(".reveal").forEach(function (el) {
      io2.observe(el);
    });
  }

  function showError() {
    document.getElementById("pricelistLoading").style.display = "none";
    document.getElementById("pricelistError").style.display = "block";
  }

  // Try relative URL first (same domain), then absolute backend URL
  fetch("/api/buy-prices", { headers: { Accept: "application/json" } })
    .then(function (r) {
      if (!r.ok) throw new Error("status:" + r.status);
      return r.json();
    })
    .catch(function () {
      return fetch(BACKEND + "/api/buy-prices", {
        headers: { Accept: "application/json" },
      }).then(function (r) {
        return r.json();
      });
    })
    .then(function (data) {
      if (!data || !data.ok) throw new Error("bad response");
      renderPricelist(data);
    })
    .catch(function () {
      showError();
    });
})();
