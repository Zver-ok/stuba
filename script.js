const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.navigation');
menuButton.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(expanded));
  menuButton.setAttribute('aria-label', expanded ? 'Закрыть меню' : 'Открыть меню');
  navigation.classList.toggle('open', expanded);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));
const products = document.querySelector('.products');
const dots = [...document.querySelectorAll('.dots button')];
function scrollProducts(direction) {
  products.scrollBy({left: direction * (products.querySelector('.product').offsetWidth + 20), behavior: 'smooth'});
}
document.querySelector('.prev').addEventListener('click', () => scrollProducts(-1));
document.querySelector('.next').addEventListener('click', () => scrollProducts(1));
dots.forEach((dot, index) => dot.addEventListener('click', () => {
  const range = products.scrollWidth - products.clientWidth;
  products.scrollTo({left: range * index / (dots.length - 1), behavior: 'smooth'});
  if (!range) { dots.forEach(item => item.classList.remove('active')); dot.classList.add('active'); }
}));
products.addEventListener('scroll', () => {
  const range = products.scrollWidth - products.clientWidth;
  const index = range ? Math.round(products.scrollLeft / range * (dots.length - 1)) : 0;
  dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
});
const form = document.querySelector('.contact-form');
document.querySelectorAll('[data-model]').forEach(button => button.addEventListener('click', () => {
  form.elements.comment.value = `Интересует трактор ${button.dataset.model}`;
  document.querySelector('#consultation').scrollIntoView({behavior: 'smooth'});
  form.elements.name.focus({preventScroll: true});
}));
form.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(form); window.ATMMarketing?.track('atm_form_prepared',{form_context:'home'});
  const message = `Заявка с сайта АТМ YTO\nИмя: ${data.get('name')}\nТелефон: ${data.get('phone')}\nРегион: ${data.get('region')}\nКомментарий: ${data.get('comment') || '—'}`;
  const status = form.querySelector('.form-status');
  status.textContent = 'Заявка подготовлена. Отправьте сообщение в WhatsApp.';
  const link = document.createElement('a');
  link.href = `https://wa.me/77775550665?text=${encodeURIComponent(message)}`;
  link.target = '_blank'; link.rel = 'noopener'; link.textContent = 'Открыть WhatsApp →';
  link.style.color = '#ed0014'; link.style.display = 'block'; link.style.marginTop = '8px';
  status.append(link);
});
const dialog = document.querySelector('.info-dialog');
document.querySelector('.privacy-button')?.addEventListener('click', () => dialog.showModal());
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
if (window.lucide) window.lucide.createIcons();
