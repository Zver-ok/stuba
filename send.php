<?php
header('Content-Type: text/html; charset=utf-8');

$recipient = 'tkatashev@bk.ru';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.html');
    exit;
}

$formType = isset($_POST['form_type']) ? trim((string) $_POST['form_type']) : '';
$name = isset($_POST['name']) ? trim((string) $_POST['name']) : '';
$phone = isset($_POST['phone']) ? trim((string) $_POST['phone']) : '';
$productName = isset($_POST['product_name']) ? trim((string) $_POST['product_name']) : '';
$details = isset($_POST['details']) ? trim((string) $_POST['details']) : '';

if ($name === '' || $phone === '') {
    http_response_code(400);
    echo 'Пожалуйста, заполните имя и номер телефона.';
    exit;
}

$subject = $formType === 'kp' ? 'Новая заявка: Получить КП' : 'Новая заявка: Консультация';

$lines = [
    'Тип формы: ' . ($formType === 'kp' ? 'Получить КП' : 'Консультация'),
    'Имя: ' . $name,
    'Телефон: ' . $phone,
];

if ($productName !== '') {
    $lines[] = 'Позиция: ' . $productName;
}

if ($details !== '') {
    $lines[] = 'Доп. информация: ' . $details;
}

$message = implode("\n", $lines);
$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: no-reply@' . ($_SERVER['HTTP_HOST'] ?? 'localhost'),
    'Reply-To: no-reply@' . ($_SERVER['HTTP_HOST'] ?? 'localhost'),
];

$sent = mail($recipient, '=?UTF-8?B?' . base64_encode($subject) . '?=', $message, implode("\r\n", $headers));

if ($sent) {
    echo 'Спасибо! Заявка отправлена.';
} else {
    http_response_code(500);
    echo 'Ошибка отправки. Попробуйте позже.';
}