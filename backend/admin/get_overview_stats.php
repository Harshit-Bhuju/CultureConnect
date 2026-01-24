<?php
require_once __DIR__ . '/../config/session_config.php';
include("../config/header.php");

// Check authentication
if (!isset($_SESSION['user_email'])) {
    echo json_encode(["success" => false, "message" => "Not authenticated"]);
    exit;
}

$user_email = $_SESSION['user_email'];

// Verify admin role
$stmt = $conn->prepare("SELECT role FROM users WHERE email = ? LIMIT 1");
$stmt->bind_param("s", $user_email);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$user || $user['role'] !== 'admin') {
    echo json_encode(["success" => false, "message" => "Unauthorized access"]);
    exit;
}

$filterType = $_GET['filter_type'] ?? 'all'; // 'marketplace', 'learn_culture', 'all'
$subCategory = $_GET['sub_category'] ?? '';

// Global: Total Users (always shown)
$res = $conn->query("SELECT COUNT(*) as total FROM users");
$totalUsers = $res->fetch_assoc()['total'];

$response = [
    "totalUsers" => $totalUsers,
    "totalTeachers" => 0,
    "totalSellers" => 0,
    "totalCourses" => 0,
    "totalProducts" => 0,
    "activeFilter" => $filterType
];

// 1. Marketplace Stats
if ($filterType === 'all' || $filterType === 'marketplace') {
    $whereClause = "";
    $params = [];
    $types = "";

    if (!empty($subCategory) && $subCategory !== 'all') {
        // Map UI category names to DB values if needed, otherwise assume direct match
        // Based on user prompt: "products category are cultural-clothes musical-instruments and handicraft-decors"
        $dbCategory = $subCategory;
        if ($subCategory === 'Traditional Clothing') $dbCategory = 'cultural-clothes';
        if ($subCategory === 'Musical Instruments') $dbCategory = 'musical-instruments'; // Note: Same name used in both
        if ($subCategory === 'Arts & Decors') $dbCategory = 'handicraft-decors';

        $whereClause = "WHERE category = ?";
        $params[] = $dbCategory;
        $types .= "s";
    }

    // Total Products
    $sql = "SELECT COUNT(*) as total FROM products $whereClause";
    $stmt = $conn->prepare($sql);
    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }
    $stmt->execute();
    $response['totalProducts'] = $stmt->get_result()->fetch_assoc()['total'];
    $stmt->close();

    // Total Sellers (who have products in this category)
    $sql = "SELECT COUNT(DISTINCT seller_id) as total FROM products $whereClause";
    $stmt = $conn->prepare($sql);
    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }
    $stmt->execute();
    $response['totalSellers'] = $stmt->get_result()->fetch_assoc()['total'];
    $stmt->close();
}

// 2. Learn Culture Stats
if ($filterType === 'all' || $filterType === 'learn_culture') {
    $whereClause = "";
    $params = [];
    $types = "";

    if (!empty($subCategory) && $subCategory !== 'all') {
        // Map UI category names to DB values
        // Assuming DB values match the UI names roughly or standard slug format
        // User listed: Cultural Dances, Cultural Singing, Musical Instruments, Cultural Art & Crafts
        // I will attempt to match loosely or use the exact string if the DB uses full names
        $dbCategory = $subCategory; // Default to exact match

        $whereClause = "WHERE category = ?";
        $params[] = $dbCategory;
        $types .= "s";
    }

    // Total Courses
    $sql = "SELECT COUNT(*) as total FROM teacher_courses $whereClause";
    $stmt = $conn->prepare($sql);
    if ($stmt) {
        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }
        $stmt->execute();
        $response['totalCourses'] = $stmt->get_result()->fetch_assoc()['total'];
        $stmt->close();
    }

    // Total Experts (who have courses in this category)
    $sql = "SELECT COUNT(DISTINCT teacher_id) as total FROM teacher_courses $whereClause";
    $stmt = $conn->prepare($sql);
    if ($stmt) {
        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }
        $stmt->execute();
        $response['totalTeachers'] = $stmt->get_result()->fetch_assoc()['total'];
        $stmt->close();
    }
}

echo json_encode([
    "success" => true,
    "data" => $response
]);

$conn->close();
