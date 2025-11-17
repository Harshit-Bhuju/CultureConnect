<?php
include("../header.php");

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete'])) {
    $id = intval($_POST['id']);

    // Fetch the slider to get image & position
    $stmt = $conn->prepare("SELECT image, position FROM sliders WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();

    if (!$result) {
        echo json_encode(['status' => 'error', 'message' => 'Slider not found']);
        exit;
    }

    $image = $result['image'];
    $delPosition = $result['position'];

    // Delete row
    $stmt = $conn->prepare("DELETE FROM sliders WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        // Delete image
        $uploadDir = __DIR__ . '/../sliders_image/';
        if (!empty($image) && file_exists($uploadDir . $image)) {
            unlink($uploadDir . $image);
        }

        // Shift positions up to remove gap
        $conn->query("UPDATE sliders SET position = position - 1 WHERE position > $delPosition");

        echo json_encode(['status' => 'success', 'message' => 'Slider deleted']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Delete failed']);
    }

    $stmt->close();
}
$conn->close();
