//Classe définissant une étape d'une FicheRecette
class Etape {
    id = 0;
    nom = '';
    description = '';
    duree = '';
    ingredients = {};
    nbIngredients = 0;
    recette = null;

    //Initialise une Etape
    //Données d'entrées :
    // - recette : recette auquel appartient l'étape
    // - infos : dictionnaire contenant les infos de l'étape, si non pourvu, l'étape prendra des valeurs par défaut
    // - etapeSousRecette : bool indiquant si on ajoute cette étape lorsqu'on ajoute une sous-recette, car on ne doit pas récupérer l'id donné, mais prendre un nouvel id valide
    constructor(recette, infos = undefined, etapeSousRecette = false) {
        this.recette = recette;
        if(infos) {
            if(etapeSousRecette)
                this.id = recette.getAvailableEtapeID();
            else
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

    //Crée les éléments html propres à l'étape
    //Données d'entrées : insererAvant : élément html servant de repère pour insérer l'étape
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
        inputDuree.maxLength = "30";
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
        changeEtapeDown.classList.add("ChangeEtapeDown");
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
        buttonAddIngredient.classList.add("buttonAddIngredient");
        buttonAddIngredient.innerHTML = "Ajouter un ingrédient";
        rechercheIngredient.appendChild(buttonAddIngredient);
        tableIngredient.appendChild(rechercheIngredient);

        trRechercheIngredient.appendChild(rechercheIngredient);
        tableIngredient.appendChild(trRechercheIngredient);
        tdTableIngredient.appendChild(tableIngredient)
        nouvelLigneEtape.appendChild(tdTableIngredient);

        let table = document.getElementById("tabEtapes");
        table.insertBefore(nouvelLigneEtape, insererAvant);
        this.updateHTML();
        this.setEventListener();
    }

    //Ajoute les eventListener aux éléments html
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

    //Actualise les valeurs de l'étape
    updateHTML() {
        document.getElementById("etape_" + this.id + "_name").value = this.getNom();
        document.getElementById("etape_" + this.id + "_duree").value = this.getDuree();
        document.getElementById("etape_" + this.id + "_description").value = this.getDescription();
        document.getElementById("etape_" + this.id + "_description").style.height = 'auto';
        document.getElementById("etape_" + this.id + "_description").style.height = document.getElementById("etape_" + this.id + "_description").scrollHeight+'px';
    }
    //Enlève les éléments html propres à l'étape
    removeHTML() {
        document.getElementById("etape_"+this.getID()).remove();
    }

    //Change l'HTML de l'étape actuelle pour l'id donné
    changeHTMLFor(id){
        //On cast en String les id et on change l'élément HTML correspondant pour son nouvel ID
        document.getElementById("etape_"+String(this.getID())).id = ("etape_"+String(id));
        document.getElementById("etape_"+String(this.getID()+"_name")).id = ("etape_"+String(id)+"_name");
        document.getElementById("etape_"+String(this.getID()+"_description")).id = ("etape_"+String(id)+"_description");
        document.getElementById("etape_"+String(this.getID()+"_duree")).id = ("etape_"+String(id)+"_duree");
        document.getElementById("etape_tableIngredient_"+String(this.getID())).id = ("etape_tableIngredient_"+String(id));
    }

    //Ajoute un ingrédient dans la liste d'ingrédients de l'étape
    //Données d'entrées : infosIngredient : dictionnaire contenant les infos de l'ingrédient
    addIngredient(infosIngredient) {
        this.ingredients[this.nbIngredients] = new Ingredient(this, infosIngredient);
        this.ingredients[this.nbIngredients++].createHTML();
        this.recette.updateTotal();
    }

    //Efface les ingredients de la liste des ingrédients nommée ingredients[]
    removeIngredient(ingredientToRemove) {
        //On itére sur la liste
        for(let ingredient in this.ingredients) {
            //Si cet ingrédient appartient à la liste on l'efface de la liste
            if(this.ingredients[ingredient] == ingredientToRemove) {
                delete this.ingredients[ingredient];
                break;
            }
        }
        //On update le total de la recette associée
        this.recette.updateTotal();
    }

    //On efface l'HTML de chaque ingrédient contenu dans la liste ingrédient de l'étape
    //N'est plus utilisé mais on la garde si nécessaire pour améliorer une partie du site
    cleanTableIngredient(){
        //On itére dans la liste
        for (let ingredient in this.ingredients) {
            //On efface l'HTML de l'ingrédient donné
            this.ingredients[ingredient].removeHTML();
        }
    }

    //Créer une copie de l'étape
    saveEtape(){
        //Créer une recette à laquelle on va y affecter tout les attributs
        var copieEtape = new Etape(this.recette,);
        copieEtape.setID(this.id);
        copieEtape.setDescription(this.description);
        copieEtape.setDuree(this.duree);
        copieEtape.setNom(this.nom);
        copieEtape.setListIngredients(this.ingredients);
        copieEtape.setNbIngredient(this.nbIngredients);
        //renvoie la copie
        return copieEtape;
    }

    //Pour chaque ingrédient de la liste ingrédient
    //On appelle la fonction createHTML de l'ingrédient donné afin de l'afficher
    printIngredientsHTML(){
        for (let ingredient in this.ingredients) {
            this.ingredients[ingredient].createHTML();
        }
        //On update l'HTML de la recette
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