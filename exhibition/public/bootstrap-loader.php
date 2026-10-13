<?php
declare(strict_types=1);
if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) { http_response_code(404); exit; }
// Supports both exhibition/public and Hostia: public_html/form + exhibition/app.
foreach ([__DIR__.'/../../exhibition/app/bootstrap.php', __DIR__.'/../app/bootstrap.php'] as $file) {
    if (@is_file($file) && @is_readable($file)) { require_once $file; return; }
}
http_response_code(500);
header('Content-Type: text/html; charset=UTF-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
?><!DOCTYPE html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Проверьте размещение файлов — АТМ</title><link rel="stylesheet" href="assets/event.css"><link rel="stylesheet" href="assets/admin.css"></head><body class="admin-body"><main class="login-wrap setup-wrap"><section class="login-card"><span class="eyebrow">НАСТРОЙКА САЙТА</span><h1>Не найдена серверная часть.</h1><p>Загрузчик не смог найти или прочитать файл <code>app/bootstrap.php</code>.</p><div class="login-message"><b>Для вашего размещения Hostia:</b><p>Содержимое public должно находиться в <code>domains/atm.hhos.net/public_html/form</code>.</p><p>Папка app — в <code>domains/atm.hhos.net/exhibition/app</code>. Внутри неё должен быть <code>bootstrap.php</code>.</p><p>Папка private — в <code>domains/atm.hhos.net/exhibition/private</code>.</p><p>Если файл уже на месте, проверьте права чтения и ограничение open_basedir в панели хостинга. Не переносите приватные данные в public_html.</p></div></section></main></body></html>
<?php exit; ?>
