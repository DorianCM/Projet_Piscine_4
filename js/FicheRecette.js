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
    modalIngredient = null;
    content = null;

    constructor(infos = null) {
        this.content = document.getElementById("content");
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
            this.auteur = "";
            this.nbPortions = 10;

            this.addEtape();

            let coutPersonnel = {"id":0, "nom":"Coût personnel", "valeur":0, "multiplicateur":false};
            this.addCout(coutPersonnel);
            let coutMatieres = {"id":1, "nom":"Coût matières", "valeur":0, "multiplicateur":false};
            this.addCout(coutMatieres);
            let coutCoef = {"id":2, "nom":"Coef", "valeur":2, "multiplicateur":true};
            this.addCout(coutCoef);
        }  

        this.setEventListener();
        this.updateHTML();
        this.modalIngredient = new ModalIngredient(this);
    }

    setEventListener() {
        let own = this;
        window.addEventListener("resize",function(){
            for(let etape in own.etapes)
                own.etapes[etape].updateHTML();
        });
        document.getElementById("addEtapeButton").addEventListener("click",function(){
            own.addEtape();
        });
        document.getElementById("addCoutButton").addEventListener("click",function(){
            own.addCout();
        });
        document.getElementById("recette_nom").addEventListener("input",function(){
            own.setNom(this.value);
        });
        document.getElementById("recette_nbportions").addEventListener("input",function(){
            own.setNbPortions(this.value);
        });
        document.getElementById("recette_auteur").addEventListener("input",function(){
            own.setAuteur(this.value);
        });
        document.getElementById("saveButton").addEventListener("click",function(){
            own.saveUpdates();
        });
    }

    updateHTML() {
        document.getElementById("recette_nom").value = this.nom;
        document.getElementById("recette_nbportions").value = this.nbPortions;
        document.getElementById("recette_auteur").value = this.auteur;
        this.updateTotal();
    }

    updateTotal() {
        let total = 0;
        for(let etape in this.etapes) {
            let listingre = this.etapes[etape].getListIngredients();
            for(let ingre in listingre)
                total += parseFloat(listingre[ingre].getPrix()*listingre[ingre].getQuantite());
        }
        document.getElementById("TotalIngredients").innerHTML = Math.round(total*1000)/1000 + "<span>€</span>";

        for(let cout in this.couts)
            if(this.couts[cout].getMultiplicateur())
                total *= parseFloat(this.couts[cout].getValeur());
            else   
                total += parseFloat(this.couts[cout].getValeur());

        document.getElementById("valeurTotal").innerHTML = Math.round(total*1000)/1000 + "<span>€</span>";
    }

    getAvailableEtapeID() {
        let max = 0;
        for(let etape in this.etapes)
            if(this.etapes[etape].getID() > max)
                max = this.etapes[etape].getID();  
        
        return max+1; //Car dans la BD l'id commence à 1
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
        this.updateTotal();
    }
    removeEtape(etapeToRemove) {
        for(let etape in this.etapes) {
            if(this.etapes[etape] == etapeToRemove) {
                delete this.etapes[etape];
                break;
            }
        }
        this.updateTotal();
    }
    addCout(infos = null) {
        this.couts[this.nbCouts++] = new Cout(this, infos);
        this.updateTotal();
    }
    removeCout(coutToRemove) {
        for(let cout in this.couts) {
            if(this.couts[cout] == coutToRemove) {
                delete this.couts[cout];
                break;
            }
        }
        this.updateTotal();
    }

    saveUpdates() {
        let infos = {};
        infos["id"] = this.getID();
        infos["nom"] = this.getNom();
        infos["auteur"] = this.getAuteur();
        infos["nbPortions"] = this.getNbPortions();

        let infosCouts = {};
        let nbCout = 0;
        for(let c in this.couts) {
            let cout = {};
            cout["id"] = this.couts[c].getID();
            cout["nom"] = this.couts[c].getNom();
            cout["valeur"] = this.couts[c].getValeur();
            cout["multiplicateur"] = this.couts[c].getMultiplicateur();
            infosCouts[nbCout++] = cout;
        }
        infos["couts"] = infosCouts;
        let infosEtapes = {};
        let nbEtape = 0
        for(let e in this.etapes) {
            let etape = {};
            etape["id"] = this.etapes[e].getID();
            etape["nom"] = this.etapes[e].getNom();
            etape["description"] = this.etapes[e].getDescription();
            let ingredients = {};
            let nbIngre = 0;
            let listIngre = this.etapes[e].getListIngredients();
            for(let i in listIngre) {
                let ingre = {};
                ingre["id"] = listIngre[i].getID();
                ingre['quantite'] = listIngre[i].getQuantite();
                ingredients[nbIngre++] = ingre;
            }
            etape["ingredients"] = ingredients; 
            infosEtapes[nbEtape++] = etape;
        }
        infos["etapes"] = infosEtapes;
        console.log(infos);
        console.log(JSON.stringify(infos));
        if(this.getID() == 0) {
            infos["fonction"] = "ajouterFicheRecette"
            let url = "../API/models/ModelFicheRecette.php?infos=" + encodeURIComponent(JSON.stringify(infos));
            let requete = new XMLHttpRequest();
            requete.open("POST", url, true);
            requete.send(null);
            requete.addEventListener("load", function (){
                console.log(requete.response);
            });
        //On récupère l'id car si l'id était à 0, la recette n'existait pas encore dans la BD,
        // on a créé dans la BD une nouvelle table et il faut donc savoir l'id
        
        //setID();
        }
        else { //Sinon, on update la table
            infos["fonction"] = "updateFicheRecette"
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
    setID(nouveauID) {
        this.id = nouveauID;
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
    getModalIngredient() {
        return this.modalIngredient;
    }
}