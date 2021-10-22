<?php

require_once("models/ModelUniteCategories.php");

echo json_encode(ModelUniteCategories::getAllCategorie());