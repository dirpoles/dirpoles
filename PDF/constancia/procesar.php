<?php
require('pdf/fpdf/fpdf.php');

// Verificar que las variables necesarias estén definidas
if (!isset($beneficiario) || !isset($cedula) || !isset($fecha)) {
    die("Error: Datos insuficientes para generar la constancia.");
}

// Alternativa para fechas en español sin intl
$dias = [
    'Monday' => 'Lunes',
    'Tuesday' => 'Martes',
    'Wednesday' => 'Miércoles',
    'Thursday' => 'Jueves',
    'Friday' => 'Viernes',
    'Saturday' => 'Sábado',
    'Sunday' => 'Domingo'
];

$meses = [
    'January' => 'Enero',
    'February' => 'Febrero',
    'March' => 'Marzo',
    'April' => 'Abril',
    'May' => 'Mayo',
    'June' => 'Junio',
    'July' => 'Julio',
    'August' => 'Agosto',
    'September' => 'Septiembre',
    'October' => 'Octubre',
    'November' => 'Noviembre',
    'December' => 'Diciembre'
];

$date = DateTime::createFromFormat('Y-m-d', $fecha);
$diaIngles = $date->format('l');
$mesIngles = $date->format('F');

$diaTexto = $dias[$diaIngles] ?? $diaIngles;
$mesTexto = $meses[$mesIngles] ?? $mesIngles;
$numeroDia = $date->format('d');
$anio = $date->format('y');

// Generar PDF
$pdf = new FPDF();
$pdf->AddPage();

$pdf->Image('pdf/constancia/constancia.png', 0, 0, 210, 297);

// Añadir los datos
$pdf->SetFont('arial', '', 18);

// Beneficiario
$pdf->SetXY(25, 64.5);
$pdf->Cell(100, 10, $beneficiario);

// Cédula
$pdf->SetXY(113, 75.5);
$pdf->Cell(100, 10, $cedula);

$pdf->SetFont('arial', '', 18);

// Día de la semana
$pdf->SetXY(25, 119.8);
$pdf->Cell(100, 10, $diaTexto);

// Día del mes
$pdf->SetXY(25, 167);
$pdf->Cell(100, 10, $numeroDia);

// Mes
$pdf->SetXY(70, 167);
$pdf->Cell(100, 10, $mesTexto);

// Año
$pdf->SetXY(128, 167.3);
$pdf->Cell(100, 9, $anio);

$pdf->Output('I', 'Constancia.pdf');
?>