<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/phpmailer/src/Exception.php';
require __DIR__ . '/phpmailer/src/PHPMailer.php';
require __DIR__ . '/phpmailer/src/SMTP.php';

$mail = new PHPMailer(true);
$mail->CharSet = 'UTF-8';
$mail->setLanguage('ru', 'phpmailer/language/');
$mail->IsHTML(true);

$mail->isSMTP(); // Send using SMTP

// Настройки для Mail.ru (bk.ru, mail.ru, inbox.ru, list.ru)
$mail->Host = 'smtp.mail.ru'; // SMTP сервер Mail.ru
$mail->SMTPAuth = true; // Enable SMTP authentication
$mail->Username = 'smol18@bk.ru'; // SMTP username (email)
$mail->Password = 'ehCLgxYU8mKs2QLObu9W'; // ⚠️ ВАЖНО: Используйте пароль для внешних приложений!

// Вариант 1: SSL/TLS на порту 465 (рекомендуется)
$mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
$mail->Port = 465;

// Если вариант 1 не работает, попробуйте вариант 2 (раскомментируйте):
// $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
// $mail->Port = 587;

// Дополнительные настройки для отладки
$mail->SMTPDebug = 0; // 0 = отключено, 2 = подробные логи (для отладки)
$mail->Debugoutput = 'error_log'; // Логи в error_log

// Проверка наличия пароля (не выбрасываем исключение, просто предупреждаем)
// Пароль будет проверен при попытке отправки
