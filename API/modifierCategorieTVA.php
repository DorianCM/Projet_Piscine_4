<?php

require_once ("models/ModelUniteCategories.php");

$id_tva = $_GET['id_tva'];
$nom_tva = $_GET['nom_tva'];
$valeur = $_GET['valeur'];

ModelUniteCategories::modifierCategorieTVA($id_tva,$nom_tva,$valeur);