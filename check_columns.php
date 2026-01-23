<?php
include("c:/xampp/htdocs/CultureConnect/backend/config/dbconnect.php");
$res = $conn->query("SHOW COLUMNS FROM teacher_courses");
while ($row = $res->fetch_assoc()) {
    echo $row['Field'] . "\n";
}
