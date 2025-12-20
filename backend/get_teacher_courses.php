<?php
session_start();
include("header.php");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Check if user is logged in
    if (!isset($_SESSION['user_email'])) {
        echo json_encode(["status" => "error", "message" => "User not logged in"]);
        exit;
    }

    $user_email = $_SESSION['user_email'];

    // Fetch user and teacher info
    $stmt = $conn->prepare("SELECT u.id, t.id as teacher_id FROM users u LEFT JOIN teachers t ON u.id = t.user_id WHERE u.email = ? LIMIT 1");
    $stmt->bind_param("s", $user_email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $stmt->close();

    if (!$user) {
        echo json_encode(["status" => "error", "message" => "User not found"]);
        exit;
    }

    if (!$user['teacher_id']) {
        echo json_encode(["status" => "error", "message" => "No teacher account found"]);
        exit;
    }

    $teacher_id = $user['teacher_id'];

    // Get and sanitize form data
    $course_title = trim($_POST['courseTitle'] ?? '');
    $category = trim($_POST['category'] ?? '');
    $skill_level = trim($_POST['skillLevel'] ?? '');
    $is_premium = isset($_POST['isPremium']) ? (bool)$_POST['isPremium'] : true;
    $price = trim($_POST['price'] ?? '0');
    $duration_weeks = trim($_POST['durationWeeks'] ?? '');
    $description = trim($_POST['description'] ?? '');
    $what_you_will_learn = trim($_POST['whatYouWillLearn'] ?? '');
    $requirements = trim($_POST['requirements'] ?? '');
    $language = trim($_POST['language'] ?? 'English');
    $status = trim($_POST['status'] ?? 'draft'); // 'draft' or 'published'

    // Get tags array
    $tags = isset($_POST['tags']) ? json_decode($_POST['tags'], true) : [];

    // Basic validation
    if (empty($course_title) || strlen($course_title) < 3 || strlen($course_title) > 255) {
        echo json_encode(["status" => "error", "message" => "Invalid course title (3-255 characters)"]);
        exit;
    }

    if (empty($category)) {
        echo json_encode(["status" => "error", "message" => "Category is required"]);
        exit;
    }

    $valid_categories = ['dance', 'music', 'yoga', 'art', 'language'];
    if (!in_array($category, $valid_categories)) {
        echo json_encode(["status" => "error", "message" => "Invalid category"]);
        exit;
    }

    if (empty($skill_level)) {
        echo json_encode(["status" => "error", "message" => "Skill level is required"]);
        exit;
    }

    $valid_skill_levels = ['beginner', 'intermediate', 'advanced', 'all'];
    if (!in_array($skill_level, $valid_skill_levels)) {
        echo json_encode(["status" => "error", "message" => "Invalid skill level"]);
        exit;
    }

    if ($is_premium && (!is_numeric($price) || $price <= 0)) {
        echo json_encode(["status" => "error", "message" => "Valid price required for premium courses"]);
        exit;
    }

    if (!$is_premium) {
        $price = 0;
    }

    if (!is_numeric($duration_weeks) || $duration_weeks < 1) {
        echo json_encode(["status" => "error", "message" => "Duration must be at least 1 week"]);
        exit;
    }

    if (empty($description) || strlen($description) < 20 || strlen($description) > 2000) {
        echo json_encode(["status" => "error", "message" => "Description must be 20-2000 characters"]);
        exit;
    }

    if (!in_array($status, ['draft', 'published'])) {
        echo json_encode(["status" => "error", "message" => "Invalid status"]);
        exit;
    }

    // Validate tags
    if (empty($tags) || !is_array($tags)) {
        echo json_encode(["status" => "error", "message" => "At least one tag is required"]);
        exit;
    }

    if (count($tags) > 10) {
        echo json_encode(["status" => "error", "message" => "Maximum 10 tags allowed"]);
        exit;
    }

    foreach ($tags as $tag) {
        if (strlen($tag) > 30) {
            echo json_encode(["status" => "error", "message" => "Tag too long (max 30 characters)"]);
            exit;
        }
    }

    // Handle video uploads
    if (!isset($_FILES['videos']) || empty($_FILES['videos']['name'][0])) {
        echo json_encode(["status" => "error", "message" => "At least one course video is required"]);
        exit;
    }

    $videoUploadDir = __DIR__ . '/teacher_datas/course_videos/';
    if (!is_dir($videoUploadDir)) {
        mkdir($videoUploadDir, 0755, true);
    }

    $uploadedVideos = [];
    $allowedVideoExts = ['mp4', 'mov', 'avi', 'mkv', 'webm'];
    $maxVideoSize = 500 * 1024 * 1024; // 500MB

    foreach ($_FILES['videos']['tmp_name'] as $key => $tmpName) {
        if ($_FILES['videos']['error'][$key] !== 0) {
            continue;
        }

        $fileName = $_FILES['videos']['name'][$key];
        $fileSize = $_FILES['videos']['size'][$key];
        $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

        if (!in_array($fileExt, $allowedVideoExts)) {
            echo json_encode(["status" => "error", "message" => "Invalid video file type. Only MP4, MOV, AVI, MKV, WEBM allowed"]);
            exit;
        }

        if ($fileSize > $maxVideoSize) {
            echo json_encode(["status" => "error", "message" => "Video file too large. Maximum 500MB per video"]);
            exit;
        }

        // Generate unique filename
        $newFileName = 'video_' . $teacher_id . '_' . bin2hex(random_bytes(8)) . '.' . $fileExt;
        $targetPath = $videoUploadDir . $newFileName;

        if (!move_uploaded_file($tmpName, $targetPath)) {
            echo json_encode(["status" => "error", "message" => "Failed to upload video"]);
            exit;
        }

        $uploadedVideos[] = [
            'filename' => $newFileName,
            'original_name' => $fileName,
            'size' => number_format($fileSize / (1024 * 1024), 2) . ' MB'
        ];
    }

    if (count($uploadedVideos) === 0) {
        echo json_encode(["status" => "error", "message" => "No valid videos uploaded"]);
        exit;
    }

    if (count($uploadedVideos) > 20) {
        echo json_encode(["status" => "error", "message" => "Maximum 20 videos allowed per course"]);
        exit;
    }

    // Start transaction
    $conn->begin_transaction();

    try {
        // Insert into teacher_courses table
        // Optional: handle course thumbnail if supplied
        $courseThumbnailName = null;
        if (isset($_FILES['course_thumbnail']) && !empty($_FILES['course_thumbnail']['name'])) {
            if ($_FILES['course_thumbnail']['error'] !== 0) {
                throw new Exception("Failed to upload course thumbnail");
            }
            $ctmp = $_FILES['course_thumbnail']['tmp_name'];
            $ctsize = $_FILES['course_thumbnail']['size'];
            $ctname = $_FILES['course_thumbnail']['name'];
            $ctext = strtolower(pathinfo($ctname, PATHINFO_EXTENSION));
            $allowedImageExts = ['jpg','jpeg','png','webp'];
            $maxImageSize = 5 * 1024 * 1024; // 5MB
            if (!in_array($ctext, $allowedImageExts)) {
                throw new Exception("Invalid course thumbnail type");
            }
            if ($ctsize > $maxImageSize) {
                throw new Exception("Course thumbnail too large");
            }
            $courseThumbNew = 'course_thumb_' . $teacher_id . '_' . bin2hex(random_bytes(8)) . '.' . $ctext;
            $courseThumbTarget = __DIR__ . '/teacher_datas/course_thumbnails/' . $courseThumbNew;
            if (!is_dir(dirname($courseThumbTarget))) mkdir(dirname($courseThumbTarget), 0755, true);
            if (!move_uploaded_file($ctmp, $courseThumbTarget)) {
                throw new Exception("Failed to move course thumbnail file");
            }
            $courseThumbnailName = $courseThumbNew;
        }

        // Insert into teacher_courses table
        $stmt = $conn->prepare("INSERT INTO teacher_courses (teacher_id, course_title, category, skill_level, is_premium, price, duration_weeks, description, thumbnail, what_you_will_learn, requirements, language, status, total_videos) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

        $what_learn_value = !empty($what_you_will_learn) ? $what_you_will_learn : null;
        $requirements_value = !empty($requirements) ? $requirements : null;
        $total_videos = count($uploadedVideos);

        $stmt->bind_param(
            "isssisssssssi",
            $teacher_id,
            $course_title,
            $category,
            $skill_level,
            $is_premium,
            $price,
            $duration_weeks,
            $description,
            $courseThumbnailName,
            $what_learn_value,
            $requirements_value,
            $language,
            $status,
            $total_videos
        );

        if (!$stmt->execute()) {
            throw new Exception("Failed to insert course");
        }

        $course_id = $stmt->insert_id;
        $stmt->close();

        // Insert course tags
        if (!empty($tags)) {
            $stmt = $conn->prepare("INSERT INTO course_tags (course_id, tag) VALUES (?, ?)");
            foreach ($tags as $tag) {
                $tag = trim($tag);
                if (!empty($tag) && strlen($tag) <= 50) {
                    $stmt->bind_param("is", $course_id, $tag);
                    if (!$stmt->execute()) {
                        throw new Exception("Failed to insert tag");
                    }
                }
            }
            $stmt->close();
        }

        // Insert course videos with order
        $stmt = $conn->prepare("INSERT INTO teacher_videos (teacher_id, course_id, video_filename, file_size, is_intro, order_in_course) VALUES (?, ?, ?, ?, ?, ?)");

        $videoOrder = 1;
        foreach ($uploadedVideos as $video) {
            $is_intro = ($videoOrder === 1) ? 1 : 0; // First video is intro

            $stmt->bind_param(
                "iissii",
                $teacher_id,
                $course_id,
                $video['filename'],
                $video['size'],
                $is_intro,
                $videoOrder
            );

            if (!$stmt->execute()) {
                throw new Exception("Failed to insert course video");
            }
            $videoOrder++;
        }
        $stmt->close();

        // Update teacher's total_courses count
        $stmt = $conn->prepare("UPDATE teachers SET total_courses = total_courses + 1 WHERE id = ?");
        $stmt->bind_param("i", $teacher_id);
        $stmt->execute();
        $stmt->close();

        // Commit transaction
        $conn->commit();

        echo json_encode([
            "status" => "success",
            "message" => $status === 'published' ? "Course published successfully!" : "Draft saved successfully!",
            "course_id" => $course_id,
            "total_videos" => count($uploadedVideos)
        ]);
    } catch (Exception $e) {
        // Rollback on error
        $conn->rollback();

        // Delete uploaded videos
        foreach ($uploadedVideos as $video) {
            $filePath = $videoUploadDir . $video['filename'];
            if (file_exists($filePath)) {
                unlink($filePath);
            }
        }

        echo json_encode([
            "status" => "error",
            "message" => "Failed to save course: " . $e->getMessage()
        ]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
}

$conn->close();
exit;
