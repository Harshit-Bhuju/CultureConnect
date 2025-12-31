<?php
include("dbconnect.php");
// ngrok http 80 --pooling-enabled
// ngrok http 5173 --pooling-enabled

$allowedOrigins = [
    "http://localhost:5173",
    "http://10.10.255.64:5173",
    "https://peaky-willa-glucinic.ngrok-free.dev/" // Replace with your LAN IP of frontend device
];
// $_SERVER['HTTP_ORIGIN'] shows localhost:5173 or LAN IP of frontend device
//browser le  kun link bata request gareko ho bhanera thah pauna ko lagi
if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
}
// this is called cors error
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
