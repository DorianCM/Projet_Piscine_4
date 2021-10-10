<?php

require_once("models/ModelIngredient.php");

$order = $_GET['order'];
if ($_GET["name"]=="1"){
    $tab = Model::getAllIngrediants(".*",$order);
}else{
    $name = $_GET["name"];
    $tab = Model::getAllIngrediants($name,$order);
}

echo json_encode($tab);