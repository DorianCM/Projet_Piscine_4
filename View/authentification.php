<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>Authentification</title>
    <link rel="stylesheet" type="text/css" href="../css/entete.css">

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
            echo "<li style='float:right;'><a class='enteta' href ='$address1'>Deconnexion</a></li>";
            }else{
            $address = "authentification.php";
            echo "<li style='float:right;'><a class='enteta' href ='$address'>Connexion</a></li>";
            }
            ?>
        </ul>
    </header>

<h1 align = "center">Non toccare la mia ricetta</h1>
<form align="center" id="formulaire">
	<label for="id_identifiant">Identifiant</label>
	<input type="text" placeholder="Identifiant" name="Identifiant" id="id_identifiant"><br>

	<label for="id_mdp">Mot de passe</label>
	<input type="password" placeholder="Mot de passe" name="Mdp" id="id_mdp"><br>

	<input type="submit" value="Valider" id="boutton_valider">
</form>
<div align="center">
		<p id="erreur" style="color:red"></p>
</div>

	<script src = "../js/authentification.js"></script>
</body>
</html>