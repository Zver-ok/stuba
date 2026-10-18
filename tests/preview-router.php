<?php
// Local template preview only; this is not a WordPress replacement.
if (PHP_SAPI !== 'cli-server') { http_response_code(404); exit; }
function get_template_directory_uri(): string { return ''; }
function wp_head(): void {}
function wp_footer(): void {}
$root=dirname(__DIR__);
$path=parse_url($_SERVER['REQUEST_URI'],PHP_URL_PATH);
$pages=['/branches/'=>'branches.php','/service/'=>'service.php','/privacy/'=>'privacy.php','/'=>'front-page.php','/index.html'=>'index.html','/catalog'=>'catalog.php','/catalog/'=>'catalog.php','/product'=>'product.php','/product/'=>'product.php'];
if (isset($pages[$path])) { require $root.'/'.$pages[$path]; return; }
if (preg_match('/\.(?:js|css|svg|pdf|jpg|jpeg|webp|png|ico)$/i',$path)) {
    $file=realpath($root.'/'.ltrim(rawurldecode($path),'/'));
    if ($file && str_starts_with($file,$root.DIRECTORY_SEPARATOR) && is_file($file)) return false;
}
http_response_code(404); echo 'Not found';
