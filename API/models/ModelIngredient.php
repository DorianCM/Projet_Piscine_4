<?php

require_once('../config/Conf.php');

class Model {

    public static $pdo;
    //On initialise la BD
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
    //Permet d'envoyer la requête qui renvoie tous les ingrédients en fonction de notre recherche name (si name = 1, renvoie tous les ingrédients,
    //Sinon renvoie les éléments commençant par la string $name) en les ordonnants selon la variable $order
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
    //Permet d'ajouter un ingrédient en prenant tous ses éléments en paramètres à part son id qui est généré automatiquement
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
    //Permet de modifier un ingrédient en prenant tous ses éléments en paramètres
    public static function modifierIngrediant($id_ingrediant,$nom_ingrediant,$id_unite,$prix_ingrediant,$id_categorie_allergene,$id_categorie,$id_tva){
        try {
            $sql = "UPDATE `Ingrediant` 
                    SET nom_ingrediant= :name,id_unite= :id_unite,prix_ingrediant=:prix_ingrediant,id_categorie_allergene=:categorie_allergene,id_categorie=:id_categorie,id_tva=:id_tva
                    WHERE id_ingrediant = :id";
            $req_prep = self::$pdo->prepare($sql);

            $values = array("id" => $id_ingrediant,
                "name" => $nom_ingrediant,
                "id_unite" => $id_unite,
                "prix_ingrediant" => $prix_ingrediant,
                "categorie_allergene" => $id_categorie_allergene,
                "id_categorie" => $id_categorie,
                "id_tva" => $id_tva);

            $req_prep->execute($values);
        } catch (PDOException $e){
            echo $e->getMessage();
            die("Erreur lors de la recherche dans la base de données.");
        }

    }
    //Cette fonction envoie la requete sql pour supprimer un ingrédient en fonction de son id
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
    //TODO verifier que cette fonction est utilisé et n'a pas été remplacée par une fonction du ModelUniteCategories
    public static function getAllUnite(){
        try {
            $sql = "SELECT * FROM `Unite`";
            $req_prep = self::$pdo->prepare($sql);

            $req_prep->execute();
            $req_prep->setFetchMode(PDO::FETCH_OBJ);
            return $req_prep->fetchAll();
        } catch (PDOException $e){
            echo $e->getMessage();
            die("Erreur lors de la recherche dans la base de données.");
        }
    }
    //Fonction qui permet de récupérer tous les éléments de la table sql categorie_allergene
    public static function getAllCategorie_Allergene(){
        try {
            $sql = "SELECT * FROM `categorie_allergene`";
            $req_prep = self::$pdo->prepare($sql);

            $req_prep->execute();
            $req_prep->setFetchMode(PDO::FETCH_OBJ);
            return $req_prep->fetchAll();
        } catch (PDOException $e){
            echo $e->getMessage();
            die("Erreur lors de la recherche dans la base de données.");
        }
    }
    //TODO verifier que cette fonction est utilisé et n'a pas été remplacée par une fonction du ModelUniteCategories
    public static function getAllCategorie(){
        try {
            $sql = "SELECT * FROM `categorie`";
            $req_prep = self::$pdo->prepare($sql);

            $req_prep->execute();
            $req_prep->setFetchMode(PDO::FETCH_OBJ);
            return $req_prep->fetchAll();
        } catch (PDOException $e){
            echo $e->getMessage();
            die("Erreur lors de la recherche dans la base de données.");
        }
    }
    //TODO verifier que cette fonction est utilisé et n'a pas été remplacée par une fonction du ModelUniteCategories
    public static function getAllTVA(){
        try {
            $sql = "SELECT * FROM `tva`";
            $req_prep = self::$pdo->prepare($sql);

            $req_prep->execute();
            $req_prep->setFetchMode(PDO::FETCH_OBJ);
            return $req_prep->fetchAll();
        } catch (PDOException $e){
            echo $e->getMessage();
            die("Erreur lors de la recherche dans la base de données.");
        }
    }
}

// on initialise la connexion $pdo
Model::init_pdo();

?>
