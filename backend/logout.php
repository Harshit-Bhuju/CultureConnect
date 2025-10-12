<?php
session_start();
include("header.php");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    session_unset();
    session_destroy();

    echo json_encode([
        "status" => "success",
        "message" => "Logged out successfully"
    ]);
    exit;
}

echo json_encode(["status" => "error", "message" => "Invalid request"]);

$conn->close();
exit;
