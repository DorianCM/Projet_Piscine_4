<?php

require_once('models/ModelIngredient.php');

$name = $_GET["name"];
$id_unite = $_GET["id_unite"];
$prix_ingrediant = $_GET["prix"];
$est_allergene = $_GET["allergene"];
$id_categorie = $_GET["id_categorie"];
$id_tva = $_GET["id_tva"];

Model::ajouterIngrediant($name,$id_unite,$prix_ingrediant,$est_allergene,$id_categorie,$id_tva);