<?php
include("../header.php");

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update'])) {
    $id = intval($_POST['id']);
    $title = trim($_POST['title']);
    $topic = trim($_POST['topic']);
    $description = trim($_POST['description']);
    $position = intval($_POST['position']); // new position from frontend

    // Fetch existing slider
    $stmt = $conn->prepare("SELECT * FROM sliders WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $exist = $result->fetch_assoc();

    if (!$exist) {
        echo json_encode(['status' => 'error', 'message' => 'Slider not found']);
        exit;
    }

    $oldPosition = $exist['position'];
    $image = $exist['image'];

    $updates = [];
    $params = [];
    $types = '';

    // Update title
    if ($title !== $exist['title']) {
        $updates[] = "title=?";
        $params[] = $title;
        $types .= "s";
    }

    // Update topic
    if ($topic !== $exist['topic']) {
        $updates[] = "topic=?";
        $params[] = $topic;
        $types .= "s";
    }

    // Update description
    if ($description !== $exist['description']) {
        $updates[] = "description=?";
        $params[] = $description;
        $types .= "s";
    }

    // Handle image upload
    if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
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

        // Delete old image if exists
        if (!empty($image) && file_exists($uploadDir . $image)) {
            unlink($uploadDir . $image);
        }

        // Generate new image name
        $image = 'slider_' . time() . '_' . bin2hex(random_bytes(8)) . '.' . $fileExt;
        move_uploaded_file($file['tmp_name'], $uploadDir . $image);

        $updates[] = "image=?";
        $params[] = $image;
        $types .= "s";
    }

    // Update position if changed
    if ($position !== $oldPosition) {
        if ($position < $oldPosition) {
            // Slider moved up: increment positions between new and old
            $conn->query("UPDATE sliders SET position = position + 1 WHERE position >= $position AND position < $oldPosition AND id != $id");
        } else {
            // Slider moved down: decrement positions between old and new
            $conn->query("UPDATE sliders SET position = position - 1 WHERE position <= $position AND position > $oldPosition AND id != $id");
        }
        $updates[] = "position=?";
        $params[] = $position;
        $types .= "i";
    }

    // Execute update if there is any change
    if (count($updates) > 0) {
        $params[] = $id;
        $types .= "i";
        $sql = "UPDATE sliders SET " . implode(", ", $updates) . " WHERE id=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param($types, ...$params);

        if ($stmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Slider updated successfully']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Update failed']);
        }
        $stmt->close();
    } else {
        echo json_encode(['status' => 'success', 'message' => 'No changes detected']);
    }

}
$conn->close();
