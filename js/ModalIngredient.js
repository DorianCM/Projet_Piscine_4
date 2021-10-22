class ModalIngredient{
    currentEtape = null;
    listIngredients = null;
    recette = null;
    modal = null;

    constructor(recette) {
        this.recette = recette;
        this.fillListIngredients();

    }
    createHTML() {
        this.modal = document.createElement("div");
        this.modal.id = "modalIngredient";
        this.modal.style.display = "none";
        this.recette.content.appendChild(this.modal);

        let modalContent = document.createElement("div");
        modalContent.id = "modalContent";
        this.modal.appendChild(modalContent);

        let closeButton = document.createElement("button");
        closeButton.id = "closeModalIngredient";
        closeButton.innerHTML = "Fermer";

        let inputSearch = document.createElement("input");
        inputSearch.id = "inputSearchIngredient";
        inputSearch.placeholder = "Recherche ...";
        let tableList = document.createElement("table");
        let ligneTh = document.createElement("tr");
        tableList.appendChild(ligneTh);
        modalContent.appendChild(closeButton);
        modalContent.appendChild(inputSearch);
        modalContent.appendChild(tableList);

        let libelle = document.createElement("th");
        libelle.innerText="Libellé";

        let unite = document.createElement("th");
        unite.innerText="Unité";

        let prix = document.createElement("th");
        prix.innerText="Prix par unité";

        let categorieAllergene = document.createElement("th");
        categorieAllergene.innerText="Catégorie allergène";

        let categorieIngredient = document.createElement("th");
        categorieIngredient.innerText= "Catégorie ingrédient";

        let categorieTVA = document.createElement("th");
        categorieTVA.innerText="Catégorie TVA";

        let valeurTVA = document.createElement("th");
        valeurTVA.innerText="TVA";

        ligneTh.appendChild(libelle);
        ligneTh.appendChild(unite);
        ligneTh.appendChild(prix);
        ligneTh.appendChild(categorieAllergene);
        ligneTh.appendChild(categorieIngredient);
        ligneTh.appendChild(categorieTVA);
        ligneTh.appendChild(valeurTVA);

        this.setEventListener();
    }

    setEventListener() {
        let own = this;
        document.getElementById("closeModalIngredient").addEventListener("click",function(){
            own.closeModal();
        });
        document.getElementById("inputSearchIngredient").addEventListener("input",function(){
            own.filterList(this.value.toLowerCase());
        });
    }

    fillListIngredients() {
        let own = this;
        let requete = new XMLHttpRequest();
        requete.open("GET", "../API/getIngrediants.php?name=1&order=null", true);
        requete.addEventListener("load", function () {
            own.listIngredients = JSON.parse(requete.responseText);
            own.createHTML();
        });
        requete.send(null);
    }

    isAlreadySelected(id) {
        let list = this.currentEtape.getListIngredients();
        for(let ingre in list)
            if(list[ingre].getID() == id)
                return true;
        return false;
    }

    filterList(value = "") {
        let own = this;
        let tableList = this.modal.getElementsByTagName("table")[0];
        tableList.innerHTML = "";
        for(let ingre in this.listIngredients) {
            let i = this.listIngredients[ingre];
            if(i["nom_ingrediant"].toLowerCase().indexOf(value) != -1) {
                let ligneIngre = document.createElement("tr");
                if(this.isAlreadySelected(i["id_ingrediant"])){
                    ligneIngre.className = "ligneIngredient alreadySelected";
                }
                else {
                    ligneIngre.className = "ligneIngredient";
                    function myClick(event) {
                        let infos = {"id_ingrediant":i["id_ingrediant"], "nom_ingrediant":i["nom_ingrediant"], "prix_ingrediant":i["prix_ingrediant"], "nom_categorie":i["nom_categorie"], "valeur_tva":i["valeur_tva"], "categorie_tva":i["categorie_tva"], "nom_categorie_allergene":i["nom_categorie_allergene"], "nom_unite":i["nom_unite"], "quantite":1};
<<<<<<< HEAD
                        console.log(infos)
=======
                        //console.log(infos);
>>>>>>> d547d2ba0638f3b84c49dfcb85ec1191a51dfebd
                        own.currentEtape.addIngredient(infos);
                        ligneIngre.classList.add("alreadySelected");
                        ligneIngre.removeEventListener("click", myClick);
                    }
                    ligneIngre.addEventListener("click", myClick);
                } 
                let tdLibelle = document.createElement("td");
                tdLibelle.innerHTML = i["nom_ingrediant"];
                let tdUnite = document.createElement("td");
                tdUnite.innerHTML = i["nom_unite"];
                let tdPrix = document.createElement("td");
                tdPrix.innerHTML = i["prix_ingrediant"];
                let tdAllergène = document.createElement("td");
                tdAllergène.innerHTML = i["nom_categorie_allergene"];
                let tdCategorie = document.createElement("td");
                tdCategorie.innerHTML = i["nom_categorie"];
                let tdCatTVA = document.createElement("td");
                tdCatTVA.innerHTML = i["categorie_tva"];
                let tdTVA = document.createElement("td");
                tdTVA.innerHTML = i["valeur_tva"];

                ligneIngre.appendChild(tdLibelle);
                ligneIngre.appendChild(tdUnite);
                ligneIngre.appendChild(tdPrix);
                ligneIngre.appendChild(tdAllergène);
                ligneIngre.appendChild(tdCategorie);
                ligneIngre.appendChild(tdCatTVA);
                ligneIngre.appendChild(tdTVA);
                tableList.appendChild(ligneIngre);
            }
        }
    }

    openModal(etape) {
        this.currentEtape = etape;
        this.modal.style.display = "";
        this.filterList();
    }

    closeModal() {
        this.currentEtape = null;
        this.modal.style.display = "none";
    }
}