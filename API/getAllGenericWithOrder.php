<?php

require_once("models/ModelUniteCategories.php");

$order = $_GET['order'];
$table = $_GET['table'];
$regexpEl = $_GET['regexpel'];
if ($_GET["name"] == "1") {
    $tab = ModelUniteCategories::getAllGenericWithOrder(".*", $order,$table,$regexpEl);
} else {
    $name = $_GET["name"];
    $tab = ModelUniteCategories::getAllGenericWithOrder($name, $order,$table,$regexpEl);
}

echo json_encode($tab);