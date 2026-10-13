<?php
declare(strict_types=1);
if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) { http_response_code(404); exit; }
// Supports both exhibition/public and Hostia: public_html/form + exhibition/app.
foreach ([__DIR__.'/../../exhibition/app/bootstrap.php', __DIR__.'/../app/bootstrap.php'] as $file) {
    if (is_file($file)) { require_once $file; return; }
}
http_response_code(500);
exit('Не найдена серверная часть. Разместите app и private по инструкции для хостинга.');
