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
			// WhatsApp клики
document.querySelectorAll('a[href*="api.whatsapp.com"]').forEach(el => {
  el.addEventListener('click', () => {
    trackEvent('whatsapp_click');
  });
});

// Телефон клики
document.querySelectorAll('a[href^="tel:"]').forEach(el => {
  el.addEventListener('click', () => {
    trackEvent('phone_click');
  });
});

// Почта клики
document.querySelectorAll('a[href^="mailto:"]').forEach(el => {
  el.addEventListener('click', () => {
    trackEvent('email_click');
  });
});
});
			
const policyModal = document.getElementById('policy-modal');
const policyBody = document.getElementById('policy-body');

const policyTexts = {
  cookie: `
    <h2>Политика использования cookie</h2>

<h3>Содержание</h3>
<p>
Введение<br>
Типы используемых cookie-файлов<br>
Назначение cookie-файлов<br>
Управление cookie-файлами<br>
Хранение cookie-файлов<br>
Передача данных третьим лицам
</p>

<h3>I Введение</h3>
<p>
На сайте avecometal.kz используются cookie-файлы (куки) для обеспечения удобства работы пользователей и улучшения функциональности сайта. Cookie представляют собой небольшие текстовые файлы, которые сохраняются на вашем устройстве при посещении сайта.
</p>

<p>
Использование cookie позволяет:<br>
— запоминать ваши предпочтения и настройки;<br>
— анализировать поведение пользователей для оптимизации работы сайта;<br>
— предлагать персонализированный контент и рекламу.
</p>

<p>
Продолжая использовать наш сайт, вы соглашаетесь с применением cookie в соответствии с настоящей Политикой. Если вы не согласны с использованием cookie, вы можете изменить настройки своего браузера или отказаться от использования cookie-файлов через соответствующие инструменты на сайте.
</p>

<h3>II Типы используемых cookie-файлов</h3>
<p>
На сайте avecometal.kz применяются следующие категории cookie-файлов:
</p>

<p>
<strong>Строго необходимые cookie</strong><br>
Эти cookie обеспечивают базовую функциональность сайта, такую как навигация по страницам и доступ к защищённым зонам. Без них корректная работа сайта невозможна.
</p>

<p>
<strong>Аналитические cookie</strong><br>
Используются для сбора информации о том, как пользователи взаимодействуют с сайтом. Это помогает нам улучшать структуру и содержание сайта, обеспечивая его удобство для посетителей. Пример: Google Analytics.
</p>

<p>
<strong>Функциональные cookie</strong><br>
Эти cookie запоминают ваши предпочтения, такие как язык сайта или регион, чтобы сделать ваше пребывание на сайте комфортным.
</p>

<h3>III Назначение cookie-файлов</h3>
<p>
Cookie-файлы на сайте avecometal.kz используются для следующих целей:
</p>

<p>
<strong>Обеспечение работы сайта</strong><br>
Поддержание сессии пользователя после входа в личный кабинет.<br>
Сохранение выбранных настроек, таких как язык или способ отображения контента.
</p>

<p>
<strong>Анализ и улучшение сайта</strong><br>
Сбор данных о посещаемости страниц, времени пребывания на сайте и популярности разделов.<br>
Выявление ошибок и проблем в работе сайта для их оперативного устранения.
</p>

<p>
<strong>Персонализация пользовательского опыта</strong><br>
Предоставление рекомендаций на основе ваших предыдущих действий на сайте.<br>
Запоминание ранее добавленных в корзину товаров.
</p>

<p>
<strong>Таргетированная реклама</strong><br>
Показ персонализированных рекламных материалов, соответствующих вашим интересам.<br>
Отслеживание эффективности рекламных кампаний.
</p>

<p>
Cookie помогают нам предоставлять вам более удобный и персонализированный опыт, а также развивать сайт, основываясь на реальных данных о его использовании.
</p>

<h3>IV Управление cookie-файлами</h3>
<p>
Если вы не хотите, чтобы ваши данные использовались в аналитических целях, вы можете отключить их через настройки браузера или использовать инструменты отказа от отслеживания, предоставляемые сервисами, такими как Google Analytics и Яндекс.Метрика.
</p>

<p>
Отключение необходимых cookie-файлов может повлиять на корректность работы некоторых функций сайта.
</p>

<p>
Мы рекомендуем сохранять включёнными строго необходимые cookie для обеспечения корректной работы сайта.
</p>

<h3>V Хранение cookie-файлов</h3>
<p>
Cookie-файлы на сайте avecometal.kz могут быть:
</p>

<p>
<strong>Сессионными</strong><br>
Эти cookie-файлы сохраняются только на время использования сайта и удаляются автоматически после закрытия браузера. Они используются для обеспечения временных функций, таких как сохранение корзины.
</p>

<p>
<strong>Постоянными</strong><br>
Cookie-файлы, которые остаются на вашем устройстве в течение определённого периода или до их удаления пользователем. Эти файлы позволяют сохранять ваши предпочтения (например, язык интерфейса) и анализировать использование сайта с течением времени.
</p>

<p>
Срок хранения постоянных cookie зависит от их типа и функций:<br>
— аналитические cookie могут сохраняться до 24 месяцев;<br>
— рекламные cookie обычно имеют срок действия 30–90 дней.
</p>

<p>
Вы можете в любое время удалить сохранённые cookie через настройки браузера или инструменты очистки данных на вашем устройстве.
</p>

<h3>VI Передача данных третьим лицам</h3>
<p>
На сайте avecometal.kz некоторые cookie-файлы могут использоваться для передачи данных третьим сторонам.
</p>

<p>
<strong>Аналитические системы</strong><br>
Google Analytics — для сбора статистики посещений сайта и анализа пользовательского поведения.<br>
Яндекс.Метрика — для оценки эффективности сайта и отслеживания пользовательских действий.
</p>

<p>
<strong>Рекламные платформы</strong><br>
Google Ads — для показа персонализированной рекламы.
</p>

<p>
Данные, собранные с помощью этих cookie, могут включать:<br>
— ваш IP-адрес;<br>
— информацию о вашем устройстве и браузере;<br>
— действия на сайте (просмотренные страницы, время на сайте и т.д.).
</p>

<p>
Эти данные используются исключительно для указанных целей, и их обработка осуществляется в соответствии с политиками конфиденциальности соответствующих третьих сторон.
</p>
  `,

  privacy: `
    <h2>Политика конфиденциальности и обработки данных</h2>
<p>
Настоящая политика конфиденциальности и обработки персональных данных регулирует порядок обработки и использования персональных и иных данных сайта ТОО "AVECO Group" (далее — Оператор).
</p>

<p>
Действующая редакция настоящей Политики конфиденциальности размещена по адресу: https://avecometal.kz
</p>

<p>
Передавая Оператору персональные данные посредством Сайта, Пользователь подтверждает свое согласие на их использование.
</p>

<p>
Если Пользователь не согласен с условиями, он обязан прекратить использование Сайта.
</p>

<p>
Начало использования Сайта считается полным акцептом условий.
</p>

<h3>1. Термины</h3>

<p><strong>1.1 Сайт</strong> — https://avecometal.kz</p>
<p>Все права на сайт принадлежат Оператору.</p>

<p><strong>1.2 Пользователь</strong> — лицо, использующее сайт</p>
<p><strong>1.3 Законодательство</strong> — законодательство РК</p>
<p><strong>1.4 Персональные данные</strong> — данные пользователя</p>
<p><strong>1.5 Данные</strong> — иные данные пользователя</p>
<p><strong>1.6 Регистрация</strong> — заполнение формы</p>
<p><strong>1.7 Регистрационная форма</strong> — форма на сайте</p>
<p><strong>1.8 Услуги</strong> — услуги оператора</p>

<h3>2. Сбор и обработка данных</h3>

<p>
2.1 Оператор собирает только необходимые данные.
</p>

<p>
2.2 Данные используются для:
<br>— оказания услуг
<br>— идентификации
<br>— связи
<br>— рекламы
<br>— аналитики
</p>

<p>
2.3 Обрабатываются:
<br>— ФИО
<br>— email
<br>— телефон
</p>

<p>
2.4 Запрещено указывать данные третьих лиц без согласия.
</p>

<h3>3. Обработка данных</h3>

<p>
3.1 Обработка ведётся по законам РК.
</p>

<p>
3.2 Данные конфиденциальны.
</p>

<p>
3.3 Оператор может хранить данные вне РК.
</p>

<p>
3.4 Передача без согласия:
<br>— госорганам
<br>— по закону
</p>

<p>
3.5 Передача третьим лицам:
<br>— с согласия
<br>— для оказания услуг
</p>

<p>
3.6 Обработка автоматизированная.
</p>

<h3>4. Защита данных</h3>

<p>
Оператор защищает данные в соответствии с законодательством.
</p>

<p>
Применяются меры защиты от:
<br>— доступа
<br>— изменения
<br>— удаления
<br>— распространения
</p>

<h3>5. Прочее</h3>

<p>
5.1 Применяется право РК.
</p>

<p>
5.2 Споры решаются по месту регистрации Оператора.
</p>

<p>
Срок ответа на претензию — 30 рабочих дней.
</p>

<p>
5.3 Недействительность части не влияет на остальное.
</p>

<p>
5.4 Оператор может изменять политику.
</p>

<p>
5.5 Пользователь обязан отслеживать изменения.
</p>

<p>
5.6 Контакты:
<br>Email: avecosteel@gmail.com
<br>Телефон: +7 771 505 60 60
</p>
  `
};

document.querySelectorAll('[data-policy]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    const type = link.dataset.policy;

    policyBody.innerHTML = policyTexts[type] || '<p>Текст не найден</p>';
    policyModal.classList.add('active');
    document.body.classList.add('modal-open');
  });
});

function closePolicyModal() {
  policyModal.classList.remove('active');
  document.body.classList.remove('modal-open');
}

document.querySelectorAll('[data-close-policy]').forEach(el => {
  el.addEventListener('click', closePolicyModal);
});

policyModal.addEventListener('click', (e) => {
  if (e.target === policyModal) {
    closePolicyModal();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closePolicyModal();
  }
});