<?php

require_once('models/ModelFicheRecette.php');

$infos = json_decode($_GET["infos"], true);

if ($infos["id"] == '0') {
    ModelFicheRecette::ajouterFicheRecette($infos);
}
else {
    ModelFicheRecette::updateFicheRecette($infos);
}