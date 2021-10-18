<?php

require_once ("Model.php");

$order = $_GET['order'];
if ($_GET["name"]=="1"){
    $tab = Model::getAllRecette(".*",$order);
}else{
    $name = $_GET["name"];
    $tab = Model::getAllRecette($name,$order);
}

echo json_encode($tab);