<?php
require_once __DIR__ . '/../config/session_config.php';
include("../config/header.php");

try {
    if (!isset($_SESSION['user_email'])) {
        echo json_encode(["success" => false, "error" => "User not logged in"]);
        exit;
    }

    $user_email = $_SESSION['user_email'];

    // Fetch user and seller info
    $stmt = $conn->prepare("SELECT u.id, s.id as seller_id FROM users u LEFT JOIN sellers s ON u.id = s.user_id WHERE u.email = ? LIMIT 1");
    $stmt->bind_param("s", $user_email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $stmt->close();

    if (!$user) {
        echo json_encode(["success" => false, "error" => "User not found"]);
        exit;
    }

    if (!$user['seller_id']) {
        echo json_encode(["success" => false, "error" => "No seller account found"]);
        exit;
    }

    $seller_id = $user['seller_id'];

    // Get only DRAFT products for this seller with images
    $query = "
        SELECT 
            p.id,
            p.product_name,
            p.product_type,
            p.category,
            p.audience,
            p.price,
            p.stock,
            p.description,
            p.dimensions,
            p.material,
            p.care_instructions,
            p.status,
            p.average_rating,
            p.total_reviews,
            p.total_sales,
            p.created_at,
            p.updated_at,
            GROUP_CONCAT(DISTINCT pi.image_url ORDER BY pi.`order` ASC, pi.id ASC) as images,
            GROUP_CONCAT(DISTINCT pt.tag) as tags
        FROM products p
        LEFT JOIN product_images pi ON p.id = pi.product_id
        LEFT JOIN product_tags pt ON p.id = pt.product_id
        WHERE p.seller_id = ? AND p.status = 'draft'
        GROUP BY p.id
        ORDER BY p.created_at DESC
    ";

    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $seller_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $products = [];
    while ($row = $result->fetch_assoc()) {
        // Convert images and tags strings to arrays
        $images = $row['images'] ? explode(',', $row['images']) : [];
        $tags = $row['tags'] ? explode(',', $row['tags']) : [];

        // Initialize culture, sizes, and age groups
        $culture = null;
        $sizes = [];
        $ageGroups = [];

        // If category is cultural-clothes, get culture and size/age info
        if ($row['category'] === 'cultural-clothes') {
            $clothesStmt = $conn->prepare("
                SELECT 
                    pc.culture,
                    sao.size_available,
                    sao.age_group
                FROM product_clothes pc
                LEFT JOIN size_age_options sao ON pc.size_age_id = sao.id
                WHERE pc.product_id = ?
            ");
            $clothesStmt->bind_param("i", $row['id']);
            $clothesStmt->execute();
            $clothesResult = $clothesStmt->get_result();

            while ($clothesRow = $clothesResult->fetch_assoc()) {
                if (!$culture && $clothesRow['culture']) {
                    $culture = $clothesRow['culture'];
                }
                if ($clothesRow['size_available']) {
                    $sizes[] = $clothesRow['size_available'];
                }
                if ($clothesRow['age_group']) {
                    $ageGroups[] = $clothesRow['age_group'];
                }
            }
            $clothesStmt->close();

            // Remove duplicates
            $sizes = array_unique($sizes);
            $ageGroups = array_unique($ageGroups);
        }

        // Get reviews for this product
        $reviewStmt = $conn->prepare("
            SELECT 
                pr.id,
                pr.rating,
                pr.comment,
                pr.created_at,
                u.username,
                u.profile_pic
            FROM product_reviews pr
            JOIN users u ON pr.user_id = u.id
            WHERE pr.product_id = ?
            ORDER BY pr.created_at DESC
        ");
        $reviewStmt->bind_param("i", $row['id']);
        $reviewStmt->execute();
        $reviewResult = $reviewStmt->get_result();

        $reviews = [];
        while ($review = $reviewResult->fetch_assoc()) {
            $reviews[] = [
                'id' => (int)$review['id'],
                'rating' => (int)$review['rating'],
                'comment' => $review['comment'],
                'username' => $review['username'],
                'userImage' => $review['profile_pic'],
                'date' => $review['created_at']
            ];
        }
        $reviewStmt->close();

        // Status is always 'Draft' for this endpoint
        $products[] = [
            'id' => (int)$row['id'],
            'productName' => $row['product_name'],
            'name' => $row['product_name'],
            'productType' => $row['product_type'],
            'category' => $row['category'],
            'audience' => $row['audience'],
            'culture' => $culture,
            'adultSizes' => array_values($sizes),
            'childAgeGroups' => array_values($ageGroups),
            'price' => (float)$row['price'],
            'stock' => (int)$row['stock'],
            'description' => $row['description'],
            'dimensions' => $row['dimensions'],
            'material' => $row['material'],
            'careInstructions' => $row['care_instructions'],
            'status' => 'Draft',
            'images' => $images,
            'tags' => $tags,
            'reviews' => $reviews,
            'averageRating' => (float)$row['average_rating'],
            'totalReviews' => (int)$row['total_reviews'],
            'totalSales' => (int)$row['total_sales'],
            'createdAt' => $row['created_at'],
            'updatedAt' => $row['updated_at']
        ];
    }
    $stmt->close();

    // Get draft statistics
    $statsQuery = "
        SELECT 
            COUNT(*) as total_drafts,
            SUM(CASE WHEN stock <= 10 THEN 1 ELSE 0 END) as low_stock_drafts
        FROM products
        WHERE seller_id = ? AND status = 'draft'
    ";

    $statsStmt = $conn->prepare($statsQuery);
    $statsStmt->bind_param("i", $seller_id);
    $statsStmt->execute();
    $statsResult = $statsStmt->get_result();
    $stats = $statsResult->fetch_assoc();
    $statsStmt->close();

    echo json_encode([
        'success' => true,
        'products' => $products,
        'stats' => [
            'totalDrafts' => (int)$stats['total_drafts'],
            'lowStockDrafts' => (int)$stats['low_stock_drafts']
        ]
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

$conn->close();
?>
