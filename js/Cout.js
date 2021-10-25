class Cout {
    id = 0;
    nom = 'Cout';
    valeur = 0;
    multiplicateur = false;
    recette = null;
    trCout = null;

    //Initialise un Cout
    //Données d'entrées :
    // - recette : recette auquel appartient le coût
    // - infos : dictionnaire contenant les infos du coût, si non pourvu, le coût prendra des valeurs par défaut
    constructor(recette, infosCout = undefined) {
        this.recette = recette
        if(infosCout) {
            this.id = infosCout.id_cout;
            this.nom = infosCout.nom_cout;
            this.valeur = infosCout.valeur_cout;
            this.multiplicateur = infosCout.multiplicateur == true;
        }
        else {
            this.id = recette.getAvailableCoutID();
        }
        this.createHTML();
    }
    //Crée les éléments html propres au coût
    createHTML() {
        this.trCout = document.createElement("tr");
        this.trCout.id = "cout_"+this.getID();
        this.trCout.className = "cout";
        let tdVide = document.createElement("td");
        tdVide.className = "coutVide";
        tdVide.colSpan = "3";

        let tdMultiplicateur = document.createElement("td");
        tdMultiplicateur.className = "coutType"
        let selectType = document.createElement("select");
        selectType.name = "TypeCout";
        var opt1 = document.createElement("option");
        var opt2 = document.createElement("option");

        opt1.value = "true";
        opt1.text = "Multiplier";
        opt2.value = "false";
        opt2.text = "Additionner"; 
        if (this.getMultiplicateur())
            opt1.selected = true;
        else
            opt2.selected = true;

        selectType.add(opt1,null);
        selectType.add(opt2, 0);

        tdMultiplicateur.appendChild(selectType);

        let tdNom = document.createElement("td");
        let inputNom = document.createElement("input");
        inputNom.value = this.getNom();
        inputNom.className = "inputNom";
        let removeButton = document.createElement("button");
        removeButton.innerHTML = "-";
        tdNom.appendChild(inputNom);
        tdNom.appendChild(removeButton);

        let tdValeur = document.createElement("td");
        let inputValeur = document.createElement("input");
        inputValeur.type = "number";
        inputValeur.value = this.getValeur();
        inputValeur.className = "cout_input_valeur";
        let spanValeur = document.createElement("span");
        spanValeur.innerHTML = "€";
        tdValeur.appendChild(inputValeur);
        tdValeur.appendChild(spanValeur);

        this.trCout.appendChild(tdVide);
        this.trCout.appendChild(tdMultiplicateur);
        this.trCout.appendChild(tdNom);
        this.trCout.appendChild(tdValeur);

        document.getElementById("tabEtapes").insertBefore(this.trCout, document.getElementById("addCout"));

        this.setEventListener();
    }

    //Ajoute les eventListener aux éléments html
    setEventListener() {
        let own = this;
        document.getElementById("cout_"+this.getID()).getElementsByTagName("input")[0].addEventListener("input",function(){
            own.setNom(this.value);
        });
        document.getElementById("cout_"+this.getID()).getElementsByTagName("button")[0].addEventListener("click",function(){
            own.removeHTML();
            own.recette.removeCout(own);
        });
        document.getElementById("cout_"+this.getID()).getElementsByTagName("select")[0].addEventListener("change",function(){
            if(this.value =="true"){
                own.setMultiplicateur(true);
            }else{
                own.setMultiplicateur(false);
            }
           own.recette.updateTotal();
        });
        document.getElementById("cout_"+this.getID()).getElementsByTagName("input")[1].addEventListener("input",function(){
            own.setValeur(this.value);
            own.recette.updateTotal();
        });
    }
     //Enlève les éléments html propres au coût
    removeHTML() {
        this.trCout.remove();
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