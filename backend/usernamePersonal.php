<?php
include("header.php");
include("username_gen.php");

// Check if username is available
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $action = $_POST['action'] ?? '';

    if ($action === 'check') {
        $username = trim($_POST['username'] ?? '');
        $currentEmail = strtolower(trim(filter_input(INPUT_POST, "email", FILTER_SANITIZE_EMAIL)));

        // Check if username exists (excluding current user)
        $stmt = $conn->prepare("SELECT email FROM users WHERE username = ? AND email != ?");
        $stmt->bind_param("ss", $username, $currentEmail);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            echo json_encode(['status' => 'taken']);
        } else {
            echo json_encode(['status' => 'available']);
        }
        $stmt->close();
    }

    // Generate username suggestions
    elseif ($action === 'suggest') {
        $email = strtolower(trim(filter_input(INPUT_POST, "email", FILTER_SANITIZE_EMAIL)));
        // generate 3 random username suggestions
        $suggestions = [];
        while (count($suggestions) < 3) {
            $newUsername = generateSignupUsername($email, $conn);
            if (!in_array($newUsername, $suggestions)) {
                $suggestions[] = $newUsername;
            }
        }

        echo json_encode(['status' => 'success', 'suggestions' => $suggestions]);
    }


    // Update username actually same code as 1st case
    elseif ($action === 'update') {
        $email = strtolower(trim($_POST['email'] ?? ''));
        $username = trim($_POST['username'] ?? '');
        // Sanitize username
        $username = htmlspecialchars($username, ENT_QUOTES);
        // Check if username exists (excluding current user)

        $checkStmt = $conn->prepare("SELECT email FROM users WHERE username = ? AND email != ?");
        $checkStmt->bind_param("ss", $username, $email);
        $checkStmt->execute();
        $checkResult = $checkStmt->get_result();

        if ($checkResult->num_rows > 0) {
            echo json_encode(["status" => "error", "message" => "Username already taken"]);
            $checkStmt->close();
            exit;
        }
        $checkStmt->close();

        // Update username in database
        $updateStmt = $conn->prepare("UPDATE users SET username = ? WHERE email = ?");
        $updateStmt->bind_param("ss", $username, $email);

        if ($updateStmt->execute()) {
            echo json_encode([
                'status' => 'success',
                'username' => $username,
                'message' => 'Username updated successfully'
            ]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Update failed']);
        }
        $updateStmt->close();
    }
}

$conn->close();
exit;
