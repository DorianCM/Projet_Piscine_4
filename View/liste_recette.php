<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Liste fiches techniques</title>
    <link rel="stylesheet" href="../css/liste_ingredients.css" />
    <script src="../js/ListeRecette.js" defer></script>
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

    <main>

    <div id="recherche">
        <div>Quelle fiche technique recherchez vous ?</div>
            <input name="barre_recherche_recette" id="barre_recherche_recette" placeholder="Par exemple : Filet de poulet..">
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