// Lightbox: click a tile to open it large; arrows / swipe to move, Esc to close.
(() => {
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
