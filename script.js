document.addEventListener('DOMContentLoaded', () => {
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
  if (!modal) return;

  const consultationContent = modal.querySelector('[data-modal-type="consultation"]');
  const kpContent = modal.querySelector('[data-modal-type="kp"]');
  const modalTitle = modal.querySelector('#modal-title');
  const productNameField = modal.querySelector('#modal-product-name');
  const productTitle = modal.querySelector('#modal-product-title');
  const productImage = modal.querySelector('#modal-product-image');

  const openModal = (type, card = null) => {
    if (type === 'kp') {
      consultationContent.hidden = true;
      kpContent.hidden = false;

      const name = card?.querySelector('h4')?.textContent?.trim() || 'Выбранная позиция';
      const imgEl = card?.querySelector('img');
      const src = imgEl?.getAttribute('src') || '';
      const alt = imgEl?.getAttribute('alt') || name;

      productTitle.textContent = name;
      productNameField.value = name;
      productImage.src = src;
      productImage.alt = alt;
    } else {
      consultationContent.hidden = false;
      kpContent.hidden = true;
      modalTitle.textContent = 'Получить консультацию';
    }

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
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

  modal.querySelectorAll('.modal-form').forEach((form) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const submitButton = form.querySelector('button[type="submit"]');
      const originalButtonText = submitButton?.textContent || '';

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Отправка...';
      }

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

        alert('Заявка отправлена');
        form.reset();
        closeModal();
      } catch (error) {
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