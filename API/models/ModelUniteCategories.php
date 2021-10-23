<?php

require_once('../config/Conf.php');

class ModelUniteCategories{

    public static $pdo;

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
/*
    public static function getAllIngrediants($name, $order)
    {
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

    public static function ajouterIngrediant($nom_ingrediant, $id_unite, $prix_ingrediant, $est_allergene, $id_categorie, $id_tva)
    {
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
        } catch (PDOException $e) {
            echo $e->getMessage();
            die("Erreur lors de la recherche dans la base de données.");
        }

    }

    public static function modifierIngrediant($id_ingrediant, $nom_ingrediant, $id_unite, $prix_ingrediant, $id_categorie_allergene, $id_categorie, $id_tva)
    {
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
        } catch (PDOException $e) {
            echo $e->getMessage();
            die("Erreur lors de la recherche dans la base de données.");
        }

    }


    public static function supprimerIngrediant($id_ingrediant)
    {
        try {
            $sql = "DELETE FROM `Ingrediant` WHERE id_ingrediant = :id";
            $req_prep = self::$pdo->prepare($sql);

            $values = array("id" => $id_ingrediant);

            $req_prep->execute($values);

        } catch (PDOException $e) {
            echo $e->getMessage();
            die("Erreur lors de la recherche dans la base de données.");
        }

    }*/

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

    /*public static function ajouterGenerique($table,$tabNames,$tabValues){
        try {
            $names = "";
            foreach($tabNames as $va){
                if($names == ""){
                    $names .= $va;
                }else{
                    $names .= "," .$va;
                }
            }
            $values = "";
            foreach($tabValues as $va){
                if($values == ""){
                    $values .= $va;
                }else{
                    $values .= "," .$va;
                }
            }
            $sql = "INSERT INTO $table ($names) VALUES ($values)";
            $req_prep = self::$pdo->prepare($sql);
            $req_prep->execute();
        } catch (PDOException $e){
            echo $e->getMessage();
            die("Erreur lors de la recherche dans la base de données.");
        }

    }*/

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

