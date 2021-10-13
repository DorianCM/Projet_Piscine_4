//Classe définissant un ingrédient
class Ingredient {
    id = 0;
    libelle = '';
    prix = 0.0;
    tva = 0.0;
    categorie = '';
    categorieAllergene = '';
    unite = '';
    quantite = 0;
    recette = null;
    etape = null;
    trIngredient = null;

    constructor(etape, infos){
        this.recette = etape.recette;
        this.etape = etape;
        this.id = infos.id;
        this.libelle = infos.libelle;
        this.prix = infos.prix;
        this.tva = infos.tva;
        this.categorie = infos.categorie;
        this.categorieAllergene = infos.categorieAllergene;
        this.unite = infos.unite;
        this.quantite = infos.quantite;

        this.createHTML();
    }

    createHTML(){
        this.trIngredient = document.createElement("tr");
        this.trIngredient.className = "etapeIngredient";

        let tdLibelle = document.createElement("td");
        tdLibelle.innerHTML = this.getLibelle();
        let removeButton = document.createElement("button");
        removeButton.innerHTML = "-";
        tdLibelle.appendChild(removeButton);

        let tdQuantite = document.createElement("td");
        let inputQt = document.createElement("input");
        inputQt.type = "number";
        inputQt.value = this.getQuantite();
        
        tdQuantite.appendChild(inputQt);

        let tdUnite = document.createElement("td");
        tdUnite.innerHTML = this.getUnite();

        let tdCategorie = document.createElement("td");
        tdCategorie.innerHTML = this.getCategorie();

        let tdCout = document.createElement("td");
        tdCout.className = "ingredientTotal";
        tdCout.innerHTML = this.getPrix()*this.getQuantite() + "€";

        this.trIngredient.appendChild(tdLibelle);
        this.trIngredient.appendChild(tdQuantite);
        this.trIngredient.appendChild(tdUnite);
        this.trIngredient.appendChild(tdCategorie);
        this.trIngredient.appendChild(tdCout);
        document.getElementById("etape_tableIngredient_"+this.etape.getID()).appendChild(this.trIngredient);

        this.setEventListener();
        this.updateHTML();
    }
    setEventListener() {
        let own = this;
        let inputQt = this.trIngredient.getElementsByTagName("input")[0];
        inputQt.addEventListener("input",function(){
            if(this.value < 0)
                this.value = 0
            own.setQuantite(this.value);
            own.updateTotal();
        });
        let removeButton = this.trIngredient.getElementsByTagName("button")[0];
        removeButton.addEventListener("click",function(){
            own.removeHTML();
            own.etape.removeIngredient(own);
        });
    }
    updateTotal() {
        let tdCout = this.trIngredient.getElementsByClassName("ingredientTotal")[0];
        tdCout.innerHTML = this.getPrix()*this.getQuantite() + "€";
        this.recette.updateTotal();
    }
    updateHTML() {
        //this.trIngredient.getElementsByTagName("td")[0].style.width = document.getElementById("colonneLibelle").offsetWidth -3+"px";
        this.trIngredient.getElementsByTagName("td")[1].style.width = 150+"px";
        /*this.trIngredient.getElementsByTagName("td")[2].style.width = document.getElementById("colonneUnite").offsetWidth -50+"px";
        this.trIngredient.getElementsByTagName("td")[3].style.width = document.getElementById("colonneCategorie").offsetWidth -3+"px";
        this.trIngredient.getElementsByTagName("td")[4].style.width = document.getElementById("colonneCout").offsetWidth +"px";*/
    }
    removeHTML() {
        this.trIngredient.remove();
    }

    getID() {
        return this.id;
    }
    getLibelle() {
        return this.libelle;
    }
    getPrix() {
        return this.prix;
    }
    getTVA() {
        return this.tva;
    }
    getCategorie() {
        return this.categorie;
    }
    getCategorieAllergene() {
        return this.categorieAllergene;
    }
    getUnite() {
        return this.unite;
    }
    getQuantite() {
        return this.quantite;
    }
    setQuantite(nouvelleQuantite) {
        this.quantite = nouvelleQuantite;
    }
}