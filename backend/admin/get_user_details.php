<?php
require_once __DIR__ . '/../config/session_config.php';
include("../config/header.php");

// Check if user is admin
if (!isset($_SESSION['user_email'])) {
    echo json_encode(["success" => false, "message" => "Not authenticated"]);
    exit;
}

$user_id = $_GET['user_id'] ?? null;
if (!$user_id) {
    echo json_encode(["success" => false, "message" => "User ID required"]);
    exit;
}

// Purchase History - Product Orders
$stmt = $conn->prepare("SELECT o.order_number, p.product_name as name, o.total_amount, o.order_status, o.created_at 
                        FROM orders o 
                        JOIN products p ON o.product_id = p.id 
                        WHERE o.user_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$productOrders = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
$stmt->close();

// Purchase History - Course Enrollments
$courseOrders = [];
$stmt = $conn->prepare("SELECT ce.enrollment_date, tc.course_title as name, tc.price as amount, ce.payment_status as status 
                        FROM teacher_course_enroll ce 
                        JOIN teacher_courses tc ON ce.course_id = tc.id 
                        WHERE ce.student_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$courseOrders = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
$stmt->close();

// User Products if Seller
$products = [];
$stmt = $conn->prepare("SELECT s.id FROM sellers s WHERE s.user_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$seller = $stmt->get_result()->fetch_assoc();
$stmt->close();

if ($seller) {
    $stmt = $conn->prepare("SELECT id, product_name, price, stock, status FROM products WHERE seller_id = ?");
    $stmt->bind_param("i", $seller['id']);
    $stmt->execute();
    $products = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    $stmt->close();
}

// User Courses if Teacher
$courses = [];
$stmt = $conn->prepare("SELECT t.id FROM teachers t WHERE t.user_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$teacher = $stmt->get_result()->fetch_assoc();
$stmt->close();

if ($teacher) {
    $stmt = $conn->prepare("SELECT id, course_title, price, status FROM teacher_courses WHERE teacher_id = ?");
    $stmt->bind_param("i", $teacher['id']);
    $stmt->execute();
    $courses = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    $stmt->close();
}

echo json_encode([
    "success" => true,
    "data" => [
        "productOrders" => $productOrders,
        "courseOrders" => $courseOrders,
        "products" => $products,
        "courses" => $courses
    ]
]);

$conn->close();
