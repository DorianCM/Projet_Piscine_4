<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Création et modifications des unités et catégories d'ingrédients</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/unitecategories.css" />
    <script src="../js/UniteCategories.js" defer></script>
    <link rel="stylesheet" type="text/css" href="../css/entete.css">
</head>
<body>

    <header>
        <ul class="entetu">
            <li class="entetli"><a class="enteta" href= "../">Accueil</a></li>
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

    <div class="triplecontainer">
        <div class="box" id="unite">
            <input id="inputUnite">
            <button id="btnAjouterUnite">Ajouter</button>
            <div class="liste_unite" id="liste_unite">

            </div>
        </div>
        <div class="box" id="categorie_ingredient">
            <input id="inputCategorie">
            <button id="btnAjouterCategorie">Ajouter</button>
            <div class="liste_categorie_ingredient" id="liste_categorie_ingredient">

            </div>
        </div>
        <div class="box" id="categorie_recette">
            <input id="inputCategorieRecette">
            <button id="btnAjouterCategorieRecette">Ajouter</button>
            <div class="liste_categorie_recette" id="liste_categorie_recette">

            </div>
        </div>
        <div class="box" id="categorie_tva">
            <input id="inputCategorieTVA">
            <input id="inputValeurTVA">
            <button id="btnAjouterCategorieTVA">Ajouter</button>
            <div class="liste_categorie_tva" id="liste_categorie_tva">

            </div>
        </div>
    </div>

</body>
</html>