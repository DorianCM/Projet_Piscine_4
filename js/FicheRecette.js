//Classe définissant une recette/fiche technique
class FicheRecette {
    id = 0; //Lors de la sauvegarde, si id = 0, on créer une nouvelle table, sinon on modifie celle existante
    nom = '';
    auteur = '';
    nbPortions = 0;
    categorieRecette='';
    couts = {};
    nbCouts = 0;
    modalIngredient = null;
    modalSousFicheRecette = null;
    content = null;
    dicoEtape ={};
    dicoNbEtape = 0;

    constructor(infos = null) {
        this.content = document.getElementById("content");
        if(infos) {
            this.id = infos[0].id_recette;
            this.nom = infos[0].nom_recette;
            this.auteur = infos[0].nom_createur;
            this.nbPortions = infos[0].nb_portions;
            this.categorieRecette = infos[0].id_categorie_recette;
            for(let cout in infos.couts)
                this.addCout(infos.couts[cout]);
            for(let etape in infos.etapes)
                this.addEtape(infos.etapes[etape]);
        }
        else{ //Si pas d'infos pourvues, valeurs par défault
            this.nom = "Nouvelle Recette";
            this.auteur = "";
            this.nbPortions = 10;
            this.categorieRecette = '1';

            this.addEtape();

            let coutPersonnel = {"id_cout":1, "nom_cout":"Coût personnel", "valeur_cout":0, "multiplicateur":false};
            this.addCout(coutPersonnel);
            let coutMatieres = {"id_cout":2, "nom_cout":"Coût matières", "valeur_cout":0, "multiplicateur":false};
            this.addCout(coutMatieres);
            let coutCoef = {"id_cout":3, "nom_cout":"Coef", "valeur_cout":2, "multiplicateur":true};
            this.addCout(coutCoef);
        }

        this.fillSelectCategorie();
        this.setEventListener();
        this.updateHTML();
        this.modalIngredient = new ModalIngredient(this);
        this.modalSousFicheRecette = new ModalSousFicheRecette(this);
        this.deleteButton();
    }

    setEventListener() {
        let own = this;
        document.getElementById("addSousRecetteButton").addEventListener("click",function(){
            own.modalSousFicheRecette.openModal();
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
        document.getElementById("selectCategorieRecette").addEventListener("change",function(){
            own.setCategorieRecette(this.value);
        });
        document.getElementById("recette_auteur").addEventListener("input",function(){
            own.setAuteur(this.value);
        });
        document.getElementById("saveButton").addEventListener("click",function(){
            own.saveUpdates();
        });
        document.getElementById("PDFFiche").addEventListener("click",function(){
            own.convertPDF(true);
        });
        document.getElementById("PDFFicheCouts").addEventListener("click",function(){
            own.convertPDF(false);
        });
    }

    fillSelectCategorie() {
        let url = "../API/getRecetteCategorie.php";
        let requete = new XMLHttpRequest();
        requete.open("POST", url, true);

        let own = this;
        requete.addEventListener("load", function (){
            let categories = JSON.parse(requete.response);
            for(let cat in categories){
                let opt = document.createElement("option");
                opt.value = categories[cat].id_categorie_recette;
                opt.text = categories[cat].nom_categorie_recette;
                document.getElementById("selectCategorieRecette").appendChild(opt);
                opt.selected = (own.getCategorieRecette() == categories[cat].id_categorie_recette);
            }
        });
        requete.send(null);
    }
    updateHTML() {
        document.getElementById("recette_nom").value = this.nom;
        document.getElementById("recette_nbportions").value = this.nbPortions;
        document.getElementById("recette_auteur").value = this.auteur;
        document.getElementById("selectCategorieRecette").value = this.categorie;
        this.updateTotal();
    }

    updateTotal() {
        let total = 0;
        for(let etape in this.dicoEtape){
            let listingre = this.dicoEtape[etape].getListIngredients();
            for(let ingre in listingre)
                total += parseFloat(listingre[ingre].getPrix()*listingre[ingre].getQuantite());
        }
        document.getElementById("TotalIngredients").innerHTML =total.toFixed(2)+ "<span>€</span>";

        for(let cout in this.couts)
            if(this.couts[cout].getMultiplicateur())
                total *= parseFloat(this.couts[cout].getValeur());
            else   
                total += parseFloat(this.couts[cout].getValeur());

        document.getElementById("valeurTotal").innerHTML = total.toFixed(2) + "<span>€</span>";
        document.getElementById("valeurTotalTTC").innerHTML = (total*1.2).toFixed(2) + "<span>€</span>";
        document.getElementById("valeurTTCPortions").innerHTML =(total*1.1/this.getNbPortions()).toFixed(2) + "<span>€</span>";
    }

    getAvailableEtapeID() {
        let max = 0;
        for(let etape in this.dicoEtape)
            if(this.dicoEtape[etape].getID() > max)
                max = this.dicoEtape[etape].getID();
        return (parseInt(max)+1).toString();
    }
    getAvailableCoutID() {
        let max = 0;
        for(let cout in this.couts) {
            if(this.couts[cout].getID() > max)
                max = this.couts[cout].getID();
        }
        return (parseInt(max)+1).toString();
    }
    addEtape(infosEtape = null, etapeSousRecette = false) {
        var stock = new Etape(this, infosEtape, etapeSousRecette);
        this.dicoEtape[stock.getID()] = stock;
        if(!infosEtape)
            this.dicoEtape[stock.getID()].createHTML();
        this.dicoNbEtape++;
        this.updateTotal();
    }
    switchEtapeDown(idEtapeUp){
        idEtapeUp = parseInt(idEtapeUp);
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

            this.updateTotal();

        }
    }
    switchEtapeUp(idEtapeDown){
        idEtapeDown = parseInt(idEtapeDown);
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
            this.dicoEtape[i] = this.dicoEtape[parseInt(i)+1];
            this.dicoEtape[i].changeHTMLFor(i);
            this.dicoEtape[i].setID(i);
        }
        delete this.dicoEtape[this.dicoNbEtape];
        this.dicoNbEtape--;

        this.updateTotal();
    }
    addCout(infosCout = null) {
        this.couts[this.nbCouts++] = new Cout(this, infosCout);
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
        infos["id_recette"] = this.getID();
        infos["nom_recette"] = this.getNom();
        infos["nom_createur"] = this.getAuteur();
        infos["nb_portions"] = this.getNbPortions();
        infos["id_categorie_recette"] = this.getCategorieRecette();

        let infosCouts = {};
        let nbCout = 0;
        for(let c in this.couts) {
            let cout = {};
            cout["id_cout"] = this.couts[c].getID();
            cout["nom_cout"] = this.couts[c].getNom();
            cout["valeur_cout"] = this.couts[c].getValeur();
            cout["multiplicateur"] = this.couts[c].getMultiplicateur();
            infosCouts[nbCout++] = cout;
        }
        infos["couts"] = infosCouts;
        let infosEtapes = {};
        let nbEtape = 0;
        for(let e in this.dicoEtape) {
            let etape = {};
            etape["id_etape"] = this.dicoEtape[e].getID();
            etape["nom_etape"] = this.dicoEtape[e].getNom();
            etape["description_etape"] = this.dicoEtape[e].getDescription();
            etape["duree"] = this.dicoEtape[e].getDuree();

            let ingredients = {};
            let nbIngre = 0;
            let listIngre = this.dicoEtape[e].getListIngredients();
            for(let i in listIngre) {
                let ingre = {};
                ingre["id_ingrediant"] = listIngre[i].getID();
                ingre['quantite'] = listIngre[i].getQuantite();
                ingredients[nbIngre++] = ingre;
            }
            etape["ingredients"] = ingredients; 
            infosEtapes[nbEtape++] = etape;
        }
        infos["etapes"] = infosEtapes;
            let url = "../API/saveFicheRecette.php?infos=" + encodeURIComponent(JSON.stringify(infos));
            let requete = new XMLHttpRequest();
            requete.open("POST", url, true);

            let own = this;
            requete.addEventListener("load", function (){
                //On récupère l'id car si l'id était à 0, la recette n'existait pas encore dans la BD,
                // on a créé dans la BD une nouvelle table et il faut donc savoir l'id
                if(own.getID() == 0)
                    own.setID(parseInt(requete.response));
            });
            requete.send(null);
    }

    hideForPDF(avecLesCout = true) {
        let listButtons = document.getElementsByTagName("button");
        for(let button in listButtons)
            if(listButtons[button].classList)
                listButtons[button].classList.add("tempHide");

        let listInput = document.getElementsByTagName("input");
        for(let input in listInput)
            if(listInput[input].classList){
                let ptemp = document.createElement("p");
                ptemp.className = "tempP";
                ptemp.innerHTML = listInput[input].value;
                listInput[input].parentNode.insertBefore(ptemp, listInput[input]);
                listInput[input].classList.add("tempHide");
            }
                //listInput[input].classList.add("hideArrowInput");

        let listTextArea = document.getElementsByTagName("textarea");
        for(let area in listTextArea)
            if(listTextArea[area].classList) {
                let ptemp = document.createElement("p");
                ptemp.className = "tempP";
                ptemp.innerHTML = listTextArea[area].value;
                listTextArea[area].parentNode.insertBefore(ptemp, listTextArea[area]);
                listTextArea[area].classList.add("tempHide");
            }
        
        let listSelects = document.getElementsByTagName("select");
        for(let select in listSelects)
            if(listSelects[select].classList && listSelects[select].id != "selectCategorieRecette")
                listSelects[select].classList.add("tempHide");

        document.getElementById("addEtape").classList.add("tempHide");
        document.getElementById("addCout").classList.add("tempHide");
        document.getElementById("ligneCoutsType").classList.add("hideText");

        let colonneVides = document.querySelectorAll(".coutVide");
        for(let c in colonneVides)
            if(colonneVides[c].classList)
                colonneVides[c].classList.add("hideRigthBorder");
        
        if(!avecLesCout) {
            document.getElementById("thCout").classList.add("tempHide");
            document.getElementById("colonneCout").classList.add("tempHide");
            document.getElementById("ligneCouts").classList.add("tempHide");
            document.getElementById("ligneTotal").classList.add("tempHide");
            document.getElementById("ligneTotalTTC").classList.add("tempHide");
            document.getElementById("ligneTTCPortions").classList.add("tempHide");
            document.getElementById("thIngredients").classList.add("hideRigthBorder");
            document.getElementById("colonneCategorie").classList.add("hideRigthBorder");
            let listTotalIngredient = document.querySelectorAll(".ingredientTotal");
            for(let cout in listTotalIngredient)
                if(listTotalIngredient[cout].classList)
                    listTotalIngredient[cout].classList.add("tempHide");
            let listCouts = document.querySelectorAll(".cout");
            for(let cout in listCouts)
                if(listCouts[cout].classList)
                    listCouts[cout].classList.add("tempHide");
        }
    }
    disableHideForPDF() {
        document.getElementById("ligneCoutsType").classList.remove("hideText");
        let listHide = document.querySelectorAll(".tempHide");
        for(let element in listHide)
            if(listHide[element].classList)
                listHide[element].classList.remove("tempHide");
        let listHideRigthBorder = document.querySelectorAll(".hideRigthBorder");
        for(let element in listHideRigthBorder)
            if(listHideRigthBorder[element].classList)
                listHideRigthBorder[element].classList.remove("hideRigthBorder");
        let listHideTextArea = document.querySelectorAll(".hideBorderTextArea");
        for(let area in listHideTextArea)
            if(listHideTextArea[area].classList)
                listHideTextArea[area].classList.remove("hideBorderTextArea");
        let listHideInput = document.querySelectorAll(".hideArrowInput");
        for(let input in listHideInput)
            if(listHideInput[input].classList)
                listHideInput[input].classList.remove("hideArrowInput");

        let listTempP = document.querySelectorAll(".tempP");
        for(let ptemp in listTempP)
            if(listTempP[ptemp].classList)
                listTempP[ptemp].remove(); 
        
    }
    convertPDF(avecLesCout = true) {
        //Cacher les éléments indésirables
        this.hideForPDF(avecLesCout);
        document.querySelectorAll(".entetu")[0].classList.add("tempHide");

        //Conversion en PDF
        let content = document.getElementById("content");
        content.classList.add("transform");
        window.print();
        content.classList.remove("transform");

        //Remontrer les éléments cachés
        this.disableHideForPDF();
    }

    addSousRecette(id_sous_recette) {
        let url = "../API/getFicheRecette.php?idFicheRecette="+id_sous_recette;
        let requete = new XMLHttpRequest();
        requete.open("GET", url, true);
        let own = this;
        requete.addEventListener("load", function (){
            let infos = JSON.parse(requete.response);
            for(let etape in infos.etapes)
                own.addEtape(infos.etapes[etape], true);
        });
        requete.send(null);
    }

    deleteButton(){
        let res = document.getElementsByClassName("test");
        while(res[0]){
            res[0].remove();
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
    getCategorieRecette() {
        return this.categorieRecette;
    }
    setCategorieRecette(nouvelleCategorie) {
        this.categorieRecette = nouvelleCategorie;
    }
    getListCout() {
        return this.couts;
    }

    getModalIngredient() {
        return this.modalIngredient;
    }
}