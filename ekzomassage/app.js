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
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) { booking.elements.phone.setCustomValidity('Введите телефон полностью'); booking.elements.phone.reportValidity(); return; }
  const message = `Здравствуйте! Хочу записаться на пробный сеанс ЭКЗОмассажа за 4 500 ₸.\nИмя: ${name}\nТелефон: ${phone}\nПодскажите удобное время.`;
  const url = 'https://wa.me/77079222080?text=' + encodeURIComponent(message);
  window.open(url, '_blank', 'noopener,noreferrer');
  const status = booking.querySelector('.form-status');
  status.textContent = 'Отправьте подготовленное сообщение в WhatsApp. ';
  const link = document.createElement('a');
  link.href = url; link.target = '_blank'; link.rel = 'noopener'; link.textContent = 'Открыть WhatsApp ↗';
  status.append(link);
});
booking.querySelectorAll('input').forEach(input => input.addEventListener('input', () => input.setCustomValidity('')));
