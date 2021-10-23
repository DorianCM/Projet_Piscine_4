<?php

require_once("models/ModelUniteCategories.php");

$nom = $_GET['nom'];

return ModelUniteCategories::ajouterCategorieRecette($nom);