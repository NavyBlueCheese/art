// Lightbox: click a tile to open it large; arrows / swipe to move, Esc to close.
(() => {
  document.documentElement.classList.add('js');

  // header hairline after scrolling
  const top = document.querySelector('.top');
  const onScroll = () => top.classList.toggle('scrolled', window.scrollY > 10);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // fade tiles in as they reach the viewport
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((es) => {
    es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px' }) : null;
  document.querySelectorAll('.gallery .tile').forEach(t => io ? io.observe(t) : t.classList.add('in'));

  const tiles = [...document.querySelectorAll('a.tile')].sort((a, b) => a.dataset.i - b.dataset.i);
  const box = document.querySelector('.lightbox');
  if (!box || !box.showModal) return;              // very old browser: links just open the image
  const img = box.querySelector('img');
  const count = box.querySelector('.lb-count');
  let cur = 0;

  const show = (i) => {
    cur = (i + tiles.length) % tiles.length;
    const t = tiles[cur];
    img.src = t.href;
    img.alt = t.querySelector('img').alt;
    count.textContent = `${cur + 1} / ${tiles.length}`;
    // warm the cache for the neighbours
    [cur + 1, cur - 1].forEach(j => { const n = tiles[(j + tiles.length) % tiles.length]; new Image().src = n.href; });
  };

  tiles.forEach((t, i) => t.addEventListener('click', (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;  // let people open in a new tab
    e.preventDefault(); show(i); box.showModal();
  }));

  // the small picture on the cover opens the matching gallery piece
  document.querySelectorAll('[data-open]').forEach(a => a.addEventListener('click', (e) => {
    const i = tiles.findIndex(t => t.dataset.i === a.dataset.open);
    if (i < 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault(); show(i); box.showModal();
  }));

  box.querySelector('.lb-close').onclick = () => box.close();
  box.querySelector('.lb-prev').onclick = () => show(cur - 1);
  box.querySelector('.lb-next').onclick = () => show(cur + 1);
  box.addEventListener('click', (e) => { if (e.target === box) box.close(); });
  box.addEventListener('close', () => { img.removeAttribute('src'); tiles[cur].focus(); });
  document.addEventListener('keydown', (e) => {
    if (!box.open) return;
    if (e.key === 'ArrowRight') show(cur + 1);
    if (e.key === 'ArrowLeft') show(cur - 1);
  });

  let x0 = null;
  box.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1));
    x0 = null;
  });
})();
