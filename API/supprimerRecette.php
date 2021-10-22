<?php

require_once ('models/ModelListeRecette.php');

$id = $_GET["id"];

ModelListeRecette::supprimerRecette($id);