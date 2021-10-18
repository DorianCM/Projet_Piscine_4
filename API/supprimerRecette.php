<?php

require_once ('Model.php');

$id = $_GET["id"];

Model::supprimerRecette($id);