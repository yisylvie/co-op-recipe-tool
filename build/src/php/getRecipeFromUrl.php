<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: *");
    header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json
    
    //Because you are posting the data via fetch(), php has to retrieve it elsewhere.
    $json_str = file_get_contents('php://input');
    //This will store the data into an associative array
    $json_obj = json_decode($json_str, true);
    
    ini_set("session.cookie_httponly", 1);

    if(!isset($_SESSION)){
		session_start();
	}

    setcookie(session_name(), session_id());

    $url = $json_obj['url'];
    $name = $json_obj['name'];
    $cookTime = $json_obj['cookTime'];
    $prepTime = $json_obj['prepTime'];
    $totalTime = $json_obj['totalTime'];
    $recipeIngredients = $json_obj['recipeIngredients'];
    $recipeInstructions = $json_obj['recipeInstructions'];
    $recipeYield = $json_obj['recipeYield'];
    $description = $json_obj['description'];
    $_SESSION['originalRecipe'] = array(
        'url' => $url,
        'name' => $name
    );

    $_SESSION['bro'] = "bro";

    echo json_encode(array(
        "url" => $_SESSION['originalRecipe']['url'],
        "name" => $name
    ));
    // phpinfo();
    // echo json_encode($json_obj);
    exit();
?>
