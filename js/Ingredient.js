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


    constructor(etape, infos){
        this.recette = etape.recette;
        this.etape = etape;
        this.id = infos.id_ingrediant;
        this.libelle = infos.nom_ingrediant;
        this.prix = infos.prix_ingrediant;
        this.tva = infos.valeur_tva;
        this.categorie = infos.nom_categorie;
        this.categorieAllergene = infos.nom_categorie_allergene;
        this.unite = infos.nom_unite;
        this.quantite = infos.quantite;

        /*this.createHTML();*/
    }

    createHTML(){
        let trIngredient = document.createElement("tr");
        trIngredient.id = "Ingredient_"+this.etape.getID()+"_"+this.getID();
        trIngredient.className = "etapeIngredient";

        let tdLibelle = document.createElement("td");
        tdLibelle.innerHTML = this.getLibelle();
        let removeButton = document.createElement("button");
        removeButton.innerHTML = "-";
        tdLibelle.appendChild(removeButton);

        let tdQuantite = document.createElement("td");
        tdQuantite.style.maxWidth = "100px"
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

        trIngredient.appendChild(tdLibelle);
        trIngredient.appendChild(tdQuantite);
        trIngredient.appendChild(tdUnite);
        trIngredient.appendChild(tdCategorie);
        trIngredient.appendChild(tdCout);
        document.getElementById("etape_tableIngredient_"+this.etape.getID()).appendChild(trIngredient);

        this.setEventListener();
        this.updateHTML();
    }
    setEventListener() {
        let own = this;
        let inputQt = document.getElementById("Ingredient_"+this.etape.getID()+"_"+this.getID()).getElementsByTagName("input")[0];
        inputQt.addEventListener("input",function(){
            if(this.value < 0)
                this.value = 0
            own.setQuantite(this.value);
            own.updateTotal();
        });
        let removeButton = document.getElementById("Ingredient_"+this.etape.getID()+"_"+this.getID()).getElementsByTagName("button")[0];
        removeButton.addEventListener("click",function(){
            own.removeHTML();
            own.etape.removeIngredient(own);
        });
    }
    updateTotal() {
        let tdCout = document.getElementById("Ingredient_"+this.etape.getID()+"_"+this.getID()).getElementsByClassName("ingredientTotal")[0];
        tdCout.innerHTML = Math.round(this.getPrix()*this.getQuantite()*100)/100 + "€";
        this.recette.updateTotal();
    }
    updateHTML() {

        /*document.getElementById()*/
        //document.getElementById("Ingredient_"+this.etape.getID()+"_"+this.getID()).getElementsByTagName("td")[0].style.width = document.getElementById("colonneLibelle").offsetWidth -3+"px";
        //////*document.getElementById("Ingredient_"+this.etape.getID()+"_"+this.getID()).getElementsByTagName("td")[1].style.width = 150+"px";*/
        /*document.getElementById("Ingredient_"+this.etape.getID()+"_"+this.getID()).getElementsByTagName("td")[2].style.width = document.getElementById("colonneUnite").offsetWidth -50+"px";
        document.getElementById("Ingredient_"+this.etape.getID()+"_"+this.getID()).getElementsByTagName("td")[3].style.width = document.getElementById("colonneCategorie").offsetWidth -3+"px";
        document.getElementById("Ingredient_"+this.etape.getID()+"_"+this.getID()).getElementsByTagName("td")[4].style.width = document.getElementById("colonneCout").offsetWidth +"px";*/
    }
    removeHTML() {
        document.getElementById("Ingredient_"+this.etape.getID()+"_"+this.getID()).remove();
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
    setEtape(nouvelleEtape){
        this.etape = nouvelleEtape;
    }

}