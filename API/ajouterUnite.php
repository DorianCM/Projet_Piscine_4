<?php

require_once("models/ModelUniteCategories.php");

//$table = $_POST['table'];
//$tabNames = $_POST['tabnames'];
//$tabValues = $_POST['tabvalues'];

//ModelUniteCategories::ajouterGenerique($table,$tabNames,$tabValues);

$nom = $_GET['nom'];

return ModelUniteCategories::ajouterUnite($nom);

