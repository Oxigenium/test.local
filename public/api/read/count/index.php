<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

if (isset($_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE']))
    $_SERVER['REQUEST_METHOD'] = $_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE'];

if ($_SERVER['REQUEST_METHOD'] != "GET")
{
    http_response_code(405);
    exit(json_encode(
        array("status" => "error", "error" => "Valid method is GET")
    ));
}

// include database and object files
include_once '../../config/Database.php';
include_once '../../objects/UserMessage.php';

// instantiate database and pano object
$database = new Database();
$db = $database->getConnection();

// initialize object
$userMessage = new UserMessage($db);

$stmt = $userMessage->count();

if (!($stmt->errorCode() === '00000'))
{
    http_response_code(500);
    exit(json_encode(
        array("status" => "error", "error" => "Error in getting messages")
    ));
}

// message
$response=array("status" => "ok");

while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){

    $response['count'] = $row['COUNT(id)'];

}

exit(json_encode($response));