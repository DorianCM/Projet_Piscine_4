<?php
require_once("models/ModelUniteCategories.php");



$nom = $_GET['nom'];
$valeur = $_GET['valeur'];

return ModelUniteCategories::ajouterCategorieTVA($nom,$valeur);