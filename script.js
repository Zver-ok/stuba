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
  const coreCount = Number(product.cores) || 3;
  const cores = Array.from({ length: Math.min(coreCount, 5) }, () => '<i></i>').join('');
  const href = `product/?product=${product.slug}`;
  return `<article class="product-card product-card--${coreCount}">
    <h3>${product.title}</h3>
    <div class="cable cable--${coreCount}" aria-hidden="true">${cores}</div>
    <p>Количество жил: ${product.cores}<br>Сечение: ${product.section} мм²<br>Номинальное напряжение: ${product.voltage}</p>
    <a href="${href}">Подробнее →</a>
  </article>`;
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
