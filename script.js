const toggle = document.querySelector('.nav__toggle');
const menu = document.querySelector('.nav__menu');
const WHATSAPP_PHONE = '77719996969';

function sendAnalyticsEvent(eventName, parameters = {}) {
  if (typeof window.gtag !== 'function') return;

  window.gtag('event', eventName, parameters);
}

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

function getCurrentProductName() {
  return document.querySelector('[data-product-title]')?.textContent?.trim() || '';
}

function initLeadModal() {
  const modal = document.createElement('div');
  modal.className = 'lead-modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="lead-modal__overlay" data-modal-close></div>
    <div class="lead-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="lead-modal-title">
      <button class="lead-modal__close" type="button" aria-label="Закрыть" data-modal-close>×</button>
      <h2 id="lead-modal-title">Оставьте заявку</h2>
      <p data-modal-subtitle>Менеджер свяжется с вами в ближайшее время.</p>
      <form class="lead-modal__form" data-lead-form>
        <input type="hidden" name="form_type" value="consultation">
        <input type="hidden" name="product_name" value="">
        <label>Ваше имя<input name="name" type="text" autocomplete="name" required></label>
        <label>Телефон<input name="phone" type="tel" autocomplete="tel" required></label>
        <label>Комментарий<textarea name="details" rows="3" placeholder="Например: нужный метраж или город доставки"></textarea></label>
        <button class="btn" type="submit">Отправить заявку</button>
        <small data-form-status>Мы гарантируем конфиденциальность ваших данных</small>
      </form>
    </div>`;
  document.body.appendChild(modal);

  const form = modal.querySelector('[data-lead-form]');
  const status = modal.querySelector('[data-form-status]');
  const title = modal.querySelector('#lead-modal-title');
  const subtitle = modal.querySelector('[data-modal-subtitle]');

  const openModal = (trigger) => {
    const productName = getCurrentProductName();
    const isPrice = trigger.textContent.toLowerCase().includes('цен');
    form.form_type.value = isPrice ? 'kp' : 'consultation';
    form.product_name.value = productName;
    title.textContent = isPrice ? 'Получить цену' : 'Получить консультацию';
    subtitle.textContent = productName
      ? `Оставьте контакты — подготовим ответ по позиции ${productName}.`
      : 'Оставьте контакты — менеджер свяжется с вами в ближайшее время.';
    status.textContent = 'Мы гарантируем конфиденциальность ваших данных';
    status.className = '';
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    form.name.focus();
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  };

  document.querySelectorAll('a, button').forEach((item) => {
    const text = item.textContent.trim();
    if (['Заказать звонок', 'Получить цену', 'Получить консультацию', 'Получить предложение'].includes(text)) {
		item.addEventListener('click', (event) => {
        event.preventDefault();
        openModal(item);
      });
    }
  });

  modal.addEventListener('click', (event) => {
    if (event.target.closest('[data-modal-close]')) closeModal();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.textContent = 'Отправляем заявку...';
    status.className = '';

    const response = await fetch('/wp-content/themes/test/send-mail.php', {
      method: 'POST',
      body: new FormData(form),
    });
    const result = await response.json();

    status.textContent = result.message || (response.ok ? 'Заявка отправлена' : 'Не удалось отправить заявку');
    status.className = response.ok && result.ok ? 'is-success' : 'is-error';
    if (response.ok && result.ok) {
      sendAnalyticsEvent('lead_form_submit', {
        event_category: 'lead',
        event_label: form.product_name.value || 'general',
        form_type: form.form_type.value,
        product_name: form.product_name.value || undefined,
      });
      form.reset();
    }
  });
}

function getWhatsAppMessage() {
  const productName = getCurrentProductName();
  return productName
    ? `Здравствуйте, я пишу по поводу ${productName}`
    : 'Здравствуйте, хочу получить консультацию по кабельной продукции';
}

function initFloatingWhatsAppButton() {
  if (document.querySelector('[data-floating-whatsapp]')) return;

  const button = document.createElement('a');
  button.className = 'floating-whatsapp';
  button.href = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(getWhatsAppMessage())}`;
  button.target = '_blank';
  button.rel = 'noopener';
  button.setAttribute('aria-label', 'Написать в WhatsApp');
  button.setAttribute('data-floating-whatsapp', '');
  button.innerHTML = '<span class="floating-whatsapp__icon" aria-hidden="true">✆</span><span class="floating-whatsapp__text">WhatsApp</span>';
  document.body.appendChild(button);
}

function initWhatsAppLinks() {
  document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]').forEach((link) => {
    link.addEventListener('click', () => {
      const productName = getCurrentProductName();
      const message = getWhatsAppMessage();
      link.href = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
      sendAnalyticsEvent('whatsapp_click', {
        event_category: 'contact',
        event_label: productName || 'general',
        product_name: productName || undefined,
        link_location: link.dataset.floatingWhatsapp !== undefined ? 'floating_button' : 'page_link',
      });
    });
  });
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
initLeadModal();
initFloatingWhatsAppButton();
initWhatsAppLinks();