<?php
/**
 * Template Name: Каталог
 * Description: Полный каталог оборудования TOR GROUP.
 */
?>
<!doctype html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Каталог TOR GROUP</title>
	  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/style.css">
</head>
<body data-template-uri="<?php echo get_template_directory_uri(); ?>">
  <header class="topbar topbar-static">
    <div class="container nav-wrap">
      <a class="brand" href="/" aria-label="TOR GROUP — на главную">
        <span class="brand-mark">TOR</span>
        <span><span class="brand-main">TOR GROUP</span><span class="brand-sub">пищевое оборудование</span></span>
      </a>
      <nav class="menu" aria-label="Основная навигация">
        <a href="/">Главная</a>
        <a href="/catalog">Каталог</a>
        <a href="/#contacts">Контакты</a>
      </nav>
      <div class="top-actions">
        <a class="phone" href="tel:+74951234567">+7 (495) 123-45-67</a>
        <a class="btn btn-dark" href="/#contacts">Оставить заявку</a>
      </div>
      <button class="menu-toggle" type="button" aria-label="Открыть меню" aria-expanded="false"><span></span><span></span><span></span></button>
    </div>
    <div class="mobile-menu" id="mobileMenu">
      <a href="/">Главная</a>
      <a href="/catalog">Каталог</a>
      <a href="/#contacts">Контакты</a>
      <a href="tel:+74951234567">+7 (495) 123-45-67</a>
    </div>
  </header>

  <main class="catalog-page">
    <section class="catalog-hero">
      <div class="container catalog-hero-grid">
        <div>
          <span class="eyebrow">Каталог TOR GROUP</span>
          <h1 class="catalog-title">Оборудование для запуска и роста пищевого производства</h1>
          <p class="catalog-sub">Фильтруйте позиции по категории, модели или артикулу. Если не нашли подходящее решение — менеджер подберёт аналог под задачу.</p>
        </div>
        <div class="catalog-note">
          <strong>60+</strong>
          <span>позиций с характеристиками, описанием и быстрым заказом в WhatsApp</span>
        </div>
      </div>
    </section>

    <section class="container catalog-listing">
      <div class="catalog-filters" aria-label="Фильтры каталога">
        <label><span>Категория</span><select id="catalogCategoryFilter"></select></label>
        <label><span>Поиск</span><input id="catalogSearch" type="search" placeholder="Название, артикул или модель"></label>
      </div>
      <div class="cards catalog-cards" id="allProductCards"></div>
    </section>
  </main>

  <div class="product-modal" id="productModal" aria-hidden="true">
    <div class="product-modal-dialog" role="dialog" aria-modal="true" aria-label="Карточка товара">
      <button class="product-modal-close" type="button" aria-label="Закрыть">×</button>
      <div class="product-modal-content"></div>
    </div>

  </div>
  <a class="whatsapp-float" href="https://wa.me/74951234567" target="_blank" rel="noopener">WhatsApp</a>
  <script src="<?php echo get_template_directory_uri(); ?>/products-data.js"></script>
  <script src="<?php echo get_template_directory_uri(); ?>/script.js"></script>
</body>
</html>