<?php
session_start();
include("header.php");

function sendResponse($status, $message, $data = null)
{
    $response = [
        "status" => $status,
        "message" => $message
    ];
    if ($data !== null) {
        $response = array_merge($response, $data);
    }
    echo json_encode($response);
    exit;
}

// Error handler
function handleError($conn, $message, $uploadedFiles = [])
{
    if ($conn && $conn->ping()) {
        $conn->rollback();
    }

    // Clean up uploaded files
    foreach ($uploadedFiles as $file) {
        if (file_exists($file)) {
            unlink($file);
        }
    }

    sendResponse("error", $message);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse("error", "Invalid request method");
}

// Check if user is logged in
if (!isset($_SESSION['user_email'])) {
    sendResponse("error", "User not logged in");
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
    sendResponse("error", "User not found");
}

if (!$user['teacher_id']) {
    sendResponse("error", "No teacher account found");
}

$teacher_id = $user['teacher_id'];

// Get and validate form data
$course_title = trim($_POST['courseTitle'] ?? '');
$category = trim($_POST['category'] ?? '');
$skill_level = trim($_POST['skillLevel'] ?? '');
$price = trim($_POST['price'] ?? '0');
$duration_weeks = trim($_POST['durationWeeks'] ?? '');
$description = trim($_POST['description'] ?? '');
$what_you_will_learn = trim($_POST['whatYouWillLearn'] ?? '');
$requirements = trim($_POST['requirements'] ?? '');
$language = trim($_POST['language'] ?? 'English');
$status = trim($_POST['status'] ?? 'draft');

// Validate required fields
if (empty($course_title) || strlen($course_title) < 3) {
    sendResponse("error", "Course title must be at least 3 characters");
}

if (!in_array($category, ['dance', 'music', 'yoga', 'art', 'language'])) {
    sendResponse("error", "Invalid category selected");
}

if (!in_array($skill_level, ['beginner', 'intermediate', 'advanced', 'all'])) {
    sendResponse("error", "Invalid skill level selected");
}

$price = floatval($price);
if ($price < 0 || $price > 999999999) {
    sendResponse("error", "Invalid price value");
}

$duration_weeks = intval($duration_weeks);
if ($duration_weeks < 1 || $duration_weeks > 52) {
    sendResponse("error", "Duration must be between 1 and 52 weeks");
}

if (empty($description) || strlen($description) < 20) {
    sendResponse("error", "Description must be at least 20 characters");
}

if (!in_array($status, ['draft', 'published'])) {
    sendResponse("error", "Invalid status");
}

// Get tags
$tags = isset($_POST['tags']) ? json_decode($_POST['tags'], true) : [];
if (!is_array($tags) || empty($tags)) {
    sendResponse("error", "At least one tag is required");
}

if (count($tags) > 10) {
    sendResponse("error", "Maximum 10 tags allowed");
}

// Validate tags
foreach ($tags as $tag) {
    if (strlen($tag) > 50) {
        sendResponse("error", "Tag must be less than 50 characters");
    }
}

// Handle video uploads
if (!isset($_FILES['videos']) || empty($_FILES['videos']['name'][0])) {
    sendResponse("error", "At least one course video is required");
}

$uploadDir = __DIR__ . '/teacher_datas/course_videos/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$thumbnailUploadDir = __DIR__ . '/teacher_datas/course_thumbnails/';
if (!is_dir($thumbnailUploadDir)) {
    mkdir($thumbnailUploadDir, 0755, true);
}

$uploadedVideos = [];
$uploadedThumbnails = [];
$uploadedFiles = []; // Track all uploaded files for cleanup on error
$allowedVideoExts = ['mp4', 'mov', 'avi', 'mkv', 'webm'];
$allowedImageExts = ['jpg', 'jpeg', 'png', 'webp'];
$maxVideoSize = 500 * 1024 * 1024; // 500MB
$maxImageSize = 5 * 1024 * 1024; // 5MB

// Process video files
$videoCount = count($_FILES['videos']['name']);
if ($videoCount > 20) {
    sendResponse("error", "Maximum 20 videos allowed");
}

foreach ($_FILES['videos']['tmp_name'] as $key => $tmpName) {
    if ($_FILES['videos']['error'][$key] !== 0) {
        continue;
    }

    $fileName = $_FILES['videos']['name'][$key];
    $fileSize = $_FILES['videos']['size'][$key];
    $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

    if (!in_array($fileExt, $allowedVideoExts)) {
        handleError($conn, "Invalid video file type. Only MP4, MOV, AVI, MKV, WEBM allowed", $uploadedFiles);
    }

    if ($fileSize > $maxVideoSize) {
        handleError($conn, "Video file too large. Maximum 500MB per video", $uploadedFiles);
    }

    // Generate unique filename
    $newFileName = 'course_video_' . $teacher_id . '_' . bin2hex(random_bytes(8)) . '.' . $fileExt;
    $targetPath = $uploadDir . $newFileName;

    if (!move_uploaded_file($tmpName, $targetPath)) {
        handleError($conn, "Failed to upload video", $uploadedFiles);
    }

    $uploadedFiles[] = $targetPath;
    $uploadedVideos[] = [
        'filename' => $newFileName,
        'size' => round($fileSize / (1024 * 1024), 2) . ' MB',
        'original_name' => $fileName
    ];
}

if (count($uploadedVideos) === 0) {
    sendResponse("error", "No valid videos uploaded");
}

// Get video metadata
$video_titles = isset($_POST['video_titles']) ? $_POST['video_titles'] : [];
$video_descriptions = isset($_POST['video_descriptions']) ? $_POST['video_descriptions'] : [];

// Validate that all videos have title and description
for ($i = 0; $i < count($uploadedVideos); $i++) {
    $title = isset($video_titles[$i]) ? trim($video_titles[$i]) : '';
    $desc = isset($video_descriptions[$i]) ? trim($video_descriptions[$i]) : '';

    if (empty($title)) {
        handleError($conn, "Video " . ($i + 1) . " is missing a title", $uploadedFiles);
    }
    if (empty($desc)) {
        handleError($conn, "Video " . ($i + 1) . " is missing a description", $uploadedFiles);
    }
}

// Process video thumbnails
if (isset($_FILES['thumbnails'])) {
    foreach ($_FILES['thumbnails']['name'] as $tidx => $tname) {
        if (empty($tname)) {
            $uploadedThumbnails[$tidx] = null;
            continue;
        }

        if ($_FILES['thumbnails']['error'][$tidx] !== 0) {
            handleError($conn, "Thumbnail upload error for video " . ($tidx + 1), $uploadedFiles);
        }

        $tfileTmp = $_FILES['thumbnails']['tmp_name'][$tidx];
        $tfileSize = $_FILES['thumbnails']['size'][$tidx];
        $tfileExt = strtolower(pathinfo($tname, PATHINFO_EXTENSION));

        if (!in_array($tfileExt, $allowedImageExts)) {
            handleError($conn, "Invalid thumbnail file type. JPG/PNG/WEBP allowed", $uploadedFiles);
        }

        if ($tfileSize > $maxImageSize) {
            handleError($conn, "Thumbnail too large. Max 5MB", $uploadedFiles);
        }

        $tNewName = 'video_thumb_' . $teacher_id . '_' . bin2hex(random_bytes(8)) . '.' . $tfileExt;
        $tTargetPath = $thumbnailUploadDir . $tNewName;

        if (!move_uploaded_file($tfileTmp, $tTargetPath)) {
            handleError($conn, "Failed to upload thumbnail for video " . ($tidx + 1), $uploadedFiles);
        }

        $uploadedFiles[] = $tTargetPath;
        $uploadedThumbnails[$tidx] = $tNewName;
    }
}

// Validate that all videos have thumbnails
for ($i = 0; $i < count($uploadedVideos); $i++) {
    if (!isset($uploadedThumbnails[$i]) || empty($uploadedThumbnails[$i])) {
        handleError($conn, "Video " . ($i + 1) . " is missing a thumbnail", $uploadedFiles);
    }
}

// Handle course thumbnail (required)
$courseThumbnailName = null;
if (!isset($_FILES['course_thumbnail']) || empty($_FILES['course_thumbnail']['name'])) {
    handleError($conn, "Course thumbnail is required", $uploadedFiles);
}

if ($_FILES['course_thumbnail']['error'] !== 0) {
    handleError($conn, "Failed to upload course thumbnail", $uploadedFiles);
}

$ctmp = $_FILES['course_thumbnail']['tmp_name'];
$ctsize = $_FILES['course_thumbnail']['size'];
$ctname = $_FILES['course_thumbnail']['name'];
$ctext = strtolower(pathinfo($ctname, PATHINFO_EXTENSION));

if (!in_array($ctext, $allowedImageExts)) {
    handleError($conn, "Invalid course thumbnail type. JPG/PNG/WEBP allowed", $uploadedFiles);
}

if ($ctsize > $maxImageSize) {
    handleError($conn, "Course thumbnail too large. Max 5MB", $uploadedFiles);
}

$courseThumbNew = 'course_thumb_' . $teacher_id . '_' . bin2hex(random_bytes(8)) . '.' . $ctext;
$courseThumbTarget = $thumbnailUploadDir . $courseThumbNew;

if (!move_uploaded_file($ctmp, $courseThumbTarget)) {
    handleError($conn, "Failed to move course thumbnail file", $uploadedFiles);
}

$uploadedFiles[] = $courseThumbTarget;
$courseThumbnailName = $courseThumbNew;

// Start transaction
$conn->begin_transaction();

try {
    // Insert course record
    $stmt = $conn->prepare("INSERT INTO teacher_courses (teacher_id, course_title, category, skill_level, price, duration_weeks, description, thumbnail, what_you_will_learn, requirements, language, status, total_videos) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    $what_learn_value = !empty($what_you_will_learn) ? $what_you_will_learn : null;
    $requirements_value = !empty($requirements) ? $requirements : null;
    $total_videos = count($uploadedVideos);

    $stmt->bind_param(
        "isssdissssssi",
        $teacher_id,
        $course_title,
        $category,
        $skill_level,
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
        throw new Exception("Failed to insert course: " . $stmt->error);
    }

    $course_id = $stmt->insert_id;
    $stmt->close();

    // Insert course videos with thumbnails and metadata
    $stmt = $conn->prepare("INSERT INTO teacher_videos (teacher_id, course_id, video_filename, file_size, thumbnail, video_title, video_description, is_intro, order_in_course) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");

    foreach ($uploadedVideos as $index => $video) {
        $is_intro = ($index === 0) ? 1 : 0;
        $order_in_course = $index + 1;

        $title = isset($video_titles[$index]) ? trim($video_titles[$index]) : '';
        $description_val = isset($video_descriptions[$index]) ? trim($video_descriptions[$index]) : '';
        $thumbnailName = isset($uploadedThumbnails[$index]) ? $uploadedThumbnails[$index] : null;

        $stmt->bind_param(
            "iisssssii",
            $teacher_id,
            $course_id,
            $video['filename'],
            $video['size'],
            $thumbnailName,
            $title,
            $description_val,
            $is_intro,
            $order_in_course
        );

        if (!$stmt->execute()) {
            throw new Exception("Failed to insert video: " . $stmt->error);
        }
    }
    $stmt->close();

    // Insert tags into course_tags table
    if (!empty($tags)) {
        $stmt = $conn->prepare("INSERT INTO course_tags (course_id, tag) VALUES (?, ?)");
        foreach ($tags as $tag) {
            $tag = trim($tag);
            if (!empty($tag) && strlen($tag) <= 50) {
                $stmt->bind_param("is", $course_id, $tag);
                if (!$stmt->execute()) {
                    throw new Exception("Failed to insert tag: " . $stmt->error);
                }
            }
        }
        $stmt->close();
    }

    // Commit transaction
    $conn->commit();

    sendResponse(
        "success",
        $status === 'published' ? "Course published successfully" : "Draft saved successfully",
        ["course_id" => $course_id]
    );
} catch (Exception $e) {
    // Rollback on error
    $conn->rollback();

    // Delete uploaded files
    foreach ($uploadedFiles as $filePath) {
        if (file_exists($filePath)) {
            unlink($filePath);
        }
    }

    sendResponse("error", "Failed to save course: " . $e->getMessage());
}

$conn->close();
