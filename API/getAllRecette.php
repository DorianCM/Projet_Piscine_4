<?php

require_once("models/ModelListeRecette.php");

$order = $_GET['order'];
if ($_GET["name"]=="1"){
    $tab = ModelListeRecette::getAllRecette(".*",$order);
}else{
    $name = $_GET["name"];
    $tab = ModelListeRecette::getAllRecette($name,$order);
}

echo json_encode($tab);