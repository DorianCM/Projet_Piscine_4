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
        $sql = "INSERT INTO `Recette` (nom_recette, nb_portions, id_createur) VALUES (:nom_recette, :nb_portions, :id_createur)";
        echo $sql;
        /*try {
            $req_prep = self::$pdo->prepare($sql);

            $values = array("nom_recette" => $infos["nom"],
                "nb_portions" => $infos["nbPortions"],
                "id_createur" => null;

            $req_prep->execute($values);
        } catch (PDOException $e) {
            echo $e->getMessage();
            die("Erreur lors de la recherche dans la base de données.");
        }*/
    }

    public static function updateFicheRecette($infos) {

    }
}
ModelFicheRecette::init_pdo();
//echo $_GET["infos"];
$infos = json_decode($_GET["infos"], true);
var_dump($infos)
/*echo $infos;

switch($infos["fonction"]) {
    case 'ajouterFicheRecette':
       ModelFicheRecette::ajouterFicheRecette(infos);
       break;

    case 'updateFicheRecette':
        ModelFicheRecette::updateFicheRecette(infos);
        break;

    default:
       $aResult['error'] = 'Not found function '.$infos["fonction"].'!';
       break;
}*/

?>