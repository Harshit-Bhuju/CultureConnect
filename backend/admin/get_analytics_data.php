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
$user = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$user || $user['role'] !== 'admin') {
    echo json_encode(["success" => false, "message" => "Unauthorized access"]);
    exit;
}

$type = $_GET['type'] ?? 'products'; // products | courses
$period = $_GET['period'] ?? 'week'; // week | month | year
$date = $_GET['date'] ?? date('Y-m-d');

$data = [];
$salesData = [];
$topItems = [];

// Helper to generate date range (Sunday to Saturday)
function getDateRange($period, $date)
{
    $time = strtotime($date);
    if ($period === 'week') {
        $w = date('w', $time); // 0 (Sun) to 6 (Sat)
        $start = date('Y-m-d', strtotime("-$w days", $time));
        $end = date('Y-m-d', strtotime("+" . (6 - $w) . " days", $time));

        $prevStart = date('Y-m-d', strtotime("-7 days", strtotime($start)));
        $prevEnd = date('Y-m-d', strtotime("-7 days", strtotime($end)));
        return [$start, $end, $prevStart, $prevEnd];
    } elseif ($period === 'month') {
        $start = date('Y-m-01', $time);
        $end = date('Y-m-t', $time);

        $prevStart = date('Y-m-d', strtotime("-1 month", strtotime($start)));
        $prevEnd = date('Y-m-t', strtotime("-1 month", strtotime($start)));
        return [$start, $end, $prevStart, $prevEnd];
    } elseif ($period === 'year') {
        $start = date('Y-01-01', $time);
        $end = date('Y-12-31', $time);

        $prevStart = date('Y-01-01', strtotime("-1 year", strtotime($start)));
        $prevEnd = date('Y-12-31', strtotime("-1 year", strtotime($start)));
        return [$start, $end, $prevStart, $prevEnd];
    }
}

function calculateGrowth($current, $previous)
{
    if ($previous <= 0) return $current > 0 ? 100 : 0;
    return round((($current - $previous) / $previous) * 100, 1);
}

list($startDate, $endDate, $prevStart, $prevEnd) = getDateRange($period, $date);

if ($type === 'products') {
    // 1. Sales Data
    $groupFormat = ($period === 'year') ? '%Y-%m' : '%Y-%m-%d';
    $sql = "SELECT DATE_FORMAT(created_at, '$groupFormat') as day, SUM(total_amount) as sales, COUNT(DISTINCT user_id) as users 
            FROM orders 
            WHERE created_at BETWEEN ? AND ? 
            GROUP BY day 
            ORDER BY day ASC";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $startDate, $endDate);
    $stmt->execute();
    $salesData = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    $stmt->close();

    // 2. Top Products
    $sql = "SELECT p.product_name as name, COUNT(o.id) as sales, SUM(o.total_amount) as revenue 
            FROM orders o 
            JOIN products p ON o.product_id = p.id 
            WHERE o.created_at BETWEEN ? AND ? 
            GROUP BY p.id 
            ORDER BY revenue DESC 
            LIMIT 5";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $startDate, $endDate);
    $stmt->execute();
    $topItems = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    $stmt->close();

    // 3. Current Totals
    $res = $conn->prepare("SELECT SUM(total_amount) as totalRevenue, COUNT(*) as totalSales FROM orders WHERE created_at BETWEEN ? AND ?");
    $res->bind_param("ss", $startDate, $endDate);
    $res->execute();
    $totals = $res->get_result()->fetch_assoc();
    $totalRevenue = $totals['totalRevenue'] ?: 0;

    // 4. Previous Totals for Growth
    $res = $conn->prepare("SELECT SUM(total_amount) as prevRevenue FROM orders WHERE created_at BETWEEN ? AND ?");
    $res->bind_param("ss", $prevStart, $prevEnd);
    $res->execute();
    $prevRevenue = $res->get_result()->fetch_assoc()['prevRevenue'] ?: 0;
    $growth = calculateGrowth($totalRevenue, $prevRevenue);

    // 5. Active Sellers (sellers who POSTED products in this period)
    $res = $conn->prepare("SELECT COUNT(DISTINCT seller_id) as activeSellers FROM products WHERE created_at BETWEEN ? AND ?");
    $res->bind_param("ss", $startDate, $endDate);
    $res->execute();
    $activeSellers = $res->get_result()->fetch_assoc()['activeSellers'] ?: 0;

    // 6. Previous Active Sellers for growth
    $res = $conn->prepare("SELECT COUNT(DISTINCT seller_id) as prevSellers FROM products WHERE created_at BETWEEN ? AND ?");
    $res->bind_param("ss", $prevStart, $prevEnd);
    $res->execute();
    $prevSellers = $res->get_result()->fetch_assoc()['prevSellers'] ?: 0;
    $sellerGrowth = calculateGrowth($activeSellers, $prevSellers);

    echo json_encode([
        "success" => true,
        "data" => [
            "salesData" => $salesData,
            "topProducts" => $topItems,
            "metrics" => [
                "totalRevenue" => $totalRevenue,
                "totalSales" => $totals['totalSales'] ?: 0,
                "activeSellers" => $activeSellers,
                "growthChange" => ($growth >= 0 ? "+" : "") . $growth . "%",
                "growthPositive" => $growth >= 0,
                "sellerGrowthChange" => ($sellerGrowth >= 0 ? "+" : "") . $sellerGrowth . "%",
                "sellerGrowthPositive" => $sellerGrowth >= 0
            ]
        ]
    ]);
} else if ($type === 'courses') {
    // 1. Enrollment Data
    $groupFormat = ($period === 'year') ? '%Y-%m' : '%Y-%m-%d';
    $sql = "SELECT DATE_FORMAT(payment_date, '$groupFormat') as day, COUNT(*) as enrollments, COUNT(DISTINCT enrollment_id) as students 
            FROM teacher_course_payment 
            WHERE payment_status = 'success' AND payment_date BETWEEN ? AND ? 
            GROUP BY day 
            ORDER BY day ASC";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $startDate, $endDate);
    $stmt->execute();
    $courseEnrollmentData = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    $stmt->close();

    // 2. Top Courses
    $sql = "SELECT tc.course_title as name, COUNT(tcp.id) as enrollments, SUM(tcp.amount) as revenue 
            FROM teacher_course_payment tcp 
            JOIN teacher_course_enroll tce ON tcp.enrollment_id = tce.id 
            JOIN teacher_courses tc ON tce.course_id = tc.id 
            WHERE tcp.payment_status = 'success' AND tcp.payment_date BETWEEN ? AND ? 
            GROUP BY tc.id 
            ORDER BY revenue DESC 
            LIMIT 5";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $startDate, $endDate);
    $stmt->execute();
    $topItems = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    $stmt->close();

    // 3. Current Totals
    $res = $conn->prepare("SELECT SUM(amount) as totalRevenue, COUNT(*) as totalEnrollments FROM teacher_course_payment WHERE payment_status = 'success' AND payment_date BETWEEN ? AND ?");
    $res->bind_param("ss", $startDate, $endDate);
    $res->execute();
    $totals = $res->get_result()->fetch_assoc();
    $totalRevenue = $totals['totalRevenue'] ?: 0;

    // 4. Previous Totals for Growth
    $res = $conn->prepare("SELECT SUM(amount) as prevRevenue FROM teacher_course_payment WHERE payment_status = 'success' AND payment_date BETWEEN ? AND ?");
    $res->bind_param("ss", $prevStart, $prevEnd);
    $res->execute();
    $prevRevenue = $res->get_result()->fetch_assoc()['prevRevenue'] ?: 0;
    $growth = calculateGrowth($totalRevenue, $prevRevenue);

    // 5. Active Experts (teachers who POSTED courses in this period)
    $res = $conn->prepare("SELECT COUNT(DISTINCT teacher_id) as activeExperts FROM teacher_courses WHERE created_at BETWEEN ? AND ?");
    $res->bind_param("ss", $startDate, $endDate);
    $res->execute();
    $activeExperts = $res->get_result()->fetch_assoc()['activeExperts'] ?: 0;

    // 6. Previous Active Experts for growth
    $res = $conn->prepare("SELECT COUNT(DISTINCT teacher_id) as prevExperts FROM teacher_courses WHERE created_at BETWEEN ? AND ?");
    $res->bind_param("ss", $prevStart, $prevEnd);
    $res->execute();
    $prevExperts = $res->get_result()->fetch_assoc()['prevExperts'] ?: 0;
    $expertGrowth = calculateGrowth($activeExperts, $prevExperts);

    echo json_encode([
        "success" => true,
        "data" => [
            "courseEnrollmentData" => $courseEnrollmentData,
            "topCourses" => $topItems,
            "metrics" => [
                "totalRevenue" => $totalRevenue,
                "totalEnrollments" => $totals['totalEnrollments'] ?: 0,
                "activeExperts" => $activeExperts,
                "growthChange" => ($growth >= 0 ? "+" : "") . $growth . "%",
                "growthPositive" => $growth >= 0,
                "expertGrowthChange" => ($expertGrowth >= 0 ? "+" : "") . $expertGrowth . "%",
                "expertGrowthPositive" => $expertGrowth >= 0
            ]
        ]
    ]);
}

$conn->close();
