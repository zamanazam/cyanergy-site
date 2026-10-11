(() => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const reveals = document.querySelectorAll('.reveal');

  const setMenuOpen = (open) => {
    if (!toggle || !nav) return;
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    header?.classList.toggle('is-menu-open', open);
    document.body.classList.toggle('menu-open', open);
  };

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      setMenuOpen(!nav.classList.contains('is-open'));
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMenuOpen(false));
    });

    header?.addEventListener('click', (event) => {
      if (event.target === header) setMenuOpen(false);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 980) setMenuOpen(false);
    });
  }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  window.setTimeout(() => {
    document.querySelectorAll('.hero .eyebrow-hero, .hero h1, .hero-lead, .hero .btn-group, .hero-float').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }, 1200);

  document.querySelectorAll('[data-demo-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const note = form.querySelector('[data-form-status]');
      if (note) {
        note.textContent = 'Thanks — this is a design preview. Form submission will be wired after client approval.';
      }
      form.reset();
    });
  });
})();
