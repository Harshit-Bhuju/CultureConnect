<?php
include("c:/xampp/htdocs/CultureConnect/backend/config/dbconnect.php");
$res = $conn->query("DESCRIBE teacher_courses");
while ($row = $res->fetch_assoc()) {
    echo "Field: {$row['Field']} | Type: {$row['Type']}\n";
}
