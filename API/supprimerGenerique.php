<?php

require_once("models/ModelUniteCategories.php");

$table = $_GET['table'];
$fieldname = $_GET['fieldname'];
$id_generique = $_GET['id_generique'];

return ModelUniteCategories::supprimerGenerique($table,$fieldname,$id_generique);