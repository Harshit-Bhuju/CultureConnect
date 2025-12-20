<?php
include("../header.php");

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['add'])) {
    $title = trim($_POST['title']);
    $topic = trim($_POST['topic']);
    $description = trim($_POST['description']);
    $newPosition = intval($_POST['position']); // desired position

    if (!isset($_FILES['image']) || $_FILES['image']['error'] !== 0) {
        echo json_encode(['status' => 'error', 'message' => 'Image is required']);
        exit;
    }

    $file = $_FILES['image'];

    $uploadDir = __DIR__ . '/../sliders_image/';
    if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

    $info = pathinfo($file['name']);
    $fileExt = strtolower($info['extension']);
    $allowedExts = ['jpg', 'jpeg', 'png', 'gif'];

    if (!in_array($fileExt, $allowedExts)) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid file type']);
        exit;
    }

    $newImageName = 'slider_' . time() . '_' . bin2hex(random_bytes(8)) . '.' . $fileExt;
    move_uploaded_file($file['tmp_name'], $uploadDir . $newImageName);

    // Shift existing sliders down to make room
    $conn->query("UPDATE sliders SET position = position + 1 WHERE position >= $newPosition");

    // Insert new slider
    $stmt = $conn->prepare("INSERT INTO sliders (title, topic, description, image, position) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssi", $title, $topic, $description, $newImageName, $newPosition);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Slider added']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Insert failed']);
    }

    $stmt->close();
    $conn->close();
}
