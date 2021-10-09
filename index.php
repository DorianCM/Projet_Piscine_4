<?php
  $url='';
  if(isset($_GET['page'])) {
      $url=explode('/',$_GET['page']);
  }
  if(empty($url))
  {
        require_once "Controller/Controller.php";
  }
  else {
    switch($url[0]) {
        case "":
            require_once "Controller/Controller.php";
            break;
        case "index.php":
            require_once "Controller/Controller.php";
            break;
        case "recette":
            require_once "Controller/Recette.php";
            break;
        default:
            echo $url[0];
            break;
    }
  }
