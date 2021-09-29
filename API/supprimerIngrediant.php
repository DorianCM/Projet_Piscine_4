<?php

require_once ('Model.php');

$id = $_GET["id"];

Model::supprimerIngrediant($id);