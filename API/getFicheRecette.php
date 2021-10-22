<?php
require_once('models/ModelFicheRecette.php');

$id = $_GET['idFicheRecette'];
ModelFicheRecette::getFicheRecette($id);
