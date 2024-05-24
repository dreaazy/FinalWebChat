<?php

session_start();

require_once __DIR__ . "/../inc/utilities.inc.php";

global $WSURI;

$filtri = array();

if (isset($_SESSION["id_user_message"]) && is_numeric($_SESSION["id_user_message"])) {



    if ($_SERVER["REQUEST_METHOD"] == "GET") {

        if (isset($_GET["f"])) {

            $function = $_GET["f"];

            switch ($function) {

                case "search":


                    $wsRemotePath =  $WSURI . "/ws/user/usertry.php";


                    $filtri["SearchText"] = $_SESSION["id_user_message"];

                    $response = WsRequest($wsRemotePath, $filtri);

                    echo $response;

                    break;

                case "message":

                    if (isset($_GET["a"])) {

                        $action = $_GET["a"];

                        switch ($action) {

                            case "lastmessage":


                                $wsRemotePath =  $WSURI . "/ws/message/LastMessage.php";

                                $filtri["SearchText"] = $_SESSION["id_conversation"];

                                $response = WsRequest($wsRemotePath, $filtri);

                                $responseArray = [
                                    'success' => json_decode($response, true)
                                ];

                                echo json_encode($responseArray);


                                break;

                            case "newmessages":

                                $wsRemotePath =  $WSURI . "/ws/message/NewMessages.php";

                                $date1 = $_GET["date1"];
                                $date2 = $_GET["date2"];

                                $filtri["date1"] = $date1;
                                $filtri["date2"] = $date2;
                                $filtri["id_conversation"] = $_SESSION["id_conversation"];


                                $response = WsRequest($wsRemotePath, $filtri);
                               
                                // Encode the array to JSON and echo it
                                echo $response;

                                break;
                        }
                    } else {
                    }


                    break;
            }
        }
    }
}
