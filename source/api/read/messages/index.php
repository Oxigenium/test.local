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

// query
if (!isset($_GET['sortdirection']) || !isset($_GET['sortby']) || !isset($_GET['page']))
{
    http_response_code(400);
    exit(json_encode(
        array("status" => "error", "error" => "Required parameters is: sortdirection, sortby, page")
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

$userMessage->sortBy = $_GET['sortby'];
$userMessage->sortDirection = $_GET['sortdirection'];
$userMessage->page = $_GET['page'];


$stmt = $userMessage->read();

$num = $stmt->rowCount();

if (!($stmt->errorCode() === '00000'))
{
    http_response_code(500);
    exit(json_encode(
        array("status" => "error", "error" => "Error in getting messages")
    ));
}

// check if more than 0 record found
if($num<=0)
{
    http_response_code(404);
    exit(json_encode(
        array("status" => "error", "error" => "messages is not exist")
    ));
}

// message
$response=array("status" => "ok", "messages" => array());

while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
    // extract row
    // this will make $row['name'] to
    // just $name only
    extract($row);

    $message_item = array(
        'username' => html_entity_decode($username),
        'email' => html_entity_decode($email),
        'homepage' => html_entity_decode($homepage),
        'text' => html_entity_decode($text),
        'timestamp' => $timestamp
    );

    array_push($response["messages"], $message_item);

}

exit(json_encode($response));

