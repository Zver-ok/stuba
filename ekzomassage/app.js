const menu = document.querySelector('.menu');
const nav = document.querySelector('.header nav');
function closeMenu() {
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Открыть меню');
}
menu.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
document.querySelectorAll('.book').forEach(link => {
  link.href = 'https://wa.me/77079222080?text=' + encodeURIComponent('Здравствуйте! Хочу записаться: ' + link.dataset.service + '. Подскажите свободное время.');
});

const booking = document.querySelector('#booking');
booking.addEventListener('submit', event => {
  event.preventDefault();
  const name = booking.elements.name.value.trim();
  const phone = booking.elements.phone.value.trim();
  if (!name) { booking.elements.name.setCustomValidity('Введите ваше имя'); booking.elements.name.reportValidity(); return; }
  const health = booking.elements.health.value.trim();
  if (!health) { booking.elements.health.setCustomValidity('Заполните поле «Что беспокоит по здоровью?»'); booking.elements.health.reportValidity(); return; }
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) { booking.elements.phone.setCustomValidity('Введите телефон полностью'); booking.elements.phone.reportValidity(); return; }
  const message = `Здравствуйте! Хочу записаться на пробный сеанс ЭКЗОмассажа за 4 500 ₸.\nИмя: ${name}\nТелефон: ${phone}\nЧто беспокоит по здоровью: ${health}\nПодскажите удобное время.`;
  const url = 'https://wa.me/77079222080?text=' + encodeURIComponent(message);
  window.open(url, '_blank', 'noopener,noreferrer');
  const status = booking.querySelector('.form-status');
  status.textContent = 'Отправьте подготовленное сообщение в WhatsApp. ';
  const link = document.createElement('a');
  link.href = url; link.target = '_blank'; link.rel = 'noopener'; link.textContent = 'Открыть WhatsApp ↗';
  status.append(link);
});
booking.querySelectorAll('input, textarea').forEach(input => input.addEventListener('input', () => input.setCustomValidity('')));

// Portrait gallery: edit the photo/video list in media-config.js.
(() => {
 const track = document.querySelector('#media-track');
 if (!track) return;
 const base = new URL('.', document.currentScript.src);
 const asset = path => new URL(path, base).href;
 const status = document.querySelector('.gallery-status');
 const viewer = document.querySelector('.photo-viewer');
 const close = () => viewer.close();
 viewer.querySelector('.photo-close').addEventListener('click', close);
 viewer.addEventListener('click', event => { if (event.target === viewer) close(); });
 let opener;
 viewer.addEventListener('close', () => { document.documentElement.style.overflow = ''; opener?.focus({preventScroll:true}); });
 const entries = Array.isArray(window.EXOMedia) ? window.EXOMedia : [];
 entries.forEach((item, i) => {
  const card = document.createElement('article'); card.className = 'media-card';
  const frame = document.createElement('div'); frame.className = 'media-frame';
  const isVideo = item.type === 'video';
  if (isVideo && item.src) {
   const video = document.createElement('video');
   video.src = asset(item.src); video.controls = true; video.playsInline = true; video.preload = 'none';
   if (item.poster) video.poster = asset(item.poster);
   video.setAttribute('aria-label', item.title || 'Видео о центре');
   video.addEventListener('play', () => track.querySelectorAll('video').forEach(other => {if(other !== video) other.pause();}));
   frame.append(video);
  } else {
   const image = document.createElement('img'); image.src = asset(isVideo ? item.poster : item.src); image.alt = item.title || 'Фото центра'; image.loading = 'lazy';
   if (!isVideo) {
    const button = document.createElement('button'); button.type='button'; button.className='media-photo';button.setAttribute('aria-label','Открыть фото: '+image.alt);
    button.append(image);button.addEventListener('click',()=>{opener=button;viewer.querySelector('img').src=image.src;viewer.querySelector('img').alt=image.alt;viewer.querySelector('p').textContent=item.title||'';viewer.showModal();document.documentElement.style.overflow='hidden';});
    frame.append(button); const zoom=document.createElement('span');zoom.className='media-zoom';zoom.textContent='+';zoom.setAttribute('aria-hidden','true');frame.append(zoom);
   } else {
    frame.append(image);const pending=document.createElement('div');pending.className='video-pending';
    const icon=document.createElement('span');icon.className='play-icon';icon.textContent='▷';icon.setAttribute('aria-hidden','true');
    const text=document.createElement('span');text.textContent=item.caption||'Видео скоро появится';pending.append(icon,text);frame.append(pending);
   }
  }
  const badge=document.createElement('span');badge.className='media-badge';badge.textContent=isVideo?'Видео':'Фото';frame.append(badge);
  const title=document.createElement('h3');title.textContent=item.title||`Материал ${i+1}`;
  const caption=document.createElement('p');caption.textContent=isVideo&&!item.src?'':item.caption||'';
  card.append(frame,title,caption);track.append(card);
 });
 const prev=document.querySelector('[data-gallery-prev]'),next=document.querySelector('[data-gallery-next]');
 function update(){const range=track.scrollWidth-track.clientWidth;prev.disabled=track.scrollLeft<3;next.disabled=track.scrollLeft>=range-3;const step=(track.firstElementChild?.getBoundingClientRect().width||1)+(parseFloat(getComputedStyle(track).columnGap)||0);status.textContent=entries.length?`Материал ${Math.min(entries.length,Math.round(track.scrollLeft/step)+1)} из ${entries.length}`:'Галерея скоро появится';}
 const move=direction=>track.scrollBy({left:direction*((track.firstElementChild?.getBoundingClientRect().width||260)+(parseFloat(getComputedStyle(track).columnGap)||0)),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));
 track.addEventListener('scroll',update,{passive:true});new ResizeObserver(update).observe(track);
 track.addEventListener('keydown',event=>{if(event.target===track&&['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();move(event.key==='ArrowRight'?1:-1);}});
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)entry.target.pause();}));track.querySelectorAll('video').forEach(video=>observer.observe(video));
 document.addEventListener('visibilitychange',()=>{if(document.hidden)track.querySelectorAll('video').forEach(video=>video.pause());});
 update();
})();
