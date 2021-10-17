<?php

require_once('../../config/Conf.php');

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

    public static function ajouterFicheRecette($infos) {
        $sql = "INSERT INTO recette (nom_recette, nb_portions, nom_createur) VALUES ('".$infos['nom']."', '".$infos['nbPortions']."', '".$infos['auteur']."')";
        try {
            $req_prep = self::$pdo->prepare($sql);
            if($req_prep->execute()) {
                //On récupère l'id de la recette sauvegardée
                $infos["id"] = self::$pdo->lastInsertId();

                //On insert les couts et les étapes
                ModelFicheRecette::ajouterCouts($infos["id"], $infos["couts"]);
                ModelFicheRecette::ajouteretapes($infos["id"], $infos["etapes"]);

                echo $infos["id"]; //On récupère l'id pour la classe js
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
            die("\nErreur lors de la création de la recette.\n");
        }
    }

    public static function updateFicheRecette($infos) {
        //D'abord, on update les informations de la recette
        $sql = "UPDATE recette set nom_recette = '".$infos['nom']."', nb_portions = '".$infos['nbPortions']."', nom_createur = '".$infos['auteur']."' WHERE id_recette = '".$infos["id"]."'";

        try{
            $req_prep = self::$pdo->prepare($sql);
            if($req_prep->execute()) {
                //Puis on supprime toutes les tables de couts, d'étapes, et d'ingrédient_étapes pour pouvoir les re-insérer

                $sql = "DELETE FROM cout WHERE id_recette = '".$infos["id"]."'";
                $req_prep = self::$pdo->prepare($sql);
                $req_prep->execute();
                $sql = "DELETE FROM etapes WHERE id_recette = '".$infos["id"]."'";
                $req_prep = self::$pdo->prepare($sql);
                $req_prep->execute();
                ModelFicheRecette::ajouterCouts($infos["id"], $infos["couts"]);
                ModelFicheRecette::ajouteretapes($infos["id"], $infos["etapes"]);

            }
        } catch (PDOException $e) {
            echo $e->getMessage();
            die("\nErreur lors de la mise à jour de la recette.\n");
        }
    }

    public static function ajouterEtapes($id_recette, $etapes) {
        foreach ($etapes as $etape) {
            $sql = "INSERT INTO etapes (id_etape, id_recette, nom_etape, description_etape, numero_etape) VALUES ('".$etape['id']."', '".$id_recette."', '".$etape['nom']."', '".$etape['description']."', '".$etape['numero']."')";
            $req_prep = self::$pdo->prepare($sql);
            $req_prep->execute();
            //Quel ingrédient est associé à quelle étape :
            $ingredients = $etape["ingredients"];
            foreach ($ingredients as $ingre) {
                $sql = "INSERT INTO ingrediant_etape (id_ingrediant, id_etape, id_recette, quantite) VALUES ('".$ingre['id']."', '".$etape['id']."', '".$id_recette."', '".$ingre['quantite']."')";
                $req_prep = self::$pdo->prepare($sql);
                $req_prep->execute();
            }
        }
    }
    public static function ajouterCouts($id_recette, $couts) {
        foreach ($couts as $cout) {
            $multi = $cout['multiplicateur']?1:0;
            $sql = "INSERT INTO cout (id_cout, id_recette, nom_cout, valeur_cout, multiplicateur) VALUES ('".$cout['id']."', '".$id_recette."', '".$cout['nom']."', '".$cout['valeur']."', '".$multi."')";
            $req_prep = self::$pdo->prepare($sql);
            $req_prep->execute();
        }
    }
}

ModelFicheRecette::init_pdo();
$infos = json_decode($_GET["infos"], true);

if ($infos["id"] == '0') {
    ModelFicheRecette::ajouterFicheRecette($infos);
}
else {
    ModelFicheRecette::updateFicheRecette($infos);
}

?>