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

        let tdQuantite = document.createElement("td");
        tdQuantite.innerHTML = this.getQuantite();

        let tdUnite = document.createElement("td");
        tdUnite.innerHTML = this.getUnite();

        let tdCategorie = document.createElement("td");
        tdCategorie.innerHTML = this.getCategorie();

        let tdCout = document.createElement("td");
        tdCout.innerHTML = this.getPrix()*this.getQuantite();

        this.trIngredient.appendChild(tdLibelle);
        this.trIngredient.appendChild(tdQuantite);
        this.trIngredient.appendChild(tdUnite);
        this.trIngredient.appendChild(tdCategorie);
        this.trIngredient.appendChild(tdCout);
        document.getElementById("etape_tableIngredient_"+this.etape.getID()).appendChild(this.trIngredient);

        this.updateHTML();
    }
    updateHTML() {
        this.trIngredient.getElementsByTagName("td")[0].style.width = document.getElementById("colonneLibelle").offsetWidth -3+"px";
        /*this.trIngredient.getElementsByTagName("td")[1].style.width = document.getElementById("colonneQuantite").offsetWidth -50+"px";
        this.trIngredient.getElementsByTagName("td")[2].style.width = document.getElementById("colonneUnite").offsetWidth -50+"px";
        this.trIngredient.getElementsByTagName("td")[3].style.width = document.getElementById("colonneCategorie").offsetWidth -3+"px";
        this.trIngredient.getElementsByTagName("td")[4].style.width = document.getElementById("colonneCout").offsetWidth +"px";*/
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