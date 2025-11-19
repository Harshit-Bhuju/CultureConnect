<?php
$servername = "localhost";
$username = "CultureConnect";
$password = getenv("DB_PASS");
$dbname = "cultureconnect";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
