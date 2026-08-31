<?php
require_once BASE_PATH . '/PDF/fpdf/fpdf.php';

// ============================================================
// REFERENCIA — PDF generado por DIRPOLES 4
// ============================================================
// Variables esperadas del controller:
//   $data → Array con los datos de la consulta/diagnóstico
// ============================================================

if (empty($data)) {
    die("No se encontraron datos para generar la referencia.");
}

// Extraer datos con soporte para diferentes nombres de columnas
$nombre   = $data['nombre_beneficiario'] ?? $data['nombres'] ?? '';
$apellido = $data['apellido_beneficiario'] ?? $data['apellidos'] ?? '';
$cedula   = $data['cedula'] ?? '';
$empleado = $data['nombres_empleado'] ?? $data['empleado'] ?? '';
$diagnostico      = $data['diagnostico'] ?? '';
$tratamiento      = $data['tratamiento_gen'] ?? $data['tratamiento'] ?? '';
$observaciones    = $data['observaciones'] ?? '';
$tipo_consulta    = $data['tipo_consulta'] ?? '';
$patologia        = $data['patologia'] ?? '';
$fecha_raw        = $data['fecha_creacion'] ?? $data['fecha_psicologia'] ?? '';
$telefono         = $data['telefono'] ?? '';

// Nombre completo
$nombreCompleto = trim($nombre . ' ' . $apellido);

// Formatear la fecha
if (!empty($fecha_raw)) {
    $fechaObj = DateTime::createFromFormat('Y-m-d', substr($fecha_raw, 0, 10));
    $fechaFormateada = $fechaObj ? $fechaObj->format('d/m/Y') : $fecha_raw;
} else {
    $fechaFormateada = date('d/m/Y');
}

// Crear el PDF
$pdf = new FPDF();
$pdf->AddPage();

// Imagen de fondo (template)
$pdf->Image(BASE_PATH . '/PDF/referencia/referencia.png', 0, 0, 210, 297);

// --- CAMPOS SUPERPUESTOS SOBRE LA IMAGEN ---
// Ajustar coordenadas (X, Y) según la plantilla referencia.png

$pdf->SetFont('Arial', '', 12);

// Nombre del beneficiario
$pdf->SetXY(55, 72);
$pdf->Cell(120, 8, utf8_decode($nombreCompleto));

// Cédula
$pdf->SetXY(55, 80);
$pdf->Cell(60, 8, utf8_decode($cedula));

// Teléfono (si existe)
if (!empty($telefono)) {
    $pdf->SetXY(55, 88);
    $pdf->Cell(60, 8, utf8_decode($telefono));
}

// Fecha
$pdf->SetXY(140, 88);
$pdf->Cell(40, 8, $fechaFormateada);

// Profesional de salud
if (!empty($empleado)) {
    $pdf->SetXY(55, 96);
    $pdf->Cell(120, 8, utf8_decode($empleado));
}

// Tipo de consulta
if (!empty($tipo_consulta)) {
    $pdf->SetXY(55, 104);
    $pdf->Cell(120, 8, utf8_decode($tipo_consulta));
}

// Patología
if (!empty($patologia)) {
    $pdf->SetXY(55, 112);
    $pdf->Cell(120, 8, utf8_decode($patologia));
}

// Diagnóstico (multicell para texto largo)
if (!empty($diagnostico)) {
    $pdf->SetXY(15, 130);
    $pdf->MultiCell(180, 7, utf8_decode($diagnostico));
}

// Tratamiento (multicell para texto largo)
if (!empty($tratamiento)) {
    $pdf->SetXY(15, 170);
    $pdf->MultiCell(180, 7, utf8_decode($tratamiento));
}

// Observaciones (multicell para texto largo)
if (!empty($observaciones)) {
    $pdf->SetXY(15, 210);
    $pdf->MultiCell(180, 7, utf8_decode($observaciones));
}

// Salida del PDF
$pdf->Output('I', 'referencia.pdf');
exit();
