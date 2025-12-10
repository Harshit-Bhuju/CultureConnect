<?php
include("header.php");

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $email = strtolower(trim(filter_input(INPUT_POST, "email", FILTER_SANITIZE_EMAIL)));
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["status" => "error", "message" => "Invalid email format."]);
        exit;
    }

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

    $province = trim($_POST['province'] ?? '');
    $province = $province === '' ? $existingUser['province'] : htmlspecialchars($province, ENT_QUOTES);

    $district = trim($_POST['district'] ?? '');
    $district = $district === '' ? $existingUser['district'] : htmlspecialchars($district, ENT_QUOTES);

    $municipality = trim($_POST['municipality'] ?? '');
    $municipality = $municipality === '' ? $existingUser['municipality'] : htmlspecialchars($municipality, ENT_QUOTES);

    $ward = trim($_POST['ward'] ?? '');
    $ward = $ward === '' ? $existingUser['ward'] : htmlspecialchars($ward, ENT_QUOTES);

    $gender = trim($_POST['gender'] ?? '');
    $allowedGenders = ["Male", "Female", "Prefer not to say"];
    $gender = in_array($gender, $allowedGenders) ? $gender : $existingUser['gender'];

    $picture = $existingUser['profile_pic'];

    if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] === 0) {
        $file = $_FILES['avatar'];
        $uploadDir = __DIR__ . '/uploads/';

        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $fileTmpPath = $file['tmp_name'];
        $info = pathinfo($file['name']);
        $fileExt = strtolower($info['extension']);
        //very important to check if the file is an image
        if (!getimagesize($_FILES['avatar']['tmp_name'])) {
            echo json_encode(["status" => "error", "message" => "Not a valid image."]);
            exit;
        }
        $allowedExts = ['jpg', 'jpeg', 'png', 'gif'];
        if (!in_array($fileExt, $allowedExts)) {
            echo json_encode(['status' => 'error', 'message' => 'Invalid file type.']);
            exit;
        }
        // Check file size (max 5MB)
        if ($file['size'] > 5 * 1024 * 1024) {
            echo json_encode(['status' => 'error', 'message' => 'Logo file too large. Maximum 5MB']);
            exit;
        }

        if (!empty($existingUser['profile_pic']) && file_exists(__DIR__ . '/uploads/' . $existingUser['profile_pic'])) {
            if ($existingUser['profile_pic'] !== 'default-image.jpg') {
                unlink(__DIR__ . '/uploads/' . $existingUser['profile_pic']);
            }
        }

        $emailSafe = preg_replace('/[^a-z]/', '', explode('@', $email)[0]);
        $newFileName = 'profilePic_' . $emailSafe . '_' . bin2hex(random_bytes(16)) . '.' . $fileExt;
        $destPath = $uploadDir . $newFileName;

        if (move_uploaded_file($fileTmpPath, $destPath)) {
            $picture = $newFileName;
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Avatar upload failed']);
            exit;
        }
    }

    $updates = [];
    $params = [];
    $types = "";

    if ($province !== $existingUser['province']) {
        $updates[] = "province=?";
        $params[] = $province;
        $types .= "s";
    }
    if ($district !== $existingUser['district']) {
        $updates[] = "district=?";
        $params[] = $district;
        $types .= "s";
    }
    if ($municipality !== $existingUser['municipality']) {
        $updates[] = "municipality=?";
        $params[] = $municipality;
        $types .= "s";
    }
    if ($ward !== $existingUser['ward']) {
        $updates[] = "ward=?";
        $params[] = $ward;
        $types .= "s";
    }
    if ($gender !== $existingUser['gender']) {
        $updates[] = "gender=?";
        $params[] = $gender;
        $types .= "s";
    }
    if ($picture !== $existingUser['profile_pic']) {
        $updates[] = "profile_pic=?";
        $params[] = $picture;
        $types .= "s";
    }

    if (count($updates) > 0) {
        $query = "UPDATE users SET " . implode(", ", $updates) . " WHERE email=?";
        $params[] = $email;
        $types .= "s";

        $stmt = $conn->prepare($query);
        $stmt->bind_param($types, ...$params);
        if ($stmt->execute()) {
            echo json_encode([
                'status' => 'success',
                'username' => $existingUser['username'],
                "location" => [
                    'province' => $province,
                    'district' => $district,
                    'municipality' => $municipality,
                    'ward' => $ward
                ],
                'gender' => $gender,
                'avatar' => $picture
            ]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Update failed']);
        }
        $stmt->close();
    }
}

$conn->close();
exit;
