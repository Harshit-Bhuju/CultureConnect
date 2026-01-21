<?php
require_once __DIR__ . '/../config/session_config.php';
include("../config/header.php");

// Get course_id from URL parameter
$course_id = isset($_GET['course_id']) ? intval($_GET['course_id']) : null;

if (!$course_id) {
    echo json_encode([
        "status" => "error",
        "message" => "Course ID is required"
    ]);
    exit;
}

try {
    // Fetch course details with teacher information
    $course_query = "
        SELECT 
            tc.*,
            t.id as teacher_id,
            t.teacher_name,
            t.profile_picture as teacher_profile_picture,
            t.bio as teacher_bio,
            t.primary_category as teacher_category,
            u.created_at as teacher_joined_date
        FROM teacher_courses tc
        INNER JOIN teachers t ON tc.teacher_id = t.id
        INNER JOIN users u ON t.user_id = u.id
        WHERE tc.id = ?
        LIMIT 1
    ";

    $stmt = $conn->prepare($course_query);
    $stmt->bind_param("i", $course_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $course = $result->fetch_assoc();
    $stmt->close();

    if (!$course) {
        echo json_encode([
            "status" => "error",
            "message" => "Course not found"
        ]);
        exit;
    }

    // Calculate teacher experience years
    $teacher_joined = new DateTime($course['teacher_joined_date']);
    $now = new DateTime();
    $experience_years = $now->diff($teacher_joined)->y;

    // Fetch all videos for this course
    $videos_query = "
        SELECT 
            id,
            video_title,
            video_description,
            duration,
            video_filename,
            thumbnail,
            file_size,
            is_intro,
            order_in_course,
            views,
            created_at
        FROM teacher_videos
        WHERE course_id = ?
        ORDER BY order_in_course ASC, created_at ASC
    ";

    $stmt = $conn->prepare($videos_query);
    $stmt->bind_param("i", $course_id);
    $stmt->execute();
    $videos_result = $stmt->get_result();

    $videos = [];
    while ($video = $videos_result->fetch_assoc()) {
        // Convert duration from seconds to mm:ss format
        $duration_seconds = (int)$video['duration'];
        $duration_formatted = $duration_seconds > 0
            ? sprintf("%d:%02d", floor($duration_seconds / 60), $duration_seconds % 60)
            : '0:00';

        $videos[] = [
            'id' => (int)$video['id'],
            'video_title' => $video['video_title'],
            'description' => $video['video_description'] ?? '',
            'duration' => $duration_formatted,
            'thumbnail' => $video['thumbnail'],
            'video_filename' => $video['video_filename'],
            'order_in_course' => (int)$video['order_in_course'],
            'views' => (int)$video['views'],
            'is_intro' => (int)$video['is_intro'],
            'file_size' => $video['file_size'],
            'created_at' => $video['created_at']
        ];
    }
    $stmt->close();

    // Get enrolled students count for this course
    $enrollment_query = "
        SELECT COUNT(*) as enrolled_count
        FROM teacher_students
        WHERE course_id = ?
    ";

    $stmt = $conn->prepare($enrollment_query);
    $stmt->bind_param("i", $course_id);
    $stmt->execute();
    $enrollment_result = $stmt->get_result();
    $enrollment = $enrollment_result->fetch_assoc();
    $enrolled_students = (int)$enrollment['enrolled_count'];
    $stmt->close();

    // Get course tags
    $tags_query = "SELECT tag FROM teacher_course_tags WHERE course_id = ?";
    $stmt = $conn->prepare($tags_query);
    $stmt->bind_param("i", $course_id);
    $stmt->execute();
    $tags_result = $stmt->get_result();

    $tags = [];
    while ($tag_row = $tags_result->fetch_assoc()) {
        $tags[] = $tag_row['tag'];
    }
    $stmt->close();

    // Calculate max_students (default to 20 if not set)
    $max_students = 20;

    // Calculate total revenue for this course
    $revenue_query = "
        SELECT COALESCE(SUM(paid_amount), 0) as total_revenue
        FROM teacher_students
        WHERE course_id = ? AND payment_status = 'paid'
    ";

    $stmt = $conn->prepare($revenue_query);
    $stmt->bind_param("i", $course_id);
    $stmt->execute();
    $revenue_result = $stmt->get_result();
    $revenue = $revenue_result->fetch_assoc();
    $total_revenue = (float)$revenue['total_revenue'];
    $stmt->close();

    // Calculate completion rate
    $completion_query = "
        SELECT 
            COUNT(*) as total_students,
            SUM(CASE WHEN completion_status = 'completed' THEN 1 ELSE 0 END) as completed_students
        FROM teacher_students
        WHERE course_id = ?
    ";

    $stmt = $conn->prepare($completion_query);
    $stmt->bind_param("i", $course_id);
    $stmt->execute();
    $completion_result = $stmt->get_result();
    $completion = $completion_result->fetch_assoc();
    $total_students = (int)$completion['total_students'];
    $completed_students = (int)$completion['completed_students'];
    $completion_rate = $total_students > 0 ? round(($completed_students / $total_students) * 100) : 0;
    $stmt->close();

    // Prepare response
    $response = [
        "status" => "success",
        "course" => [
            "id" => (int)$course['id'],
            "teacher_id" => (int)$course['teacher_id'],
            "course_title" => $course['course_title'],
            "category" => $course['category'],
            "subcategory" => '', // Add if you have subcategory field
            "skill_level" => ucfirst($course['skill_level']),
            "price" => (float)$course['price'],
            "is_premium" => (float)$course['price'] > 0 ? 1 : 0,
            "duration_weeks" => (int)$course['duration_weeks'],
            "description" => $course['description'],
            "what_you_will_learn" => $course['what_you_will_learn'],
            "requirements" => $course['requirements'],
            "language" => $course['language'] ?? 'English',
            "status" => $course['status'],
            "thumbnail" => $course['thumbnail'],
            "total_videos" => count($videos),
            "enrolled_students" => $enrolled_students,
            "max_students" => $max_students,
            "average_rating" => (float)$course['average_rating'],
            "total_reviews" => (int)$course['total_reviews'],
            "total_revenue" => $total_revenue,
            "completion_rate" => $completion_rate,
            "created_at" => $course['created_at'],
            "updated_at" => $course['updated_at'],
            "tags" => $tags
        ],
        "teacher" => [
            "id" => (int)$course['teacher_id'],
            "name" => $course['teacher_name'],
            "profile_picture" => $course['teacher_profile_picture'],
            "bio" => $course['teacher_bio'],
            "category" => $course['teacher_category'],
            "experience_years" => $experience_years
        ],
        "videos" => $videos
    ];

    echo json_encode($response);
} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Failed to fetch course details: " . $e->getMessage()
    ]);
}

$conn->close();
exit;
