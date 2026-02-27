<?php
// Включаем отображение ошибок для отладки (в продакшене убрать)
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Устанавливаем заголовок для JSON ответов
header('Content-Type: application/json; charset=utf-8');

// Настройки отправки
try {
	require __DIR__ . '/config.php';
} catch (Exception $e) {
	http_response_code(500);
	echo json_encode([
		'message' => 'Ошибка загрузки конфигурации: ' . $e->getMessage(),
		'status' => 'error'
	], JSON_UNESCAPED_UNICODE);
	exit;
} catch (Error $e) {
	// Обработка фатальных ошибок PHP
	http_response_code(500);
	echo json_encode([
		'message' => 'Ошибка загрузки конфигурации: ' . $e->getMessage(),
		'status' => 'error'
	], JSON_UNESCAPED_UNICODE);
	exit;
}

// Проверка метода запроса
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	http_response_code(405);
	echo json_encode([
		'message' => 'Метод не разрешен',
		'status' => 'error'
	]);
	exit;
}

// Валидация обязательных полей
$errors = [];
if (empty($_POST['name'])) {
	$errors[] = 'Имя обязательно для заполнения';
}
if (empty($_POST['phone'])) {
	$errors[] = 'Телефон обязателен для заполнения';
}

// Если есть ошибки валидации
if (!empty($errors)) {
	http_response_code(400);
	echo json_encode([
		'message' => implode(', ', $errors),
		'status' => 'error',
		'errors' => $errors
	]);
	exit;
}

// Название сайта для писем
$siteName = 'Antalya House (antalya-house.ru)';

// От кого письмо
$mail->setFrom('smol18@bk.ru', 'Недвижимость'); // Указать нужный E-mail
// Кому отправить
$mail->addAddress('esmolakov65@gmail.com'); // Указать нужный E-mail

// Тема и тело письма — заявка с сайта и название сайта
$mail->Subject = 'Заявка с сайта ' . $siteName . ' — ' . (isset($_POST['name']) ? htmlspecialchars($_POST['name']) : 'Без имени');

$body = '<h2>Заявка с сайта ' . htmlspecialchars($siteName) . '</h2>';
$body .= '<p><strong>Имя:</strong> ' . htmlspecialchars($_POST['name'] ?? '') . '</p>';
$body .= '<p><strong>Телефон:</strong> ' . htmlspecialchars($_POST['phone'] ?? '') . '</p>';
if (!empty($_POST['message'])) {
	$body .= '<p><strong>Сообщение:</strong></p><p>' . nl2br(htmlspecialchars($_POST['message'])) . '</p>';
}

$body .= '<hr>';
$body .= '<p><small>Дата отправки: ' . date('d.m.Y H:i:s') . '</small></p>';

$mail->Body = $body;

// Отправляем
try {
	if (!$mail->send()) {
		$message = 'Ошибка отправки письма: ' . $mail->ErrorInfo;
		$status = 'error';
	} else {
		$message = 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.';
		$status = 'success';
	}
} catch (Exception $e) {
	$message = 'Ошибка отправки письма: ' . $e->getMessage();
	$status = 'error';
}

$response = [
	'message' => $message,
	'status' => $status
];

echo json_encode($response, JSON_UNESCAPED_UNICODE);
