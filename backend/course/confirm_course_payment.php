<?php
require_once __DIR__ . '/../config/session_config.php';
include("../config/header.php");

require_once __DIR__ . '/../vendor/autoload.php';

use Xentixar\EsewaSdk\Esewa;

try {
    $user_email = $_SESSION['user_email'];

    if (!$user_email) {
        echo json_encode(["success" => false, "error" => "User not authenticated"]);
        exit;
    }

    $enrollment_id = $_POST['enrollment_id'] ?? null;
    $payment_method = $_POST['payment_method'] ?? 'esewa';

    if (!$enrollment_id) {
        echo json_encode(["success" => false, "error" => "Enrollment ID is required"]);
        exit;
    }

    // Capture and sessionize the frontend URL for subsequent redirects
    if (isset($_POST['frontend_url'])) {
        $_SESSION['frontend_url'] = $_POST['frontend_url'];
    }

    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
    $stmt->bind_param("s", $user_email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $stmt->close();

    if (!$user) {
        echo json_encode(["success" => false, "error" => "User not found"]);
        exit;
    }

    $user_id = $user['id'];

    // Get enrollment and course details
    $stmt = $conn->prepare("
        SELECT 
            ts.*,
            tc.course_title,
            tc.price,
            tc.teacher_id
        FROM teacher_course_enroll ts
        JOIN teacher_courses tc ON ts.course_id = tc.id
        WHERE ts.id = ? 
        AND ts.student_id = ? 
        AND ts.payment_status = 'pending'
        LIMIT 1
    ");
    $stmt->bind_param("ii", $enrollment_id, $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $enrollment = $result->fetch_assoc();
    $stmt->close();

    if (!$enrollment) {
        echo json_encode(["success" => false, "error" => "Enrollment not found or already processed"]);
        exit;
    }

    $conn->begin_transaction();

    try {
        $payment_status = 'pending';
        $amount = (float)$enrollment['price'];

        // Create course payment record
        $stmt = $conn->prepare("INSERT INTO teacher_course_payment (enrollment_id, payment_method, payment_status, amount) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("issd", $enrollment_id, $payment_method, $payment_status, $amount);
        $stmt->execute();
        $payment_id = $conn->insert_id;
        $stmt->close();

        // For eSewa payment
        if ($payment_method === 'esewa') {
            $transaction_uuid = "COURSE_" . $enrollment_id . "_" . $payment_id . "_" . time();

            // Update transaction_uuid in teacher_course_payment
            $stmt = $conn->prepare("UPDATE teacher_course_payment SET transaction_uuid = ? WHERE id = ?");
            $stmt->bind_param("si", $transaction_uuid, $payment_id);
            $stmt->execute();
            $stmt->close();

            $conn->commit();

            // Store transaction info in session for course payment success handler
            $_SESSION['course_transaction_uuid'] = $transaction_uuid;
            $_SESSION['course_enrollment_id'] = $enrollment_id;
            $_SESSION['course_amount'] = $amount;

            // Don't commit yet - we'll commit after eSewa redirects
            // The enrollment stays in pending status until payment succeeds

            $esewa = new Esewa();

            // Dynamically build the backend base URL for callbacks
            $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
            $host = $_SERVER['HTTP_HOST'];
            $base_url = "{$protocol}://{$host}/CultureConnect/backend/course";

            $success_url = $base_url . "/course_payment_success.php";
            $failure_url = $base_url . "/course_payment_failure.php?teacher_id=" . $enrollment['teacher_id'] . "&course_id=" . $enrollment['course_id'] . "&transaction_uuid=" . urlencode($transaction_uuid);

            // Store transaction_uuid in session for course payment success handler
            $_SESSION['course_transaction_uuid'] = $transaction_uuid;
            $_SESSION['course_enrollment_id'] = $enrollment_id;

            $esewa->config(
                $success_url,
                $failure_url,
                (float)$amount,
                $transaction_uuid,
                'EPAYTEST',
                '8gBm/:&EnhH.1/q',
                0.00,
                0.00,
                0.00
            );

            // Set header BEFORE init() outputs the form
            header("Content-Type: text/html; charset=UTF-8");
            $esewa->init(false);  // This echoes the form directly
            exit;
        }

        // For free courses or other payment methods (if any)
        // Update enrollment status
        $stmt = $conn->prepare("
            UPDATE teacher_course_enroll 
            SET payment_status = 'paid',
                updated_at = NOW()
            WHERE id = ?
        ");
        $stmt->bind_param("i", $enrollment_id);
        $stmt->execute();
        $stmt->close();

        // Update payment status
        $stmt = $conn->prepare("UPDATE teacher_course_payment SET payment_status = 'success', payment_date = NOW() WHERE id = ?");
        $stmt->bind_param("i", $payment_id);
        $stmt->execute();
        $conn->commit();

        echo json_encode([
            "success" => true,
            "redirect_to_esewa" => false,
            "enrollment_id" => $enrollment_id,
            "payment_method" => $payment_method
        ]);
    } catch (Exception $e) {
        $conn->rollback();
        throw $e;
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

$conn->close();
