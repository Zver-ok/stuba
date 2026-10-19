<?php
// Local template preview only; this is not a WordPress replacement.
if (PHP_SAPI !== 'cli-server') { http_response_code(404); exit; }
function get_template_directory_uri(): string { return ''; }
function wp_head(): void {}
function wp_footer(): void {}
function wp_create_nonce($action): string { return 'preview-lead-nonce'; }
$root=dirname(__DIR__);
$path=parse_url($_SERVER['REQUEST_URI'],PHP_URL_PATH);
if($path==='/send-mail.php'){require __DIR__.'/wp-mail-preview.php';require $root.'/send-mail.php';return;}
$pages=['/tyres/'=>'tyres.php','/tyres-catalog/'=>'tyres-catalog.php','/tyres-product/'=>'tyres-product.php','/farmet/'=>'farmet.php','/farmet-catalog/'=>'farmet-catalog.php','/farmet-product/'=>'farmet-product.php','/sampo/'=>'sampo.php','/sampo-catalog/'=>'sampo-catalog.php','/sampo-product/'=>'sampo-product.php','/equipment/'=>'equipment.php','/branches/'=>'branches.php','/service/'=>'service.php','/privacy/'=>'privacy.php','/'=>'front-page.php','/index.html'=>'index.html','/catalog'=>'catalog.php','/catalog/'=>'catalog.php','/product'=>'product.php','/product/'=>'product.php'];
if (isset($pages[$path])) { require $root.'/'.$pages[$path]; return; }
if (preg_match('/\.(?:js|css|svg|pdf|jpg|jpeg|webp|png|ico|docx|xlsx)$/i',$path)) {
    $file=realpath($root.'/'.ltrim(rawurldecode($path),'/'));
    if ($file && str_starts_with($file,$root.DIRECTORY_SEPARATOR) && is_file($file)) return false;
}
http_response_code(404); echo 'Not found';
