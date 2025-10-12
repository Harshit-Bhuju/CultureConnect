<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:5173");

header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

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
exit;
