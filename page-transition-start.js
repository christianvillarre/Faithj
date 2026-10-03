
/* Set the arrival state before the page paints. The homepage keeps its own loader. */
try {
  const arriving = sessionStorage.getItem('faithj-page-transition') === '1';
  sessionStorage.removeItem('faithj-page-transition');
  if (!/^\/$|^\/index\.html$/.test(location.pathname) && arriving) {
    document.documentElement.classList.add('curtain-arrival');
  }
} catch (_) {}
