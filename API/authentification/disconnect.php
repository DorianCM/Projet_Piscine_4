<?php
session_start();
session_unset();
session_destroy();

echo "<p> Vous êtes bien déconnecter ! ";
echo "<a href='../../'>Retourner à l'accueil : </a>";



?>