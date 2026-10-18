(() => {
  const script = document.currentScript;
  const base = new URL('.', script.src);
  const catalog = window.YTO_CATALOG;
  const asset = path => new URL(path, base).href;
  const escape = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
  const productUrl = model => `/product/?model=${encodeURIComponent(model.id)}`;
  const whatsapp = model => `https://wa.me/77775550665?text=${encodeURIComponent(`Здравствуйте! Интересует ${model.name}. Подскажите цену, наличие и комплектацию.`)}`;
  function card(model, comparison = false) {
    return `<article class="product catalog-product" data-name="${escape(model.name)}" data-power="${model.power}" data-kind="${model.group}" data-id="${model.id}" data-ac="${model.airConditioning}"><a class="product-photo" href="${productUrl(model)}"><span class="stock-badge">${model.power} л.с. · 4×4</span><img src="${asset(model.image)}" alt="${escape(model.name)} — место для фотографии" loading="lazy"></a><div class="product-body"><a href="${productUrl(model)}"><h3>${escape(model.name)}</h3></a><p class="product-caption">${escape(model.lead)}</p><div class="compact-specs"><span><b>${escape(model.gears)}</b>Передачи</span><span><b>${model.hydraulicPairs} пары</b>Гидровыходы</span><span><b>${model.mass}</b>Масса, кг</span></div><p class="price quote-price">Цена по запросу</p><small class="price-note">Наличие и срок поставки уточните у менеджера</small><div class="product-actions"><a class="button small" href="${productUrl(model)}">Подробнее →</a><a class="button outline small" href="${whatsapp(model)}" target="_blank" rel="noopener">Получить КП</a></div>${comparison ? `<label class="compare-choice"><input type="checkbox" data-compare="${model.id}"> Сравнить модель</label>` : ''}</div></article>`;
  }
  window.YTO_UI = {catalog, asset, escape, productUrl, whatsapp, card};
  const popular = document.querySelector('.products[data-catalog-models]');
  if (popular) popular.innerHTML = ['NMF604','NMF804-8','X904','X1304'].map(id => card(catalog.models.find(model => model.id === id))).join('');
  document.querySelectorAll('[data-catalog-pdf]').forEach(link => link.href = asset(catalog.pdf));
})();
