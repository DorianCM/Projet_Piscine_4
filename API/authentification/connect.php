<?php
session_start();
require_once '../../config/Conf.php';

class Connexion{
    private static $pdo = NULL;
    public static $seed = 'D6MTr5ua9C';

        public static function init(){
                   $hostname = Conf::getHostname();
                   $database_name = Conf::getDatabase();
                   $login = Conf::getLogin();
                   $password = Conf::getPassword();
                   try{
                   // Connexion à la base de données
                   // Le dernier argument sert à ce que toutes les chaines de caractères
                   // en entrée et sortie de MySql soit dans le codage UTF-8
                   self::$pdo = new PDO("mysql:host=$hostname;dbname=$database_name", $login, $password, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
                   // On active le mode d'affichage des erreurs, et le lancement d'exception en cas d'erreur
                   self::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                   }catch(PDOException $e){
                   if (Conf::getDebug()){
                   echo $e->getMessage();
                   }else{
                   echo 'Une erreur est survenue <a href=""> retour a la page d\'accueil </a>';}
                   die();
                   }
        }
        public static function getPDO(){
                   if (is_null(self::$pdo)){
                                      self::init();
                                      }
                       return self::$pdo;
            }


        public static function hacher($texte_en_clair) {
            $texte_en_clair =  static::$seed . $texte_en_clair;
            $texte_hache = hash('sha256', $texte_en_clair);
            return $texte_hache;
        }
        public static function checkPassword($login,$mdp){
                try{
                $bool = false;
                $mdp_hache = self::hacher($mdp);
                $sql = 'SELECT mdp FROM utilisateur WHERE login=:id_login';
                $req_prep = self::getPDO()->prepare($sql);
                $values = array(
                "id_login" => $login,
                );
                $req_prep->execute($values);
                $resultat = $req_prep->fetch();
                if($resultat[0] == $mdp_hache){
                $bool = true;
                }
                return $bool;
                self::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

                }catch(PDOException $e){
                if (Conf::debug()){
                 echo $e->getMessage();
                 }else{
                 echo 'Une erreur est survenue <a href=""> retour a la page d\'accueil </a>';}
                 die();
                 }
            }


 }
$login = $_GET['Identifiant'];
$mdp = $_GET['MDP'];
if (Connexion::checkPassword($login,$mdp) ){
    $_SESSION['login']=$login;
    //renvoyer true en echo
    $response = array(
    'Response' => true);
    $json = json_encode($response);
    echo $json;

}
  else{
   //renvoyer false en echo
   $response = array(
       'Response' => false);
   $json = json_encode($response);
   echo $json;
}



?>