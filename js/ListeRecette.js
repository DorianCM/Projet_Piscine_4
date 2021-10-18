let divList = document.getElementById("listRecette");

let nom_recette;
let nom_createur;

let modifyingState = null;

let order = "nom_recette ASC";
let inputTri = document.getElementById("tri");

inputTri.addEventListener("input", function () {
    order = inputTri.value;
    //TO implement for name
    getAllRecette("1");
});
let input_barre_recherche_recette = document.getElementById("barre_recherche_recette");

input_barre_recherche_recette.addEventListener("input",function () {
    if (input_barre_recherche_recette.value.length >= 2){
        getAllRecette(input_barre_recherche_recette.value);
    }
    else if (input_barre_recherche_recette.value.length === 0){
        getAllRecette("1");
    }
});

function getAllRecette(name) {
    divList.innerText = "";
    let url = "../API/getAllRecette.php?name="+ encodeURIComponent(name)+ "&order="+encodeURIComponent(order);
    let requete = new XMLHttpRequest();
    requete.open("GET", url, true);
    requete.addEventListener("load", function () {
        console.log(requete.responseText)
        let result = JSON.parse(requete.responseText);
        let table = document.createElement("table");
        let trth = document.createElement("tr");
        table.appendChild(trth);

        let th_nom_recette = document.createElement("th");//nom_recette
        th_nom_recette.innerText="Nom de la fiche technique";

        let th_nom_createur = document.createElement("th");//nom_createur
        th_nom_createur.innerText="Auteur";

        let th_supprimer = document.createElement("th");//supprimer

        trth.appendChild(th_nom_recette);
        trth.appendChild(th_nom_createur);
        trth.appendChild(th_supprimer);

        Array.prototype.forEach.call(result, val =>{
            let tr = document.createElement("tr");
            table.appendChild(tr);

            let td_nom_recette = document.createElement("td");//nom_recette
            td_nom_recette.innerText=val.nom_recette;

            let td_nom_createur = document.createElement("td");//nom_createur
            td_nom_createur.innerText=val.nom_createur;

            let td_supprimer = document.createElement("th");//supprimer

            let btnsuppr = document.createElement("button");

            btnsuppr.innerText = "Supprimer";
            btnsuppr.addEventListener("click", function () {
                let url = "../API/supprimerRecette.php?id=" + encodeURIComponent(val.id_recette);
                let requete = new XMLHttpRequest();
                requete.open("GET", url, true);
                requete.send(null);
                getAllRecette("1");
            });

            td_supprimer.appendChild(btnsuppr);

            tr.appendChild(td_nom_recette);
            tr.appendChild(td_nom_recette);
            tr.appendChild(td_supprimer);

            table.appendChild(tr);
        });
        divList.appendChild(table);
    });
    requete.send(null);
}

getAllRecette("");