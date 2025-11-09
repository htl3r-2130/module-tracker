<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$file = __DIR__ . '/data/progress.json';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo file_get_contents($file);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents("php://input");
    if (!$input) {
        http_response_code(400);
        echo json_encode(["error" => "No data received"]);
        exit;
    }

    file_put_contents($file, $input);
    echo json_encode(["status" => "ok"]);
    exit;
}

http_response_code(405);
echo json_encode(["error" => "Method not allowed"]);
