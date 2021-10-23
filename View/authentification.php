<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>Authentification</title>


</head>
<body>

<h1 align = "center">Projet piscine</h1>
<form align="center" id="formulaire">
	<label for="id_identifiant">Identifiant</label>
	<input type="text" placeholder="Identifiant" name="Identifiant" id="id_identifiant"><br>

	<label for="id_mdp">Mot de passe</label>
	<input type="password" placeholder="Mot de passe" name="Mdp" id="id_mdp"><br>

	<input type="submit" value="Valider" id="boutton_valider">
</form>

<div align="center">
    <button id="disconnect">Déconnexion</button>
</div>
<div align="center">
		<p id="erreur" style="color:red"></p>
</div>

	<script src = "../js/authentification.js"></script>
</body>
</html>