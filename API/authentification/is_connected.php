<?php

session_start();
if (isset($_SESSION['login'])){
    $response = array(
    'Response' => true);
    $json = json_encode($response);
    echo $json;
}else{
    $response = array(
       'Response' => false);
    $json = json_encode($response);
    echo $json;
}

?>