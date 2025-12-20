<?php
include("../header.php");

$stmt = $conn->prepare("SELECT username, email, profile_pic FROM users WHERE role='admin' LIMIT 1");
$stmt->execute();
$result = $stmt->get_result();
$admin = $result->fetch_assoc();
$stmt->close();

if ($admin) {
    // send full URL for profile pic
    $admin['profile_pic'] = 'http://localhost/CultureConnect/backend/uploads/' . ($admin['profile_pic']);
    echo json_encode(['status'=>'success', 'data'=>$admin]);
} else {
    echo json_encode(['status'=>'error', 'message'=>'Admin not found']);
}

$conn->close();
