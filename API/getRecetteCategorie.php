<?php

require_once("models/ModelFicheRecette.php");

$tab = ModelFicheRecette::getCategorieRecette();

echo json_encode($tab);