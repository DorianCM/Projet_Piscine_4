<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="preconnect" href="https://fonts.googleapis.com/%22%3E
        <link rel="preconnect" href="https://fonts.gstatic.com/" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Andada+Pro&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/accueil.css" />
    <title>Accueil</title>
</head>
<body>
<main>
    <div class="container">
        <div class="child">
            <img src="View/Images/photoaccueil1.jpg" alt="Photo cuisinier 1">
        </div>
        <div class="milieu">
            <div class="titre">Nom du site</div>
                <div class="regr">
                    <div class="bouton" onclick="window.location= 'View/ingrediants.php'">Mercuriale</div>
                    <div class="bouton" onclick="window.location= 'View/liste_recette.php'">Liste des fiches techniques</div>
                    <?php if (isset($_SESSION['login'])){
                     $adr = '"View/recette.php"';
                     $idFicheRecette = 'idFicheRecette=; path=/';
                     $document = 'document.cookie = "$idFicheRecette"';
                     $address1 = 'window.location = "API/authentification/disconnect.php"';
                     echo "<div class='bouton' onclick='$document;window.location=$adr'>Créer une fiche technique</div>";
                     echo "<div class='bouton' onclick ='$address1'>Deconnexion</div>";
                    }else{
                    $address = 'window.location = "View/authentification.php"';
                     echo "<div class='bouton' onclick ='$address'>Connexion</div>";} ?>
                </div>
        </div>
        <div class="child">
            <img src="View/Images/photoaccueil2.jpg" alt="Photo cuisinier 2">
        </div>
    </div>
</main>
<footer>
    <div id="dfooter">
        <div> © </div>
        <div> | </div>
        <div>
            Lycée des métiers de la gastronomie, de l'hôtellerie et des tourismes Georges-Frêche
        </div>
    </div>
</footer>
</body>
</html>