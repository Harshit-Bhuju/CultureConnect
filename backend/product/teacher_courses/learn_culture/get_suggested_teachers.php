<?php
require_once __DIR__ . '/../../../config/session_config.php';
include(__DIR__ . "/../../../config/header.php");

/**
 * API: get_suggested_teachers.php
 * 
 * LOGIC SUMMARY:
 * 1. TIERS:
 *    - Tier 1: Teachers with sales this month (Trending)
 *    - Tier 2: All other active teachers with courses
 * 
 * 2. WEIGHTED SCORE (Internal Sorting):
 *    - avg_rating (40%): Average rating of all their courses (Ignoring unrated courses).
 *    - total_sales (30%): Lifetime student/enrollment volume.
 *    - course_count (30%): Variety of courses offered.
 * 
 * 3. LIMITS:
 *    - Max: 10
 */

try {
    $teachers = [];

    $query = "
        SELECT 
            t.id,
            t.teacher_name AS name,
            t.profile_picture,
            t.primary_category AS specialty,
            t.total_courses AS course_count,
            t.total_sales,
            t.sales_this_month,
            COALESCE(AVG(CASE WHEN tc.total_reviews > 0 THEN tc.average_rating ELSE NULL END), 0) AS teacher_avg_rating
        FROM teachers t
        LEFT JOIN teacher_courses tc ON t.id = tc.teacher_id AND tc.status = 'published'
        GROUP BY t.id
        HAVING course_count > 0
        ORDER BY 
            (t.sales_this_month > 0) DESC,
            (
                (t.sales_this_month * 50) +                
                (t.total_sales * 5) +                      
                (COALESCE(AVG(CASE WHEN tc.total_reviews > 0 THEN tc.average_rating ELSE NULL END), 0) * 10) + 
                (t.total_courses * 0.5)                         
            ) DESC
        LIMIT 10
    ";

    $result = $conn->query($query);

    if (!$result) {
        throw new Exception($conn->error);
    }

    while ($row = $result->fetch_assoc()) {
        $teachers[] = [
            'id' => (int)$row['id'],
            'name' => $row['name'] ?: 'Unnamed Instructor',
            'profile_picture' => $row['profile_picture'] ?: 'default_profile.jpg',
            'specialty' => $row['specialty'] ?: 'Cultural Arts',
            'rating' => round((float)$row['teacher_avg_rating'], 1),
            'courses' => (int)$row['course_count'],
            'total_students' => (int)$row['total_sales'],
            'sales_this_month' => (int)$row['sales_this_month']
        ];
    }

    // Response handling
    if (count($teachers) === 0) {
        echo json_encode([
            'success' => true,
            'teachers' => [],
            'message' => 'No active teachers found to suggest'
        ]);
    } else {
        echo json_encode([
            'success' => true,
            'teachers' => $teachers,
            'count' => count($teachers),
            'message' => count($teachers) < 3 ? 'Found limited top teachers' : 'Suggested teachers loaded successfully'
        ]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Server error: ' . $e->getMessage()
    ]);
}

$conn->close();
