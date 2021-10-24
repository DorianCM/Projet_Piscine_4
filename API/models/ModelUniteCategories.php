<?php

require_once('../config/Conf.php');

class ModelUniteCategories{

    public static $pdo;
    //Initialisation de la BD
    public static function init_pdo()
    {
        $host = Conf::getHostname();
        $dbname = Conf::getDatabase();
        $login = Conf::getLogin();
        $pass = Conf::getPassword();
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

    //Les trois premieres fonctions servent a remplir les input de la liste d'ingrédients, il sont plus spécifiques sur la
    //selection des éléments et ne peuvent donc pas être récupéré via la requete générique

    //Envoie la requete sql afin de récuperer toutes les unités
    public static function getAllUnite()
    {
        try {
            $sql = "SELECT * FROM `Unite`";
            $req_prep = self::$pdo->prepare($sql);

            $req_prep->execute();
            $req_prep->setFetchMode(PDO::FETCH_OBJ);
            return $req_prep->fetchAll();
        } catch (PDOException $e) {
            echo $e->getMessage();
            die("Erreur lors de la recherche dans la base de données.");
        }
    }
    //Envoie la requete sql afin de récuperer toutes les catégories d'ingrédients
    public static function getAllCategorie()
    {
        try {
            $sql = "SELECT * FROM `categorie`";
            $req_prep = self::$pdo->prepare($sql);

            $req_prep->execute();
            $req_prep->setFetchMode(PDO::FETCH_OBJ);
            return $req_prep->fetchAll();
        } catch (PDOException $e) {
            echo $e->getMessage();
            die("Erreur lors de la recherche dans la base de données.");
        }
    }
    //Envoie la requete sql afin de récuperer toutes les catégories de TVA
    public static function getAllTVA()
    {
        try {
            $sql = "SELECT * FROM `tva`";
            $req_prep = self::$pdo->prepare($sql);

            $req_prep->execute();
            $req_prep->setFetchMode(PDO::FETCH_OBJ);
            return $req_prep->fetchAll();
        } catch (PDOException $e) {
            echo $e->getMessage();
            die("Erreur lors de la recherche dans la base de données.");
        }
    }

    //Get générique qui permet de récupérer tous les éléments de n'importe quelle classe en les ordonnants selon un paramètre
    //en ayant la possibilité de selectionné que les éléments qui commencent par la variable string $regexpEl
    public static function getAllGenericWithOrder($name,$order,$table, $regexpEl){
        try {
            $sql = "SELECT * FROM $table WHERE $regexpEl REGEXP \"^$name.*\" ORDER BY $order";
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

    //Fonction générique permettant de supprimer un element par son id, le nom de sa clé primaire $fieldname et le nom de sa table sql
    public static function supprimerGenerique($table, $fieldname, $id_generique){
        try {
            $sql = "DELETE FROM `$table` WHERE $fieldname = :id";
            $req_prep = self::$pdo->prepare($sql);

            $values = array("id" => $id_generique);
            $req_prep->execute($values);

            return $sql;
        } catch (PDOException $e){
            echo $e->getMessage();
            die("Erreur lors de la recherche dans la base de données.");
        }

    }

    //Fonction permetant d'ajouter une unité dans la base de donnée
    public static function ajouterUnite($nom_unite){
        try {
            $sql = "INSERT INTO `Unite` (`nom_unite`) VALUES ('$nom_unite')";
            $req_prep = self::$pdo->prepare($sql);
            $req_prep->execute();
        } catch (PDOException $e){
            echo $e->getMessage();
            die("Erreur lors de la recherche dans la base de données.");
        }
    }

    //Fonction permetant de modifier une unité dans la base de donnée
    public static function modifierUnite($id_unite,$nom_unite){
        try {
            $sql = "UPDATE `Unite` 
                    SET nom_unite = :name
                    WHERE id_unite = :id";
            $req_prep = self::$pdo->prepare($sql);

            $values = array("id" => $id_unite,
                "name" => $nom_unite);

            $req_prep->execute($values);
        } catch (PDOException $e){
            echo $e->getMessage();
            die("Erreur lors de la recherche dans la base de données.");
        }
    }
    //Fonction permetant de modifier une catégorie d'ingrédients dans la base de donnée
    public static function modifierCategorie($id_categorie,$nom_categorie){
        try {
            $sql = "UPDATE `Categorie` 
                    SET nom_categorie = :name
                    WHERE id_categorie = :id";
            $req_prep = self::$pdo->prepare($sql);

            $values = array("id" => $id_categorie,
                "name" => $nom_categorie);

            $req_prep->execute($values);
        } catch (PDOException $e){
            echo $e->getMessage();
            die("Erreur lors de la recherche dans la base de données.");
        }
    }
    //Fonction permetant de modifier une catégorie de recette dans la base de donnée
    public static function modifierCategorieRecette($id_categorie,$nom_categorie){
        try {
            $sql = "UPDATE `categorie_recette` 
                    SET nom_categorie_recette = :name
                    WHERE id_categorie_recette = :id";
            $req_prep = self::$pdo->prepare($sql);

            $values = array("id" => $id_categorie,
                "name" => $nom_categorie);

            $req_prep->execute($values);
        } catch (PDOException $e){
            echo $e->getMessage();
            die("Erreur lors de la recherche dans la base de données.");
        }
    }
    //Fonction permetant de modifier une catégorie de TVA dans la base de donnée
    public static function modifierCategorieTVA($id_categorie_tva,$nom_categorie_tva,$valeur){
        try {
            $sql = "UPDATE `tva` 
                    SET categorie_tva = :name, valeur_tva = :valeur
                    WHERE id_tva = :id";
            $req_prep = self::$pdo->prepare($sql);

            $values = array("id" => $id_categorie_tva,
                "name" => $nom_categorie_tva,
                "valeur" => $valeur);

            $req_prep->execute($values);
        } catch (PDOException $e){
            echo $e->getMessage();
            die("Erreur lors de la recherche dans la base de données.");
        }
    }
    //Fonction permetant de modifier une catégorie d'ingrédients dans la base de donnée
    public static function ajouterCategorie($nom_categorie){
        try {
            $sql = "INSERT INTO `Categorie` (`nom_categorie`) VALUES ('$nom_categorie')";
            $req_prep = self::$pdo->prepare($sql);
            $req_prep->execute();
        } catch (PDOException $e){
            echo $e->getMessage();
            die("Erreur lors de la recherche dans la base de données.");
        }
    }
    //Fonction permetant de modifier une catégorie de recette dans la base de donnée
    public static function ajouterCategorieRecette($nom_categorie){
        try {
            $sql = "INSERT INTO `Categorie_Recette` (`nom_categorie_recette`) VALUES ('$nom_categorie')";
            $req_prep = self::$pdo->prepare($sql);
            $req_prep->execute();
        } catch (PDOException $e){
            echo $e->getMessage();
            die("Erreur lors de la recherche dans la base de données.");
        }
    }
    //Fonction permetant de modifier une catégorie de TVA dans la base de donnée
    public static function ajouterCategorieTVA($nom_categorie_tva,$valeur_tva){
        try {
            $sql = "INSERT INTO `tva` (`categorie_tva`,`valeur_tva`) VALUES ('$nom_categorie_tva','$valeur_tva')";
            $req_prep = self::$pdo->prepare($sql);
            $req_prep->execute();
            return $sql;
        } catch (PDOException $e){
            echo $e->getMessage();
            die("Erreur lors de la recherche dans la base de données.");
        }
    }
}

// on initialise la connexion $pdo
ModelUniteCategories::init_pdo();

