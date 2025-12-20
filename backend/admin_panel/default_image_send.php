<?php
include("../header.php");
$defaultImage = 'http://localhost/CultureConnect/backend/uploads/default-image.jpg';
echo json_encode(['status' => 'success', 'default_image' => $defaultImage]);
