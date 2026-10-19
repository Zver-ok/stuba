<?php
// Standalone theme endpoint; works without editing the host theme's functions.php.
header('Content-Type: application/json; charset=UTF-8');header('Cache-Control: no-store');header('X-Content-Type-Options: nosniff');
if(($_SERVER['REQUEST_METHOD']??'')!=='POST'){http_response_code(405);header('Allow: POST');echo json_encode(['ok'=>false,'message'=>'Используйте форму на сайте.'],JSON_UNESCAPED_UNICODE);exit;}
if((int)($_SERVER['CONTENT_LENGTH']??0)>32768){http_response_code(413);echo json_encode(['ok'=>false,'message'=>'Слишком большой запрос.'],JSON_UNESCAPED_UNICODE);exit;}
if(!defined('ABSPATH')){$loader=dirname(__DIR__,3).'/wp-load.php';if(is_file($loader))require_once $loader;}
if(!function_exists('wp_mail')||!function_exists('wp_verify_nonce')){http_response_code(503);echo json_encode(['ok'=>false,'message'=>'Отправка временно недоступна. Позвоните +7 777 555 06 65.'],JSON_UNESCAPED_UNICODE);exit;}
$origin=$_SERVER['HTTP_ORIGIN']??'';
if($origin!==''){$expected=wp_parse_url(home_url('/'));$actual=wp_parse_url($origin);if(!$actual||strtolower($actual['host']??'')!==strtolower($expected['host']??'')||strtolower($actual['scheme']??'')!==strtolower($expected['scheme']??'')||($actual['port']??null)!==($expected['port']??null)){http_response_code(403);echo json_encode(['ok'=>false,'message'=>'Откройте форму на нашем сайте и повторите отправку.'],JSON_UNESCAPED_UNICODE);exit;}}
require_once __DIR__.'/lead-handler.php';
try{[$status,$result]=atm_process_lead($_POST);}catch(Throwable $error){$status=503;$result=['ok'=>false,'message'=>'Отправка временно недоступна. Попробуйте позже или позвоните нам.'];}
http_response_code($status);echo json_encode($result,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE);
