<?php
include("../header.php");

$defaultImageName = "default-image.jpg";
if (isset($_FILES['default_profile']) && $_FILES['default_profile']['error'] === 0) {
    $file = $_FILES['default_profile'];
    $uploadDir = __DIR__ . '/../uploads/';

    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $info = pathinfo($file['name']);
    $fileExt = strtolower($info['extension']);

    // Delete the old default image if it exists
    $oldDefaultPath = $uploadDir . $defaultImageName;
    if (file_exists($oldDefaultPath)) {
        unlink($oldDefaultPath);
    }

    // Save new default image with same name
    $newFileName = $defaultImageName;
    $destPath = $uploadDir . $newFileName;

    if (move_uploaded_file($file['tmp_name'], $destPath)) {
        echo json_encode(['status' => 'success', 'message' => 'Default profile image updated successfully.']);
        exit;
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Upload failed.']);
        exit;
    }
}
$conn->close();
