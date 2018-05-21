<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: PUT");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require '../../objects/CaptchasDotNet.php';

if (isset($_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE']))
    $_SERVER['REQUEST_METHOD'] = $_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE'];

// get posted data
$data = json_decode(file_get_contents("php://input"));
if ($data == null)
{
    http_response_code(415);
    exit(json_encode(
        array("status" => "error", "error" => "Valid media is JSON")
    ));
}

if (!isset($data->userName) || !isset($data->email) || !isset($data->text) || !isset($data->captcha))
{
    http_response_code(400);
    exit(json_encode(
        array("status" => "error", "error" => "Required fields is: userName, email, text, captcha")
    ));
}

$captchas = new CaptchasDotNet ('demo', 'secret',
    '/tmp/captchasnet-random-strings','3600',
    'abcdefghkmnopqrstuvwxyz','6',
    '180','70','000088');

if (!$captchas->verify($data->captcha))
{
    print_r($password);
    http_response_code(400);
    exit(json_encode(
        array("status" => "error", "error" => "Captcha incorrect")
    ));
}


if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
    $ip = $_SERVER['HTTP_CLIENT_IP'];
} elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
} else {
    $ip = $_SERVER['REMOTE_ADDR'];
}

// include database and object files
include_once '../../config/Database.php';
include_once '../../objects/UserMessage.php';

// instantiate database and usermessage object
$database = new Database();
$db = $database->getConnection();

// initialize object
$userMessage = new UserMessage($db);

$userMessage->userName = $data->userName;
$userMessage->email = $data->email;
$userMessage->homepage = isset($data->homepage) ? $data->homepage : null;
$userMessage->text = $data->text;
$userMessage->ip = $ip;
$userMessage->userAgent = $_SERVER['HTTP_USER_AGENT'];


if ($userMessage->add()->errorCode() !== '00000')
{
    http_response_code(500);
    exit(json_encode(
        array("status" => "error", "error" => "Error in creation usermessage")
    ));
}

http_response_code(201);
exit(json_encode(
    array("status" => "ok", "email" => $userMessage->email)
));