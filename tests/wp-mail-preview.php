<?php
// Local-only WordPress mail adapter. Never sends mail and refuses non-preview use.
if(PHP_SAPI!=='cli-server'||!getenv('ATM_PREVIEW_MAIL_DIR')){http_response_code(503);exit('Preview mail adapter is not configured');}
define('ABSPATH',dirname(__DIR__).'/');
function wp_verify_nonce($nonce,$action){return $nonce==='preview-lead-nonce'&&$action==='atm_lead';}
function wp_unslash($value){return stripslashes($value);}
function sanitize_text_field($value){return trim(preg_replace('/[\r\n\t]+/',' ',strip_tags($value)));}
function sanitize_textarea_field($value){return trim(strip_tags($value));}
function is_email($value){return filter_var($value,FILTER_VALIDATE_EMAIL);}
function wp_salt($scheme=''){return 'local-preview-secret-only';}
function wp_parse_url($value){return parse_url($value);}
function home_url($path='/'){return 'http://'.$_SERVER['HTTP_HOST'].$path;}
function get_transient($key){$path=getenv('ATM_PREVIEW_MAIL_DIR').'/'.hash('sha256',$key).'.json';if(!is_file($path))return false;$data=json_decode(file_get_contents($path),true);return $data['until']>time()?$data['value']:false;}
function set_transient($key,$value,$ttl){file_put_contents(getenv('ATM_PREVIEW_MAIL_DIR').'/'.hash('sha256',$key).'.json',json_encode(['until'=>time()+$ttl,'value'=>$value]));return true;}
function wp_mail($to,$subject,$message,$headers=[]){if(($_SERVER['HTTP_X_PREVIEW_MAIL_FAILURE']??'')==='1')return false;file_put_contents(getenv('ATM_PREVIEW_MAIL_DIR').'/accepted-mail.jsonl',json_encode(compact('to','subject','message','headers'),JSON_UNESCAPED_UNICODE)."\n",FILE_APPEND);return true;}
