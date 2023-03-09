<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: *");
    header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

    ini_set("session.cookie_httponly", 1);

    $json_str = file_get_contents('php://input');
    $json_obj = json_decode($json_str, true);

    session_start();
    // require "database.php";

	if(!isset($_SESSION)){
		session_start();
	}

    echo json_encode(array(
        "success" => true,
        "id" => $id,
    ));
    exit;
?>