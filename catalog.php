<?php
/**
 * Template Name: Каталог
 * Description: 
 */
?>
<!doctype html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Каталог PROTECH</title>
  <link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/style.css">
</head>
<body data-template-uri="<?php echo get_template_directory_uri(); ?>">
<header class="topbar">
  <div class="container nav-wrap">
    <div class="brand"><span class="brand-main">PROTECH</span><span class="brand-sub">пищевое оборудование</span></div>
    <nav class="menu"><a href="/">ГЛАВНАЯ</a><a href="/catalog">КАТАЛОГ</a></nav>
  </div>
</header>
<main class="catalog-page">
  <div class="container">
    <h1 class="catalog-title">Полный каталог товаров</h1>
    <p class="catalog-sub">Все позиции из файла «Каталог.xlsx»</p>
	      <div class="catalog-filters">
      <select id="catalogCategoryFilter"></select>
      <input id="catalogSearch" type="search" placeholder="Поиск по названию, артикулу или модели">
    </div>
    <div class="cards catalog-cards" id="allProductCards"></div>
  </div>
</main>
<a class="whatsapp-float" href="https://wa.me/74951234567" target="_blank" rel="noopener">Написать в WhatsApp</a>
	<script src="<?php echo get_template_directory_uri(); ?>/products-data.js"></script>
<script src="<?php echo get_template_directory_uri(); ?>/script.js"></script>
</body>
</html>