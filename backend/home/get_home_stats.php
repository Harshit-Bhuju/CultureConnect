<?php
include("../config/header.php");

try {
    // 1. Total Sellers
    $seller_query = "SELECT COUNT(*) as total_sellers FROM sellers";
    $seller_result = $conn->query($seller_query);
    $total_sellers = $seller_result->fetch_assoc()['total_sellers'] ?? 0;

    // 2. Total Products
    $product_query = "SELECT COUNT(*) as total_products FROM products";
    $product_result = $conn->query($product_query);
    $total_products = $product_result->fetch_assoc()['total_products'] ?? 0;

    // 3. Total Teachers (Experts)
    $teacher_query = "SELECT COUNT(*) as total_teachers FROM teachers WHERE status = 'approved'";
    $teacher_result = $conn->query($teacher_query);
    $total_teachers = $teacher_result->fetch_assoc()['total_teachers'] ?? 0;

    // 4. Total Courses
    $course_query = "SELECT COUNT(*) as total_courses FROM teacher_courses";
    $course_result = $conn->query($course_query);
    $total_courses = $course_result->fetch_assoc()['total_courses'] ?? 0;

    echo json_encode([
        "status" => "success",
        "data" => [
            "total_sellers" => (int)$total_sellers,
            "total_products" => (int)$total_products,
            "total_teachers" => (int)$total_teachers,
            "total_courses" => (int)$total_courses
        ]
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Failed to fetch stats: " . $e->getMessage()
    ]);
} finally {
    if (isset($conn)) {
        $conn->close();
    }
}
