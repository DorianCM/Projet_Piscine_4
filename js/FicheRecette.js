//Classe définissant une recette/fiche technique
class FicheRecette {
    id = 0; //Lors de la sauvegarde, si id = 0, on crée une nouvelle table, sinon on modifie celle existante
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

    //Initialise la fiche recette
    //Données d'entrées :
    // - infos : dictionnaire contenant les infos de la fiche recette, si non pourvu, on prendra des valeurs par défaut
    constructor(infos = null) {
        this.content = document.getElementById("content");
        if(infos) { //On initialise avec les valeurs reçues
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
    }

    //Ajoute les eventListener aux éléments html
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
        document.getElementById("Etiquetes").addEventListener("click", function () {
            own.getEtiquettes();
        });
    }

    //Remplie la liste de catégorie de recette
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
    //Actualise les valeurs de la recette
    updateHTML() {
        document.getElementById("recette_nom").value = this.nom;
        document.getElementById("recette_nbportions").value = this.nbPortions;
        document.getElementById("recette_auteur").value = this.auteur;
        document.getElementById("selectCategorieRecette").value = this.categorie;
        this.updateTotal();
    }

    //Actualise les totaux des couts
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

    //Renvoie un ID valide pour une nouvelle étape
    getAvailableEtapeID() {
        let max = 0;
        for(let etape in this.dicoEtape)
            if(this.dicoEtape[etape].getID() > max)
                max = this.dicoEtape[etape].getID();
        return (parseInt(max)+1).toString();
    }
    //Renvoie un ID valide pour un nouveau coût
    getAvailableCoutID() {
        let max = 0;
        for(let cout in this.couts) {
            if(this.couts[cout].getID() > max)
                max = this.couts[cout].getID();
        }
        return (parseInt(max)+1).toString();
    }
    //Ajoute une étape dans la liste d'étapes
    //Données d'entrées : 
    // - infos : dictionnaire contenant les infos de l'étape, si non pourvu, l'étape prendra des valeurs par défaut (dans son constructeur)
    // - etapeSousRecette : bool indiquant si on ajoute cette étape lorsqu'on ajoute une sous-recette, car on ne doit pas récupérer l'id donné, mais prendre un nouvel id valide
    addEtape(infosEtape = null, etapeSousRecette = false) {
        var stock = new Etape(this, infosEtape, etapeSousRecette);
        this.dicoEtape[stock.getID()] = stock;
        if(!infosEtape)
            this.dicoEtape[stock.getID()].createHTML();
        this.dicoNbEtape++;
        this.updateTotal();
    }

    //Echange l'étape sélectionné avec celle juste en dessous
    //Si c'est la dernière étape, ne fait rien
    switchEtapeDown(idEtapeUp){
        //Converti l'id de l'étape du haut en Int
        idEtapeUp = parseInt(idEtapeUp);
        //Si ce n'est pas la dernière étape, effectue la suite d'instruction suivante
        if (idEtapeUp != this.dicoNbEtape){
            //Copie les étapes du dessus et du bas afin de les intervertir
            var copie1 = this.dicoEtape[idEtapeUp].saveEtape();
            var copie2 = this.dicoEtape[idEtapeUp +1].saveEtape();
            //Affecte une copie à l'autre étape
            //Change les id des étapes correspondantes pour qu'elles correspondent bien à leur place
            //dans le dictionnaire associatif et l'HTML
            this.dicoEtape[idEtapeUp] = copie2;
            this.dicoEtape[idEtapeUp].setID(idEtapeUp);
            this.dicoEtape[idEtapeUp +1] = copie1;
            this.dicoEtape[idEtapeUp +1].setID(idEtapeUp +1);
            //Pour chaque étape on récupère la liste d'ingrédient correspondante et pour chaque ingrédient on y réaffecte sa recette correspondante
            for(let ingredient in this.dicoEtape[idEtapeUp].getListIngredients()){
                this.dicoEtape[idEtapeUp].getListIngredients()[ingredient].setEtape(this.dicoEtape[idEtapeUp]);
            }
            for(let ingredient in this.dicoEtape[idEtapeUp+1].getListIngredients()){
                this.dicoEtape[idEtapeUp+1].getListIngredients()[ingredient].setEtape(this.dicoEtape[idEtapeUp+1]);
            }
            //Efface l'HTML correspondant aux étapes car on les recrées pour les réinserer juste avant/après certains éléments
            this.dicoEtape[idEtapeUp].removeHTML();
            this.dicoEtape[idEtapeUp+1].removeHTML();
            //Si il n'y a que deux étapes dans la recette ou que l'étape suivante est la dernière étape
            //On va d'abord recréer l'étape du dessus puis celle du dessous
            //car dans le createHTML on insére l'étape juste avant le bouton ajouter étape
            if (this.dicoNbEtape == 2 || (idEtapeUp+1) == this.dicoNbEtape){
                this.dicoEtape[idEtapeUp].createHTML();
                this.dicoEtape[idEtapeUp+1].createHTML();
            }
            //sinon on insére juste avant l'étape qui suit celle du bas de la même manière
            else{
                this.dicoEtape[idEtapeUp].createHTML(document.getElementById("etape_"+(idEtapeUp+2)));
                this.dicoEtape[idEtapeUp+1].createHTML(document.getElementById("etape_"+(idEtapeUp+2)));;
            }
            //on recréer les ingrédients dans la table correspondante
            this.dicoEtape[idEtapeUp].printIngredientsHTML();
            this.dicoEtape[idEtapeUp+1].printIngredientsHTML();
            //On re-modifie le total
            this.updateTotal();
        }
    }

    //Echange l'étape sélectionné avec celle juste au dessus d'elle
    //Si c'est la première étape, ne fait rien
    switchEtapeUp(idEtapeDown){
        //Converti l'id de l'étape du bas en Int
        idEtapeDown = parseInt(idEtapeDown);
        //Si ce n'est pas la première étape, effectue la suite d'instruction suivante
        if (idEtapeDown != 1){
            //Copie les étapes du dessus et du bas afin de les intervertir
            var copie1 = this.dicoEtape[idEtapeDown].saveEtape();
            var copie2 = this.dicoEtape[idEtapeDown -1].saveEtape();
            //Affecte une copie à l'autre étape
            //Change les id des étapes correspondantes pour qu'elles correspondent bien à leur place
            //dans le dictionnaire associatif et l'HTML
            this.dicoEtape[idEtapeDown] = copie2;
            this.dicoEtape[idEtapeDown].setID(idEtapeDown);
            this.dicoEtape[idEtapeDown -1] = copie1;
            this.dicoEtape[idEtapeDown -1].setID(idEtapeDown -1);
            //Pour chaque étape on récupère la liste d'ingrédient correspondante et pour chaque ingrédient on y réaffecte sa recette correspondante
            for(let ingredient in this.dicoEtape[idEtapeDown].getListIngredients()){
                this.dicoEtape[idEtapeDown].getListIngredients()[ingredient].setEtape(this.dicoEtape[idEtapeDown]);
            }
            for(let ingredient in this.dicoEtape[idEtapeDown-1].getListIngredients()){
                this.dicoEtape[idEtapeDown-1].getListIngredients()[ingredient].setEtape(this.dicoEtape[idEtapeDown-1]);
            }
            //Efface l'HTML correspondant aux étapes car on les recrées pour les réinserer juste avant/après certains éléments
            this.dicoEtape[idEtapeDown].removeHTML();
            this.dicoEtape[idEtapeDown-1].removeHTML();
            //Si il n'y a que deux étapes dans la recette ou que l'étape sélectionné est la dernière étape
            //On va d'abord recréer l'étape du dessus puis celle du dessous
            //car dans le createHTML on insére l'étape juste avant le bouton ajouter étape
            if (this.dicoNbEtape == 2 || idEtapeDown == this.dicoNbEtape){
                this.dicoEtape[idEtapeDown-1].createHTML();
                this.dicoEtape[idEtapeDown].createHTML();
            }
            //sinon on insére juste avant l'étape qui suit celle du bas de la même manière
            else{
                this.dicoEtape[idEtapeDown-1].createHTML(document.getElementById("etape_"+(idEtapeDown+1)));
                this.dicoEtape[idEtapeDown].createHTML(document.getElementById("etape_"+(idEtapeDown+1)));;
            }
            //on recréer les ingrédients dans la table correspondante
            this.dicoEtape[idEtapeDown].printIngredientsHTML();
            this.dicoEtape[idEtapeDown-1].printIngredientsHTML();
            //On re-modifie le total
            this.updateTotal();
        }
    }
    //Retire une étape
    //Données d'entrées : l'étape (classe Etape) à enlever
    removeEtape(etapeToRemove) {
        //Boucle qui replace dans le tableau les étapes situés après l'étape à supprimer
        for(let i = etapeToRemove.getID(); i< this.dicoNbEtape; i++){
            this.dicoEtape[i] = this.dicoEtape[parseInt(i)+1];
            this.dicoEtape[i].changeHTMLFor(i);
            this.dicoEtape[i].setID(i);
        }
        delete this.dicoEtape[this.dicoNbEtape];
        this.dicoNbEtape--;

        this.updateTotal();
    }
    //Ajoute une étape dans la liste d'étapes
    //Données d'entrées : 
    // - infos : dictionnaire contenant les infos du coût, si non pourvu, le coût prendra des valeurs par défaut (dans son constructeur)
    addCout(infosCout = null) {
        this.couts[this.nbCouts++] = new Cout(this, infosCout);
        this.updateTotal();
    }
    //Retire un coût
    //Données d'entrées : le coût (classe Cout) à enlever
    removeCout(coutToRemove) {
        for(let cout in this.couts) {
            if(this.couts[cout] == coutToRemove) {
                delete this.couts[cout];
                break;
            }
        }
        this.updateTotal();
    }

    //Sauvegarde la fiche recette dans la base de données
    saveUpdates() {
        let infos = {}; //Dictionnaire
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
            if(own.getID() == 0) {
                own.setID(parseInt(requete.response));
                own.openConfirmSave("La fiche recette a bien été créée");
            }
            else if (requete.response)
                own.openConfirmSave("Modifications enregistrées avec succès");
            
        });
        requete.send(null);
    }

    //Ouvre une fenêtre avec un message, qui se ferme avec un clique
    //Données d'entrées : message une chaine de caractères
    openConfirmSave(message) {
        let modal = document.createElement("div");
        modal.id = "modalConfirm";
        this.content.appendChild(modal);

        let modalContent = document.createElement("div");
        modalContent.id = "modalContentConfirm";
        modal.appendChild(modalContent);

        let p = document.createElement("p");
        p.innerHTML = message;
        modalContent.appendChild(p);

        modal.addEventListener("click",function(){
            modal.remove();
        });
    }

    //cache les éléments comme les boutons, et remplace les inputs et les textarea par des p
    //Cache aussi pour les utilisateurs non connectés
    //Données d'entrées : avecLesCouts : Bool indiquant si on veut garder les coûts
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

    //Annule les effets de hideForPDF()
    //Données d'entrées : avecLesCouts : Bool indiquant si on veut garder les coûts
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
    //ouvre la page permettant d'imprimer un pdf
    //Données d'entrées : avecLesCouts : Bool indiquant si on veut garder les coûts
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

    //Ajoute une recette (ses étapes) à la recette actuelle
    //Données d'entrées : id_sous_recette : id de la sous recette
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

    getEtiquettes(){
        let listIngredient = "";
        for(let etape in this.dicoEtape){
            listIngredient === ""? listIngredient = "" : listIngredient += "_";
            let listingre = this.dicoEtape[etape].getListIngredients();
            for(let ingre in listingre)
                listIngredient += listingre[ingre].categorieAllergene !== "non allergene"? listingre[ingre].libelle + "-" +"oui": listingre[ingre].libelle + "-" + "non";
        }
        let today = new Date();
        let day = today.getDate();
        let dayPeremption = today.getDate()+3;
        let dateF = day+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
        let datePer = dayPeremption+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
        window.open('../API/genererEtiquettePDF.php?nom=' + encodeURIComponent(this.nom) + '&liste=' + encodeURIComponent(listIngredient) + '&dateFab=' + dateF +' &datePer=' + datePer, '_blank');
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