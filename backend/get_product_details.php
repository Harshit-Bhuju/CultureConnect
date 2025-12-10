<?php
session_start();
include("header.php");

try {
    if (!isset($_SESSION['user_email'])) {
        echo json_encode(["success" => false, "error" => "User not logged in"]);
        exit;
    }

    $user_email = $_SESSION['user_email'];
    $product_id = $_GET['product_id'] ?? null;

    if (!$product_id || !is_numeric($product_id)) {
        echo json_encode(["success" => false, "error" => "Invalid product ID"]);
        exit;
    }

    // Get user's seller_id
    $stmt = $conn->prepare("
        SELECT u.id, s.id as seller_id 
        FROM users u 
        LEFT JOIN sellers s ON u.id = s.user_id 
        WHERE u.email = ? 
        LIMIT 1
    ");
    $stmt->bind_param("s", $user_email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $stmt->close();

    if (!$user || !$user['seller_id']) {
        echo json_encode(["success" => false, "error" => "No seller account found"]);
        exit;
    }

    $seller_id = $user['seller_id'];

    // Get product details with all fields including product_type, dimensions, material, care_instructions
  // Get product details with all fields including product_type, dimensions, material, care_instructions
    $stmt = $conn->prepare("
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
            p.revenue,
            p.created_at,
            p.updated_at,
            GROUP_CONCAT(DISTINCT pi.image_url ORDER BY pi.`order` ASC, pi.id ASC) as images,
            GROUP_CONCAT(DISTINCT pt.tag) as tags
        FROM products p
        LEFT JOIN product_images pi ON p.id = pi.product_id
        LEFT JOIN product_tags pt ON p.id = pt.product_id
        WHERE p.id = ? AND p.seller_id = ? AND p.status != 'deleted'
        GROUP BY p.id
        LIMIT 1
    ");
    $stmt->bind_param("ii", $product_id, $seller_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $stmt->close();

    if (!$row) {
        echo json_encode(["success" => false, "error" => "Product not found or unauthorized"]);
        exit;
    }

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
        $clothesStmt->bind_param("i", $product_id);
        $clothesStmt->execute();
        $clothesResult = $clothesStmt->get_result();

        while ($clothesRow = $clothesResult->fetch_assoc()) {
            // Get culture from first row
            if (!$culture && $clothesRow['culture']) {
                $culture = $clothesRow['culture'];
            }

            // Collect sizes and age groups
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

    // Get reviews
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
    $reviewStmt->bind_param("i", $product_id);
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

    // Convert status
    $status = ucfirst($row['status']);
    if ($status === 'Published') {
        $status = 'Active';
    }

    $product = [
        'id' => (int)$row['id'],
        'productName' => $row['product_name'],
        'name' => $row['product_name'],
        'productType' => $row['product_type'],
        'category' => $row['category'],
        'audience' => $row['audience'],
        'culture' => $culture,
        'sizes' => array_values($sizes),
        'ageGroups' => array_values($ageGroups),
        'price' => (float)$row['price'],
        'stock' => (int)$row['stock'],
        'description' => $row['description'],
        'dimensions' => $row['dimensions'],
        'material' => $row['material'],
        'careInstructions' => $row['care_instructions'],
        'status' => $status,
        'images' => $images,
        'tags' => $tags,
        'reviews' => $reviews,
        'averageRating' => (float)$row['average_rating'],
        'totalReviews' => (int)$row['total_reviews'],
        'totalSales' => (int)$row['total_sales'],
        'revenue' => (float)$row['revenue'],
        'createdAt' => $row['created_at'],
        'updatedAt' => $row['updated_at']
    ];

    echo json_encode([
        'success' => true,
        'product' => $product
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

$conn->close();
