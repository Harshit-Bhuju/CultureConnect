<?php
include("dbconnect.php");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

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



if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] === UPLOAD_ERR_OK) {
    // isset($_FILES['avatar']) - Check if an avatar file was uploaded successfully in frontend
    //like this <input type="file" name="avatar" />.

    //$_FILES['avatar']['error'] === UPLOAD_ERR_OK – ensures there were no errors during the upload.
    //Only if a file exists and was uploaded successfully, we proceed.

    // Set the upload directory (create if it doesn't exist)
    $uploadDir = __DIR__ . '/uploads/';
    if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);
    //  __DIR__ = current directory of this PHP file.
    ///uploads/ = folder where avatars will be stored.
    //is_dir() checks if the folder exists.
    //If not, mkdir() creates it with permissions 0755 (read/write/execute for owner, read/execute for others).
    //true allows nested folder creation, just in case.

    $fileTmpPath = $_FILES['avatar']['tmp_name'];
    $fileName = basename($_FILES['avatar']['name']);
    $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

    //$fileTmpPath – temporary location of uploaded file (stored by PHP).
    //$fileName – original filename uploaded by the user.
    //$fileExt – file extension (jpg, png, etc.) converted to lowercase.


    $allowedExts = ['jpg', 'jpeg', 'png', 'gif'];
    if (!in_array($fileExt, $allowedExts)) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid file type.']);
        exit;
    }

    // Delete old avatar if it exists and is not the default
    if (!empty($existingUser['profile_pic']) && file_exists(__DIR__ . '/uploads/' . $existingUser['profile_pic'])) {
        unlink(__DIR__ . '/uploads/' . $existingUser['profile_pic']);
        //unlink() is the PHP function to delete a file from the server.
    }

    // Allow only certain file types (images)
    //Ensures only allowed image types are accepted.
    //If the uploaded file is not an allowed type, return an error and stop execution.

    // Generate a unique, safe filename using email + timestamp
    $emailSafe = preg_replace('/[^a-z]/', '', explode('@', $email)[0]); // replace special chars
    $newFileName = 'profilePic_' . $emailSafe . '_' . time() . '.' . $fileExt;
    // avatar_harshit_1734876234.jpg
    // here time() is in seconds since January 1, 1970 (UTC).


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


// Update user in DB
$stmt = $conn->prepare("UPDATE users SET username=?, location=?, gender=?, profile_pic=? WHERE email=?");
$stmt->bind_param("sssss", $username, $location, $gender, $picture, $email);

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
