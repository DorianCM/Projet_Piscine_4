<?php
//============================================================+
// File name   : example_011.php
// Begin       : 2008-03-04
// Last Update : 2013-05-14
//
// Description : Example 011 for TCPDF class
//               Colored Table (very simple table)
//
// Author: Nicola Asuni
//
// (c) Copyright:
//               Nicola Asuni
//               Tecnick.com LTD
//               www.tecnick.com
//               info@tecnick.com
//============================================================+

/**
 * Creates an example PDF TEST document using TCPDF
 * @package com.tecnick.tcpdf
 * @abstract TCPDF - Example: Colored Table
 * @author Nicola Asuni
 * @since 2008-03-04
 */

// Include the main TCPDF library (search for installation path).
require_once('TCPDF/tcpdf.php');

// create new PDF document
$pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

// set document information
//$pdf->SetCreator(PDF_CREATOR);
//$pdf->SetAuthor('Nicola Asuni');
//$pdf->SetTitle('TCPDF Example 011');
//$pdf->SetSubject('TCPDF Tutorial');
//$pdf->SetKeywords('TCPDF, PDF, example, test, guide');

$pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

$pdf->setPrintHeader(false);
$pdf->setPrintFooter(false);

$pdf->SetMargins(0,0,0);
// ---------------------------------------------------------

// add a page
$pdf->AddPage();

// set font
$pdf->SetFont('helvetica', '', 12);


// set cell padding
$pdf->setCellPaddings(1, 1, 1, 1);

// set cell margins
$pdf->setCellMargins(1, 1, 1, 1);


$pdf->SetMargins(0,0,0);

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

//<b>Test</b>
//$pdf->SetFont('helvetica', 'B', 12);
// set some text for example
$txt = '<p>Nom du plat : ' . $nomPlat .'</p>' . '<p>Ingrédients : ' . $listFinal .'</p>' . "\n" . 'Date de fabrication : ' . $dateFab . '<br>' .  'Date de péremption : ' . $datePer ;

// print a blox of text using multicell()
//$pdf->MultiCell(80, 5, $txt."\n", 1, 'J', 1, 1, '' ,'', true);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// AUTO-FITTING

// set color for background
$pdf->SetFillColor(255, 255, 255);

// Fit text on cell by reducing font size
//params : marge droite ou taille ? Aucune idée, txtVar,
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

// close and output PDF document
$pdf->Output('example_011.pdf', 'I');

//============================================================+
// END OF FILE
//============================================================+