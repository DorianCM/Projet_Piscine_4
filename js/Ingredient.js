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
        this.id = infos.id;
        this.libelle = infos.libelle;
        this.prix = infos.prix;
        this.tva = infos.tva;
        this.categorie = infos.categorie;
        this.categorieAllergene = infos.categorieAllergene;
        this.unite = infos.unite;
        this.quantite = infos.quantite;
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