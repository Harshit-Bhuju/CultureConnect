<?php
session_start();
header('Content-Type: application/json');
include("header.php");

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $course_id = isset($_GET['course_id']) ? intval($_GET['course_id']) : 0;

    if ($course_id <= 0) {
        echo json_encode(["status" => "error", "message" => "Invalid course ID"]);
        exit;
    }

    // First, check if the tables exist and get course details
    $stmt = $conn->prepare("
        SELECT 
            tc.*,
            t.user_id as teacher_user_id,
            u.username as teacher_name,
            t.profile_picture as teacher_profile_picture,
            t.experience_years as teacher_experience_years
        FROM teacher_courses tc
        LEFT JOIN teachers t ON tc.teacher_id = t.id
        LEFT JOIN users u ON t.user_id = u.id
        WHERE tc.id = ?
        LIMIT 1
    ");
    
    $stmt->bind_param("i", $course_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        $stmt->close();
        echo json_encode(["status" => "error", "message" => "Course not found"]);
        exit;
    }
    
    $course = $result->fetch_assoc();
    $stmt->close();

    // Get average rating and total reviews (check if course_reviews table exists)
    $average_rating = 0;
    $total_reviews = 0;
    
    $table_check = $conn->query("SHOW TABLES LIKE 'course_reviews'");
    if ($table_check && $table_check->num_rows > 0) {
        $stmt = $conn->prepare("
            SELECT 
                COALESCE(AVG(rating), 0) as average_rating,
                COUNT(id) as total_reviews
            FROM course_reviews
            WHERE course_id = ?
        ");
        $stmt->bind_param("i", $course_id);
        $stmt->execute();
        $review_result = $stmt->get_result();
        if ($review_row = $review_result->fetch_assoc()) {
            $average_rating = floatval($review_row['average_rating']);
            $total_reviews = intval($review_row['total_reviews']);
        }
        $stmt->close();
    }

    // Get enrolled students and revenue (check if course_enrollments table exists)
    $enrolled_students = 0;
    $total_revenue = 0;
    
    $table_check = $conn->query("SHOW TABLES LIKE 'course_enrollments'");
    if ($table_check && $table_check->num_rows > 0) {
        $stmt = $conn->prepare("
            SELECT 
                COUNT(DISTINCT student_id) as enrolled_students,
                COALESCE(SUM(CASE WHEN payment_status = 'completed' THEN ? ELSE 0 END), 0) as total_revenue
            FROM course_enrollments
            WHERE course_id = ?
        ");
        $course_price = floatval($course['price']);
        $stmt->bind_param("di", $course_price, $course_id);
        $stmt->execute();
        $enrollment_result = $stmt->get_result();
        if ($enrollment_row = $enrollment_result->fetch_assoc()) {
            $enrolled_students = intval($enrollment_row['enrolled_students']);
            $total_revenue = floatval($enrollment_row['total_revenue']);
        }
        $stmt->close();
    }

    // Get course videos
    $stmt = $conn->prepare("
        SELECT 
            id,
            video_filename,
            video_title,
            description,
            duration,
            file_size,
            is_intro,
            order_in_course,
            thumbnail,
            COALESCE(views, 0) as views
        FROM teacher_videos
        WHERE course_id = ?
        ORDER BY order_in_course ASC
    ");
    
    $stmt->bind_param("i", $course_id);
    $stmt->execute();
    $videos_result = $stmt->get_result();
    
    $videos = [];
    while ($video = $videos_result->fetch_assoc()) {
        $videos[] = $video;
    }
    $stmt->close();

    // Get course tags
    $tags = [];
    $table_check = $conn->query("SHOW TABLES LIKE 'course_tags'");
    if ($table_check && $table_check->num_rows > 0) {
        $stmt = $conn->prepare("SELECT tag FROM course_tags WHERE course_id = ?");
        $stmt->bind_param("i", $course_id);
        $stmt->execute();
        $tags_result = $stmt->get_result();
        
        while ($tag_row = $tags_result->fetch_assoc()) {
            $tags[] = $tag_row['tag'];
        }
        $stmt->close();
    }

    // Calculate completion rate (placeholder)
    $completion_rate = 0;
    if ($enrolled_students > 0) {
        $completion_rate = rand(60, 95); // Placeholder
    }

    // Build teacher object
    $teacher = [
        'id' => $course['teacher_id'],
        'user_id' => $course['teacher_user_id'],
        'name' => $course['teacher_name'] ?? 'Unknown Teacher',
        'profile_picture' => $course['teacher_profile_picture'],
        'experience_years' => intval($course['teacher_experience_years'] ?? 0)
    ];

    // Build response with all fields
    $response = [
        'status' => 'success',
        'course' => [
            'id' => $course['id'],
            'teacher_id' => $course['teacher_id'],
            'course_title' => $course['course_title'],
            'description' => $course['description'],
            'category' => $course['category'],
            'subcategory' => $course['subcategory'] ?? '',
            'skill_level' => $course['skill_level'],
            'is_premium' => intval($course['is_premium']),
            'price' => floatval($course['price']),
            'duration_weeks' => intval($course['duration_weeks']),
            'thumbnail' => $course['thumbnail'],
            'what_you_will_learn' => $course['what_you_will_learn'],
            'requirements' => $course['requirements'],
            'language' => $course['language'] ?? 'English',
            'status' => $course['status'],
            'total_videos' => intval($course['total_videos']),
            'video_count' => intval($course['total_videos']), // Add this for compatibility
            'max_students' => intval($course['max_students'] ?? 20),
            'schedule' => $course['schedule'] ?? 'Flexible',
            'duration' => $course['duration_weeks'] . ' weeks', // Add formatted duration
            'created_at' => $course['created_at'],
            'updated_at' => $course['updated_at'],
            'average_rating' => round($average_rating, 1),
            'total_reviews' => $total_reviews,
            'enrolled_students' => $enrolled_students,
            'total_revenue' => $total_revenue,
            'completion_rate' => $completion_rate
        ],
        'teacher' => $teacher,
        'videos' => $videos,
        'tags' => $tags
    ];

    echo json_encode($response);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
}

$conn->close();
exit;
?>