<?php
include("../header.php");

// Fetch all users with role='user'
$stmt = $conn->prepare("SELECT id, username, email, gender, location, profile_pic, created_at FROM users WHERE role = 'user' ORDER BY id ASC");
$stmt->execute();
$result = $stmt->get_result();

$users = [];
while ($row = $result->fetch_assoc()) {
    if (!empty($row['profile_pic']) && strpos($row['profile_pic'], 'http://') !== 0 && strpos($row['profile_pic'], 'https://') !== 0) {
        //strpos($row['profile_pic'], 'http://') !== 0 
        // as if there is no space in a text like https://google it will count whole text as index 0
        //so image ko aaghi http aaye bhane yesari jau
        $row['profile_pic'] = "http://localhost/CultureConnect/backend/uploads/" . $row['profile_pic'];
    }

    $users[] = $row;
}

echo json_encode($users);

$stmt->close();
$conn->close();
exit;
