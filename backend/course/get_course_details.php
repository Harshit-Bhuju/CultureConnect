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
            tc.id,
            tc.teacher_id,
            tc.course_title,
            tc.category,
            tc.skill_level,
            tc.price,
            tc.duration_weeks,
            tc.hours_per_week,
            tc.learning_schedule,
            tc.description,
            tc.what_you_will_learn,
            tc.requirements,
            tc.language,
            tc.status,
            tc.thumbnail,
            tc.average_rating,
            tc.total_reviews,
            tc.created_at,
            tc.updated_at,
            t.id as teacher_id,
            t.teacher_name,
            t.profile_picture as teacher_profile_picture,
            t.bio as teacher_bio,
            t.primary_category as teacher_category
        FROM teacher_courses tc
        INNER JOIN teachers t ON tc.teacher_id = t.id
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
        FROM teacher_course_enroll
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

    // Set max_students to 0 (indicates unlimited)
    $max_students = 0;

    $revenue_query = "
        SELECT COALESCE(SUM(amount), 0) as total_revenue
        FROM teacher_course_payment
        WHERE enrollment_id IN (SELECT id FROM teacher_course_enroll WHERE course_id = ?) 
        AND payment_status = 'success'
    ";

    $stmt = $conn->prepare($revenue_query);
    $stmt->bind_param("i", $course_id);
    $stmt->execute();
    $revenue_result = $stmt->get_result();
    $revenue = $revenue_result->fetch_assoc();
    $total_revenue = (float)$revenue['total_revenue'];
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
            "hours_per_week" => (int)$course['hours_per_week'],
            "learning_schedule" => $course['learning_schedule'],
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
            "created_at" => $course['created_at'],
            "updated_at" => $course['updated_at'],
            "tags" => $tags
        ],
        "teacher" => [
            "id" => (int)$course['teacher_id'],
            "name" => $course['teacher_name'],
            "profile_picture" => $course['teacher_profile_picture'],
            "bio" => $course['teacher_bio'],
            "category" => $course['teacher_category']
        ],
        "videos" => $videos,
        "reviews" => [] // Default empty
    ];

    // Fetch reviews with teacher replies
    $reviewStmt = $conn->prepare("
        SELECT 
            tcr.id,
            tcr.user_id,
            tcr.rating,
            tcr.comment,
            tcr.created_at,
            u.username,
            u.profile_pic,
            tcrr.id as reply_id,
            tcrr.reply_text,
            tcrr.created_at as reply_created_at,
            tcrr.updated_at as reply_updated_at,
            tcrr.teacher_id as reply_teacher_id,
            t.teacher_name as reply_teacher_name,
            t.profile_picture as reply_teacher_image
        FROM teacher_course_reviews tcr
        JOIN users u ON tcr.user_id = u.id
        LEFT JOIN teacher_course_review_replies tcrr ON tcr.id = tcrr.review_id
        LEFT JOIN teachers t ON tcrr.teacher_id = t.id
        WHERE tcr.course_id = ?
        ORDER BY tcr.created_at DESC
    ");

    if ($reviewStmt) {
        $reviewStmt->bind_param("i", $course_id);
        $reviewStmt->execute();
        $reviewResult = $reviewStmt->get_result();

        $reviewsMap = [];
        while ($review = $reviewResult->fetch_assoc()) {
            $review_id = $review['id'];

            if (!isset($reviewsMap[$review_id])) {
                $reviewsMap[$review_id] = [
                    'id' => (int)$review['id'],
                    'userId' => (int)$review['user_id'],
                    'rating' => (int)$review['rating'],
                    'comment' => $review['comment'],
                    'author' => $review['username'],
                    'userImage' => $review['profile_pic'],
                    'date' => $review['created_at'],
                    'replies' => []
                ];
            }

            if ($review['reply_id']) {
                $reviewsMap[$review_id]['replies'][] = [
                    'id' => (int)$review['reply_id'],
                    'teacherId' => (int)$review['reply_teacher_id'],
                    'replyText' => $review['reply_text'],
                    'teacherName' => $review['reply_teacher_name'],
                    'teacherImage' => $review['reply_teacher_image'],
                    'createdAt' => $review['reply_created_at'],
                    'updatedAt' => $review['reply_updated_at']
                ];
            }
        }
        $reviewStmt->close();
        $response['reviews'] = array_values($reviewsMap);
    }

    echo json_encode($response);
} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Failed to fetch course details: " . $e->getMessage()
    ]);
}

$conn->close();
exit;
