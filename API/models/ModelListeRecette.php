<?php

require_once('../config/Conf.php');

class ModelListeRecette {

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

    public static function getAllRecette($name,$order){
            try {
                $sql = "SELECT id_recette,nom_recette,nom_createur
                        FROM `recette` r
                        REGEXP \"^$name.*\" ORDER BY $order";
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

    public static function supprimerRecette($id_recette){
            try {
                $sql = "DELETE FROM `recette` WHERE id_recette = :id";
                $req_prep = self::$pdo->prepare($sql);

                $values = array("id" => $id_recette);

                $req_prep->execute($values);

            } catch (PDOException $e){
                echo $e->getMessage();
                die("Erreur lors de la recherche dans la base de données.");
            }
        }
}

	ModelListeRecette::Init();
?>