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

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatPrice(product) {
  const price = String(product.price || '').trim();
  return price ? `Цена: ${price}` : 'Цена: уточняйте у менеджера';
}

function placeholderImage(label = 'TOR GROUP') {
  const safeLabel = escapeHtml(label).slice(0, 42);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="760" viewBox="0 0 900 760"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#f4efe6"/><stop offset="1" stop-color="#d8cec0"/></linearGradient><linearGradient id="o" x1="0" x2="1"><stop stop-color="#f36b13"/><stop offset="1" stop-color="#ff9b33"/></linearGradient></defs><rect width="900" height="760" rx="44" fill="url(#g)"/><circle cx="700" cy="115" r="120" fill="#fff" opacity=".38"/><rect x="120" y="180" width="660" height="330" rx="34" fill="#171717"/><rect x="170" y="230" width="430" height="28" rx="14" fill="#ffffff" opacity=".16"/><rect x="170" y="290" width="560" height="142" rx="28" fill="#ffffff" opacity=".08"/><rect x="170" y="560" width="180" height="18" rx="9" fill="url(#o)"/><text x="120" y="640" font-family="Inter,Arial,sans-serif" font-size="38" font-weight="900" fill="#171717">${safeLabel}</text><text x="120" y="688" font-family="Inter,Arial,sans-serif" font-size="23" font-weight="700" fill="#6f6b64">пищевое оборудование</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function productCard(product) {
	  const name = escapeHtml(product.name);
  return `
    <article class="card product-card" data-category="${escapeHtml(product.category)}" data-article="${escapeHtml(product.article)}" role="button" tabindex="0">
      <img class="product-image" src="${product.image}" alt="${name}" data-fallback-label="${name}">
      <p class="article">${escapeHtml(product.category)} · ${escapeHtml(product.article)}</p>
      <h3>${name}</h3>
      <p class="price">${escapeHtml(formatPrice(product))}</p>
      <p class="desc">${escapeHtml(shortText(product.description))}</p>
      <button class="btn btn-dark product-btn" type="button" data-article="${escapeHtml(product.article)}">Подробнее</button>
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
  cards.innerHTML = data.length ? data.map(productCard).join('') : '<p class="modal-empty">По вашему запросу товары не найдены.</p>';
  setupImageFallbacks(cards);}

function renderHomeCategories() {
  setupImageFallbacks(document.getElementById('homeCategoryGrid'));
}

function setupImageFallbacks(scope = document) {
  if (!scope) return;
  scope.querySelectorAll('img').forEach((image) => {
    if (image.dataset.fallbackReady === 'true') return;
    image.dataset.fallbackReady = 'true';
    const replaceWithFallback = () => {
      image.src = placeholderImage(image.dataset.fallbackLabel || image.alt || 'TOR GROUP');
    };
    image.addEventListener('error', replaceWithFallback, { once: true });
    if (image.complete && image.naturalWidth === 0) {
      replaceWithFallback();
    }
  });
}


function setupMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById('mobileMenu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    menu.classList.toggle('is-open');
  });

  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

function setupHomeCategoryLinks() {
  const categoryGrid = document.getElementById('homeCategoryGrid');
  if (!categoryGrid) return;

  categoryGrid.addEventListener('click', (event) => {
    const card = event.target.closest('.category-card[data-category]');
    if (!card) return;
    const category = encodeURIComponent(card.dataset.category);
    window.location.href = `/catalog?category=${category}`;
  });
}

function setupCatalogFilter(productsData) {
  const cards = document.getElementById('allProductCards');
	  const params = new URLSearchParams(window.location.search);
  const preselectedCategory = params.get('category');
  const category = document.getElementById('catalogCategoryFilter');
  const search = document.getElementById('catalogSearch');
  if (!cards || !category || !search) return;

  const categories = [...new Set(productsData.map((item) => item.category))];
  category.innerHTML = `<option value="all">Все категории</option>` + categories.map((c) => `<option value="${c}">${c}</option>`).join('');

	  if (preselectedCategory && categories.includes(preselectedCategory)) {
    category.value = preselectedCategory;
  }

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
	  applyFilter();
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

	  document.addEventListener('keydown', (event) => {
    const card = event.target.closest('.product-card[data-article]');
    if (!card || (event.key !== 'Enter' && event.key !== ' ')) return;
    event.preventDefault();
    card.querySelector('.product-btn')?.click();
  });

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-article]');
    if (!trigger) return;

    if (event.target.closest('a, button') && !event.target.closest('.product-btn[data-article]')) return;

    const article = trigger.dataset.article;
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
          <img class="product-modal-image" src="${product.image}" alt="${escapeHtml(product.name)}" data-fallback-label="${escapeHtml(product.name)}">
		  <div>
            <h3>${escapeHtml(product.name)}</h3>
            <p class="article">Артикул: ${escapeHtml(product.article)}</p>
            <p class="price">${escapeHtml(formatPrice(product))}</p>
            <p class="desc">${escapeHtml(product.description)}</p>
            ${buildSpecs(product)}
            <a class="btn btn-accent modal-order-btn" href="https://wa.me/74951234567" target="_blank" rel="noopener">Заказать</a>
			<p class="modal-whatsapp-note">в WhatsApp</p>
          </div>
        </div>`;
		      setupImageFallbacks(content);
    }, 220);
  });
}

const normalizedProducts = normalizeProducts(products);
renderCards('productCards', normalizedProducts.slice(0, 9));
renderCards('allProductCards', normalizedProducts);
renderHomeCategories(normalizedProducts);
setupCatalogFilter(normalizedProducts);
setupProductModal(normalizedProducts);
setupMobileMenu();
setupHomeCategoryLinks();
setupImageFallbacks();