<?php

$DBhost ="localhost";
$DBuser ="root";
$DBpassword ="";
$DBName= "webchat_v2";
/* 
$DBhost ="localhost";
$DBuser ="uvzgnrcjcpl3g";
$DBpassword ="Chiccopiccinini2005!";
$DBName= "dboxfiaapnbn3h";
 */
$conn = new mysqli($DBhost,$DBuser,$DBpassword,$DBName);

if($conn->connect_error)
{
    die("connection failed: ".$conn->connect_error);
}


?>