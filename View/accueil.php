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
    <div id="container">
        <div class="child">
            <img src="View/Images/photoaccueil1.jpg" alt="Photo cuisinier 1">
        </div>
        <div class="child">
            <div class="bouton" onclick="window.location= 'View/ingrediants.php'">Mercuriale</div>
            <div class="bouton" onclick="window.location= 'View/liste_recette.php'">Liste des fiches techniques</div>
            <div class="bouton" onclick="document.cookie = 'idFicheRecette=; path=/';window.location= 'View/recette.php'">Créer une fiche technique</div>
        </div>
        <div class="child">
            <img src="View/Images/photoaccueil2.jpg" alt="Photo cuisinier 2">
        </div>
    </div>
</main>
<footer>
    <div id="dfooter">
        Tous droits réservés
    </div>
</footer>
</body>
</html>