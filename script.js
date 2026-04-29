document.addEventListener('DOMContentLoaded', () => {
  const burgerButton = document.querySelector('.burger-btn');
  const mobileMenu = document.querySelector('.menu');

const trackEvent = (eventName, params = {}) => {
  if (typeof gtag === 'function') {
    gtag('event', eventName, params);
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...params
  });
};

  if (burgerButton && mobileMenu) {
    burgerButton.addEventListener('click', () => {
      const isOpen = document.body.classList.toggle('menu-open');
      burgerButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    mobileMenu.querySelectorAll('a').forEach((menuLink) => {
      menuLink.addEventListener('click', () => {
        document.body.classList.remove('menu-open');
        burgerButton.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const slider = document.querySelector('#products-slider');
  const buttons = document.querySelectorAll('.slider-btn');

  if (slider && buttons.length) {
    const getStep = () => slider.clientWidth * 0.8;

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const direction = button.dataset.dir === 'next' ? 1 : -1;
        slider.scrollBy({
          left: getStep() * direction,
          behavior: 'smooth',
        });
      });
    });
  }

  const modal = document.querySelector('#lead-modal');

  let consultationContent = null;
  let kpContent = null;
  let modalTitle = null;
  let productNameField = null;
  let productTitle = null;
  let productImage = null;

  if (modal) {
    consultationContent = modal.querySelector('[data-modal-type="consultation"]');
    kpContent = modal.querySelector('[data-modal-type="kp"]');
    modalTitle = modal.querySelector('#modal-title');
    productNameField = modal.querySelector('#modal-product-name');
    productTitle = modal.querySelector('#modal-product-title');
    productImage = modal.querySelector('#modal-product-image');

    const openModal = (type, card = null) => {
      if (type === 'kp') {
        if (consultationContent) consultationContent.hidden = true;
        if (kpContent) kpContent.hidden = false;

        const name = card?.querySelector('h4')?.textContent?.trim() || 'Выбранная позиция';
        const imgEl = card?.querySelector('img');
        const src = imgEl?.getAttribute('src') || '';
        const alt = imgEl?.getAttribute('alt') || name;

        if (productTitle) productTitle.textContent = name;
        if (productNameField) productNameField.value = name;
        if (productImage) {
          productImage.src = src;
          productImage.alt = alt;
        }
      } else {
        if (consultationContent) consultationContent.hidden = false;
        if (kpContent) kpContent.hidden = true;
        if (modalTitle) modalTitle.textContent = 'Получить консультацию';
      }

      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');

      trackEvent('modal_open', {
        modal_type: type || 'unknown'
      });
    };

    const closeModal = () => {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
    };

    document.querySelectorAll('[data-open-modal]').forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const type = trigger.dataset.openModal;
        const card = trigger.closest('.slider-card');
        openModal(type, card);
      });
    });

    modal.querySelectorAll('[data-close-modal]').forEach((closeBtn) => {
      closeBtn.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && modal.classList.contains('is-open')) {
        closeModal();
      }
    });
  }

  document.querySelectorAll('form').forEach((form) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formType = form.querySelector('[name="form_type"]')?.value || 'unknown';
      const submitButton = form.querySelector('button[type="submit"]');
      const originalButtonText = submitButton?.textContent || '';

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Отправка...';
      }

	  trackEvent('form_submit', {
  form_type: formType
});
	  
      try {
        const response = await fetch(form.action, {
          method: 'POST',
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
          },
          body: new FormData(form),
        });

        const data = await response.json();

        if (!response.ok || !data.ok) {
          throw new Error(data.message || 'Ошибка отправки.');
        }

        trackEvent('form_success', {
          form_type: formType
        });

        alert('Заявка отправлена');
        form.reset();

        if (modal && modal.classList.contains('is-open')) {
          modal.classList.remove('is-open');
          modal.setAttribute('aria-hidden', 'true');
          document.body.classList.remove('modal-open');
        }
      } catch (error) {
        trackEvent('form_error', {
          form_type: formType,
          error_message: error?.message || 'unknown_error'
        });

        alert(error.message || 'Ошибка отправки. Попробуйте позже.');
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
        }
      }
    });
  });
});