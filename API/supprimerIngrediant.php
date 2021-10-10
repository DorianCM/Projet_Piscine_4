<?php

require_once('models/ModelIngredient.php');

$id = $_GET["id"];

Model::supprimerIngrediant($id);