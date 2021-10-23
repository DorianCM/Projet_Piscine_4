class ModalSousFicheRecette{
    listSousFicheRecette = null;
    recette = null;
    modal = null;

    constructor(recette) {
        this.recette = recette;
        this.fillListSousFicheRecette();
    }
    createHTML() {
        this.modal = document.createElement("div");
        this.modal.id = "modalSousFicheRecette";
        this.modal.style.display = "none";
        this.recette.content.appendChild(this.modal);

        let modalContent = document.createElement("div");
        modalContent.id = "modalContentSousFicheRecette";
        this.modal.appendChild(modalContent);

        let closeButton = document.createElement("button");
        closeButton.id = "closeModalSousFicheRecette";
        closeButton.innerHTML = "Fermer";

        let inputSearch = document.createElement("input");
        inputSearch.id = "inputSearchSousFicheRecette";
        inputSearch.placeholder = "Recherche ...";
        let tableList = document.createElement("table");
        modalContent.appendChild(closeButton);
        modalContent.appendChild(inputSearch);
        modalContent.appendChild(tableList);

        this.setEventListener();
    }

    addTH() {
        let tableList = this.modal.getElementsByTagName("table")[0];
        let ligneTh = document.createElement("tr");
        tableList.appendChild(ligneTh);

        let nom = document.createElement("th");
        nom.innerText="Nom Recette";

        let auteur = document.createElement("th");
        auteur.innerText="Auteur";

        let categorie = document.createElement("th");
        categorie.innerText="Categorie";

        let portions = document.createElement("th");
        portions.innerText="Portions";

        ligneTh.appendChild(nom);
        ligneTh.appendChild(auteur);
        ligneTh.appendChild(categorie);
        ligneTh.appendChild(portions);
    }

    setEventListener() {
        let own = this;
        document.getElementById("closeModalSousFicheRecette").addEventListener("click",function(){
            own.closeModal();
        });
        document.getElementById("inputSearchSousFicheRecette").addEventListener("input",function(){
            own.filterList(this.value.toLowerCase());
        });
    }

    fillListSousFicheRecette() {
        let own = this;
        let requete = new XMLHttpRequest();
        requete.open("GET", "../API/getAllRecette.php?name=1&order=nom_recette ASC", true);
        requete.addEventListener("load", function () {
            own.listSousFicheRecette = JSON.parse(requete.responseText);
            own.createHTML();
        });
        requete.send(null);
    }

    filterList(value = "") {
        let own = this;
        let tableList = this.modal.getElementsByTagName("table")[0];
        tableList.innerHTML = "";
        this.addTH();
        for(let recette in this.listSousFicheRecette) {
            let i = this.listSousFicheRecette[recette];
            if(i["nom_recette"].toLowerCase().indexOf(value) != -1) {
                let ligneRecette = document.createElement("tr");
                ligneRecette.className = "ligneRecette";
                ligneRecette.addEventListener("click",function(){
                    own.closeModal();
                    own.recette.addSousRecette(i["id_recette"]);
                });

                let tdNom = document.createElement("td");
                tdNom.innerHTML = i["nom_recette"];
                let tdAuteur = document.createElement("td");
                tdAuteur.innerHTML = i["nom_createur"];
                let tdCategorie = document.createElement("td");
                tdCategorie.innerHTML = i["nom_categorie_recette"];
                let tdportions = document.createElement("td");
                tdportions.innerHTML = i["nb_portions"];

                ligneRecette.appendChild(tdNom);
                ligneRecette.appendChild(tdAuteur);
                ligneRecette.appendChild(tdCategorie);
                ligneRecette.appendChild(tdportions);
                tableList.appendChild(ligneRecette);
            }
        }
    }

    openModal() {
        document.getElementById("inputSearchSousFicheRecette").value= '';
        this.modal.style.display = "";
        this.filterList();
    }

    closeModal() {
        this.modal.style.display = "none";
    }
}