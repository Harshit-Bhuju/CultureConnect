<?php
include("../header.php");

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update'])) {
    $id = intval($_POST['section_id']);
    $title = trim($_POST['title']);
    $subtitle = trim($_POST['subtitle']);
    $description = trim($_POST['description']);

    $stmt = $conn->prepare("SELECT * FROM welcome_sections WHERE section_id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $existing = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$existing) {
        echo json_encode(['status' => 'error', 'message' => 'Section not found']);
        exit;
    }

    $updates = [];
    $params = [];
    $types = '';

    if ($title !== $existing['title']) {
        $updates[] = "title=?";
        $params[] = $title;
        $types .= "s";
    }

    if ($subtitle !== $existing['subtitle']) {
        $updates[] = "subtitle=?";
        $params[] = $subtitle;
        $types .= "s";
    }

    if ($description !== $existing['description']) {
        $updates[] = "description=?";
        $params[] = $description;
        $types .= "s";
    }

    if (count($updates) > 0) {
        $params[] = $id;
        $types .= "i";
        $sql = "UPDATE welcome_sections SET " . implode(", ", $updates) . " WHERE section_id=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param($types, ...$params);

        if ($stmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Section updated successfully']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Update failed']);
        }
        $stmt->close();
    } else {
        echo json_encode(['status' => 'success', 'message' => 'No changes detected']);
    }
}

$conn->close();
