//Classe définissant une étape d'une recette
class Etape {
    id = 0;
    nom = 'Etape';
    description = '';
    ingredients = {};
    nbIngredients = 0;
    recette = null;

    constructor(recette, infos = undefined) {
        this.recette = recette
        if(infos) {
            this.id = infos.id;
            this.nom = infos.nom;
            this.description = infos.description;
            let i = 0;
            for(let ingredient in infos.ingredients)
                this.addIngredient(infos.ingredients[ingredient]);
        }
        else {
            this.id = recette.getAvailableEtapeID();
        }
    }

    addIngredient(infosIngredient) {
        this.ingredients[this.nbIngredients++] = new Ingredient(this, infosIngredient);
    }
    removeIngredient(idIngredient) {
        for(let ingredient in this.ingredients) {
            if(this.ingredients[ingredient].getID() = idIngredient) {
                delete this.ingredients[ingredient];
                break;
            }
        }
        this.nbIngredients--;
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