<?php
header('Content-Type: application/json; charset=utf-8');

$recipient = 'tkatashev@bk.ru';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'ok' => false,
        'message' => 'Метод не поддерживается.',
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$formType = $_POST['form_type'] ?? '';
$name = trim($_POST['name'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$productName = trim($_POST['product_name'] ?? '');
$details = trim($_POST['details'] ?? '');

if ($name === '' || $phone === '') {
    http_response_code(400);
    echo json_encode([
        'ok' => false,
        'message' => 'Заполните имя и телефон',
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$subject = $formType === 'kp'
    ? 'Новая заявка: Получить КП'
    : 'Новая заявка: Консультация';

$message = "Тип формы: " . ($formType === 'kp' ? 'Получить КП' : 'Консультация') . "\n";
$message .= "Имя: $name\n";
$message .= "Телефон: $phone\n";

if ($productName) {
    $message .= "Позиция: $productName\n";
}

if ($details) {
    $message .= "Дополнительно: $details\n";
}

$headers = "From: info@aveco.kz\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$sent = mail($recipient, $subject, $message, $headers);

if ($sent) {
    echo json_encode([
        'ok' => true,
        'message' => 'Заявка отправлена',
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

http_response_code(500);
echo json_encode([
    'ok' => false,
    'message' => 'mail() не работает на сервере',
], JSON_UNESCAPED_UNICODE);