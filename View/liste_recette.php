<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Liste fiches techniques</title>
    <link rel="stylesheet" href="../css/accueil.css" />
    <script src="../js/ListeRecette.js" defer></script>
    <link rel="stylesheet" type="text/css" href="../css/entete.css">
</head>
    <body>

    <header>

        <ul class="entetu">
            <li class="entetli"><a class="enteta" href="ingrediants.php">Mercuriale</a></li>
            <li class="entetli"><a class="enteta" href="liste_recette.php">Liste des fiches techniques</a></li>
            <li class="entetli"><a class="enteta" onclick = "document.cookie = 'idFicheRecette=; path=/';" href="recette.php">Créer une fiche technique</a></li>
        </ul>

    </header>

    <main>

    <div id="recherche">
            <input name="barre_recherche_recette" id="barre_recherche_recette">
        </div>

        <div id="divTri">
            <label>Trier par</label>
            <select id="tri" name="tri">
                <option value="nom_recette ASC">Ordre alphabétique(A-Z)</option>
                <option value="nom_recette DESC">Ordre alphabétique(Z-A)</option>
                <option value="nom_createur ASC">Ordre alphabétique(A-Z)</option>
                <option value="nom_createur DESC">Ordre alphabétique(Z-A)</option>
            </select>
        </div>

        <div id="listRecette"></div>

    </main>

    </body>
</html>