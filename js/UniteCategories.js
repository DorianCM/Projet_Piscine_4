let liste_unite = document.getElementById("liste_unite");
let liste_categorie_ingredient = document.getElementById("liste_categorie_ingredient");
let liste_categorie_tva = document.getElementById("liste_categorie_tva");

let inputUnite = document.getElementById("inputUnite");
let btnAjouterUnite = document.getElementById("btnAjouterUnite");

btnAjouterUnite.addEventListener("click",function () {
    if (inputUnite.value.length > 0){
        ajouterUnite(inputUnite.value);
        inputUnite.value = "";
    }
});

let inputCategorie = document.getElementById("inputCategorie");
let btnAjouterCategorie = document.getElementById("btnAjouterCategorie");

btnAjouterCategorie.addEventListener("click",function () {
    if (inputCategorie.value.length > 0){
        ajouterCategorie(inputCategorie.value);
        inputCategorie.value = "";
    }
});

let inputCategorieTVA = document.getElementById("inputCategorieTVA");
let inputValeurTVA = document.getElementById("inputValeurTVA");
let btnAjouterCategorieTVA = document.getElementById("btnAjouterCategorieTVA");

btnAjouterCategorieTVA.addEventListener("click",function () {
    if (inputCategorieTVA.value.length > 0 && inputValeurTVA.value.length > 0){
        ajouterCategorieTVA(inputCategorieTVA.value,inputValeurTVA.value);
        inputCategorieTVA.value = "";
        inputValeurTVA.value = "";
    }
});

//Fonction pour créer un th ou un td et le mettre dans le bon element tout en lui donnant un innerText approprié
//tag -> String ; innerText -> string, parentElement -> DOMElement
function th_td_creator(tag,innerText,parentElement){
    let element = document.createElement(tag);//nom_ingrediant
    element.innerText=innerText;
    parentElement.appendChild(element);
    //return element;
}

//listInnerText -> list of String
function th_td_multiple_creator(tag,listInnerText,ParentElement){
    Array.prototype.forEach.call(listInnerText, el =>{
        th_td_creator(tag,el,ParentElement);
    });
}

function modifierUnite(id_unite,nom_unite){
    let url = "../API/modifierUnite.php?id_unite=" + encodeURIComponent(id_unite) + "&nom_unite=" + encodeURIComponent(nom_unite);
    let requete = new XMLHttpRequest();
    requete.open("GET", url, true);
    requete.send(null);
    requete.addEventListener("load", function () {
        loadLists()
    });
}

function modifierCategorie(id_categorie,nom_categorie){
    let url = "../API/modifierCategorie.php?id_categorie=" + encodeURIComponent(id_categorie) + "&nom_categorie=" + encodeURIComponent(nom_categorie);
    let requete = new XMLHttpRequest();
    requete.open("GET", url, true);
    requete.send(null);
    requete.addEventListener("load", function () {
        loadLists()
    });
}

function modifierCategorieTva(id_tva,list){

    let url = "../API/modifierCategorieTVA.php?id_tva=" + encodeURIComponent(id_tva) + "&nom_tva=" + encodeURIComponent(list[0].value) + "&valeur=" + encodeURIComponent(list[1].value);
    let requete = new XMLHttpRequest();
    requete.open("GET", url, true);
    requete.send(null);
    requete.addEventListener("load", function () {
        loadLists()
    });
}

function formModifier(btn,id,func) {
    btn.innerText = "Valider";
    Array.prototype.forEach.call(btn.parentElement.parentElement.children, el =>{
        if(el.innerText!== "Modifier" && el.innerText!== "Valider" && el.innerText!== "Supprimer"){
            let input = document.createElement("input");
            input.value=el.innerText;
            el.innerText = "";
            el.appendChild(input);
            btn.removeEventListener("click",arguments.callee);
            btn.addEventListener("click", function () {
                btn.innerText = "Modifier";
                func(id,input.value);
                //formModifier(btn,id,table)
            });
        }
    });
}

let list = [];
function formModifierTVA(btn,id,func) {
    btn.innerText = "Valider";
    Array.prototype.forEach.call(btn.parentElement.parentElement.children, el => {
        if (el.innerText !== "Modifier" && el.innerText !== "Valider" && el.innerText !== "Supprimer") {
            let input = document.createElement("input");
            input.value = el.innerText;
            el.innerText = "";
            list.push(input);
            el.appendChild(input);
        }
    });
    btn.removeEventListener("click",arguments.callee);
    btn.addEventListener("click", function () {
        btn.innerText = "Modifier";
        func(id,list);
        list = [];
    });
}

function th_td_multiple_creator_with_buttons(tag,listInnerText,ParentElement,listInnerTextButton,table,primary_key,id){
    let buttonCpt = 0;
    Array.prototype.forEach.call(listInnerText, el =>{
        if(el===""){
            let td = document.createElement("td");
            ParentElement.appendChild(td);
            let btn = document.createElement("button");
            btn.innerText=listInnerTextButton[buttonCpt];
            if (btn.innerText==="Supprimer"){
                btn.onclick = function(){
                    let url = "../API/supprimerGenerique.php?table=" + encodeURIComponent(table) + "&fieldname=" + encodeURIComponent(primary_key) + "&id_generique=" + encodeURIComponent(id);
                    let requete = new XMLHttpRequest();
                    requete.open("GET", url, true);
                    requete.send(null);
                    requete.addEventListener("load",function () {
                        loadLists();
                    });
                };
            }
            else if (btn.innerText==="Modifier"){
               if(table==="Unite"){
                   btn.addEventListener("click", function () {
                       formModifier(this,id,modifierUnite);
                   });
               }
               else if (table==="Categorie"){
                   btn.addEventListener("click", function () {
                       formModifier(this,id,modifierCategorie);
                   });
               }
               else{
                   btn.addEventListener("click", function () {
                       formModifierTVA(this,id,modifierCategorieTva);
                   });
               }
                //btn.addEventListener("click",function ());
            }
            buttonCpt++;
            td.appendChild(btn);
        }
        else{
            for(let elem in el) {
                let re = new RegExp('^id');
                if(!re.test(elem)){
                    th_td_creator(tag, el[elem], ParentElement);
                }
            }
        }
    });
}

function getAllGeneric(name,order,tab,reg,listButtons,parentDiv,primary_key) {
    parentDiv.innerHTML = "";
    let url = "../API/getAllGenericWithOrder.php?name="+ encodeURIComponent(name)+ "&order="+encodeURIComponent(order)+"&table="+encodeURIComponent(tab) + "&regexpel="+encodeURIComponent(reg);
    let requete = new XMLHttpRequest();
    requete.open("GET", url, true);
    requete.addEventListener("load", function () {
        //console.log(requete.responseText);
        let result = JSON.parse(requete.responseText);
        let table = document.createElement("table");
        parentDiv.appendChild(table);
        let tr = document.createElement("tr");
        table.appendChild(tr);
        th_td_multiple_creator("th",["Nom "+tab,"",""],tr);
        Array.prototype.forEach.call(result, val =>{
            let tr_val = document.createElement("tr");
            table.appendChild(tr_val);
            th_td_multiple_creator_with_buttons("td",[val,"",""],tr_val,listButtons,tab,primary_key,parseInt(val[primary_key]));
        });
    });
    requete.send(null);
}

function ajouterUnite(nom){
    let url = "../API/ajouterUnite.php?nom=" + encodeURIComponent(nom);
    let requete = new XMLHttpRequest();
    requete.open("GET", url, true);
    requete.send(null);
    requete.addEventListener("load", function () {
        loadLists()
    });
}

function ajouterCategorie(nom){
    let url = "../API/ajouterCategorie.php?nom=" + encodeURIComponent(nom);
    let requete = new XMLHttpRequest();
    requete.open("GET", url, true);
    requete.send(null);
    requete.addEventListener("load", function () {
        loadLists()
    });
}

function ajouterCategorieTVA(nom,valeur){
    let url = "../API/ajouterCategorieTva.php?nom=" + encodeURIComponent(nom) + "&valeur=" + encodeURIComponent(valeur);
    let requete = new XMLHttpRequest();
    requete.open("GET", url, true);
    requete.send(null);
    requete.addEventListener("load", function () {
        loadLists()
    });
}

function loadLists(){
    getAllGeneric(1,"nom_unite ASC","Unite","nom_unite",["Modifier","Supprimer"],liste_unite,"id_unite");
    getAllGeneric(1,"nom_categorie ASC","Categorie","nom_categorie",["Modifier","Supprimer"],liste_categorie_ingredient,"id_categorie");
    getAllGeneric(1,"categorie_tva ASC","tva","categorie_tva",["Modifier","Supprimer"],liste_categorie_tva, "id_tva");
}

window.addEventListener("load",function () {
    loadLists();
});

