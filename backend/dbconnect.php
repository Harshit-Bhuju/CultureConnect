<?php
$servername = "localhost";
$username = "CultureConnect";
$password = getenv("DB_PASS");
$dbname = "school_project";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
