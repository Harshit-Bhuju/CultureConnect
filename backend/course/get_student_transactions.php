<?php
require_once __DIR__ . '/../config/session_config.php';
include("../config/header.php");

// Check if user is logged in
if (!isset($_SESSION['user_email'])) {
    echo json_encode([
        "status" => "error",
        "message" => "User not logged in"
    ]);
    exit;
}

try {
    $user_email = $_SESSION['user_email'];

    // Get user_id from email
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
    $stmt->bind_param("s", $user_email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $stmt->close();

    if (!$user) {
        echo json_encode([
            "status" => "error",
            "message" => "User not found"
        ]);
        exit;
    }

    $user_id = $user['id'];
    $period = $_GET['period'] ?? 'Until now';

    // Build date filter
    $date_filter = "";
    if ($period === 'This month') {
        $date_filter = "AND DATE_FORMAT(tcp.payment_date, '%Y-%m') = DATE_FORMAT(NOW(), '%Y-%m')";
    } elseif ($period === 'This year') {
        $date_filter = "AND YEAR(tcp.payment_date) = YEAR(NOW())";
    }

    // Fetch student transactions
    $query = "
        SELECT 
            tcp.id as transactionId,
            tcp.payment_method as paymentMethod,
            tcp.payment_status as paymentStatus,
            tcp.amount,
            tcp.transaction_uuid as transactionUuid,
            tcp.payment_date as paymentDate,
            tc.course_title as courseTitle,
            tc.thumbnail,
            tc.id as courseId,
            t.teacher_name as teacherName
        FROM teacher_course_payment tcp
        JOIN teacher_course_enroll tce ON tcp.enrollment_id = tce.id
        JOIN teacher_courses tc ON tce.course_id = tc.id
        JOIN teachers t ON tc.teacher_id = t.id
        WHERE tce.student_id = ?
        $date_filter
        ORDER BY tcp.payment_date DESC
    ";

    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $transactions = [];
    while ($row = $result->fetch_assoc()) {
        $row['transactionId'] = (int)$row['transactionId'];
        $row['amount'] = (float)$row['amount'];
        $row['courseId'] = (int)$row['courseId'];
        $row['paymentDate'] = date("j F Y g:i A", strtotime($row['paymentDate']));
        $row['paymentMethod'] = strtoupper($row['paymentMethod']);

        // Normalize status for display
        $row['displayStatus'] = match ($row['paymentStatus']) {
            'success' => 'Paid',
            'pending' => 'Pending',
            'failed' => 'Failed',
            'refunded' => 'Refunded',
            default => ucfirst($row['paymentStatus'])
        };

        $transactions[] = $row;
    }
    $stmt->close();

    echo json_encode([
        "status" => "success",
        "transactions" => $transactions,
        "period" => $period
    ]);
} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Failed to fetch transactions: " . $e->getMessage()
    ]);
}

$conn->close();
exit;
