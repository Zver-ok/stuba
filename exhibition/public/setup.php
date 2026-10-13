<?php
require __DIR__.'/../app/bootstrap.php';
$message=''; $finished=admin_config()!==null;
$key_file=private_dir().'/setup-key.php';
$key=is_file($key_file)?require $key_file:null;
$enabled=is_string($key) && preg_match('/^[A-Za-z0-9_-]{24,200}$/',$key) && $key!=='YOUR_SECRET_SETUP_CODE_24_CHARS';
$driver=text_input($_POST,'driver',10)?:'sqlite';
if ($_SERVER['REQUEST_METHOD']==='POST') {
    if ($finished) { http_response_code(403); $message='Установка уже завершена. Изменение администратора через эту страницу запрещено.'; }
    elseif (!valid_csrf()) { http_response_code(403); $message='Обновите страницу и попробуйте ещё раз.'; }
    elseif (!$enabled) { http_response_code(403); $message='Сначала создайте файл с кодом установки по инструкции ниже.'; }
    else {
        $attempt_file=private_dir().'/setup-attempts.json';
        $handle=fopen($attempt_file,'c+'); flock($handle,LOCK_EX); chmod($attempt_file,0600);
        $attempts=json_decode(stream_get_contents($handle),true)?:[];
        $attempts=array_filter($attempts,fn($row)=>$row['time']>time()-900);
        $address=address_key(); $mine=array_filter($attempts,fn($row)=>$row['address']===$address);
        $entered=$_POST['setup_code']??'';
        if (count($mine)>=5) { http_response_code(429); $message='Слишком много попыток. Попробуйте через 15 минут.'; }
        elseif (!is_string($entered) || !hash_equals(hash('sha256',$key),hash('sha256',$entered))) {
            $attempts[]=['address'=>$address,'time'=>time()]; http_response_code(403); $message='Неверный код установки.';
        }
        else {
            $username=text_input($_POST,'username',60); $password=$_POST['password']??''; $confirm=$_POST['password_confirm']??'';
            if (!preg_match('/^[A-Za-z0-9_.-]{3,60}$/',$username)) $message='Логин: от 3 до 60 латинских букв, цифр, точек, дефисов или подчёркиваний.';
            elseif (!is_string($password) || !preg_match('/^.{12,1024}$/us',$password)) $message='Пароль должен содержать от 12 до 1024 символов.';
            elseif (!is_string($confirm) || !hash_equals($password,$confirm)) $message='Пароли не совпадают.';
            elseif (!in_array($driver,['sqlite','mysql'],true)) $message='Выберите SQLite или MySQL.';
            else {
                $config=['driver'=>$driver];
                if ($driver==='mysql') {
                    $host=text_input($_POST,'db_host',200); $database=text_input($_POST,'db_name',100); $user=text_input($_POST,'db_user',100); $db_password=$_POST['db_password']??'';
                    $port=filter_var($_POST['db_port']??3306,FILTER_VALIDATE_INT);
                    if (!preg_match('/^[A-Za-z0-9_.:-]+$/',$host) || !preg_match('/^[A-Za-z0-9_$-]+$/',$database) || $user==='' || !$port || $port<1 || $port>65535 || !is_string($db_password)) $message='Проверьте данные MySQL из панели хостинга.';
                    else $config+=['host'=>$host,'port'=>$port,'database'=>$database,'username'=>$user,'password'=>$db_password];
                }
                if ($message==='') {
                    $lock=fopen(private_dir().'/setup.lock','c+'); flock($lock,LOCK_EX);
                    try {
                        if (admin_config()!==null) throw new RuntimeException('Already installed');
                        connect_database($config);
                        save_private_php(private_dir().'/database.php',$config);
                        $file=private_dir().'/admin.json'; $temp=tempnam(private_dir(),'admin-'); chmod($temp,0600);
                        $json=json_encode(['username'=>$username,'password_hash'=>password_hash($password,PASSWORD_DEFAULT)],JSON_THROW_ON_ERROR);
                        if (file_put_contents($temp,$json,LOCK_EX)===false || !rename($temp,$file)) { @unlink($temp); throw new RuntimeException('Cannot save administrator'); }
                        @unlink($key_file); $finished=true; $enabled=false;
                        $_SESSION['csrf']=bin2hex(random_bytes(32));
                    } catch (Throwable $error) {
                        error_log('Exhibition setup failed: '.$error->getMessage());
                        $message='Не удалось завершить установку. Проверьте подключение к базе, расширение PDO и права записи в private. Пароль администратора не изменён.';
                    } finally { flock($lock,LOCK_UN); fclose($lock); }
                }
            }
        }
        rewind($handle); ftruncate($handle,0); fwrite($handle,json_encode(array_values($attempts))); fflush($handle); flock($handle,LOCK_UN); fclose($handle);
    }
}
?><!DOCTYPE html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Установка кабинета — АТМ</title><link rel="stylesheet" href="assets/event.css"><link rel="stylesheet" href="assets/admin.css"></head><body class="admin-body"><main class="login-wrap setup-wrap"><a class="atm-logo" href="./"><strong>АТМ</strong><span>AGROTECHMANAGEMENT</span></a><section class="login-card"><span class="eyebrow">ПЕРВАЯ НАСТРОЙКА</span><?php if ($finished): ?><h1>Кабинет настроен.</h1><p>Установка закрыта. Войдите с вашим логином и паролем.</p><a class="primary" href="admin.php">Открыть кабинет →</a><?php else: ?><h1>Без терминала.</h1><p>Создайте доступ к кабинету и выберите базу.</p><?php if (!$enabled): ?><div class="login-message"><b>Один шаг в файловом менеджере:</b><p>В папке <code>private</code> создайте файл <code>setup-key.php</code> с содержимым:</p><pre>&lt;?php
return 'ВАШ_СЕКРЕТНЫЙ_КОД';</pre><p>Вместо текста в кавычках придумайте случайный код из 24 или более латинских букв и цифр. Он нужен только для установки. Сохраните файл и обновите страницу.</p><p>Не создавайте файл в папке public.</p></div><?php else: ?><form method="post" autocomplete="off"><input type="hidden" name="csrf" value="<?= e(csrf()) ?>"><label class="field">Секретный код установки<input name="setup_code" type="password" autocomplete="off" required minlength="24"></label><label class="field">Логин кабинета<input name="username" value="<?= e(text_input($_POST,'username',60)?:'admin') ?>" autocomplete="username" pattern="[A-Za-z0-9_.\-]{3,60}" required></label><label class="field">Пароль кабинета<input name="password" type="password" autocomplete="new-password" minlength="12" required></label><label class="field">Повторите пароль<input name="password_confirm" type="password" autocomplete="new-password" minlength="12" required></label><label class="field">База данных<select name="driver" id="database-driver"><option value="sqlite" <?= $driver==='sqlite'?'selected':'' ?>>SQLite — без создания базы вручную</option><option value="mysql" <?= $driver==='mysql'?'selected':'' ?>>MySQL / MariaDB — из панели хостинга</option></select></label><div id="mysql-fields" <?= $driver!=='mysql'?'hidden':'' ?>><p class="form-intro">Сначала создайте базу и пользователя в панели хостинга. Введите выданные хостингом данные.</p><label class="field">Хост базы<input name="db_host" value="<?= e(text_input($_POST,'db_host',200)?:'localhost') ?>"></label><label class="field">Порт<input name="db_port" type="number" min="1" max="65535" value="<?= e(text_input($_POST,'db_port',5)?:'3306') ?>"></label><label class="field">Имя базы<input name="db_name" value="<?= e(text_input($_POST,'db_name',100)) ?>"></label><label class="field">Пользователь базы<input name="db_user" value="<?= e(text_input($_POST,'db_user',100)) ?>"></label><label class="field">Пароль базы<input name="db_password" type="password" autocomplete="new-password"></label></div><p class="field-error" role="alert"><?= e($message) ?></p><button class="primary">Создать кабинет →</button><p class="form-bottom">После установки повторное создание администратора блокируется, файл кода удаляется.</p></form><script src="assets/setup.js" defer></script><?php endif ?><?php endif ?></section><a class="back-link" href="./">← Вернуться на сайт</a></main></body></html>
