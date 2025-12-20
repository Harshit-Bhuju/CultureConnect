<?php
session_start();
include("header.php");

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

// Fetch all pending teachers
$stmt = $conn->prepare("
    SELECT 
        t.id,
        t.teacher_name as name,
        t.bio,
        t.esewa_phone as esewa_number,
        t.primary_category as styles,
        t.profile_picture as profile_photo,
        t.created_at,
        u.email
    FROM teachers t
    JOIN users u ON t.user_id = u.id
    WHERE t.status = 'pending'
    ORDER BY t.created_at DESC
");

$stmt->execute();
$result = $stmt->get_result();

$pending_teachers = [];

while ($row = $result->fetch_assoc()) {
    $teacher_id = $row['id'];

    // Fetch certificates for this teacher
    $cert_stmt = $conn->prepare("
        SELECT certificate_filename 
        FROM teacher_certificates 
        WHERE teacher_id = ?
        ORDER BY id ASC
    ");
    $cert_stmt->bind_param("i", $teacher_id);
    $cert_stmt->execute();
    $cert_result = $cert_stmt->get_result();

    // Initialize certificates as empty array
    $certificates = [];

    // Fetch all certificates
    while ($cert = $cert_result->fetch_assoc()) {
        if (!empty($cert['certificate_filename'])) {
            $certificates[] = [
                'url' => $cert['certificate_filename']
            ];
        }
    }
    $cert_stmt->close();

    // Add certificates array to teacher data
    $row['certificates'] = $certificates;
    $row['videos'] = []; // Add empty videos array for now

    $pending_teachers[] = $row;
}

$stmt->close();

// Return response with proper JSON encoding
echo json_encode([
    "success" => true,
    "pending_teachers" => $pending_teachers
], JSON_PRETTY_PRINT);

$conn->close();
exit;
