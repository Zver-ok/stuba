<?php
// Deterministic handler tests: WordPress transport is replaced with an in-memory adapter.
define('ABSPATH',__DIR__);
$GLOBALS['cache']=[];$GLOBALS['mail']=[];$GLOBALS['mail_ok']=true;
function wp_verify_nonce($n,$a){return $n==='test-nonce'&&$a==='atm_lead';}
function wp_unslash($v){return $v;}
function sanitize_text_field($v){return trim(preg_replace('/[\r\n\t]+/',' ',strip_tags($v)));}
function sanitize_textarea_field($v){return trim(strip_tags($v));}
function is_email($v){return filter_var($v,FILTER_VALIDATE_EMAIL);}
function wp_salt($s=''){return 'test-secret';}
function get_transient($k){return $GLOBALS['cache'][$k]??false;}
function set_transient($k,$v,$ttl){$GLOBALS['cache'][$k]=$v;return true;}
function wp_mail($to,$subject,$body,$headers){if(!$GLOBALS['mail_ok'])return false;$GLOBALS['mail'][]=compact('to','subject','body','headers');return true;}
function check($condition,$message){if(!$condition)throw new RuntimeException($message);}
require dirname(__DIR__).'/lead-handler.php';
$_SERVER['REMOTE_ADDR']='203.0.113.10';
$valid=['nonce'=>'test-nonce','name'=>'Тест','phone'=>'+7 777 000 00 00','model'=>'YTO-X1304','comment'=>'Подбор орудия','page_url'=>'https://example.test/product/?model=X1304','quantity'=>'2','utm_source'=>'google'];
foreach([['nonce'=>'bad'],['name'=>''],['phone'=>'abc'],['quantity'=>'0'],['quantity'=>'1000'],['website'=>'spam'],['model'=>['bad']],['comment'=>str_repeat('x',2001)]] as $bad){[$code,$result]=atm_process_lead(array_replace($valid,$bad));check($code>=400&&!$result['ok'],'Invalid request was accepted');}
check(count($GLOBALS['mail'])===0,'Invalid requests sent mail');
[$code,$result]=atm_process_lead($valid);check($code===200&&$result['ok'],'Valid lead rejected');
check(count($GLOBALS['mail'])===1,'Missing accepted email');$delivered=$GLOBALS['mail'][0];check($delivered['to']==='sales@agrotm.kz','Recipient changed');check(str_contains($delivered['body'],'Количество: 2'),'Quantity missing');check(str_contains($delivered['body'],'utm_source: google'),'Campaign missing');
[$code,$result]=atm_process_lead($valid);check($code===200&&($result['duplicate']??false)&&count($GLOBALS['mail'])===1,'Duplicate was sent again');
$injection=array_replace($valid,['name'=>"Name\r\nBcc: attacker@example.test",'recipient'=>'attacker@example.test','comment'=>'Header test']);atm_process_lead($injection);$delivered=end($GLOBALS['mail']);check($delivered['to']==='sales@agrotm.kz'&&$delivered['headers']===['Content-Type: text/plain; charset=UTF-8'],'Caller influenced headers/recipient');
$GLOBALS['mail_ok']=false;[$code,$result]=atm_process_lead(array_replace($valid,['comment'=>'Transport failure']));check($code===502&&!$result['ok'],'Failed transport reported success');$GLOBALS['mail_ok']=true;
for($i=0;$i<8;$i++)atm_process_lead(array_replace($valid,['comment'=>'Rate '.$i]));[$code,$result]=atm_process_lead(array_replace($valid,['comment'=>'Rate final']));check($code===429&&!$result['ok'],'Rate limit missing');
foreach(array_keys($GLOBALS['cache']) as $key)check(!str_contains($key,'203.0.113.10'),'Raw network address stored in key');
echo "PASS: validation, nonce, honeypot, fixed recipient/headers, quantity/UTM, deduplication, transport failure, rate limit. No real mail sent.\n";
