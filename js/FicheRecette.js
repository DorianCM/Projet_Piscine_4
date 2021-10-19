//Classe définissant une recette/fiche technique
class FicheRecette {
    id = '0'; //Lors de la sauvegarde, si id = 0, on créer une nouvelle table, sinon on modifie celle existante
    nom = '';
    auteur = '';
    nbPortions = 0;
    couts = {};
    nbCouts = 0;
    modalIngredient = null;
    content = null;
    dicoEtape ={};
    dicoNbEtape = 0;

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

            let coutPersonnel = {"id":1, "nom":"Coût personnel", "valeur":0, "multiplicateur":false};
            this.addCout(coutPersonnel);
            let coutMatieres = {"id":2, "nom":"Coût matières", "valeur":0, "multiplicateur":false};
            this.addCout(coutMatieres);
            let coutCoef = {"id":3, "nom":"Coef", "valeur":2, "multiplicateur":true};
            this.addCout(coutCoef);
        }

        this.setEventListener();
        this.updateHTML();
        this.modalIngredient = new ModalIngredient(this);
    }

    setEventListener() {
        let own = this;

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
        for(let etape in this.dicoEtape){
            let listingre = this.dicoEtape[etape].getListIngredients();
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
        for(let etape in this.dicoEtape)
            if(this.dicoEtape[etape].getID() > max)
                max = this.dicoEtape[etape].getID();
        
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
        var stock = new Etape(this,infos);
        this.dicoEtape[stock.getID()] = stock;
        this.dicoEtape[stock.getID()].createHTML();
        this.dicoNbEtape++;
        this.updateTotal();
    }
    switchEtapeDown(idEtapeUp){
        if (idEtapeUp != this.dicoNbEtape){
            var copie1 = this.dicoEtape[idEtapeUp].saveEtape();
            var copie2 = this.dicoEtape[idEtapeUp +1].saveEtape();
            this.dicoEtape[idEtapeUp].cleanTableIngredient();
            this.dicoEtape[idEtapeUp+1].cleanTableIngredient();
            this.dicoEtape[idEtapeUp] = copie2;
            this.dicoEtape[idEtapeUp].setID(idEtapeUp);
            this.dicoEtape[idEtapeUp +1] = copie1;
            this.dicoEtape[idEtapeUp +1].setID(idEtapeUp +1);
            for(let ingredient in this.dicoEtape[idEtapeUp].getListIngredients()){
                this.dicoEtape[idEtapeUp].getListIngredients()[ingredient].setEtape(this.dicoEtape[idEtapeUp]);
            }
            for(let ingredient in this.dicoEtape[idEtapeUp+1].getListIngredients()){
                this.dicoEtape[idEtapeUp+1].getListIngredients()[ingredient].setEtape(this.dicoEtape[idEtapeUp+1]);
            }
            this.dicoEtape[idEtapeUp].removeHTML();
            this.dicoEtape[idEtapeUp+1].removeHTML();
            if (this.dicoNbEtape == 2 || (idEtapeUp+1) == this.dicoNbEtape){
                this.dicoEtape[idEtapeUp].createHTML();
                this.dicoEtape[idEtapeUp+1].createHTML();
            }
            else{
                this.dicoEtape[idEtapeUp].createHTML(document.getElementById("etape_"+(idEtapeUp+2)));
                this.dicoEtape[idEtapeUp+1].createHTML(document.getElementById("etape_"+(idEtapeUp+2)));;
            }
            this.dicoEtape[idEtapeUp].printIngredientsHTML();
            this.dicoEtape[idEtapeUp+1].printIngredientsHTML();
            console.log(this.dicoEtape[idEtapeUp].getListIngredients());

            this.updateTotal();

        }
    }
    switchEtapeUp(idEtapeDown){
        if (idEtapeDown != 1){
            var copie1 = this.dicoEtape[idEtapeDown].saveEtape();
            var copie2 = this.dicoEtape[idEtapeDown -1].saveEtape();
            this.dicoEtape[idEtapeDown].cleanTableIngredient();
            this.dicoEtape[idEtapeDown-1].cleanTableIngredient();
            this.dicoEtape[idEtapeDown] = copie2;
            this.dicoEtape[idEtapeDown].setID(idEtapeDown);
            this.dicoEtape[idEtapeDown -1] = copie1;
            this.dicoEtape[idEtapeDown -1].setID(idEtapeDown -1);
            for(let ingredient in this.dicoEtape[idEtapeDown].getListIngredients()){
                this.dicoEtape[idEtapeDown].getListIngredients()[ingredient].setEtape(this.dicoEtape[idEtapeDown]);
            }
            for(let ingredient in this.dicoEtape[idEtapeDown-1].getListIngredients()){
                this.dicoEtape[idEtapeDown-1].getListIngredients()[ingredient].setEtape(this.dicoEtape[idEtapeDown-1]);
            }
            this.dicoEtape[idEtapeDown].removeHTML();
            this.dicoEtape[idEtapeDown-1].removeHTML();
            if (this.dicoNbEtape == 2 || idEtapeDown == this.dicoNbEtape){
                this.dicoEtape[idEtapeDown-1].createHTML();
                this.dicoEtape[idEtapeDown].createHTML();
            }
            else{
                this.dicoEtape[idEtapeDown-1].createHTML(document.getElementById("etape_"+(idEtapeDown+1)));
                this.dicoEtape[idEtapeDown].createHTML(document.getElementById("etape_"+(idEtapeDown+1)));;
            }
            this.dicoEtape[idEtapeDown].printIngredientsHTML();
            this.dicoEtape[idEtapeDown-1].printIngredientsHTML();
            this.updateTotal();
        }
    }
    removeEtape(etapeToRemove) {
        for(let i = etapeToRemove.getID(); i< this.dicoNbEtape; i++){
            this.dicoEtape[i] = this.dicoEtape[i+1];
            this.dicoEtape[i].changeHTMLFor(i);
            this.dicoEtape[i].setID(i);
        }
        delete this.dicoEtape[this.dicoNbEtape];
        this.dicoNbEtape--;



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
        for(let e in this.dicoEtape) {
            let etape = {};
            etape["id"] = this.dicoEtape[e].getID();
            etape["nom"] = this.dicoEtape[e].getNom();
            etape["description"] = this.dicoEtape[e].getDescription();
            etape["numero"] = "0"; //this.dicoEtape[e].getNumero();
            let ingredients = {};
            let nbIngre = 0;
            let listIngre = this.dicoEtape[e].getListIngredients();
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
            let url = "../API/models/ModelFicheRecette.php?infos=" + encodeURIComponent(JSON.stringify(infos));
            let requete = new XMLHttpRequest();
            requete.open("POST", url, true);
            requete.send(null);
            let own = this;
            requete.addEventListener("load", function (){
                //On récupère l'id car si l'id était à 0, la recette n'existait pas encore dans la BD,
                // on a créé dans la BD une nouvelle table et il faut donc savoir l'id
                if(own.getID() == '0')
                    own.setID(requete.response);
                else console.log(requete.response);
            });
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

    getModalIngredient() {
        return this.modalIngredient;
    }
}