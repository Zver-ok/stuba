const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.navigation');
menuButton?.addEventListener('click', () => {
 const open = menuButton.getAttribute('aria-expanded') !== 'true';
 menuButton.setAttribute('aria-expanded', String(open));
 menuButton.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
 nav.classList.toggle('open', open);
});
const dialog = document.querySelector('.info-dialog');
document.querySelector('.privacy-button')?.addEventListener('click', () => dialog.showModal());
document.querySelector('.dialog-close')?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', event => {if (event.target === dialog) dialog.close();});
const grid = document.querySelector('.catalog-grid');
if (grid) {
 const cards = [...grid.children];
 const search = document.querySelector('#model-search');
 const power = document.querySelector('#power-filter');
 const sort = document.querySelector('#sort-models');
 function update() {
  const kind = document.querySelector('input[name="kind"]:checked').value;
  const query = search.value.trim().toLowerCase().replace(/[\s-]/g, '');
  let count = 0;
  cards.forEach(card => {
   const hp = Number(card.dataset.power);
   const matchesPower = power.value === 'all' || (power.value === 'low' && hp <= 60) || (power.value === 'medium' && hp > 60 && hp <= 90) || (power.value === 'high' && hp >= 91);
   const show = card.dataset.name.toLowerCase().replace(/[\s-]/g, '').includes(query) && (kind === 'all' || card.dataset.kind === kind) && matchesPower;
   card.hidden = !show; if (show) count++;
  });
  const ordered = [...cards];
  if (sort.value === 'price-up') ordered.sort((a,b) => Number(a.dataset.price)-Number(b.dataset.price));
  if (sort.value === 'price-down') ordered.sort((a,b) => Number(b.dataset.price)-Number(a.dataset.price));
  if (sort.value === 'power') ordered.sort((a,b) => Number(b.dataset.power)-Number(a.dataset.power));
  ordered.forEach(card => grid.append(card));
  document.querySelector('#result-count').textContent = `Найдено моделей: ${count}`;
  document.querySelector('.empty-results').hidden = count !== 0;
 }
 function reset() {
  search.value=''; power.value='all'; sort.value='default';
  document.querySelector('input[name="kind"][value="all"]').checked=true; update();
 }
 search.addEventListener('input', update);
 power.addEventListener('change', update); sort.addEventListener('change', update);
 document.querySelectorAll('input[name="kind"]').forEach(input => input.addEventListener('change', update));
 document.querySelector('#reset-filters').addEventListener('click', reset);
 document.querySelector('#empty-reset').addEventListener('click', reset);
 update();
}
const productPage = document.querySelector('.product-page');
if (productPage) {
 const models = {X804:[80,'14 900 000'],NMF604:[60,'12 800 000'],NME504:[50,'11 900 000'],ME404:[40,'10 500 000'],X904:[90,'16 200 000'],X1204:[120,'21 800 000']};
 const requested = new URLSearchParams(location.search).get('model');
 const model = Object.hasOwn(models, requested) ? requested : 'X804';
 const [power, price] = models[model];
 const name = `YTO-${model}`;
 document.title = `${name} — характеристики и предложение | АТМ`;
 document.querySelectorAll('[data-model-name]').forEach(el => el.textContent=name);
 document.querySelectorAll('[data-model-power]').forEach(el => el.textContent=power);
 document.querySelectorAll('[data-model-price]').forEach(el => el.textContent=price);
 document.querySelectorAll('.model-whatsapp').forEach(link => {link.href=`https://wa.me/77775550665?text=${encodeURIComponent(`Здравствуйте! Интересует ${name}. Подскажите актуальную цену, наличие и комплектацию.`)}`;});
 const image = document.querySelector('#main-product-image'); image.alt = `Трактор ${name}`;
 document.querySelectorAll('.gallery-thumbs button').forEach(button => button.addEventListener('click', () => {
  image.src=button.querySelector('img').src;
  document.querySelectorAll('.gallery-thumbs button').forEach(item => {
   item.classList.toggle('active',item===button); item.setAttribute('aria-pressed',String(item===button));
  });
 }));
 const form=document.querySelector('.product-inquiry');
 form.addEventListener('submit', event => {
  event.preventDefault();
  const data=new FormData(form);
  const message=`Здравствуйте! Интересует трактор ${name}.\nИмя: ${data.get('name')}\nТелефон: ${data.get('phone')}\nЗадачи: ${data.get('task') || 'Хочу получить консультацию'}`;
  const status=form.querySelector('.inquiry-status');
  status.textContent='Заявка подготовлена. Перейдите в WhatsApp и отправьте сообщение менеджеру.';
  const link=document.createElement('a'); link.href=`https://wa.me/77775550665?text=${encodeURIComponent(message)}`;
  link.target='_blank'; link.rel='noopener'; link.textContent='Отправить в WhatsApp ↗'; status.append(link);
 });
}
