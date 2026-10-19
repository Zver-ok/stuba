/* Shared controls: independent carousels on every equipment page. */
(() => {
 const reduced = matchMedia('(prefers-reduced-motion: reduce)');
 document.querySelectorAll('.carousel, [data-accessory-carousel]').forEach((section, index) => {
  const track = section.querySelector('.products, .accessory-track');
  if (!track || track.children.length < 2) {
   section.querySelectorAll('.carousel-arrow, [data-slide]').forEach(button => button.hidden = true);
   return;
  }
  const original = [...track.children];
  const dots = [...(section.nextElementSibling?.matches('.dots') ? section.nextElementSibling.children : [])];
  let position = 0;
  track.id ||= `equipment-carousel-${index}`;
  track.tabIndex = 0;
  track.setAttribute('aria-label', 'Карточки техники. Используйте стрелки влево и вправо');
  const buttons = [...section.querySelectorAll('.carousel-arrow, [data-slide]')];
  buttons.forEach(button => button.setAttribute('aria-controls', track.id));
  function mark(active) {
   dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === active);
    dot.setAttribute('aria-current', i === active ? 'true' : 'false');
   });
  }
  function fits() { return track.scrollWidth <= track.clientWidth + 3; }
  function move(direction) {
   if (fits()) {
    const width = track.firstElementChild.getBoundingClientRect().width + (parseFloat(getComputedStyle(track).columnGap) || 0);
    if (direction > 0) track.append(track.firstElementChild);
    else track.prepend(track.lastElementChild);
    position = (position + direction + original.length) % original.length;
    if (!reduced.matches) [...track.children].forEach(card => card.animate([
     { transform: `translateX(${direction * width}px)`, opacity: .5 },
     { transform: 'translateX(0)', opacity: 1 }
    ], { duration: 240, easing: 'ease-out' }));
    mark(position % Math.max(1, dots.length));
   } else {
    const range = track.scrollWidth - track.clientWidth;
    const step = track.firstElementChild.getBoundingClientRect().width + (parseFloat(getComputedStyle(track).columnGap) || 0);
    let left = track.scrollLeft + direction * step;
    if (direction > 0 && track.scrollLeft >= range - 3) left = 0;
    if (direction < 0 && track.scrollLeft <= 3) left = range;
    track.scrollTo({ left, behavior: reduced.matches ? 'instant' : 'smooth' });
   }
  }
  buttons.forEach(button => button.addEventListener('click', () => move(button.matches('.prev, [data-slide="prev"]') ? -1 : 1)));
  dots.forEach((dot, i) => dot.addEventListener('click', () => {
   if (fits()) {
    const target = i % original.length;
    original.slice(target).concat(original.slice(0, target)).forEach(card => track.append(card));
    position = target;
    mark(i);
   } else track.scrollTo({ left: (track.scrollWidth - track.clientWidth) * i / Math.max(1, dots.length - 1), behavior: reduced.matches ? 'instant' : 'smooth' });
  }));
  track.addEventListener('scroll', () => {
   if (!fits()) mark(Math.round(track.scrollLeft / (track.scrollWidth - track.clientWidth) * (dots.length - 1)));
  }, { passive: true });
  track.addEventListener('keydown', event => {
   if (event.target !== track || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
   event.preventDefault(); move(event.key === 'ArrowLeft' ? -1 : 1);
  });
  let start = null, dragged = false;
  track.addEventListener('pointerdown', event => {
   if (event.pointerType !== 'mouse' || event.button !== 0 || event.target.closest('button,input,select,textarea')) return;
   start = event.clientX; dragged = false;
  });
  track.addEventListener('pointermove', event => {
   if (start === null || Math.abs(event.clientX - start) < 40) return;
   move(event.clientX < start ? 1 : -1); start = null; dragged = true;
  });
  window.addEventListener('pointerup', () => start = null);
  track.addEventListener('dragstart', event => event.preventDefault());
  track.addEventListener('click', event => { if (dragged) { event.preventDefault(); event.stopPropagation(); dragged = false; } }, true);
  mark(0);
 });
})();
