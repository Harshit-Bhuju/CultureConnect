<?php
include("c:/xampp/htdocs/CultureConnect/backend/config/dbconnect.php");
$res = $conn->query("SHOW COLUMNS FROM teacher_courses");
$columns = [];
while ($row = $res->fetch_assoc()) {
    $columns[] = $row['Field'];
}
echo implode(", ", $columns);
