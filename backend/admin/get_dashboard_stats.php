<?php
require_once __DIR__ . '/../config/session_config.php';
include("../config/header.php");

// Check if user is admin
if (!isset($_SESSION['user_email'])) {
    echo json_encode(["success" => false, "message" => "Not authenticated"]);
    exit;
}

$user_email = $_SESSION['user_email'];

// Verify admin role
$stmt = $conn->prepare("SELECT role FROM users WHERE email = ? LIMIT 1");
$stmt->bind_param("s", $user_email);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
$stmt->close();

if (!$user || $user['role'] !== 'admin') {
    echo json_encode(["success" => false, "message" => "Unauthorized access"]);
    exit;
}

// 1. Total Users
$res = $conn->query("SELECT COUNT(*) as total FROM users");
$totalUsers = $res->fetch_assoc()['total'];

// 2. Active Teachers (status='verified')
$res = $conn->query("SELECT COUNT(*) as total FROM teachers WHERE status = 'verified'");
$totalTeachers = $res->fetch_assoc()['total'];

// 3. Active Sellers (status='verified')
$res = $conn->query("SELECT COUNT(*) as total FROM sellers WHERE status = 'verified'");
$totalSellers = $res->fetch_assoc()['total'];

// 4. Total Courses
$res = $conn->query("SELECT COUNT(*) as total FROM teacher_courses");
$totalCourses = $res->fetch_assoc()['total'];

// 5. Total Products
$res = $conn->query("SELECT COUNT(*) as total FROM products");
$totalProducts = $res->fetch_assoc()['total'];

// 6. Pending Approvals
$res = $conn->query("SELECT COUNT(*) as total FROM teachers WHERE status = 'pending'");
$pendingApprovals = $res->fetch_assoc()['total'];

echo json_encode([
    "success" => true,
    "data" => [
        "totalUsers" => $totalUsers,
        "totalTeachers" => $totalTeachers,
        "totalSellers" => $totalSellers,
        "totalCourses" => $totalCourses,
        "totalProducts" => $totalProducts,
        "pendingApprovals" => $pendingApprovals
    ]
]);

$conn->close();
