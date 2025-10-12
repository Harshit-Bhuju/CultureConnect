<?php
include("header.php");

// Get email first to identify user
$email = strtolower(trim(filter_input(INPUT_POST, "email", FILTER_SANITIZE_EMAIL)));
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["status" => "error", "message" => "Invalid email format."]);
    exit;
}

// Fetch existing user
$stmt = $conn->prepare("SELECT * FROM users WHERE email = ? LIMIT 1");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$existingUser = $result->fetch_assoc();
$stmt->close();

if (!$existingUser) {
    echo json_encode(["status" => "error", "message" => "User not found."]);
    exit;
}

// Sanitize and preserve old values if fields not changed
$username = trim($_POST['username'] ?? '');
$username = $username === '' ? $existingUser['username'] : htmlspecialchars($username, ENT_QUOTES);
//if ''(null) then existingUser else validate $username terniary operator is used here

$location = trim($_POST['location'] ?? '');
$location = $location === '' ? $existingUser['location'] : htmlspecialchars($location, ENT_QUOTES);

$gender = trim($_POST['gender'] ?? '');
$allowedGenders = ["Male", "Female", "Prefer not to say"];
$gender = in_array($gender, $allowedGenders) ? $gender : $existingUser['gender'];

$picture = $existingUser['profile_pic']; // keep old avatar by default

$file = $_FILES['avatar'];

if (isset($file) && $file['error'] === 0) {

    $uploadDir = __DIR__ . '/uploads/';

    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    //  __DIR__ = current directory of this PHP file.
    ///uploads/ = folder where avatars will be stored.
    //is_dir() checks if the folder exists.
    //If not, mkdir() creates it with permissions 0755 (read/write/execute for owner, read/execute for others).
    //true allows nested folder creation, just in case.

    $fileTmpPath = $file['tmp_name'];
    //$fileTmpPath – temporary location of uploaded file (stored by PHP).

    $info = pathinfo($file['name']);
    $fileName = $info['basename'];
    $fileExt = strtolower($info['extension']);
    //pathinfo()
    // var/www/html/uploads/profilePic_harshit_1734876234.jpg
    // we take only wxtension
    // Array
    // (
    //     [dirname] => /var/www/html/uploads
    //     [basename] => profilePic_harshit_1734876234.jpg
    //     [extension] => jpg
    //     [filename] => profilePic_harshit_1734876234
    // )

    //$fileName – original filename uploaded by the user.
    //$fileExt – file extension (jpg, png, etc.) converted to lowercase.


    $allowedExts = ['jpg', 'jpeg', 'png', 'gif'];
    if (!in_array($fileExt, $allowedExts)) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid file type.']);
        exit;
    }
    // Allow only certain file types (images)
    //Ensures only allowed image types are accepted.
    //If the uploaded file is not an allowed type, return an error and stop execution.


    // Delete old avatar if it exists and is not the default
    if (!empty($existingUser['profile_pic']) && file_exists(__DIR__ . '/uploads/' . $existingUser['profile_pic'])) {
        unlink(__DIR__ . '/uploads/' . $existingUser['profile_pic']);
        //unlink() is the PHP function to delete a file from the server.
    }

    // Generate a unique, safe filename using email + timestamp
    $emailSafe = preg_replace('/[^a-z]/', '', explode('@', $email)[0]); // replace special chars
    $newFileName = 'profilePic_' . $emailSafe . '_' . bin2hex(random_bytes(16)) . '.' . $fileExt;

    // Full destination path
    $destPath = $uploadDir . $newFileName;
    //  $destPath will save C:\xampp\htdocs\CultureConnect\backend\uploads\avatar_harshit_1734876234.jpg


    // Move the uploaded file to the uploads directory
    if (move_uploaded_file($fileTmpPath, $destPath)) {
        $picture = $newFileName;
        // move_uploaded_file() – moves the file from temporary folder to your uploads folder.
        //If successful: $picture stores the relative path to save in the database.
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Avatar upload failed']);
        exit;
    }
}

$updates = [];
$params = [];
$types = "";

// Compare each field to check if changed
if ($username !== $existingUser['username']) {
    $updates[] = "username=?";
    $params[] = $username;
    $types = $types . "s";
}

if ($location !== $existingUser['location']) {
    $updates[] = "location=?";
    $params[] = $location;
    $types = $types . "s";
}

if ($gender !== $existingUser['gender']) {
    $updates[] = "gender=?";
    $params[] = $gender;
    $types = $types . "s";
}

if ($picture !== $existingUser['profile_pic']) {
    $updates[] = "profile_pic=?";
    $params[] = $picture;
    $types = $types . "s";
}

// If nothing changed
if (empty($updates)) {
    echo json_encode(["status" => "success", "message" => "No changes detected."]);
    exit;
}


$query = "UPDATE users SET " . implode(", ", $updates) . " WHERE email=?";
//implode(", ", $updates) => username=?, location=?, gender=?, picture=? 
//its in string form
$params[] = $email;
$types = $types . "s";

$stmt = $conn->prepare($query);
$stmt->bind_param($types, ...$params);
//$params = [$username, $location, $gender, $email];
//so ...$params spreads the array so each element becomes a separate argument.
//now it will be like $stmt->bind_param($types, $username, $location, $gender, $picture, $email);
// we cant do implode as it converts into string so if $username then it will be harman like that

if ($stmt->execute()) {
    echo json_encode([
        'status' => 'success',
        'username' => $username,
        'location' => $location,
        'gender' => $gender,
        'avatar' => $picture
    ]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Update failed']);
}

$stmt->close();
$conn->close();
exit;
