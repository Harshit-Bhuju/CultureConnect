<?php
session_start();
include("header.php");
include("mail.php");

// Check if user is admin
if (!isset($_SESSION['user_email'])) {
    echo json_encode(["success" => false, "message" => "Not authenticated"]);
    exit;
}

$user_email = $_SESSION['user_email'];

// Verify admin role
$stmt = $conn->prepare("SELECT role FROM users WHERE email = ? LIMIT 1");
$stmt->bind_param("s", $user_email);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
$stmt->close();

if (!$user || $user['role'] !== 'admin') {
    echo json_encode(["success" => false, "message" => "Unauthorized access"]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $teacher_id = $_POST['teacher_id'] ?? null;
    $action = $_POST['action'] ?? null; // 'approve', 'reject', or 'cancel'

    if (!$teacher_id || !in_array($action, ['approve', 'reject', 'cancel'])) {
        echo json_encode(["success" => false, "message" => "Invalid parameters"]);
        exit;
    }

    // Get teacher details
    $stmt = $conn->prepare("
        SELECT t.*, u.email, u.id as user_id
        FROM teachers t
        JOIN users u ON t.user_id = u.id
        WHERE t.id = ? AND t.status = 'pending'
        LIMIT 1
    ");
    $stmt->bind_param("i", $teacher_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $teacher = $result->fetch_assoc();
    $stmt->close();

    if (!$teacher) {
        echo json_encode(["success" => false, "message" => "Teacher not found or already processed"]);
        exit;
    }

    $teacher_email = $teacher['email'];
    $teacher_name = $teacher['teacher_name'];
    $user_id = $teacher['user_id'];

    if ($action === 'approve') {
        // Update teacher status to verified
        $update_stmt = $conn->prepare("UPDATE teachers SET status = 'verified' WHERE id = ?");
        $update_stmt->bind_param("i", $teacher_id);

        if ($update_stmt->execute()) {
            $update_stmt->close();

            // Send response immediately
            $response = ["success" => true, "message" => "Teacher approved successfully"];
            sendResponseAndContinue($response);

            // Send approval email
            sendTeacherVerifiedEmail($teacher_email, $teacher_name);
            exit;
        } else {
            $update_stmt->close();
            echo json_encode(["success" => false, "message" => "Failed to approve teacher"]);
            exit;
        }
    } } elseif ($action === 'reject' || $action === 'cancel') {
        // Begin transaction for deletion
        $conn->begin_transaction();

        try {
            // Get certificate filenames before deletion
            $cert_stmt = $conn->prepare("SELECT certificate_filename FROM teacher_certificates WHERE teacher_id = ?");
            $cert_stmt->bind_param("i", $teacher_id);
            $cert_stmt->execute();
            $cert_result = $cert_stmt->get_result();
            $certificate_files = [];
            while ($row = $cert_result->fetch_assoc()) {
                $certificate_files[] = $row['certificate_filename'];
            }
            $cert_stmt->close();

            // Get profile picture filename
            $profile_picture = $teacher['profile_picture'];

            // Delete all certificates from database
            $delete_certs = $conn->prepare("DELETE FROM teacher_certificates WHERE teacher_id = ?");
            $delete_certs->bind_param("i", $teacher_id);
            $delete_certs->execute();
            $delete_certs->close();

            // Delete the teacher record from database
            $delete_teacher = $conn->prepare("DELETE FROM teachers WHERE id = ?");
            $delete_teacher->bind_param("i", $teacher_id);
            $delete_teacher->execute();
            $delete_teacher->close();

            // Update user role back to regular user or buyer
            $role_stmt = $conn->prepare("SELECT role FROM users WHERE id = ? LIMIT 1");
            $role_stmt->bind_param("i", $user_id);
            $role_stmt->execute();
            $role_result = $role_stmt->get_result();
            $current_role = $role_result->fetch_assoc()['role'];
            $role_stmt->close();

            // Revert role
            $new_role = ($current_role === 'seller_teacher') ? 'seller' : 'user';
            $update_role_stmt = $conn->prepare("UPDATE users SET role = ? WHERE id = ?");
            $update_role_stmt->bind_param("si", $new_role, $user_id);
            $update_role_stmt->execute();
            $update_role_stmt->close();

            // Commit transaction
            $conn->commit();

            // Delete physical files after successful database operations
            // Delete profile picture
            if (!empty($profile_picture)) {
                $profile_path = __DIR__ . '/teacher_datas/profile_pictures/' . $profile_picture;
                if (file_exists($profile_path)) {
                    unlink($profile_path);
                }
            }

            // Delete certificate files
            foreach ($certificate_files as $cert_file) {
                $cert_path = __DIR__ . '/teacher_datas/certificates/' . $cert_file;
                if (file_exists($cert_path)) {
                    unlink($cert_path);
                }
            }

            // Determine message based on action
            $message = "Teacher application rejected successfully";

            // Send response immediately
            $response = ["success" => true, "message" => $message];
            sendResponseAndContinue($response);

            // Send appropriate email
            sendTeacherRejectedEmail($teacher_email, $teacher_name);
            exit;
        } catch (Exception $e) {
            // Rollback on error
            $conn->rollback();
            echo json_encode(["success" => false, "message" => "Failed to process request: " . $e->getMessage()]);
            exit;
        }
    }


$conn->close();
exit;
