<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>Authentification</title>
    <link rel="stylesheet" type="text/css" href="../css/entete.css">
    <link href="https://fonts.googleapis.com/css2?family=Andada+Pro&display=swap" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="../css/authentification.css">
</head>
<body>
<header>
        <ul class="entetu">
            <li class="entetli"><a class="enteta" onclick = "window.location= '../'">Accueil</a></li>
            <li class="entetli"><a class="enteta" href="ingrediants.php">Mercuriale</a></li>
            <li class="entetli"><a class="enteta" href="liste_recette.php">Liste des fiches techniques</a></li>
            <?php
            session_start();
            if(isset($_SESSION['login'])){
            $adr = '"recette.php"';
            $idFicheRecette = 'idFicheRecette=; path=/';
            $document = 'document.cookie = "'.$idFicheRecette.'"';
            "<div class='bouton' onclick='$document;window.location=$adr'>Créer une fiche technique</div>";
            echo "<li class='entetli'><a class='enteta' onclick='$document;'href=$adr>Créer une fiche technique</a></li>";
            $address1 = "../API/authentification/disconnect.php";
            echo "<li style='float:right;'><a class='enteta' href ='$address1'>Déconnexion</a></li>";
            }else{
            $address = "authentification.php";
            echo "<li style='float:right;'><a class='enteta' href ='$address'>Connexion</a></li>";
            }
            ?>
        </ul>
    </header>

<form class="align-center" id="formulaire">
	<label for="id_identifiant">Identifiant</label><br>
	<input type="text" placeholder="Identifiant" name="Identifiant" id="id_identifiant"><br><br>

	<label for="id_mdp">Mot de passe</label><br>
	<input type="password" placeholder="Mot de passe" name="Mdp" id="id_mdp"><br><br>

	<input class="bouton" type="submit" value="Se connecter" id="boutton_valider">
</form>
<div class="align-center">
		<p id="erreur" style="color:red"></p>
</div>

    <script src = "../js/authentification.js"></script>

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