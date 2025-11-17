<?php
include("header.php");

// 1. Fetch Sections Text
$sections_stmt = $conn->prepare("SELECT section_id, title, subtitle, description FROM welcome_sections ORDER BY section_id ASC");
$sections_stmt->execute();
$sections_result = $sections_stmt->get_result();

$sections = [];
while ($row = $sections_result->fetch_assoc()) {
    $sections[] = $row;
}
$sections_stmt->close();

// 2. Fetch Carousel Images
$carousel_stmt = $conn->prepare("SELECT image_id, section_id, position, image, sort_order FROM welcome_images ORDER BY section_id ASC, sort_order ASC");
$carousel_stmt->execute();
$carousel_result = $carousel_stmt->get_result();

$carousels = [];
while ($row = $carousel_result->fetch_assoc()) {
    if ($row['position'] == 'carousel1') {
        $row['image'] = "http://localhost/CultureConnect/backend/welcome_images/carousel1/" . $row['image'];
    }
    if ($row['position'] == 'carousel2') {
        $row['image'] = "http://localhost/CultureConnect/backend/welcome_images/carousel2/" . $row['image'];
    }
    $carousels[] = $row;
}
$carousel_stmt->close();

// 3. Fetch Parallax Images
$parallax_stmt = $conn->prepare("SELECT parallax_id, image, position, heading, subheading FROM welcome_parallax");
$parallax_stmt->execute();
$parallax_result = $parallax_stmt->get_result();

$parallax = [];
while ($row = $parallax_result->fetch_assoc()) {
    $row['image'] = "http://localhost/CultureConnect/backend/welcome_images/parallax/" . $row['image'];
    $parallax[] = $row;
}
$parallax_stmt->close();

// Return JSON
echo json_encode([
    'sections' => $sections,
    'carousels' => $carousels,
    'parallax' => $parallax
]);
// {
//   "sections": [
//     {"section_id":1,"title":"CultureConnect","subtitle":"Welcome","description":"..."},
//     {"section_id":2,"title":"Marketplace","subtitle":"Traditional Clothes","description":"..."}
//   ],
//   "carousels": [
//     {"section_id":2,"position":"carousel1","image":"...","sort_order":1},
//     {"section_id":2,"position":"carousel1","image":"...","sort_order":2}
//   ],
//   "parallax": [
//     {"image":".../parallax_small.jpg","position":"parallax_small","heading":"Small Parallax Heading","subheading":"Small Subheading"},
//     {"image":".../parallax_big.jpg","position":"parallax_big","heading":"Big Parallax Heading","subheading":"Big Subheading"}
//   ]
// }
$conn->close();
exit;
