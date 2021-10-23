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
    <script src="../js/FicheRecette.js" defer></script>
    <script type="text/javascript">
        window.onload = function() {
            let cookies = document.cookie.split(";");
            let id = 0;
            cookies.forEach(val => {
                if (val.indexOf("idFicheRecette") === 0)
                    id = val.substring("idFicheRecette".length+1); //+1 pour le =, nameCookie=value
            })
            var recette;
            if(id == 0)
                recette = new FicheRecette();
            else {
                let url = "../API/getFicheRecette.php?idFicheRecette="+id;
                let requete = new XMLHttpRequest();
                requete.open("GET", url, true);
                
                requete.addEventListener("load", function (){
                    let infos = JSON.parse(requete.response);
                    //console.log(infos);
                    recette = new FicheRecette(infos);
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
            <li class="entetli"><a class="enteta" onclick = "document.cookie = 'idFicheRecette=; path=/';" href="recette.php">Créer une fiche technique</a></li>
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
                                <td>Nb Portions : <input id="recette_nbportions"></input></td>
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
                    <td></td>
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