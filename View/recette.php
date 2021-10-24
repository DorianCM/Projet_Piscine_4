<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Fiche recette</title>
    <link rel="stylesheet" href="../css/recette.css" />
    <link rel="stylesheet" type="text/css" href="../css/entete.css">
    <script src="../js/Ingredient.js" defer></script>
    <script src="../js/Etape.js" defer></script>
    <script src="../js/Cout.js" defer></script>
    <script src="../js/ModalIngredient.js" defer></script>
    <script src="../js/ModalSousFicheRecette.js" defer></script>
    <script src="../js/FicheRecette.js" defer></script>
    <script type="text/javascript">
        //On va vérifier si on a une recette à charger
        window.onload = function() {
            let cookies = document.cookie.split(";");
            let id = 0;
            cookies.forEach(val => {
                if (val.indexOf("idFicheRecette") === 0)
                    id = val.substring("idFicheRecette".length+1); //+1 pour le =, nameCookie=value
                else if (val.indexOf(" idFicheRecette") === 0) //Car il peut avoir un espace au début de la chaine de caractères
                    id = val.substring("idFicheRecette".length+2);
            });
            var recette;
            if(id == 0) //dans la base de données, les id commencent à 1, donc 0 = pas de recette
                recette = new FicheRecette();
            else {
                let url = "../API/getFicheRecette.php?idFicheRecette="+id;
                let requete = new XMLHttpRequest();
                requete.open("GET", url, true);
                
                requete.addEventListener("load", function (){
                    let infos = JSON.parse(requete.response);
                    recette = new FicheRecette(infos);

                    //Envoie une requête à la page API/authentification/is_connected.php pour savoir si l'on est connecté
                    let url_2 = "../API/authentification/is_connected.php";
                    let requete_2 = new XMLHttpRequest();
                    requete_2.open("GET", url_2, true);
                    requete_2.addEventListener("load", function () {
                        var res = JSON.parse(requete_2.response);
                        var bool_move_page = res['Response'];
                        //si l'on est pas connecté on charge la version PDF
                        if (!bool_move_page) {
                            recette.hideForPDF(true);
                            }

                    });
                    requete_2.send(null);
                });
                requete.send(null);

            }
        }
      </script>
</head>
<body>

    <header>

        <ul class="entetu">
            <li class="entetli"><a class="enteta" onclick = "window.location= '../'">Accueil</a></li>
            <li class="entetli"><a class="enteta" href="ingrediants.php">Mercuriale</a></li>
            <li class="entetli"><a class="enteta" href="liste_recette.php">Liste des fiches techniques</a></li>
            <?php
            session_start();
            /* Si l'on est connecté on affiche les bouttons Créer une fiche technique et Déconnexion */
            if(isset($_SESSION['login'])){
            $adr = '"recette.php"';
            $idFicheRecette = 'idFicheRecette=; path=/';
            $document = 'document.cookie = "'.$idFicheRecette.'"';
            "<div class='bouton' onclick='$document;window.location=$adr'>Créer une fiche technique</div>";
            echo "<li class='entetli'><a class='enteta' onclick='$document;'href=$adr>Créer une fiche technique</a></li>";
            $address1 = "../API/authentification/disconnect.php";
            echo "<li style='float:right;'><a class='enteta' href ='$address1'>Déconnexion</a></li>";
            }else{
            /* sinon on affiche le boutton Connexion */
            $address = "authentification.php";
            echo "<li style='float:right;'><a class='enteta' href ='$address'>Connexion</a></li>";
            }
            ?>
        </ul>

    </header>

    <main>

    <section>
        <div id="content">
            <table id="tabInfos">
                <tr>
                    <td id = "infosNom"><input id="recette_nom"></input></td>
                    <td id = "infosPortionsAuteur">
                        <table>
                            <tr>
                                <td>Nb Portions : <input type="number" id="recette_nbportions"></input></td>
                            </tr>
                            <tr>
                                <td>Auteur : <input id="recette_auteur"></input></td>
                            </tr>
                            <tr>
                                <td id="tdCategorieRecette">Catégorie : <select id="selectCategorieRecette"></select></td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
            <table id="tableEtapes">
                <tbody id="tabEtapes">
                <tr id = "ligneTh">
                    <th>Etapes</th>
                    <th colspan="4" id="thIngredients">Ingrédients</th>
                    <th id = "thCout">Coûts</th>
                </tr>
                <tr id ="ligneTd">
                    <td id="addSousRecette"><button id="addSousRecetteButton">Ajouter une sous-recette</button></td>
                    <td id ="colonneLibelle">Libellé</td>
                    <td id ="colonneQuantite">Quantité</td>
                    <td id ="colonneUnite">Unité</td>
                    <td id ="colonneCategorie">Catégorie</td>
                    <td id ="colonneCout">Prix x Quantité</td>
                </tr>
                <tr id="addEtape"><td><button id="addEtapeButton">Ajouter une étape</button></td><td colspan="5"></td></tr>
                <tr id ="ligneCouts">
                    <td class="coutVide" colspan="3"></td>
                    <td id="ligneCoutsType">Type</td>
                    <td>Nom du coût</td>
                    <td>Valeur</td>
                </tr>
                <tr class="cout">
                    <td colspan="4"></td>
                    <td class="total">Total Ingrédients</td>
                    <td id ="TotalIngredients"></td>
                </tr>
                <tr id="addCout">
                    <td colspan="4"></td>
                    <td><button id="addCoutButton">Ajouter un coût</button></td>
                    <td></td>
                </tr>
                <tr id="ligneTotal" class="cout">
                    <td colspan="4"></td>
                    <td class="total">Total HT</td>
                    <td id="valeurTotal">0</td>
                </tr>
                <tr id="ligneTotalTTC" class="cout">
                    <td colspan="4"></td>
                    <td class="total">Total TTC</td>
                    <td id="valeurTotalTTC">0</td>
                </tr>
                <tr id="ligneTTCPortions" class="cout">
                    <td colspan="4"></td>
                    <td class="total">Par portions</td>
                    <td id="valeurTTCPortions">0</td>
                </tr>
                </tbody>
            </table>

            <button id = "saveButton">
                Enregistrer les modifications
            </button>
            <button id = "PDFFiche">
                Convertir en PDF
            </button>
            <button id = "PDFFicheCouts">
                Convertif en PDF (sans les coûts)
            </button>
        </div>
      </section>

    </main>
</body>
</html>