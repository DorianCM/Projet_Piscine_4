<?php

require_once('../config/Conf.php');

class ModelFicheRecette {
    public static $pdo;

    public static function init_pdo() {
        $host   = Conf::getHostname();
        $dbname = Conf::getDatabase();
        $login  = Conf::getLogin();
        $pass   = Conf::getPassword();
        try {
            self::$pdo = new PDO("mysql:host=$host;dbname=$dbname", $login, $pass, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
            self::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $ex) {
            echo $ex->getMessage();
            die("Problème lors de la connexion à la base de données.");
        }
    }

    public static function getFicheRecette($id) {
        $sql = "SELECT id_recette, nom_recette, nb_portions, nom_createur, id_categorie_recette
            FROM recette r
            WHERE r.id_recette = $id";
        try {
            $req_prep = self::$pdo->prepare($sql);
            $req_prep->execute();
            $req_prep->setFetchMode(PDO::FETCH_OBJ);
            $results= $req_prep->fetchAll();
            

            $results["etapes"] = ModelFicheRecette::getAllEtape($id);
            $results["couts"] = ModelFicheRecette::getAllCouts($id);

            echo json_encode($results);
        } catch (PDOException $ex) {
            echo $ex->getMessage();
            die("Problème lors de la connexion à la base de données.");
        }
    }

    public static function getAllEtape($id_recette) {
        $sql = "SELECT id_etape, nom_etape, description_etape, duree
            FROM etapes
            WHERE id_recette = $id_recette";
        try {
            $prepEtape = self::$pdo->prepare($sql);
            $prepEtape->execute();
            $prepEtape->setFetchMode(PDO::FETCH_OBJ);
            $resultsEtapes = $prepEtape->fetchAll();

            $length = count($resultsEtapes);
            for ($i = 0; $i< $length; $i++) {
                $resultsEtapes[$i]->ingredients = ModelFicheRecette::getAllIngredient($id_recette, $resultsEtapes[$i]->id_etape);
            }

            return $resultsEtapes;
        } catch (PDOException $ex) {
            echo $ex->getMessage();
            die("Problème lors de la connexion à la base de données.");
        }
    }

    public static function getAllIngredient($id_recette, $id_etape) {
        $sql = "SELECT ie.id_ingrediant,nom_ingrediant,u.nom_unite,prix_ingrediant,ca.nom_categorie_allergene,c.nom_categorie,t.categorie_tva,t.valeur_tva, ie.quantite
            FROM `Ingrediant` i 
            JOIN Unite u ON u.id_unite=i.id_unite
            JOIN categorie c ON c.id_categorie=i.id_categorie
            JOIN tva t ON t.id_tva=i.id_tva 
            JOIN categorie_allergene ca ON ca.id_categorie_allergene=i.id_categorie_allergene
            JOIN ingrediant_etape ie on ie.id_ingrediant = i.id_ingrediant
            WHERE ie.id_recette = $id_recette && ie.id_etape = $id_etape";
        try {
            $prepIngre = self::$pdo->prepare($sql);
            $prepIngre->execute();
            $prepIngre->setFetchMode(PDO::FETCH_OBJ);
            $resultsIngre = $prepIngre->fetchAll();

            return $resultsIngre;
        } catch (PDOException $ex) {
            echo $ex->getMessage();
            die("Problème lors de la connexion à la base de données.");
        }
    }

    public static function getAllCouts($id_recette) {
        $sql = "SELECT id_cout, nom_cout, valeur_cout, multiplicateur
            FROM cout
            WHERE id_recette = $id_recette";
        try {
            $prepCout = self::$pdo->prepare($sql);
            $prepCout->execute();
            $prepCout->setFetchMode(PDO::FETCH_OBJ);
            $resultsCouts = $prepCout->fetchAll();

            return $resultsCouts;
        } catch (PDOException $ex) {
            echo $ex->getMessage();
            die("Problème lors de la connexion à la base de données.");
        }
    }

    public static function ajouterFicheRecette($infos) {
        $sql = "INSERT INTO recette (nom_recette, nb_portions, nom_createur, id_categorie_recette) VALUES ('".$infos['nom_recette']."', '".$infos['nb_portions']."', '".$infos['nom_createur']."', '".$infos['id_categorie_recette']."')";
        try {
            $req_prep = self::$pdo->prepare($sql);
            if($req_prep->execute()) {
                //On récupère l'id de la recette sauvegardée
                $infos["id_recette"] = self::$pdo->lastInsertId();

                //On insert les couts et les étapes
                ModelFicheRecette::ajouterCouts($infos["id_recette"], $infos["couts"]);
                ModelFicheRecette::ajouteretapes($infos["id_recette"], $infos["etapes"]);

                echo $infos["id_recette"]; //On récupère l'id pour la classe js
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
            die("\nErreur lors de la création de la recette.\n");
        }
    }

    public static function updateFicheRecette($infos) {
        //D'abord, on update les informations de la recette
        $sql = "UPDATE recette set nom_recette = '".$infos['nom_recette']."', nb_portions = '".$infos['nb_portions']."', nom_createur = '".$infos['nom_createur']."', id_categorie_recette = '".$infos['id_categorie_recette']."' 
        WHERE id_recette = '".$infos["id_recette"]."'";

        try{
            $req_prep = self::$pdo->prepare($sql);
            if($req_prep->execute()) {
                //Puis on supprime toutes les tables de couts, d'étapes, et d'ingrédient_étapes pour pouvoir les re-insérer

                $sql = "DELETE FROM cout WHERE id_recette = '".$infos["id_recette"]."'";
                $req_prep = self::$pdo->prepare($sql);
                $req_prep->execute();
                $sql = "DELETE FROM ingrediant_etapes WHERE id_recette = '".$infos["id_recette"]."'";
                $req_prep = self::$pdo->prepare($sql);
                $req_prep->execute();
                $sql = "DELETE FROM etapes WHERE id_recette = '".$infos["id_recette"]."'";
                $req_prep = self::$pdo->prepare($sql);
                $req_prep->execute();
                ModelFicheRecette::ajouterCouts($infos["id_recette"], $infos["couts"]);
                ModelFicheRecette::ajouterEtapes($infos["id_recette"], $infos["etapes"]);

                echo true;
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
            die("\nErreur lors de la mise à jour de la recette.\n");
        }
    }

    public static function ajouterEtapes($id_recette, $etapes) {
        foreach ($etapes as $etape) {
            $sql = "INSERT INTO etapes (id_etape, id_recette, nom_etape, description_etape, duree) VALUES ('".$etape['id_etape']."', '".$id_recette."', '".$etape['nom_etape']."', '".$etape['description_etape']."', '".$etape['duree']."')";
            $req_prep = self::$pdo->prepare($sql);
            $req_prep->execute();
            //Quel ingrédient est associé à quelle étape :
            $ingredients = $etape["ingredients"];
            foreach ($ingredients as $ingre) {
                $sql = "INSERT INTO ingrediant_etape (id_ingrediant, id_etape, id_recette, quantite) VALUES ('".$ingre['id_ingrediant']."', '".$etape['id_etape']."', '".$id_recette."', '".$ingre['quantite']."')";
                $req_prep = self::$pdo->prepare($sql);
                $req_prep->execute();
            }
        }
    }
    public static function ajouterCouts($id_recette, $couts) {
        foreach ($couts as $cout) {
            $multi = $cout['multiplicateur']?1:0;
            $sql = "INSERT INTO cout (id_cout, id_recette, nom_cout, valeur_cout, multiplicateur) VALUES ('".$cout['id_cout']."', '".$id_recette."', '".$cout['nom_cout']."', '".$cout['valeur_cout']."', '".$multi."')";
            $req_prep = self::$pdo->prepare($sql);
            $req_prep->execute();
        }
    }

    public static function getCategorieRecette() {
        $sql = "SELECT id_categorie_recette, nom_categorie_recette
            FROM categorie_recette";
        try {
            $req_prep = self::$pdo->prepare($sql);
            $req_prep->execute();
            $req_prep->setFetchMode(PDO::FETCH_ASSOC);
            return $req_prep->fetchAll();
        } catch (PDOException $ex) {
            echo $ex->getMessage();
            die("Problème lors de la connexion à la base de données.");
        }
    }
}

ModelFicheRecette::init_pdo();
?>