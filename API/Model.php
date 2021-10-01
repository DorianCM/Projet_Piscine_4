<?php

require_once('../config/Conf.php');

class Model {

    public static $pdo;

    public static function init_pdo() {
        $host   = Conf::getHostname();
        $dbname = Conf::getDatabase();
        $login  = Conf::getLogin();
        $pass   = Conf::getPassword();
        try {
            // connexion à la base de données
            // le dernier argument sert à ce que toutes les chaines de charactères
            // en entrée et sortie de MySql soit dans le codage UTF-8
            self::$pdo = new PDO("mysql:host=$host;dbname=$dbname", $login, $pass, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
            // on active le mode d'affichage des erreurs, et le lancement d'exception en cas d'erreur
            self::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $ex) {
            echo $ex->getMessage();
            die("Problème lors de la connexion à la base de données.");
        }
    }

    public static function getAllIngrediants($name,$order){
        try {
            $sql = "SELECT id_ingrediant,nom_ingrediant,u.nom_unite,prix_ingrediant,ca.nom_categorie_allergene,c.nom_categorie,t.categorie_tva,t.valeur_tva
FROM `Ingrediant` i 
JOIN Unite u ON u.id_unite=i.id_unite
JOIN categorie c ON c.id_categorie=i.id_categorie
JOIN tva t ON t.id_tva=i.id_tva 
JOIN categorie_allergene ca ON ca.id_categorie_allergene=i.id_categorie_allergene
WHERE nom_ingrediant REGEXP \"^$name.*\" ORDER BY $order";
            //var_dump($sql);
            $req_prep = self::$pdo->prepare($sql);

            $req_prep->execute();
            $req_prep->setFetchMode(PDO::FETCH_OBJ);
            $tabResults = $req_prep->fetchAll();
            return $tabResults;
        } catch (PDOException $e) {
            echo $e->getMessage();
            die("Erreur lors de la recherche dans la base de données.");
        }
    }

    public static function ajouterIngrediant($nom_ingrediant,$id_unite,$prix_ingrediant,$est_allergene,$id_categorie,$id_tva){
        try {
            $sql = "INSERT INTO `Ingrediant` (nom_ingrediant,id_unite,prix_ingrediant,id_categorie_allergene,id_categorie,id_tva) VALUES (:name, :id_unite, :prix_ingrediant, :est_allergene, :id_categorie, :id_tva)";
            $req_prep = self::$pdo->prepare($sql);

            $values = array("name" => $nom_ingrediant,
                "id_unite" => $id_unite,
                "prix_ingrediant" => $prix_ingrediant,
                "est_allergene" => $est_allergene,
                "id_categorie" => $id_categorie,
                "id_tva" => $id_tva);

            $req_prep->execute($values);
        } catch (PDOException $e){
            echo $e->getMessage();
            die("Erreur lors de la recherche dans la base de données.");
        }

    }

    /*public static function modifierIngrediant($nom_ingrediant,$id_unite,$prix_ingrediant,$est_allergene,$id_categorie,$id_tva){
        try {
            $sql = "INSERT INTO `Ingrediant` (nom_ingrediant,id_unite,prix_ingrediant,est_allergene,id_categorie,id_tva) VALUES (:name, :id_unite, :prix_ingrediant, :est_allergene, :id_categorie, :id_tva)";
            $req_prep = self::$pdo->prepare($sql);

            $values = array("name" => $nom_ingrediant,
                "id_unite" => $id_unite,
                "prix_ingrediant" => $prix_ingrediant,
                "est_allergene" => $est_allergene,
                "id_categorie" => $id_categorie,
                "id_tva" => $id_tva);

            $req_prep->execute($values);
        } catch (PDOException $e){
            echo $e->getMessage();
            die("Erreur lors de la recherche dans la base de données.");
        }

    }*/

    public static function supprimerIngrediant($id_ingrediant){
        try {
            $sql = "DELETE FROM `Ingrediant` WHERE id_ingrediant = :id";
            $req_prep = self::$pdo->prepare($sql);

            $values = array("id" => $id_ingrediant);

            $req_prep->execute($values);

        } catch (PDOException $e){
            echo $e->getMessage();
            die("Erreur lors de la recherche dans la base de données.");
        }

    }

    /* logiquement fonction inutile
    public static function getUnitebyId($id){
        try {
            $sql = "SELECT FROM `Unite` WHERE id_unite = :id";
            $req_prep = self::$pdo->prepare($sql);

            $values = array("id" => $id);

            $req_prep->execute($values);
            $req_prep->setFetchMode(PDO::FETCH_OBJ);
            $tabResults = $req_prep->fetchAll();
            return $tabResults;
        } catch (PDOException $e){
            echo $e->getMessage();
            die("Erreur lors de la recherche dans la base de données.");
        }
    }*/


    /*
    public static function ajouterAdherent($name){
        $sql = "INSERT INTO adherent (nomAdherent) VALUES (:name_tag)";
        $req_prep = self::$pdo->prepare($sql);

        $values = array("name_tag" => $name);

        $req_prep->execute($values);
    }

    public static function ajouterLivre($titre){
        $sql = "INSERT INTO livre (titreLivre) VALUES (:name_tag)";
        $req_prep = self::$pdo->prepare($sql);

        $values = array("name_tag" => $titre);

        $req_prep->execute($values);
    }

    public static function getAllAdherent(){
        try {
            $sql = "SELECT adherent.idAdherent, nomAdherent, COUNT(e.idAdherent) AS nbEmprunts FROM `adherent` LEFT JOIN emprunt e ON e.idAdherent = adherent.idAdherent GROUP BY adherent.idAdherent";
            $req_prep = self::$pdo->prepare($sql);

            $req_prep->execute();
            $req_prep->setFetchMode(PDO::FETCH_OBJ);
            $tabResults = $req_prep->fetchAll();
            return $tabResults;
        } catch (PDOException $e) {
            echo $e->getMessage();
            die("Erreur lors de la recherche dans la base de données.");
        }
    }
    // SELECT adherent.idAdherent, nomAdherent, COUNT(e.idAdherent) FROM `adherent` LEFT JOIN emprunt e ON e.idAdherent = adherent.idAdherent GROUP BY adherent.idAdherent

    public static function getLivresDispo(){
        try {
            $sql = "SELECT * FROM `livre` WHERE idLivre NOT IN(SELECT idLivre FROM `emprunt`)";
            $req_prep = self::$pdo->prepare($sql);

            $req_prep->execute();
            $req_prep->setFetchMode(PDO::FETCH_OBJ);
            $tabResults = $req_prep->fetchAll();
            return $tabResults;
        } catch (PDOException $e) {
            echo $e->getMessage();
            die("Erreur lors de la recherche dans la base de données.");
        }

    }

    public static function getLivresEmprunt(){
        try {
            $sql = "SELECT l.titreLivre, e.idLivre, a.nomAdherent FROM livre l JOIN emprunt e ON e.idLivre = l.idLivre JOIN adherent a ON a.idAdherent = e.idAdherent";
            $req_prep = self::$pdo->prepare($sql);

            $req_prep->execute();
            $req_prep->setFetchMode(PDO::FETCH_OBJ);
            $tabResults = $req_prep->fetchAll();
            return $tabResults;
        } catch (PDOException $e) {
            echo $e->getMessage();
            die("Erreur lors de la recherche dans la base de données.");
        }

    }

    public static function getListEmprunts($idAdherent){
    try {
        $sql = "SELECT titreLivre FROM livre WHERE idLivre IN (SELECT idLivre FROM `emprunt` WHERE idAdherent=:name_tag)";
        $req_prep = self::$pdo->prepare($sql);

        $values = array("name_tag" => $idAdherent);
        $req_prep->execute($values);
        $req_prep->setFetchMode(PDO::FETCH_OBJ);
        $tabResults = $req_prep->fetchAll();
        return $tabResults;
    } catch (PDOException $e) {
        echo $e->getMessage();
        die("Erreur lors de la recherche dans la base de données.");
    }
    }

    public static function emprunterLivre($idLivre, $idAdherent){
        $sql = "INSERT INTO emprunt (idAdherent, idLivre) VALUES (:adherent, :livre)";
        $req_prep = self::$pdo->prepare($sql);
        $values = array("livre" => $idLivre,
                            "adherent" => $idAdherent);
        $req_prep->execute($values);
    }

    public static function rendreLivre($idLivre){
        $sql = "DELETE FROM emprunt WHERE idLivre=:livre";
        $req_prep = self::$pdo->prepare($sql);
        $values = array("livre" => $idLivre);
        $req_prep->execute($values);
    }

    /*
     try {
            $sql = "INSERT INTO adherent (nomAdherent) VALUES (:name_tag)";
            $req_prep = self::$pdo->prepare($sql);

            $values = array("name_tag" => $name);

            $req_prep->execute($values);
            $req_prep->setFetchMode(PDO::FETCH_OBJ);
            $tabResults = $req_prep->fetchAll();
            // renvoi du tableau de résultats
            return $tabResults;
        } catch (PDOException $e) {
            echo $e->getMessage();
            die("Erreur lors de la recherche dans la base de données.");
        }
     */
}

// on initialise la connexion $pdo
Model::init_pdo();

?>
