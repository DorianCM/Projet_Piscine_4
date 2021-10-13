class Cout {
    id = 0;
    nom = 'Cout';
    valeur = 0;
    multiplicateur = false;
    recette = null;
    trCout = null;

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
        this.createHTML();
    }
    createHTML() {
        this.trCout = document.createElement("tr");
        this.trCout.id = "cout_"+this.getID();
        this.trCout.className = "cout";
        let tdVide = document.createElement("td");
        tdVide.colSpan = "3";

        let tdMultiplicateur = document.createElement("td");

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

    setEventListener() {
        let own = this;
        document.getElementById("cout_"+this.getID()).getElementsByTagName("input")[0].addEventListener("input",function(){
            own.setNom(this.value);
        });
        document.getElementById("cout_"+this.getID()).getElementsByTagName("button")[0].addEventListener("click",function(){
            own.removeHTML();
            own.recette.removeCout(own);
        });
        document.getElementById("cout_"+this.getID()).getElementsByTagName("input")[1].addEventListener("input",function(){
            own.setValeur(this.value);
            own.recette.updateTotal();
        });
    }
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