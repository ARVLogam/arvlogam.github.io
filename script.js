// ARV Logam – small UX helpers
(() => {
  const toggle = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-nav]');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('mobile');
      nav.style.display = nav.classList.contains('mobile') ? 'flex' : '';
    });
  }

  // Scroll reveal
  const items = Array.from(document.querySelectorAll('.reveal'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('show');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach(el => io.observe(el));

  // Update year in footer
  const y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();
})();
