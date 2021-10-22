<?php

require_once ("models/ModelUniteCategories.php");

$id_categorie = $_GET['id_categorie'];
$nom_categorie = $_GET['nom_categorie'];

ModelUniteCategories::modifierCategorie($id_categorie,$nom_categorie);