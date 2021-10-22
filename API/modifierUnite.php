<?php

require_once ("models/ModelUniteCategories.php");

$id_unite = $_GET['id_unite'];
$nom_unite = $_GET['nom_unite'];

ModelUniteCategories::modifierUnite($id_unite,$nom_unite);