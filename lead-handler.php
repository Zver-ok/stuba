<?php
/** WordPress-backed lead processing. No caller-provided recipients or mail headers. */
if (!defined('ABSPATH')) { http_response_code(404); exit; }
function atm_lead_result(int $status, bool $ok, string $message): array { return [$status,['ok'=>$ok,'message'=>$message]]; }
function atm_process_lead(array $input): array {
    $nonce=$input['nonce']??null;
    if(!is_string($nonce)||!wp_verify_nonce($nonce,'atm_lead'))return atm_lead_result(403,false,'Обновите страницу и повторите отправку.');
    if(!empty($input['website']))return atm_lead_result(422,false,'Не удалось обработать форму. Позвоните нам или попробуйте ещё раз.');
    $limits=['name'=>100,'phone'=>40,'region'=>120,'city'=>120,'model'=>200,'topic'=>160,'task'=>2000,'comment'=>2000,'quantity'=>3,'page_url'=>1000,'source_model'=>200];$fields=[];
    foreach($limits as $key=>$limit){$value=$input[$key]??'';if(!is_string($value))return atm_lead_result(422,false,'Проверьте поля формы.');$value=wp_unslash($value);if(strlen($value)>$limit*4)return atm_lead_result(422,false,'Сократите слишком длинные поля формы.');$value=in_array($key,['task','comment'],true)?sanitize_textarea_field($value):sanitize_text_field($value);$length=function_exists('mb_strlen')?mb_strlen($value,'UTF-8'):preg_match_all('/./us',$value);if($length>$limit)return atm_lead_result(422,false,'Сократите слишком длинные поля формы.');$fields[$key]=$value;}
    $digits=preg_replace('/\D/','',$fields['phone']);
    if($fields['name']===''||strlen($digits)<7||strlen($digits)>15)return atm_lead_result(422,false,'Укажите имя и корректный номер телефона.');
    if($fields['quantity']!==''&&!preg_match('/^[1-9][0-9]{0,2}$/',$fields['quantity']))return atm_lead_result(422,false,'Количество должно быть от 1 до 999.');
    $recipient=defined('ATM_LEADS_EMAIL')?ATM_LEADS_EMAIL:'sales@agrotm.kz';
    if(!is_string($recipient)||!is_email($recipient))return atm_lead_result(503,false,'Отправка временно недоступна. Свяжитесь с нами по телефону.');
    $campaign=[];foreach(['utm_source','utm_medium','utm_campaign','utm_content','utm_term'] as $key){$value=$input[$key]??'';if(!is_string($value)||strlen($value)>640)return atm_lead_result(422,false,'Проверьте параметры формы.');$campaign[$key]=substr(sanitize_text_field(wp_unslash($value)),0,640);}
    $secret=wp_salt('nonce');
    $fingerprint='atm_lead_done_'.hash_hmac('sha256',json_encode([$fields,$campaign],JSON_UNESCAPED_UNICODE),$secret);
    if(get_transient($fingerprint))return [200,['ok'=>true,'message'=>'Заявка уже принята. Мы свяжемся с вами.','duplicate'=>true]];
    $rateKey='atm_lead_rate_'.hash_hmac('sha256',$_SERVER['REMOTE_ADDR']??'unknown',$secret);
    $rate=get_transient($rateKey);$rate=is_array($rate)?$rate:['count'=>0,'until'=>time()+600];
    if($rate['count']>=8)return atm_lead_result(429,false,'Слишком много обращений. Попробуйте позже или позвоните нам.');
    $rate['count']++;set_transient($rateKey,$rate,max(1,$rate['until']-time()));
    $labels=['name'=>'Имя','phone'=>'Телефон','region'=>'Регион','city'=>'Город','model'=>'Модель / товар','topic'=>'Тема обращения','source_model'=>'Подбор к технике','quantity'=>'Количество','task'=>'Задача','comment'=>'Комментарий','page_url'=>'Страница обращения'];
    $lines=['Новая заявка с сайта АТМ',''];foreach($labels as $key=>$label)if($fields[$key]!=='')$lines[]=$label.': '.$fields[$key];
    foreach($campaign as $key=>$value)if($value!=='')$lines[]=$key.': '.$value;
    $sent=wp_mail($recipient,'Новая заявка с сайта АТМ',implode("\n",$lines),['Content-Type: text/plain; charset=UTF-8']);
    if(!$sent)return atm_lead_result(502,false,'Не удалось отправить заявку. Данные сохранены в форме: попробуйте ещё раз или позвоните нам.');
    set_transient($fingerprint,1,120);
    return atm_lead_result(200,true,'Заявка принята к отправке. Мы свяжемся с вами.');
}
