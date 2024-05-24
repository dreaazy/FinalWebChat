<?php



if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    session_start();

    include __DIR__ . "/config.php";

    include __DIR__ . "/../bl/utenteBL.inc.php"; // Correct the path

    // Set Content-Type header just once
    header('Content-Type: application/json;charset=UTF-8');

    // Process the incoming POST data
    $requestData = json_decode(file_get_contents('php://input'), true);

    if (isset($_GET["t"])) {
        $type = $_GET["t"];

        if ($type = "exact") {
            // Perform some operations based on the incoming data
            $searchText = $requestData['SearchText'];
        
            $utenteBL = new UtenteBL($conn);
        
            $result = $utenteBL->GetUserByUsername($searchText, true); // Correct method invocation
        
            if ($result) {
                $users = json_decode($result, true);
        
                if (is_array($users)) {
                    // Iterate through each user and add a new key-value pair to each user
                    foreach ($users as &$user) {
                        $user['user_id'] = $_SESSION["user_id"]; // Add another key-value pair to each user
                    }
        
                    echo json_encode($users);
                } else {
                    echo json_encode(["error" => "Invalid user data format"]);
                }
            } else {
                echo json_encode(["error" => "No user data found"]);
            }
        }
        
    } else {
        // Perform some operations based on the incoming data
        $searchText = $requestData['SearchText'];

        $utenteBL = new UtenteBL($conn);

        $result = $utenteBL->GetUserByUsername($searchText, false); // Correct method invocation

        echo $result;
    }
}
