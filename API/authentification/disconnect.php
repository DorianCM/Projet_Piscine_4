<?php
session_start();
session_unset();
session_destroy();

echo "<p> Vous êtes bien déconnecter ! ";
echo "<a href='../../'>Retourner à l'accueil : </a>";



?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Déconnexion</title>
    <link rel="stylesheet" type="text/css" href="../../css/entete.css">
</head>
<body>
    <header>
        <ul class="entetu">
            <li class="entetli"><a class="enteta" onclick = "window.location= '../../'">Accueil</a></li>
            <li class="entetli"><a class="enteta" href="../../View/ingrediants.php">Mercuriale</a></li>
            <li class="entetli"><a class="enteta" href="../../View/liste_recette.php">Liste des fiches techniques</a></li>
            <?php
            session_start();
            if(isset($_SESSION['login'])){
            $adr = '"recette.php"';
            $idFicheRecette = 'idFicheRecette=; path=../../View/';
            $document = 'document.cookie = "'.$idFicheRecette.'"';
            "<div class='bouton' onclick='$document;window.location=$adr'>Créer une fiche technique</div>";
            echo "<li class='entetli'><a class='enteta' onclick='$document;'href=$adr>Créer une fiche technique</a></li>";
            $address1 = "disconnect.php";
            echo "<li style='float:right;'><a class='enteta' href ='$address1'>Deconnexion</a></li>";
            }else{
            $address = "../../View/authentification.php";
            echo "<li style='float:right;'><a class='enteta' href ='$address'>Connexion</a></li>";
            }
            ?>
        </ul>
    </header>
</body>
</html>