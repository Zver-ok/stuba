function getTemplateUri() {
  return document.body.dataset.templateUri || '';
}

function normalizeProducts(data) {
  const base = getTemplateUri();
  return data.map((item) => ({
    ...item,
    image: item.image.startsWith('http') ? item.image : `${base}/${item.image.replace(/^\//, '')}`
  }));
}

function productCard(product) {
  return `
    <article class="card product-card" data-category="${product.category}">
      <img class="product-image" src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p class="article">Артикул: ${product.article}</p>
      <p class="price">${product.price ? `Цена: ${product.price}` : 'Цена: по запросу'}</p>
      <p class="desc">${product.description || 'Описание уточняйте у менеджера.'}</p>
      <ul class="specs">
        <li><strong>Модель:</strong> ${product.model || '—'}</li>
        <li><strong>Мощность:</strong> ${product.power || '—'}</li>
        <li><strong>Производительность:</strong> ${product.capacity || '—'}</li>
        <li><strong>Размер:</strong> ${product.size || '—'}</li>
        <li><strong>Вес:</strong> ${product.weight ? `${product.weight} кг` : '—'}</li>
      </ul>
      <button class="btn product-btn" type="button">Подробнее</button>
    </article>`;
}

function renderCards(targetId, data) {
  const cards = document.getElementById(targetId);
  if (!cards) return;
  cards.innerHTML = data.map(productCard).join('');
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

const normalizedProducts = normalizeProducts(products);
renderCards('productCards', normalizedProducts.slice(0, 9));
renderCards('allProductCards', normalizedProducts);
setupCatalogFilter(normalizedProducts);