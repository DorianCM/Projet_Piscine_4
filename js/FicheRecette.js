//Classe définissant une recette/fiche technique
class FicheRecette {
    id = 0; //Lors de la sauvegarde, si id = 0, on créer une nouvelle table, sinon on modifie celle existante
    nom = '';
    auteur = '';
    nbPortions = 0;
    couts = {};
    nbCouts = 0;
    etapes = {};
    nbEtapes = 0;
    content = null;

    constructor(infos = null) {
        this.constructHTML();
        if(infos) {
            this.id = infos.id;
            this.nom = infos.nom;
            this.auteur = infos.auteur;
            this.nbPortions = infos.nbPortions;
            for(let cout in infos.couts)
                this.addCout(this, infos.couts[cout]);
            for(let etape in infos.etapes)
                this.addEtape(this, infos.etapes[etape]);
        }
        else{ //Si pas d'infos pourvues, valeurs par défault
            this.nom = "Nouvelle Recette";
            this.auteur = "Auteur";
            this.nbPortions = 10;
            this.addEtape();
            let coutPersonnel = {"id":0, "nom":"Coût personnel", "valeur":0, "multiplicateur":false};
            this.addCout(coutPersonnel);
            let coutMatieres = {"id":0, "nom":"Coût matières", "valeur":0, "multiplicateur":false};
            this.addCout(coutMatieres);
            let coutCoef = {"id":0, "nom":"Coef", "valeur":2, "multiplicateur":true};
            this.addCout(coutCoef);
        }
    }

    constructHTML(){
        this.content = document.getElementById("content");

    }
    getAvailableEtapeID() {
        let max = 0;
        for(let etape in this.etapes) {
            if(this.etapes[etape].getID() > max)
                max = this.etapes[etape].getID();
        }
        return max+1;
    }
    getAvailableCoutID() {
        let max = 0;
        for(let cout in this.couts) {
            if(this.couts[cout].getID() > max)
                max = this.couts[cout].getID();
        }
        return max+1;
    }
    addEtape(infos = null) {
        this.etapes[this.nbEtapes++] = new Etape(this, infos);
    }
    removeEtape(idEtape) {
        for(let etape in this.etapes) {
            if(this.etapes[etape].getID() = idEtape) {
                delete this.etapes[etape];
                break;
            }
        }
        this.nbEtapes--;
    }
    addCout(infos = null) {
        this.etapes[this.nbCouts++] = new Cout(this, infos);
    }
    removeCout(idCout) {
        for(let cout in this.couts) {
            if(this.couts[cout].getID() = idCout) {
                delete this.couts[cout];
                break;
            }
        }
        this.nbCouts--
    }
    addIngredient(idEtape, infosIngredient) {
        for(let etape in this.etapes) {
            if(this.etapes[etape].getID() = idEtape) {
                this.etapes[etape].addIngredient(infosIngredient);
                break;
            }
        }
    }

    getID() {
        return this.id;
    }
    getNom() {
        return this.nom;
    }
    setNom(nouveauNom) {
        this.nom = nouveauNom;
    }
    getAuteur() {
        return this.auteur;
    }
    setAuteur(nouveauAuteur) {
        this.auteur = nouveauAuteur;
    }
    getNbPortions() {
        return this.nbPortions;
    }
    setNbPortions(nouveauNbPortions) {
        this.nbPortions = nouveauNbPortions;
    }
    getListCout() {
        return this.couts;
    }
    getListEtapes() {
        return this.etapes;
    }
}