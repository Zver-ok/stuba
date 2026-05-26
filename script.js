function getTemplateUri() {
  return document.body.dataset.templateUri || '';
}

function normalizeProducts(data) {
  const base = getTemplateUri();
  return data.map((item) => ({
    ...item,
    image: item.image.startsWith('http') ? item.image : `${base}/${item.image.replace(/^\//, '')}`,
    description: item.description?.trim() || generateFallbackDescription(item)
  }));
}

function generateFallbackDescription(product) {
  const category = product.category ? `Категория: ${product.category.toLowerCase()}.` : 'Профессиональное оборудование для пищевого производства.';
  const model = product.model ? ` Модель ${product.model} рассчитана на стабильную ежедневную нагрузку.` : '';
  const power = product.power ? ` Мощность: ${product.power}.` : '';
  const capacity = product.capacity ? ` Производительность: ${product.capacity}.` : '';
  return `Надёжное решение для цехов и предприятий HoReCa.${model}${power}${capacity} ${category}`.trim();
}

function shortText(text, maxLength = 180) {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

function productCard(product) {
  return `
    <article class="card product-card" data-category="${product.category}">
      <img class="product-image" src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p class="article">Артикул: ${product.article}</p>
      <p class="price">Цена: уточняйте у менеджера</p>
	  <p class="desc">${shortText(product.description)}</p>
      <button class="btn product-btn" type="button" data-article="${product.article}">Подробнее</button>
    </article>`;
}

function buildSpecs(product) {
  const specs = [
    ['Модель', product.model],
    ['Мощность', product.power],
    ['Производительность', product.capacity],
    ['Размер', product.size],
    ['Вес', product.weight ? `${product.weight} кг` : '']
  ].filter(([, value]) => value && String(value).trim());

  if (!specs.length) return '<p class="modal-empty">Параметры не указаны.</p>';

  return `<ul class="specs modal-specs">${specs
    .map(([label, value]) => `<li><strong>${label}:</strong> ${value}</li>`)
    .join('')}</ul>`;
}

function renderCards(targetId, data) {
  const cards = document.getElementById(targetId);
  if (!cards) return;
  cards.innerHTML = data.map(productCard).join('');
}

function renderHomeCategories() {
  // отключено чтобы использовать HTML из index.php
}

function setupCatalogFilter(productsData) {
  const cards = document.getElementById('allProductCards');
  const category = document.getElementById('catalogCategoryFilter');
  const search = document.getElementById('catalogSearch');
  if (!cards || !category || !search) return;

  const categories = [...new Set(productsData.map((item) => item.category))];
  category.innerHTML = `<option value="all">Все категории</option>` + categories.map((c) => `<option value="${c}">${c}</option>`).join('');

  const applyFilter = () => {
    const selected = category.value;
    const q = search.value.trim().toLowerCase();
    const filtered = productsData.filter((item) => {
      const byCategory = selected === 'all' || item.category === selected;
      const byText = !q || `${item.name} ${item.model} ${item.article}`.toLowerCase().includes(q);
      return byCategory && byText;
    });
    renderCards('allProductCards', filtered);
  };

  category.addEventListener('change', applyFilter);
  search.addEventListener('input', applyFilter);
}

function setupProductModal(productsData) {
  const modal = document.getElementById('productModal');
  if (!modal) return;

  const body = document.body;
  const content = modal.querySelector('.product-modal-content');
  const closeButton = modal.querySelector('.product-modal-close');

  const close = () => {
    modal.classList.remove('is-open');
    body.classList.remove('modal-open');
    content.innerHTML = '';
  };

  closeButton.addEventListener('click', close);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) close();
  });

  document.addEventListener('click', (event) => {
    const btn = event.target.closest('.product-btn[data-article]');
    if (!btn) return;

    const article = btn.dataset.article;
    modal.classList.add('is-open');
    body.classList.add('modal-open');
    content.innerHTML = '<p class="modal-loading">Загружаем карточку…</p>';

    setTimeout(() => {
      const product = productsData.find((item) => item.article === article);
      if (!product) {
        content.innerHTML = '<p class="modal-empty">Товар не найден.</p>';
        return;
      }

      content.innerHTML = `
        <div class="product-modal-grid">
          <img class="product-modal-image" src="${product.image}" alt="${product.name}">
          <div>
            <h3>${product.name}</h3>
            <p class="article">Артикул: ${product.article}</p>
            <p class="price">Цена: уточняйте у менеджера</p>
			<p class="desc">${product.description}</p>
            ${buildSpecs(product)}
			            <a class="btn modal-order-btn" href="https://wa.me/74951234567" target="_blank" rel="noopener">Заказать</a>
            <p class="modal-whatsapp-note">в WhatsApp</p>
          </div>
        </div>`;
    }, 220);
  });
}

const normalizedProducts = normalizeProducts(products);
renderCards('productCards', normalizedProducts.slice(0, 9));
renderCards('allProductCards', normalizedProducts);
renderHomeCategories(normalizedProducts);
setupCatalogFilter(normalizedProducts);
setupProductModal(normalizedProducts);