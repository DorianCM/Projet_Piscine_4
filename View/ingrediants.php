<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Liste ingrediants</title>
    <link rel="stylesheet" href="../css/liste_ingredients.css" />
    <script src="../js/Ingrediant.js" defer></script>
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
            $document = 'document.cookie = "$idFicheRecette"';
            "<div class='bouton' onclick='$document;window.location=$adr'>Créer une fiche technique</div>";
            echo "<li class='entetli'><a class='enteta' onclick='$document;'href=$adr>Créer une fiche technique</a></li>";
            }
            ?>
        </ul>
    </header>

    <main>

    <div id="recherche">
        <div>Quel produit recherchez vous ?</div>
        <input name="barre_recherche_ingredient" id="barre_recherche_ingredient" placeholder="Par exemple : Beurre">
    </div>

    <div id="btnajouter">
        <div>Pour ajouter un produit :</div>
    </div>
    <div id="divTri">
        <label>Trier par</label>
        <select id="tri" name="tri">
            <option value="id_ingrediant ASC" selected>Ordre d'ajout(du plus ancien au plus récent)</option>
            <option value="id_ingrediant DESC">Ordre d'ajout(du plus récent au plus ancien)</option>
            <option value="nom_ingrediant ASC">Ordre alphabétique(A-Z)</option>
            <option value="nom_ingrediant DESC">Ordre alphabétique(Z-A)</option>
            <option value="nom_categorie ASC">Par catégorie(A-Z)</option>
            <option value="nom_categorie DESC">Par catégorie(Z-A)</option>
        </select>
    </div>
    <div id="listIngrediant">

    </div>

    </main>

</body>
</html>