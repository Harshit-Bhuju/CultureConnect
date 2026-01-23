<?php
require_once __DIR__ . '/../config/session_config.php';
include("../config/dbconnect.php");

require_once __DIR__ . '/../vendor/autoload.php';

use Xentixar\EsewaSdk\Esewa;

try {
    $esewa = new Esewa();
    $response = $esewa->decode();

    // Use session-based frontend URL or fallback
    $frontend_base = $_SESSION['frontend_url'] ?? "http://localhost:5173";

    // 1. Decode must succeed
    if (!$response || ($response['status'] ?? '') !== 'COMPLETE') {
        header("Location: {$frontend_base}/?error=" . urlencode("Invalid payment response") . "&payment=failed");
        exit;
    }

    $transaction_uuid = $response['transaction_uuid'] ?? null;
    $paid_amount = $response['total_amount'] ?? null;

    if (!$transaction_uuid || !$paid_amount) {
        header("Location: {$frontend_base}/?error=" . urlencode("Missing payment data") . "&payment=failed");
        exit;
    }

    $stmt = $conn->prepare("
        SELECT pt.*
        FROM teacher_course_payment pt
        WHERE pt.transaction_uuid = ?
        LIMIT 1
    ");
    $stmt->bind_param("s", $transaction_uuid);
    $stmt->execute();
    $transaction = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$transaction) {
        header("Location: {$frontend_base}/?error=" . urlencode("Transaction not found") . "&payment=failed");
        exit;
    }

    $enrollment_id = $transaction['enrollment_id'];

    $stmt = $conn->prepare("
        SELECT 
            ts.*,
            tc.teacher_id,
            tc.id as course_id_internal,
            tc.price
        FROM teacher_course_enroll ts
        JOIN teacher_courses tc ON ts.course_id = tc.id
        WHERE ts.id = ?
        LIMIT 1
    ");
    $stmt->bind_param("i", $enrollment_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $enrollment = $result->fetch_assoc();
    $stmt->close();

    if (!$enrollment) {
        header("Location: {$frontend_base}/?error=" . urlencode("Enrollment not found") . "&payment=failed");
        exit;
    }

    if ($enrollment['payment_status'] === 'paid') {
        header("Location: {$frontend_base}/courses/{$enrollment['teacher_id']}/{$enrollment['course_id_internal']}?payment=success");
        exit;
    }

    if ((float)$paid_amount !== (float)$enrollment['price']) {
        header("Location: {$frontend_base}/courses/{$enrollment['teacher_id']}/{$enrollment['course_id_internal']}?error=" . urlencode("Amount mismatch") . "&payment=failed");
        exit;
    }

    // 5. Atomic update
    $conn->begin_transaction();

    // Update enrollment status
    $stmt = $conn->prepare("
        UPDATE teacher_course_enroll
        SET payment_status = 'paid',
            enrollment_date = NOW()
        WHERE id = ?
          AND payment_status = 'pending'
    ");
    $stmt->bind_param("i", $enrollment_id);
    $stmt->execute();
    $affected_rows = $conn->affected_rows;
    $stmt->close();

    // Update payment record
    if (isset($payment_id)) {
        $stmt = $conn->prepare("UPDATE teacher_course_payment SET payment_status = 'success', payment_date = NOW() WHERE id = ?");
        $stmt->bind_param("i", $payment_id);
        $stmt->execute();
        $stmt->close();
    } else {
        // Fallback if payment_id wasn't in UUID
        $stmt = $conn->prepare("UPDATE teacher_course_payment SET payment_status = 'success', payment_date = NOW() WHERE transaction_uuid = ?");
        $stmt->bind_param("s", $transaction_uuid);
        $stmt->execute();
        $stmt->close();
    }

    $conn->commit();

    // Clear session variables
    unset($_SESSION['course_transaction_uuid']);
    unset($_SESSION['course_enrollment_id']);

    // 6. Success redirect to course page
    header("Location: {$frontend_base}/courses/{$enrollment['teacher_id']}/{$enrollment['course_id_internal']}?payment=success");
    exit;
} catch (Exception $e) {
    if (isset($conn)) {
        $conn->rollback();
    }

    $frontend_base = $_SESSION['frontend_url'] ?? "http://localhost:5173";
    header("Location: {$frontend_base}/?error=" . urlencode("Payment processing error: " . $e->getMessage()) . "&payment=failed");
    exit;
}

$conn->close();
