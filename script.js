const toggle = document.querySelector('.nav__toggle');
const menu = document.querySelector('.nav__menu');

if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  menu.addEventListener('click', (event) => {
	  if (event.target instanceof HTMLAnchorElement) {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

function productCard(product) {

  const href = `product/?product=${product.slug}`;
  return `<article class="product-card">
    <a class="product-card__image" href="${href}" aria-label="Открыть ${product.title}">
      <img src="${product.images.card}" alt="${product.title}" loading="lazy">
    </a>
    <h3>${product.title}</h3>
    <p>Количество жил: ${product.cores}<br>Сечение: ${product.section} мм²<br>Номинальное напряжение: ${product.voltage}</p>
    <a href="${href}">Подробнее →</a>
  </article>`;
}

function applyProductHeroBackground(product) {
  const hero = document.querySelector('.product-hero');
  if (!hero || !product.images.background) return;

  hero.style.setProperty('--product-hero-bg-image', `url("${product.images.background}")`);
}


function initCatalogTabs() {
  const tabs = document.querySelectorAll('[data-catalog-tab]');
  const grid = document.querySelector('[data-product-grid]');
  if (!tabs.length || !grid || !window.cableProducts) return;

  const render = (category) => {
    grid.innerHTML = window.cableProducts
      .filter((product) => product.category === category)
      .map(productCard)
      .join('');
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((item) => item.classList.remove('is-active'));
      tab.classList.add('is-active');
      render(tab.dataset.catalogTab);
    });
  });

  render(document.querySelector('[data-catalog-tab].is-active')?.dataset.catalogTab || tabs[0].dataset.catalogTab);
}

function initProductPage() {
  const root = document.querySelector('[data-product-page]');
  if (!root || !window.cableProducts) return;
  const params = new URLSearchParams(window.location.search);
  const product = window.cableProducts.find((item) => item.slug === params.get('product')) || window.cableProducts.find((item) => item.title === 'ВВГ 3x2,5');
  document.title = `${product.title} — купить кабель ВВГ`;
  document.querySelectorAll('[data-product-title]').forEach((item) => { item.textContent = product.title; });
  document.querySelectorAll('[data-product-purpose]').forEach((item) => { item.textContent = product.purpose; });
	  applyProductHeroBackground(product);
	document.querySelector('[data-product-specs]').innerHTML = [
    ['Марка кабеля', product.category], ['Количество жил', product.cores], ['Сечение', `${product.section} мм²`],
    ['Материал жилы', product.conductor], ['Изоляция жил', product.insulation], ['Оболочка', product.shell],
    ['Номинальное напряжение', product.voltage], ['Температура эксплуатации', product.temperature], ['Стандарт', product.standard],
  ].map(([key, value]) => `<tr><th>${key}</th><td>${value}</td></tr>`).join('');
  const popular = window.cableProducts.filter((item) => item.category === 'ВВГ').slice(6, 11);
  document.querySelector('[data-popular-products]').innerHTML = popular.map(productCard).join('');
}

initCatalogTabs();
initProductPage();
