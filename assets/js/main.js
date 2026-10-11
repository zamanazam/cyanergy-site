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

  const syncHeaderScroll = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  };

  syncHeaderScroll();
  window.addEventListener('scroll', syncHeaderScroll, { passive: true });

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

  const formatValue = (value, decimals, useComma) => {
    const fixed = value.toFixed(decimals);
    if (!useComma) return fixed;
    const [whole, fraction] = fixed.split('.');
    const withComma = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return fraction !== undefined ? `${withComma}.${fraction}` : withComma;
  };

  const animateCount = (el) => {
    const target = Number(el.dataset.count || 0);
    const decimals = Number(el.dataset.decimals || 0);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const useComma = el.dataset.format === 'comma';
    const duration = 1400;
    const start = performance.now();

    const render = (value) => {
      el.textContent = `${prefix}${formatValue(value, decimals, useComma)}${suffix}`;
    };

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      render(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
      else render(target);
    };

    render(0);
    requestAnimationFrame(tick);
  };

  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    if ('IntersectionObserver' in window) {
      const counterIo = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            animateCount(entry.target);
            counterIo.unobserve(entry.target);
          });
        },
        { threshold: 0.35 }
      );
      counters.forEach((el) => counterIo.observe(el));
    } else {
      counters.forEach((el) => animateCount(el));
    }
  }

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
