<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require './php_mailer/Exception.php';
require './php_mailer/PHPMailer.php';
require './php_mailer/SMTP.php';
function sendemail_verify($email, $subject, $custom_template)
{
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username = getenv('SMTP_USER');
    $mail->Password = getenv('SMTP_PASS');
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;

    $mail->setFrom('cultureconnect0701@gmail.com', 'CultureConnect');
    $mail->addAddress($email);

    $mail->isHTML(true);
    $mail->Subject = $subject;

    $email_template = $custom_template;

    $mail->Body = $email_template;
    $mail->send();
}
