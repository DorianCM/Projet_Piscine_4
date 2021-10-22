let divList = document.getElementById("listIngrediant");
let divBtnAjouter = document.getElementById("btnajouter");
let btnAjouter = document.createElement("Button");
btnAjouter.innerText = "Ajouter";

let nom_ingrediant_input;
let clone_unite;
let prix_ingredient_input;
let clone_categorie_allergene;
let clone_categorie;
let clone_tva;

let modifyingState = null;


let input_name = document.createElement("input");
input_name.placeholder = "nom d'ingrédiant";

let input_prix_ingrediant = document.createElement("input");
input_prix_ingrediant.placeholder = "prix ingrédiant";

let input_id_unite = document.createElement("select");
function init_input_id_unite(){
    let url = "../API/getAllUnite.php";
    let requete = new XMLHttpRequest();
    requete.open("GET", url, true);
    requete.addEventListener("load", function () {
        let result = JSON.parse(requete.responseText);
        Array.prototype.forEach.call(result, val =>{
            let option = document.createElement("option");
            option.value = val.id_unite;
            option.innerText = val.nom_unite;
            input_id_unite.appendChild(option);
        });
    });
    requete.send(null);
}

let input_categorie_allergene = document.createElement("select");
function init_input_id_categorie_allergene(){
    let url = "../API/getAllCategorie_Allergene.php";
    let requete = new XMLHttpRequest();
    requete.open("GET", url, true);
    requete.addEventListener("load", function () {
        let result = JSON.parse(requete.responseText);
        Array.prototype.forEach.call(result, val =>{
            let option = document.createElement("option");
            option.value = val.id_categorie_allergene;
            option.innerText = val.nom_categorie_allergene;
            input_categorie_allergene.appendChild(option);
        });
    });
    requete.send(null);
}
let input_id_categorie = document.createElement("select");
function init_input_id_categorie(){
    let url = "../API/getAllCategorie.php";
    let requete = new XMLHttpRequest();
    requete.open("GET", url, true);
    requete.addEventListener("load", function () {
        let result = JSON.parse(requete.responseText);
        Array.prototype.forEach.call(result, val =>{
            let option = document.createElement("option");
            option.value = val.id_categorie;
            option.innerText = val.nom_categorie;
            input_id_categorie.appendChild(option);
        });
    });
    requete.send(null);
}
let input_id_tva = document.createElement("select");
function init_input_id_tva(){
    let url = "../API/getAllTVA.php";
    let requete = new XMLHttpRequest();
    requete.open("GET", url, true);
    requete.addEventListener("load", function () {
        let result = JSON.parse(requete.responseText);
        Array.prototype.forEach.call(result, val =>{
            let option = document.createElement("option");
            option.value = val.id_tva;
            option.innerText = val.categorie_tva;
            input_id_tva.appendChild(option);
        });
    });
    requete.send(null);
}

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
        "&prix=" + encodeURIComponent(input_prix_ingrediant.value) + "&allergene=" + encodeURIComponent(input_categorie_allergene.value) + "&id_categorie=" +
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
    divBtnAjouter.appendChild(input_categorie_allergene);
    divBtnAjouter.appendChild(input_id_categorie);
    divBtnAjouter.appendChild(input_id_tva);
    divBtnAjouter.appendChild(btnAjouter);

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
    divBtnAjouter.removeChild(input_categorie_allergene);
    divBtnAjouter.removeChild(input_id_categorie);
    divBtnAjouter.removeChild(input_id_tva);
    divBtnAjouter.removeChild(btnAjouter);
}

//Fonction pour créer un th ou un td et le mettre dans le bon element tout en lui donnant un innerText approprié
//tag -> String ; innerText -> string, parentElement -> DOMElement
function th_td_creator(tag,innerText,parentElement){
    let element = document.createElement(tag);//nom_ingrediant
    element.innerText=innerText;
    parentElement.appendChild(element);
}

//listInnerText -> list of String
function th_td_multiple_creator(tag,listInnerText,ParentElement){
    Array.prototype.forEach.call(listInnerText, el =>{
        th_td_creator(tag,el,ParentElement);
    });
}


btnPlus.addEventListener("click", plus);

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

        //"Nom ingrédient"
        th_td_multiple_creator("th",["Nom ingrédient","Unité","Prix par unité", "Catégorie allergene",
            "Nom Catégorie ingrédient","Catégorie TVA","Pourcentage de TVA","",""],trth);


        Array.prototype.forEach.call(result, val =>{
            let tr = document.createElement("tr");
            table.appendChild(tr);

            let td_nom_ingrediant = document.createElement("td");//nom_ingrediant
            td_nom_ingrediant.innerText=val.nom_ingrediant;

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
            btnmodif.addEventListener("click", function(){
                if(btnmodif.innerText === "Modifier"){
                    if(modifyingState !== null){
                        getAllIngrediant("1");
                        modifyingState = null;
                    }
                    else{
                        modifyingState = "modifying";
                    }

                    nom_ingrediant_input = document.createElement("input");
                    nom_ingrediant_input.value = td_nom_ingrediant.innerText;
                    td_nom_ingrediant.innerText="";
                    td_nom_ingrediant.appendChild(nom_ingrediant_input);


                    clone_unite = input_id_unite.cloneNode(true);
                    clone_unite.id = "input_unite_" + val.id_ingrediant;
                    input_id_unite.after(clone_unite);
                    Array.prototype.forEach.call(clone_unite.childNodes, el =>{
                        if (el.innerText === td_nom_unite.innerText){
                            el.selected = true;
                        }
                    });
                    td_nom_unite.innerText="";
                    td_nom_unite.appendChild(clone_unite);

                    prix_ingredient_input = document.createElement("input");
                    prix_ingredient_input.value = td_prix_ingredient.innerText;
                    td_prix_ingredient.innerText="";
                    td_prix_ingredient.appendChild(prix_ingredient_input);

                    clone_categorie_allergene = input_categorie_allergene.cloneNode(true);
                    clone_categorie_allergene.id = "input_categorie_allergene_" + val.id_ingrediant;
                    input_id_unite.after(clone_categorie_allergene);
                    Array.prototype.forEach.call(clone_categorie_allergene.childNodes, el =>{
                        if (el.innerText === td_nom_categorie_allergene.innerText){
                            el.selected = true;
                        }
                    });
                    td_nom_categorie_allergene.innerText="";
                    td_nom_categorie_allergene.appendChild(clone_categorie_allergene);

                    clone_categorie = input_id_categorie.cloneNode(true);
                    clone_categorie.id = "input_categorie_" + val.id_ingrediant;
                    input_id_categorie.after(clone_categorie);
                    Array.prototype.forEach.call(clone_categorie.childNodes, el =>{
                        if (el.innerText === td_nom_categorie.innerText){
                            el.selected = true;
                        }
                    });
                    td_nom_categorie.innerText="";
                    td_nom_categorie.appendChild(clone_categorie);

                    clone_tva = input_id_tva.cloneNode(true);
                    clone_tva.id = "input_tva_" + val.id_ingrediant;
                    input_id_tva.after(clone_tva);
                    Array.prototype.forEach.call(clone_tva.childNodes, el =>{
                        if (el.innerText === td_categorie_tva.innerText){
                            el.selected = true;
                        }
                    });
                    td_categorie_tva.innerText="";
                    td_categorie_tva.appendChild(clone_tva);
                    btnmodif.innerText = "Valider";
                }
                else if(btnmodif.innerText === "Valider"){
                    let url = "../API/updateIngrediant.php?id=" + encodeURIComponent(val.id_ingrediant) + "&name=" + encodeURIComponent(nom_ingrediant_input.value) + "&id_unite=" + encodeURIComponent(clone_unite.value) +
                    "&prix=" + encodeURIComponent(parseFloat(prix_ingredient_input.value)) + "&allergene=" + encodeURIComponent(clone_categorie_allergene.value) + "&id_categorie=" + encodeURIComponent(clone_categorie.value) + "&id_tva=" + encodeURIComponent(clone_tva.value);
                    let requete = new XMLHttpRequest();
                    requete.open("GET", url, true);
                    requete.addEventListener("load", function(){
                        getAllIngrediant("1");
                    });
                    requete.send(null);

                    btnmodif.innerText = "Modifier";
                    modifyingState = null;
                }
            });
            btnsuppr.innerText = "Supprimer";
            btnsuppr.addEventListener("click", function () {
                let url = "../API/supprimerIngrediant.php?id=" + encodeURIComponent(val.id_ingrediant);
                let requete = new XMLHttpRequest();
                requete.open("GET", url, true);
                requete.addEventListener("load", function (){
                    getAllIngrediant("1");
                });
                requete.send(null);
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
    init_input_id_unite();
    init_input_id_categorie_allergene();
    init_input_id_categorie();
    init_input_id_tva();
});