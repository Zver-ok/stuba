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
