//Classe définissant une étape d'une recette
class Etape {
    id = 0;
    nom = '';
    description = '';
    duree = '';
    ingredients = {};
    nbIngredients = 0;
    recette = null;

    constructor(recette, infos = undefined) {
        this.recette = recette;
        if(infos) {
            this.id = infos.id_etape;
            this.nom = infos.nom_etape;
            this.description = infos.description_etape;
            this.duree = infos.duree;
            this.createHTML();

            for(let ingredient in infos.ingredients)
                this.addIngredient(infos.ingredients[ingredient]);
        }
        else {
            this.id = recette.getAvailableEtapeID();
            this.nom = "Etape "+this.id;
        }
    }

    createHTML(insererAvant = document.getElementById("addEtape")){
        let nouvelLigneEtape = document.createElement("tr");
        nouvelLigneEtape.id = "etape_"+this.getID();
        nouvelLigneEtape.className = "etape";

        let infosEtape = document.createElement("td");
        infosEtape.className = "etapeInfos";
        nouvelLigneEtape.appendChild(infosEtape);

        let name = document.createElement("input");
        name.id = "etape_"+this.getID()+"_name";
        let divDuree = document.createElement("div");
        divDuree.className = "etapeDuree";
        let labelDuree = document.createElement("p");
        labelDuree.innerHTML = "Durée : "
        let inputDuree = document.createElement("input");
        inputDuree.id = "etape_"+this.getID()+"_duree";
        divDuree.appendChild(labelDuree);
        divDuree.appendChild(inputDuree);
        let descript = document.createElement("textarea");
        descript.id = "etape_"+this.getID()+"_description";
        let removeButton = document.createElement("button");
        removeButton.className = "removeEtape";
        removeButton.innerHTML = "Retirer cette étape";
        let changeEtapeUp = document.createElement("button");
        changeEtapeUp.className = "ChangeEtapeUp";
        changeEtapeUp.innerHTML = "↑";
        let changeEtapeDown = document.createElement("button");
        changeEtapeDown.className = "ChangeEtapeDown";
        changeEtapeDown.innerHTML = "↓";


        infosEtape.appendChild(name);
        infosEtape.appendChild(divDuree);
        infosEtape.appendChild(descript);
        infosEtape.appendChild(removeButton);
        infosEtape.appendChild(changeEtapeUp);
        infosEtape.appendChild(changeEtapeDown);

        let tdTableIngredient = document.createElement("td");
        tdTableIngredient.className = "td_etape_tableIngredient";
        tdTableIngredient.colSpan = 5;
        let tableIngredient = document.createElement("table");
        tableIngredient.id = "etape_tableIngredient_"+this.getID();
        tableIngredient.className = "etape_tableIngredient";
        let trRechercheIngredient = document.createElement("tr");
        let rechercheIngredient = document.createElement("td");
        rechercheIngredient.colSpan = 5;
        rechercheIngredient.className = "rechercheIngredient";
        rechercheIngredient.style.border = "none";
        let buttonAddIngredient = document.createElement("button");
        buttonAddIngredient.className = "buttonAddIngredient";
        buttonAddIngredient.innerHTML = "Ajouter un ingrédient";
        rechercheIngredient.appendChild(buttonAddIngredient);
        tableIngredient.appendChild(rechercheIngredient);

        //Faire ce qu'il faut pour chercher un ingrédient et l'ajouter
        trRechercheIngredient.appendChild(rechercheIngredient);
        tableIngredient.appendChild(trRechercheIngredient);
        tdTableIngredient.appendChild(tableIngredient)
        nouvelLigneEtape.appendChild(tdTableIngredient);

        let table = document.getElementById("tabEtapes");
        table.insertBefore(nouvelLigneEtape, insererAvant);
        this.updateHTML();
        this.setEventListener();
    }

    setEventListener() {
        let own = this;
        document.getElementById("etape_"+this.getID()+"_name").addEventListener("input",function(){
            own.setNom(this.value);
        });
        document.getElementById("etape_"+this.getID()+"_duree").addEventListener("input",function(){
            own.setDuree(this.value);
        });
        document.getElementById("etape_"+this.getID()+"_description").addEventListener("input",function(){
            own.setDescription(this.value);
        });
        document.getElementById("etape_"+this.getID()+"_description").addEventListener("keydown",function(){
            this.style.height = 'auto';
            this.style.height = this.scrollHeight+'px';
        });
        document.getElementById("etape_"+this.getID()).getElementsByClassName("removeEtape")[0].addEventListener("click",function(){
            own.removeHTML();
            own.recette.removeEtape(own);
        });
        document.getElementById("etape_"+this.getID()).getElementsByClassName("buttonAddIngredient")[0].addEventListener("click",function(){
            own.recette.getModalIngredient().openModal(own);
        });

        document.getElementById("etape_" + this.getID()).getElementsByClassName("ChangeEtapeDown")[0].addEventListener("click", function(){
            own.recette.switchEtapeDown(own.getID());
            own.recette.updateTotal();
        });

        document.getElementById("etape_" + this.getID()).getElementsByClassName("ChangeEtapeUp")[0].addEventListener("click", function(){
            own.recette.switchEtapeUp(own.getID());
            own.recette.updateTotal();
        });
    }


    updateHTML() {
        document.getElementById("etape_" + this.id + "_name").value = this.getNom();
        document.getElementById("etape_" + this.id + "_duree").value = this.getDuree();
        document.getElementById("etape_" + this.id + "_description").value = this.getDescription();
    }
    removeHTML() {
        document.getElementById("etape_"+this.getID()).remove();
    }
    changeHTMLFor(id){
        let own = this;
        document.getElementById("etape_"+String(own.getID())).id = ("etape_"+String(id));
        document.getElementById("etape_"+String(own.getID()+"_name")).id = ("etape_"+String(id)+"_name");
        document.getElementById("etape_"+String(own.getID()+"_description")).id = ("etape_"+String(id)+"_description");
        document.getElementById("etape_tableIngredient_"+String(own.getID())).id = ("etape_tableIngredient_"+String(id));
    }

    addIngredient(infosIngredient) {
        this.ingredients[this.nbIngredients] = new Ingredient(this, infosIngredient);
        this.ingredients[this.nbIngredients++].createHTML();
        this.recette.updateTotal();

    }
    removeIngredient(ingredientToRemove) {
        for(let ingredient in this.ingredients) {
            if(this.ingredients[ingredient] == ingredientToRemove) {
                delete this.ingredients[ingredient];
                break;
            }
        }


        this.recette.updateTotal();
    }
    cleanTableIngredient(){
        for (let ingredient in this.ingredients) {
            this.ingredients[ingredient].removeHTML();

        }
    }
    saveEtape(){
        var copieEtape = new Etape(this.recette,);
        copieEtape.setID(this.id);
        copieEtape.setDescription(this.description);
        copieEtape.setDuree(this.duree);
        copieEtape.setNom(this.nom);
        copieEtape.setListIngredients(this.ingredients);
        copieEtape.setNbIngredient(this.nbIngredients);

        return copieEtape;

    }
    printIngredientsHTML(){
        for (let ingredient in this.ingredients) {
            this.ingredients[ingredient].createHTML();
        }
        this.recette.updateHTML();

    }

    getID() {
        return this.id;
    }
    setID(nouveauID) {
        this.id = nouveauID;
    }
    getNom() {
        return this.nom;
    }
    setNom(nouveauNom) {
        this.nom = nouveauNom;
    }
    getDescription() {
        return this.description;
    }
    setDescription(nouvelleDescription) {
        this.description = nouvelleDescription;
    }
    getDuree() {
        return this.duree;
    }
    setDuree(nouvelleDuree) {
        this.duree = nouvelleDuree;
    }
    getListIngredients() {
        return this.ingredients;
    }
    setListIngredients(nouvelleListIngredient){
        this.ingredients = nouvelleListIngredient;
    }
    getNbIngredient(){
        return this.nbIngredients;
    }
    setNbIngredient(nouveauNbIngredient){
        this.nbIngredients = nouveauNbIngredient;
    }
}