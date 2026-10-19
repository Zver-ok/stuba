Логотипы в шапке и подвале

Пути относятся к активной теме WordPress, а не к корню домена:
wp-content/themes/atm/
├── images/
│   ├── atm.webp
│   ├── sampo.webp
│   ├── farmet.webp
│   └── tronmax.webp
├── style.css
├── front-page.php
├── index.html
├── catalog.php
├── product.php
├── sampo.php
├── sampo-catalog.php
├── sampo-product.php
├── farmet.php
├── farmet-catalog.php
├── farmet-product.php
├── tyres.php
├── tyres-catalog.php
├── tyres-product.php
├── branches.php
├── service.php
├── privacy.php
└── equipment.php

Файлы изображений уже размещены вами; в репозитории их нет, архив их не заменяет. Загрузите обновлённые шаблоны и style.css из архива с заменой. Не удаляйте папку темы.

Для ручной правки существующего шаблона внутри каждой ссылки class="brand" замените <strong>АТМ</strong> на:
<img class="brand-logo brand-logo-atm" src="<?php echo get_template_directory_uri(); ?>/images/atm.webp" alt="ATM" decoding="async">

На страницах Sampo замените <span class="sampo-wordmark">SAMPO</span> на:
<img class="brand-logo brand-logo-sampo" src="<?php echo get_template_directory_uri(); ?>/images/sampo.webp" alt="SAMPO" decoding="async">

На страницах Farmet замените <span class="farmet-wordmark">FARMET</span> на:
<img class="brand-logo brand-logo-farmet" src="<?php echo get_template_directory_uri(); ?>/images/farmet.webp" alt="FARMET" decoding="async">

На страницах шин замените <span>YTO</span> на:
<img class="brand-logo brand-logo-tronmax" src="<?php echo get_template_directory_uri(); ?>/images/tronmax.webp" alt="TRONMAX" decoding="async">

У тракторов оставлен существующий <span>YTO</span>: путь к картинке YTO не предоставлен. В общих страницах (филиалы, сервис, политика) тоже используется пара ATM + YTO; на equipment.php заменён только ATM.

Повторите замены в шапке и подвале. В style.css добавьте блок в конце с комментарием Shared brand pairs. Он задаёт размеры на компьютере и телефоне без искажения пропорций.

После загрузки очистите кеш WordPress/CDN. Если картинки лежат именно в корневой /images/ домена, а не в папке темы, в атрибуте src используйте /images/atm.webp и соответствующие имена остальных логотипов без PHP-префикса.
