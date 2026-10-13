<?php
declare(strict_types=1);
require __DIR__.'/bootstrap-loader.php';
header('Content-Type: application/json; charset=utf-8');
function reply(int $status,array $body): never { http_response_code($status); echo json_encode($body,JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR); exit; }
if ($_SERVER['REQUEST_METHOD']!=='POST') reply(405,['ok'=>false,'message'=>'Используйте POST.']);
if (!valid_csrf()) reply(403,['ok'=>false,'message'=>'Обновите страницу и попробуйте ещё раз.']);
try {
    $action=text_input($_POST,'action',20); $visitor=visitor_id(); $day=date('Y-m-d');
    if ($action==='start') {
        db()->prepare('UPDATE visitors SET started=1 WHERE visitor=? AND day=?')->execute([$visitor,$day]);
        reply(200,['ok'=>true]);
    }
    if ($action!=='register') reply(400,['ok'=>false,'message'=>'Неизвестное действие.']);
    if (text_input($_POST,'website')!=='' || time()-($_SESSION['form_issued']??time())<2) reply(400,['ok'=>false,'message'=>'Пожалуйста, заполните форму и попробуйте снова.']);
    $first=text_input($_POST,'first_name',60); $last=text_input($_POST,'last_name',60);
    $rawphone=text_input($_POST,'phone',30); $phone=preg_replace('/\D/','',$rawphone);
    if (strlen($phone)===11 && $phone[0]==='8') $phone='7'.substr($phone,1);
    $type=text_input($_POST,'person_type',20); $company=$type==='legal'?text_input($_POST,'company',150):'';
    $interest=text_input($_POST,'interest',80); $allowed=['Тракторы','Строительная техника','Навесное оборудование','Генераторы','Шины и запчасти','Общая консультация'];
    $errors=[];
    foreach (['first_name'=>$first,'last_name'=>$last] as $key=>$value) if (!preg_match('/^[\p{L}\p{M}][\p{L}\p{M} .’\x{0027}-]{1,59}$/u',$value)) $errors[$key]='Укажите имя / фамилию (от 2 до 60 символов).';
    if (!preg_match('/^7\d{10}$/',$phone)) $errors['phone']='Введите номер Казахстана: +7 и 10 цифр.';
    if (!in_array($type,['individual','legal'],true)) $errors['person_type']='Выберите физическое или юридическое лицо.';
    if ($type==='legal' && strlen($company)<2) $errors['company']='Укажите название компании.';
    if ($interest!=='' && !in_array($interest,$allowed,true)) $errors['interest']='Выберите интересующее направление.';
    if (($_POST['consent']??'')!=='1') $errors['consent']='Для записи необходимо согласие на обработку данных.';
    if ($errors) reply(422,['ok'=>false,'message'=>'Проверьте поля формы.','errors'=>$errors]);
    $address=address_key();
    db()->prepare('DELETE FROM submit_attempts WHERE created_at<?')->execute([time()-3600]);
    $check=db()->prepare('SELECT COUNT(*) FROM submit_attempts WHERE address=? AND created_at>?'); $check->execute([$address,time()-600]);
    if ($check->fetchColumn()>=10) reply(429,['ok'=>false,'message'=>'Слишком много попыток. Попробуйте через 10 минут.']);
    db()->prepare('INSERT INTO submit_attempts VALUES(?,?)')->execute([$address,time()]);
    $utm=$_SESSION['utm']??['source'=>'','medium'=>'','campaign'=>''];
    try {
        $stmt=db()->prepare('INSERT INTO leads(created_at,day,visitor,first_name,last_name,phone,person_type,company,interest,source,medium,campaign,consent_version) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)');
        $stmt->execute([date('c'),$day,$visitor,$first,$last,'+'.$phone,$type,$company,$interest,$utm['source'],$utm['medium'],$utm['campaign'],'2026-10-13']);
    } catch (PDOException $error) {
        if ($error->getCode()==='23000') reply(200,['ok'=>true,'duplicate'=>true,'message'=>'Этот номер уже записан. Будем рады видеть вас на стенде '.EVENT_STAND.'!']);
        throw $error;
    }
    reply(201,['ok'=>true,'message'=>'Вы записаны! Ждём вас '.EVENT_DATES.' на стенде '.EVENT_STAND.'.']);
} catch (Throwable $error) {
    error_log('Exhibition API error: '.$error->getMessage());
    reply(500,['ok'=>false,'message'=>'Не удалось сохранить заявку. Попробуйте позже или свяжитесь с нами по телефону.']);
}
