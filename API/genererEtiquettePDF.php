<?php

/**
 * Crée les étiquettes en utilisant la librairie TCPDF
 * @package com.tecnick.tcpdf
 * @author Lorenzo Italiano
 */


// Require du fichier qui inclus tous les fichiers automatiquement
require_once('TCPDF/tcpdf.php');

// création du pdf
$pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

$pdf->SetTitle('Etiquettes');

$pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

//Desactivation du header et du footer de base
$pdf->setPrintHeader(false);
$pdf->setPrintFooter(false);

//Desactivation des marges
$pdf->SetMargins(0,0,0);
// ---------------------------------------------------------

// ajout d'une page
$pdf->AddPage();

// set font
$pdf->SetFont('helvetica', '', 12);


// set cell padding
$pdf->setCellPaddings(1, 1, 1, 1);

// set cell margins
$pdf->setCellMargins(1, 1, 1, 1);

//Récupération des paramètres pour la création des étiquettes
$listeIngredient =  $_GET["liste"];
$l = explode("_",$listeIngredient);
$listFinal = "";

foreach ($l as $value){
    $listFinal != "" ? $listFinal .= "," : $listFinal = "";
    //v[0] = nom ingredient, v[1] = allergene -> oui ou non
    $v = explode("-",$value);
    if($v[1] == "oui"){
        $listFinal .= " <b>" . $v[0] . "</b>";
    }else{
        $listFinal .= " " . $v[0];
    }
}

$nomPlat = $_GET['nom'];
$dateFab = $_GET['dateFab'];
$datePer = $_GET['datePer'];
//Génération du texte en html selon les ingrédients allergenes, la date de fabrication, peremption et le nom de la recette
$txt = '<p>Nom du plat : ' . $nomPlat .'</p>' . '<p>Ingrédients : ' . $listFinal .'</p>' . "\n" . 'Date de fabrication : ' . $dateFab . '<br>' .  'Date de péremption : ' . $datePer ;

// set color for background (blanc)
$pdf->SetFillColor(255, 255, 255);

//Affichage des cellules en indiquant leur place, le texte a afficher, la taille des cases, etc...
$pdf->MultiCell(102, 54, $txt."\n", 1, 'J', 1, 1, 0/*x value*/, 0/*y value*/, true, 0, true, true, 54, 'M', true);
$pdf->MultiCell(102, 54, $txt."\n", 1, 'J', 1, 1, 105/*x value*/, 0/*y value*/, true, 0, true, true, 54, 'M', true);
$pdf->MultiCell(102, 54, $txt."\n", 1, 'J', 1, 1, 0/*x value*/, 55/*y value*/, true, 0, true, true, 54, 'M', true);
$pdf->MultiCell(102, 54, $txt."\n", 1, 'J', 1, 1, 105/*x value*/, 55/*y value*/, true, 0, true, true, 54, 'M', true);
$pdf->MultiCell(102, 54, $txt."\n", 1, 'J', 1, 1, 0/*x value*/, 110/*y value*/, true, 0, true, true, 54, 'M', true);
$pdf->MultiCell(102, 54, $txt."\n", 1, 'J', 1, 1, 105/*x value*/, 110/*y value*/, true, 0, true, true, 54, 'M', true);
$pdf->MultiCell(102, 54, $txt."\n", 1, 'J', 1, 1, 0/*x value*/, 165/*y value*/, true, 0, true, true, 54, 'M', true);
$pdf->MultiCell(102, 54, $txt."\n", 1, 'J', 1, 1, 105/*x value*/, 165/*y value*/, true, 0, true, true, 54, 'M', true);
$pdf->MultiCell(102, 54, $txt."\n", 1, 'J', 1, 1, 0/*x value*/, 220/*y value*/, true, 0, true, true, 54, 'M', true);
$pdf->MultiCell(102, 54, $txt."\n", 1, 'J', 1, 1, 105/*x value*/, 220/*y value*/, true, 0, true, true, 54, 'M', true);



// ---------------------------------------------------------

// fermeture et affichage du pdf
$pdf->Output('example_011.pdf', 'I');

//============================================================+
// END OF FILE
//============================================================+