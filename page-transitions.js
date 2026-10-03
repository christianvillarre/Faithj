
(() => {
  const curtain = document.querySelector('.page-curtain, .page-wipe');
  if (!curtain) return;
  let navigating = false;

  if (document.documentElement.classList.contains('curtain-arrival')) {
    const loader = document.querySelector('.loader');
    if (loader) loader.style.display = 'none';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      curtain.classList.add('is-revealing');
      document.documentElement.classList.remove('curtain-arrival');
      curtain.addEventListener('transitionend', () => curtain.classList.remove('is-revealing'), { once: true });
    }));
  }

  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return;
    navigating = false;
    curtain.classList.remove('is-active', 'is-revealing');
    document.documentElement.classList.remove('curtain-arrival');
  });

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || navigating) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if ((link.target && link.target !== '_self') || link.hasAttribute('download')) return;
    const rawHref = link.getAttribute('href');
    if (!rawHref || rawHref.startsWith('#') || /^(mailto:|tel:|javascript:)/i.test(rawHref)) return;
    const destination = new URL(link.href, location.href);
    if (destination.origin !== location.origin) return;
    if (destination.pathname === location.pathname && destination.search === location.search) return;

    event.preventDefault();
    navigating = true;
    curtain.classList.remove('is-revealing');
    curtain.classList.add('is-active');
    try {
      if (!/^\/$|^\/index\.html$/.test(destination.pathname)) {
        sessionStorage.setItem('faithj-page-transition', '1');
      }
    } catch (_) {}
    let didNavigate = false;
    const go = () => {
      if (didNavigate) return;
      didNavigate = true;
      location.href = destination.href;
    };
    curtain.addEventListener('transitionend', go, { once: true });
    setTimeout(go, 670);
  }, true);
})();
