class Cout {
    id = 0;
    nom = 'Cout';
    valeur = 0;
    multiplicateur = false;

    constructor(recette, infos = undefined) {
        this.recette = recette
        if(infos) {
            this.id = infos.id;
            this.nom = infos.nom;
            this.valeur = infos.valeur;
            this.multiplicateur = infos.multiplicateur;
        }
        else {
            this.id = recette.getAvailableCoutID();
        }
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
    getValeur() {
        return this.valeur;
    }
    setValeur(nouvelleValeur) {
        this.valeur = nouvelleValeur;
    }
    getMultiplicateur() {
        return this.multiplicateur;
    }
    setMultiplicateur(nouveauMultiplicateur) {
        this.multiplicateur = nouveauMultiplicateur;
    }
}