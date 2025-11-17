<?php
include("header.php"); // DB connection

$stmt = $conn->prepare("SELECT * FROM sliders ORDER BY position ASC");
$stmt->execute();
$result = $stmt->get_result();

$sliders = [];
while ($row = $result->fetch_assoc()) {
    $row['image'] = "http://localhost/CultureConnect/backend/sliders_image/" . $row['image'];
    $sliders[] = $row;
}

echo json_encode($sliders);
// [
//   {
//     "title": "Welcome Slide",
//     "topic": "Culture",
//     "description": "Discover Nepal's heritage.",
//     "image": "http://localhost/CultureConnect/backend/sliders_image/slide1.jpg",
//     "position": "1"
//   },
//   {
//     "title": "Explore More",
//     "topic": "Tradition",
//     "description": "Dive into local art forms.",
//     "image": "http://localhost/CultureConnect/backend/sliders_image/slide2.jpg",
//     "position": "2"
//   },
//   {
//     "title": "Join Us",
//     "topic": "Community",
//     "description": "Celebrate together.",
//     "image": "http://localhost/CultureConnect/backend/sliders_image/slide3.jpg",
//     "position": "3"
//   }
// ]
$stmt->close();
$conn->close();
exit;
