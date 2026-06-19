<?php
/**
 * Template Name: Каталог
 * Description: Каталог
 */
?>
<!doctype html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Каталог ВВГ кабеля — AVECO ENERGY</title>
  <meta name="description" content="Полный каталог кабелей ВВГ, ВВГнг, ВВГнг-LS и ВВГнг-FRLS с сечениями и отдельными страницами товара.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/style.css">
</head>
<body>
  <header class="page-header">
    <nav class="nav container" aria-label="Главная навигация">
      <a class="brand" href="/"><span class="brand__mark">⚡</span><span class="brand__text"><strong>AVECO ENERGY</strong><em>КАБЕЛЬНАЯ ПРОДУКЦИЯ</em></span></a>
      <button class="nav__toggle" type="button" aria-label="Открыть меню" aria-expanded="false"><span></span><span></span><span></span></button>
      <div class="nav__menu"><a href="/">Главная</a><a class="is-active" href="/catalog">Каталог</a><a href="#about">О компании</a><a href="#delivery">Доставка и оплата</a><a href="#contacts">Контакты</a></div>
      <div class="nav__phone"><span>          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M6.6 10.8c1.5 3 3.9 5.4 6.6 6.6l2.2-2.2c.3-.3.8-.4 1.2-.2 1.3.4 2.6.6 4 .6.7 0 1.2.5 1.2 1.2v3.5c0 .7-.5 1.2-1.2 1.2C10.8 22 2 13.2 2 2.4 2 1.7 2.5 1.2 3.2 1.2h3.6c.7 0 1.2.5 1.2 1.2 0 1.4.2 2.8.6 4 .1.4 0 .9-.3 1.2l-1.7 3.2Z"
            />
          </svg></span><span><b>8 (771) 999-69-69</b><small>Менеджер на связи</small></span><a class="btn btn--small" href="#contacts">Заказать звонок</a></div>
    </nav>
    <div class="container page-title"><h1>Каталог ВВГ кабеля</h1><p>Все популярные марки и сечения с отдельной подробной страницей для каждой позиции.</p></div>
  </header>
  <main>
    <section class="catalog section">
      <div class="container">
        <div class="tabs" role="list" aria-label="Категории продукции">
          <button class="tab is-active" type="button" data-catalog-tab="ВВГ">ВВГ</button>
          <button class="tab" type="button" data-catalog-tab="ВВГнг (A)">ВВГнг (A)</button>
          <button class="tab" type="button" data-catalog-tab="ВВГнг-LS">ВВГнг-LS</button>
          <button class="tab" type="button" data-catalog-tab="ВВГнг-FRLS">ВВГнг-FRLS</button>
          <button class="tab" type="button" data-catalog-tab="Аксессуары">Аксессуары</button>
        </div>
        <div class="product-grid catalog-grid" data-product-grid></div>
      </div>
    </section>
  </main>
  <footer class="footer" id="contacts"><div class="container footer__bottom"><p>© 2026 ВВГ Кабель. Все права защищены.</p><a href="#contacts">Контакты</a></div></footer>
  <script src="<?php echo get_template_directory_uri(); ?>/product.js"></script><script src="<?php echo get_template_directory_uri(); ?>/script.js"></script>
</body>
</html>