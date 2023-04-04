<?php
    header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

    //Because you are posting the data via fetch(), php has to retrieve it elsewhere.
    $json_str = file_get_contents('php://input');
    //This will store the data into an associative array
    $json_obj = json_decode($json_str, true);

    ini_set("session.cookie_httponly", 1);

	if(!isset($_SESSION)){
		session_start();
	}

    echo json_encode($json_obj);
    exit;
?>
