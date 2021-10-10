<?php
require_once Filee::build_path(array("config","Conf.php"));

class Model{
	
	public static $pdo;

	public static function Init(){
		$hostname = Conf::getHostname();
		$database_name = Conf::getDatabase();
		// Connexion à la base de données            
		// Le dernier argument sert à ce que toutes les chaines de caractères 
		// en entrée et sortie de MySql soit dans le codage UTF-8
		try{
		self::$pdo = new PDO("mysql:host=$hostname;dbname=$database_name", Conf::getLogin(), Conf::getPassword(), array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
   
		// On active le mode d'affichage des erreurs, et le lancement d'exception en cas d'erreur
		self::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		} catch(PDOException $e) {
			if (Conf::getDebug()) {
    			echo $e->getMessage(); // affiche un message d'erreur
  			} else {
    			echo 'Une erreur est survenue <a href=""> retour a la page d\'accueil </a>';
  			}
  			die();	  
		}
	}

    public static function selectAll(){
	    $table_name= "P_" . strtoupper(static::$objet);
	    $class_name="Model" . ucfirst(static::$objet);
        $rep = Model::$pdo->query("SELECT * FROM $table_name");
        $rep->setFetchMode(PDO::FETCH_CLASS, "$class_name");
        return $rep->fetchAll();
    }

    public static function select($primary_value){
        $table_name="P_" . strtoupper(static::$objet);
        $class_name="Model" . ucfirst(static::$objet);
        $primary_key=static::$primary;
        $sql = "SELECT * from $table_name WHERE $primary_key=:nom_tag";
        $req_prep = Model::$pdo->prepare($sql);

        $values = array(
            "nom_tag" => $primary_value,
        );
        $req_prep->execute($values);
        $req_prep->setFetchMode(PDO::FETCH_CLASS, "$class_name");
        $tab_voit = $req_prep->fetchAll();

        if (empty($tab_voit)){
            require_once Filee::build_path(array("view","error.php"));
            return false;
        }
        return $tab_voit[0];
    }

    public static function delete($primary){
        $table_name="P_" . strtoupper(static::$objet);
        $primary_key=static::$primary;
        $sql = "DELETE FROM $table_name WHERE $primary_key=:nom_tag";
        $req_prep = Model::$pdo->prepare($sql);
        $values = array(
            "nom_tag" => $primary,
        );
        $req_prep->execute($values);
    }

    public static function update($data){
        $table_name="P_" . strtoupper(static::$objet);
        $primary_key=static::$primary;
        $set = "";

        foreach ($data as $cle => $valeur) {
            $set .= " $cle='$data[$cle]',";
        }

        $settrim = rtrim($set, ",");
        //var_dump($settrim);
        $sql = "UPDATE $table_name SET $settrim WHERE $primary_key=:primary";
        $req_prep = Model::$pdo->prepare($sql);

        $values = array(
            "primary" => $data[$primary_key],
        );
        //var_dump($sql);
        $req_prep->execute($values);
    }


    public static function save($data){
        $table_name="P_" . strtoupper(static::$objet);
        $values = "(";
        $into = "(";

        foreach ($data as $cle => $valeur) {
            $into .= " $cle,";
            $values .= " :$cle,";
        }

        $valuestrim = rtrim($values, ",");
        $valuestrim .= ")";

        $settrim = rtrim($into, ",");
        $settrim .= ")";
        $table_name.= $settrim;

        $sql = "INSERT INTO $table_name VALUES $valuestrim";
        $req_prep = Model::$pdo->prepare($sql);

        $values = array();
        foreach ($data as $cle => $valeur) {
            $values[$cle]=$valeur;
        }
        //var_dump($values);
        $req_prep->execute($values);
    }
}

	Model::Init();
?>