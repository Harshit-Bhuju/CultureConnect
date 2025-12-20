<?php
include("../header.php");

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update'])) {
    $id = intval($_POST['image_id']);
    $sort_order = intval($_POST['sort_order']);
    $position = trim($_POST['position']);
    $section_id = intval($_POST['section_id']);

    $stmt = $conn->prepare("SELECT * FROM welcome_images WHERE image_id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $existing = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$existing) {
        echo json_encode(['status' => 'error', 'message' => 'Image not found']);
        exit;
    }

    $updates = [];
    $params = [];
    $types = '';
    $image = $existing['image'];

    if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
        $file = $_FILES['image'];
        $uploadDir = __DIR__ . "/../welcome_images/{$position}/";
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

        $info = pathinfo($file['name']);
        $ext = strtolower($info['extension']);
        $allowed = ['jpg', 'jpeg', 'png', 'gif'];
        if (!in_array($ext, $allowed)) {
            echo json_encode(['status' => 'error', 'message' => 'Invalid file type']);
            exit;
        }

        // Remove old
        if (!empty($image) && file_exists($uploadDir . $image)) {
            unlink($uploadDir . $image);
        }

        $image = 'carousel_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
        move_uploaded_file($file['tmp_name'], $uploadDir . $image);

        $updates[] = "image=?";
        $params[] = $image;
        $types .= "s";
    }

    if ($sort_order !== intval($existing['sort_order'])) {
        $updates[] = "sort_order=?";
        $params[] = $sort_order;
        $types .= "i";
    }

    if (count($updates) > 0) {
        $params[] = $id;
        $types .= "i";
        $sql = "UPDATE welcome_images SET " . implode(", ", $updates) . " WHERE image_id=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param($types, ...$params);
        if ($stmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Carousel image updated']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Update failed']);
        }
        $stmt->close();
    } else {
        echo json_encode(['status' => 'success', 'message' => 'No changes detected']);
    }
}

$conn->close();
