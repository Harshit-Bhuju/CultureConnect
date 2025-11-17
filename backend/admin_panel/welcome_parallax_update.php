<?php
include("../header.php");

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update'])) {
    $id = intval($_POST['id']);
    $heading = trim($_POST['heading']);
    $subheading = trim($_POST['subheading']);
    $position = trim($_POST['position']);

    $stmt = $conn->prepare("SELECT * FROM welcome_parallax WHERE parallax_id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $existing = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$existing) {
        echo json_encode(['status' => 'error', 'message' => 'Parallax not found']);
        exit;
    }

    $updates = [];
    $params = [];
    $types = '';
    $image = $existing['image'];

    if ($heading !== $existing['heading']) {
        $updates[] = "heading=?";
        $params[] = $heading;
        $types .= "s";
    }

    if ($subheading !== $existing['subheading']) {
        $updates[] = "subheading=?";
        $params[] = $subheading;
        $types .= "s";
    }

    if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
        $uploadDir = __DIR__ . "/../welcome_images/parallax/";
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

        $info = pathinfo($_FILES['image']['name']);
        $ext = strtolower($info['extension']);
        $allowed = ['jpg', 'jpeg', 'png', 'webp'];
        if (!in_array($ext, $allowed)) {
            echo json_encode(['status' => 'error', 'message' => 'Invalid file type']);
            exit;
        }

        if (!empty($image) && file_exists($uploadDir . $image)) {
            unlink($uploadDir . $image);
        }

        $image = 'parallax_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
        move_uploaded_file($_FILES['image']['tmp_name'], $uploadDir . $image);

        $updates[] = "image=?";
        $params[] = $image;
        $types .= "s";
    }

    if (count($updates) > 0) {
        $params[] = $id;
        $types .= "i";
        $sql = "UPDATE welcome_parallax SET " . implode(", ", $updates) . " WHERE parallax_id=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param($types, ...$params);
        if ($stmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Parallax updated successfully']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Update failed']);
        }
        $stmt->close();
    } else {
        echo json_encode(['status' => 'success', 'message' => 'No changes detected']);
    }
}

$conn->close();