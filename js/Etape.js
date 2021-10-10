//Classe définissant une étape d'une recette
class Etape {
    id = 0;
    nom = '';
    description = '';
    ingredients = {};
    nbIngredients = 0;
    recette = null;

    constructor(recette, infos = undefined) {
        this.recette = recette;
        if(infos) {
            this.id = infos.id;
            this.nom = infos.nom;
            this.description = infos.description;
        }
        else {
            this.id = recette.getAvailableEtapeID();
            this.nom = "Etape "+this.id;
        }
        this.createHTML();
        this.setEventListener();
        if(infos)
            for(let ingredient in infos.ingredients)
                this.addIngredient(infos.ingredients[ingredient]);
    }

    createHTML(){
        let nouvelLigneEtape = document.createElement("tr");
        nouvelLigneEtape.id = "etape_"+this.getID();
        nouvelLigneEtape.className = "etape";

        let infosEtape = document.createElement("td");
        infosEtape.className = "etapeInfos";
        nouvelLigneEtape.appendChild(infosEtape);

        let name = document.createElement("input");
        name.id = "etape_"+this.getID()+"_name";
        let descript = document.createElement("textarea");
        descript.id = "etape_"+this.getID()+"_description";
        let removeButton = document.createElement("button");
        removeButton.innerHTML = "Retirer cette étape";

        infosEtape.appendChild(name);
        infosEtape.appendChild(descript);
        infosEtape.appendChild(removeButton);

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
        let labelRecherche = document.createElement("p");
        labelRecherche.innerHTML = "Ajouter un Ingrédient : "
        let rechercheIngredientInput = document.createElement("input");
        rechercheIngredient.appendChild(labelRecherche);
        rechercheIngredient.appendChild(rechercheIngredientInput);
        tableIngredient.appendChild(rechercheIngredient);

        //A CHANGER : bouton pour ajouter un faux ingrédient pour tester
        let fauxIngre = document.createElement("button");
        fauxIngre.innerHTML = "Test Ingrédient";
        let own = this;
        fauxIngre.addEventListener("click",function(){
            let fauxIngredient = {"id":0, "libelle":"Carotte", "prix":1.0, "tva":0.1, "categorie":"Légume", "categorieAllergene":null, "unite":"p", "quantite":1};
            own.addIngredient(fauxIngredient);
        });
        rechercheIngredient.appendChild(fauxIngre);

        //Faire ce qu'il faut pour chercher un ingrédient et l'ajouter
        trRechercheIngredient.appendChild(rechercheIngredient);
        tableIngredient.appendChild(trRechercheIngredient);
        tdTableIngredient.appendChild(tableIngredient)
        nouvelLigneEtape.appendChild(tdTableIngredient);

        let table = document.getElementById("tabEtapes");
        table.insertBefore(nouvelLigneEtape, document.getElementById("addEtape"));
        this.updateHTML();
    }

    setEventListener() {
        let own = this;
        document.getElementById("etape_"+this.getID()+"_name").addEventListener("input",function(){
            own.setNom(this.value);
        });
        document.getElementById("etape_"+this.getID()+"_description").addEventListener("input",function(){
            own.setDescription(this.value);
        });
        document.getElementById("etape_"+this.getID()+"_description").addEventListener("keydown",function(){
            this.style.height = 'auto';
            this.style.height = this.scrollHeight+'px';
        });
        document.getElementById("etape_"+this.getID()).getElementsByTagName("button")[0].addEventListener("click",function(){
           own.removeHTML();
           own.recette.removeEtape(own);
        });
    }

    updateHTML(){
        document.getElementById("etape_"+this.id+"_name").value = this.getNom();
        document.getElementById("etape_"+this.id+"_description").value = this.getDescription();

        for(let ingredient in this.ingredients)
            this.ingredients[ingredient].updateHTML();
        this.recette.updateHTML();
    }
    removeHTML() {
        document.getElementById("etape_"+this.getID()).remove();
    }

    addIngredient(infosIngredient) {
        this.ingredients[this.nbIngredients++] = new Ingredient(this, infosIngredient);
        this.updateHTML();
    }
    removeIngredient(ingredientToRemove) {
        for(let ingredient in this.ingredients) {
            if(this.ingredients[ingredient] == ingredientToRemove) {
                delete this.ingredients[ingredient];
                break;
            }
        }

        this.updateHTML();
        this.recette.updateTotal();
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
    getListIngredients() {
        return this.ingredients;
    }
}