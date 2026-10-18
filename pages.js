const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.navigation');
menuButton?.addEventListener('click', () => {
 const open = menuButton.getAttribute('aria-expanded') !== 'true';
 menuButton.setAttribute('aria-expanded', String(open));
 menuButton.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
 nav?.classList.toggle('open', open);
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {nav.classList.remove('open'); menuButton.setAttribute('aria-expanded','false');}));
const dialog = document.querySelector('.info-dialog');
document.querySelector('.privacy-button')?.addEventListener('click', () => dialog?.showModal());
document.querySelector('.dialog-close')?.addEventListener('click', () => dialog?.close());
dialog?.addEventListener('click', event => {if (event.target === dialog) dialog.close();});
const ui = window.YTO_UI;
const grid = document.querySelector('.catalog-grid');
if (grid && ui) {
 grid.innerHTML = ui.catalog.models.map(model => ui.card(model, true)).join('');
 const cards = [...grid.children];
 const search = document.querySelector('#model-search');
 const power = document.querySelector('#power-filter');
 const sort = document.querySelector('#sort-models');
 const ac = document.querySelector('#ac-filter');
 function update() {
  const kind = document.querySelector('input[name="kind"]:checked').value;
  const query = search.value.trim().toLowerCase().replace(/[\s-]/g, '');
  let count = 0;
  cards.forEach(card => {
   const hp = Number(card.dataset.power);
   const matchesPower = power.value === 'all' || (power.value === 'low' && hp <= 60) || (power.value === 'medium' && hp > 60 && hp <= 90) || (power.value === 'high' && hp > 90 && hp <= 180) || (power.value === 'extra' && hp > 180);
   const show = card.dataset.name.toLowerCase().replace(/[\s-]/g, '').includes(query) && (kind === 'all' || card.dataset.kind === kind) && matchesPower && (ac.value === 'all' || card.dataset.ac === ac.value);
   card.hidden = !show; if (show) count++;
  });
  const ordered = [...cards];
  if (sort.value === 'power-up') ordered.sort((a,b) => Number(a.dataset.power)-Number(b.dataset.power));
  if (sort.value === 'power-down') ordered.sort((a,b) => Number(b.dataset.power)-Number(a.dataset.power));
  if (sort.value === 'name') ordered.sort((a,b) => a.dataset.name.localeCompare(b.dataset.name));
  ordered.forEach(card => grid.append(card));
  document.querySelector('#result-count').textContent = `Найдено моделей: ${count}`;
  document.querySelector('.empty-results').hidden = count !== 0;
 }
 function reset() {search.value=''; power.value='all'; sort.value='default'; ac.value='all'; document.querySelector('input[name="kind"][value="all"]').checked=true; update();}
 search.addEventListener('input', update);
 [power,sort,ac].forEach(input => input.addEventListener('change', update));
 document.querySelectorAll('input[name="kind"]').forEach(input => input.addEventListener('change', update));
 document.querySelector('#reset-filters').addEventListener('click', reset);
 document.querySelector('#empty-reset').addEventListener('click', reset);
 update();
 const selected = new Set();
 const bar = document.querySelector('.compare-bar');
 const status = document.querySelector('#compare-status');
 function sync() {
  grid.querySelectorAll('[data-compare]').forEach(input => input.checked=selected.has(input.dataset.compare));
  bar.hidden = selected.size === 0;
  document.querySelector('#compare-count').textContent = selected.size;
  document.querySelector('#compare-open').disabled = selected.size < 2;
 }
 grid.addEventListener('change', event => {
  const input = event.target.closest('[data-compare]'); if (!input) return;
  const id = input.dataset.compare;
  if (input.checked && selected.size >= 3) {input.checked=false; status.textContent='Можно сравнить до трёх моделей одновременно.'; return;}
  if (input.checked) selected.add(id); else selected.delete(id);
  status.textContent=''; sync();
 });
 document.querySelector('#compare-clear').addEventListener('click', () => {selected.clear(); status.textContent=''; sync();});
 const comparison = document.querySelector('#compare-dialog');
 document.querySelector('#compare-close').addEventListener('click', () => comparison.close());
 document.querySelector('#compare-open').addEventListener('click', () => {
  const models=ui.catalog.models.filter(model => selected.has(model.id));
  const rows=[['Мощность, л.с.',model=>model.power],['Двигатель',model=>model.engine || 'Уточнить'],['Объём, см³',model=>model.displacement],['Передачи вперёд + назад',model=>model.gears],['Гидравлические выходы, пар',model=>model.hydraulicPairs],['Подъёмная сила на 610 мм, кН',model=>model.lift],['Бак, л',model=>model.tank],['Масса по каталогу, кг',model=>model.mass],['Кондиционер',model=>model.airConditioning?'Есть':'Нет']];
  comparison.querySelector('.comparison-content').innerHTML=`<div class="comparison-scroll"><table><thead><tr><th>Параметр</th>${models.map(model=>`<th><a href="${ui.productUrl(model)}">${ui.escape(model.name)}</a></th>`).join('')}</tr></thead><tbody>${rows.map(([label,get])=>`<tr><th>${label}</th>${models.map(model=>`<td>${ui.escape(get(model))}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p class="source-caption">Данные каталога от ${ui.catalog.edition}. Комплектацию и наличие уточните у менеджера.</p>`;
  comparison.showModal();
 });
}
const productPage = document.querySelector('.product-page');
if (productPage && ui) {
 const requested = new URLSearchParams(location.search).get('model');
 const model = ui.catalog.models.find(model => model.id === (requested || 'NMF804-8').toUpperCase());
 if (!model) {
  document.title='Модель не найдена — АТМ';
  productPage.innerHTML='<section class="container unknown-model"><h1>Модель не найдена</h1><p>Проверьте название или выберите трактор из актуального каталога.</p><a class="button" href="/catalog/">Открыть каталог →</a></section>';
 } else {
  const name=model.name;
  document.title=`${name} — характеристики, комплектация и цена по запросу | АТМ`;
  document.querySelectorAll('[data-model-name]').forEach(el => el.textContent=name);
  document.querySelectorAll('[data-model-power]').forEach(el => el.textContent=model.power);
  document.querySelectorAll('[data-model-gears]').forEach(el => el.textContent=model.gears);
  document.querySelector('.detail-lead').textContent=model.lead;
  document.querySelector('.detail-description').textContent=model.description;
  document.querySelectorAll('.model-whatsapp').forEach(link => link.href=ui.whatsapp(model));
  const image = document.querySelector('#main-product-image'); image.src=ui.asset(model.image); image.alt=`${name} — место для фотографии`;
  const thumbs=document.querySelector('.gallery-thumbs'); const pictures=[model.image,...model.gallery];
  thumbs.hidden=pictures.length<2;
  thumbs.innerHTML=pictures.map((path,index)=>`<button class="${index===0?'active':''}" aria-label="Фото ${index+1}" aria-pressed="${index===0}"><img src="${ui.asset(path)}" alt="${ui.escape(name)}: фото ${index+1}"></button>`).join('');
  thumbs.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{image.src=button.querySelector('img').src;thumbs.querySelectorAll('button').forEach(item=>{item.classList.toggle('active',item===button);item.setAttribute('aria-pressed',String(item===button));});}));
  document.querySelector('.specification-groups').innerHTML=Object.entries(model.specs).map(([title,rows],index)=>`<details ${index===0?'open':''}><summary>${ui.escape(title)}</summary><dl class="specification-table">${rows.map(([key,value])=>`<div><dt>${ui.escape(key)}</dt><dd>${ui.escape(value)}</dd></div>`).join('')}</dl></details>`).join('');
  document.querySelector('.model-notes').innerHTML=model.notes.map(note=>`<p>${ui.escape(note)}</p>`).join('');
  document.querySelector('.model-notes').hidden=model.notes.length===0;
  document.querySelector('.model-source').textContent=`Источник: каталог YTO от ${ui.catalog.edition}, стр. ${model.sourcePage}. Комплектацию подтвердите перед заказом.`;
const pdfLink = document.querySelector('.model-pdf');
if (pdfLink && ui.catalog.pdf) {
  pdfLink.href = ui.asset(ui.catalog.pdf) + `#page=${model.pdfPage}`;
}  const alternatives=ui.catalog.models.filter(other=>other.id!==model.id).sort((a,b)=>Math.abs(a.power-model.power)-Math.abs(b.power-model.power)).slice(0,3);
  document.querySelector('.related-grid').innerHTML=alternatives.map(other=>ui.card(other)).join('');
  const form=document.querySelector('.product-inquiry');
  form.addEventListener('submit', event => {
   event.preventDefault(); const data=new FormData(form); window.ATMMarketing?.track('atm_form_prepared',{form_context:'product'});
   const message=`Здравствуйте! Интересует ${name}.\nИмя: ${data.get('name')}\nТелефон: ${data.get('phone')}\nЗадачи: ${data.get('task') || 'Хочу получить консультацию'}`;
   const status=form.querySelector('.inquiry-status'); status.textContent='Заявка подготовлена. Откройте WhatsApp и отправьте сообщение менеджеру.';
   const link=document.createElement('a');link.href=`https://wa.me/77775550665?text=${encodeURIComponent(message)}`;link.target='_blank';link.rel='noopener';link.textContent='Отправить в WhatsApp →';status.append(link);
  });
 }
}
