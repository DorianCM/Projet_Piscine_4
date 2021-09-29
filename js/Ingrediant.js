let divList = document.getElementById("listIngrediant");
let divBtnAjouter = document.getElementById("btnajouter");
let input_id_tva = document.createElement("input");
input_id_tva.placeholder = "id tva";
let btnAjouter = document.createElement("Button");
btnAjouter.innerText = "Ajouter";
let input_name = document.createElement("input");
input_name.placeholder = "nom d'ingrédiant";
let input_id_unite = document.createElement("input");
input_id_unite.placeholder = "id unité";
let input_prix_ingrediant = document.createElement("input");
input_prix_ingrediant.placeholder = "prix ingrédiant";
let input_est_allergene = document.createElement("input");
input_est_allergene.placeholder = "id allergene";
let input_id_categorie = document.createElement("input");
input_id_categorie.placeholder = "id catégorie";

let order = "id_ingrediant ASC";
let inputTri = document.getElementById("tri");

inputTri.addEventListener("input", function () {
    order = inputTri.value;
    //TO implement for name
    getAllIngrediant("1");
});
let input_barre_recherche_ingredient = document.getElementById("barre_recherche_ingredient");

input_barre_recherche_ingredient.addEventListener("input",function () {
    if (input_barre_recherche_ingredient.value.length >= 2){
        //console.log(input_barre_recherche_ingredient.value);
        getAllIngrediant(input_barre_recherche_ingredient.value);
    }
    else if (input_barre_recherche_ingredient.value.length === 0){
        getAllIngrediant("1");
    }
});

btnAjouter.addEventListener("click", function () {
    let url = "../API/ajouterIngrediant.php?name=" + encodeURIComponent(input_name.value) + "&id_unite=" + encodeURIComponent(input_id_unite.value) +
        "&prix=" + encodeURIComponent(input_prix_ingrediant.value) + "&allergene=" + encodeURIComponent(input_est_allergene.value) + "&id_categorie=" +
        encodeURIComponent(input_id_categorie.value) + "&id_tva=" + encodeURIComponent(input_id_tva.value);
    let requete = new XMLHttpRequest();
    requete.open("GET", url, true);
    requete.send(null);
    requete.addEventListener("load", function (){
        getAllIngrediant("1");
    });

});

let btnPlus = document.createElement("Button");
btnPlus.innerText = "+";
divBtnAjouter.appendChild(btnPlus);

function plus(event){
    btnPlus.innerText = "+";

    divBtnAjouter.appendChild(input_name);
    divBtnAjouter.appendChild(input_id_unite);
    divBtnAjouter.appendChild(input_prix_ingrediant);
    divBtnAjouter.appendChild(input_est_allergene);
    divBtnAjouter.appendChild(input_id_categorie);
    divBtnAjouter.appendChild(input_id_tva);
    divBtnAjouter.appendChild(btnAjouter);

    /*let input = document.createElement("input");
    input.innerText = "nom d'ingrédiant";
    divBtnAjouter.appendChild(input);*/

    btnPlus.removeEventListener("click", plus);

    btnPlus.innerText = "-";
    btnPlus.addEventListener("click", moins)
}

function moins(event){
    btnPlus.innerText = "+";

    btnPlus.removeEventListener("click", moins);
    btnPlus.addEventListener("click",plus);

    divBtnAjouter.removeChild(input_name);
    divBtnAjouter.removeChild(input_id_unite);
    divBtnAjouter.removeChild(input_prix_ingrediant);
    divBtnAjouter.removeChild(input_est_allergene);
    divBtnAjouter.removeChild(input_id_categorie);
    divBtnAjouter.removeChild(input_id_tva);
    divBtnAjouter.removeChild(btnAjouter);
}


btnPlus.addEventListener("click", plus);

/*function getUnitebyId(id){
    let url = "../API/getUniteById.php?id=" + id;
    let requete = new XMLHttpRequest();
    requete.open("GET", url, true);
    requete.send(null);
}*/

function getAllIngrediant(name) {
    divList.innerText = "";
    let url = "../API/getIngrediants.php?name="+ encodeURIComponent(name)+ "&order="+encodeURIComponent(order);
    let requete = new XMLHttpRequest();
    requete.open("GET", url, true);
    requete.addEventListener("load", function () {
        let result = JSON.parse(requete.responseText);
        let table = document.createElement("table");
        let trth = document.createElement("tr");
        table.appendChild(trth);

        let th_nom_ingrediant = document.createElement("th");//nom_ingrediant
        th_nom_ingrediant.innerText="Nom ingrédient";

        let th_nom_unite = document.createElement("th");//nom_unite
        th_nom_unite.innerText="Unité";

        let th_prix_ingredient = document.createElement("th");//prix_ingrediant
        th_prix_ingredient.innerText="Prix par unité";

        let th_nom_categorie_allergene = document.createElement("th");//nom_categorie_allergene
        th_nom_categorie_allergene.innerText="Catégorie allergene";

        let th_nom_categorie = document.createElement("th");//nom_categorie
        th_nom_categorie.innerText= "Nom Catégorie ingrédient";

        let th_categorie_tva = document.createElement("th");//categorie_tva
        th_categorie_tva.innerText="Catégorie TVA";

        let th_valeur_tva = document.createElement("th");//valeur_tva
        th_valeur_tva.innerText="Pourcentage de TVA";

        let th_modifier = document.createElement("th");//modifier
        //th_valeur_tva.value="Pourcentage de TVA";

        let th_supprimer = document.createElement("th");//supprimer
        //th_valeur_tva.value="Pourcentage de TVA";

        trth.appendChild(th_nom_ingrediant);
        trth.appendChild(th_nom_unite);
        trth.appendChild(th_prix_ingredient);
        trth.appendChild(th_nom_categorie_allergene);
        trth.appendChild(th_nom_categorie);
        trth.appendChild(th_categorie_tva);
        trth.appendChild(th_valeur_tva);
        trth.appendChild(th_modifier);
        trth.appendChild(th_supprimer);

        Array.prototype.forEach.call(result, val =>{
            let tr = document.createElement("tr");
            table.appendChild(tr);

            let td_nom_ingrediant = document.createElement("td");//nom_ingrediant
            td_nom_ingrediant.innerText=val.nom_ingrediant;
            /*let input_nom_ingrediant = document.createElement("input");
            td_nom_ingrediant.innerText = input_nom_ingrediant;
            input_nom_ingrediant.value = val.nom_ingrediant;
            input_nom_ingrediant.readOnly=true;*/
            //td_nom_ingrediant.appendChild(input_nom_ingrediant);

            let td_nom_unite = document.createElement("td");//nom_unite
            td_nom_unite.innerText=val.nom_unite;

            let td_prix_ingredient = document.createElement("td");//prix_ingrediant
            td_prix_ingredient.innerText=val.prix_ingrediant + "€";

            let td_nom_categorie_allergene = document.createElement("td");//nom_categorie_allergene
            td_nom_categorie_allergene.innerText=val.nom_categorie_allergene;

            let td_nom_categorie = document.createElement("td");//nom_categorie
            td_nom_categorie.innerText= val.nom_categorie;

            let td_categorie_tva = document.createElement("td");//categorie_tva
            td_categorie_tva.innerText=val.categorie_tva;

            let td_valeur_tva = document.createElement("td");//valeur_tva
            td_valeur_tva.innerText=val.valeur_tva + "%";

            let td_modifier = document.createElement("th");//modifier
            //th_valeur_tva.value="Pourcentage de TVA";

            let td_supprimer = document.createElement("th");//supprimer

            let btnmodif = document.createElement("button");
            let btnsuppr = document.createElement("button");
            btnmodif.innerText = "Modifier";
            btnsuppr.innerText = "Supprimer";
            btnsuppr.addEventListener("click", function () {
                let url = "../API/supprimerIngrediant.php?id=" + encodeURIComponent(val.id_ingrediant);
                let requete = new XMLHttpRequest();
                requete.open("GET", url, true);
                requete.send(null);
                getAllIngrediant("1");
            });

            td_modifier.appendChild(btnmodif);
            td_supprimer.appendChild(btnsuppr);

            tr.appendChild(td_nom_ingrediant);
            tr.appendChild(td_nom_unite);
            tr.appendChild(td_prix_ingredient);
            tr.appendChild(td_nom_categorie_allergene);
            tr.appendChild(td_nom_categorie);
            tr.appendChild(td_categorie_tva);
            tr.appendChild(td_valeur_tva);
            tr.appendChild(td_modifier);
            tr.appendChild(td_supprimer);

            table.appendChild(tr);
        });
        divList.appendChild(table);
    });
    requete.send(null);
}

window.addEventListener("load", function () {
    getAllIngrediant("1");
});