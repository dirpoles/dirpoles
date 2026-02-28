<?php
require('pdf/fpdf/fpdf.php');

if (isset($id_discapacidad)) {
    $beneficiario = $discapacidad['nombre_beneficiario'] . ' ' . $discapacidad['apellido_beneficiario'];
    $empleado = $discapacidad['nombres_empleado'];
    $cargo = $discapacidad['tipo'];
    $telefono = $discapacidad['telefono'];
    $cedula = $discapacidad['cedula'];
    $fecha = $discapacidad['fecha_creacion'];
}

if (isset($id_consulta_med)) {
    $beneficiario = $medicina['nombre_beneficiario'];
    $empleado = $medicina['nombres_empleado'];
    $cargo = $medicina['tipo'];
    $telefono = $medicina['telefono'];
    $cedula = $medicina['cedula'];
    $fecha = $medicina['fecha_creacion'];
}

if (isset($id_orientacion)) {
    $beneficiario = $orientacion['nombre_beneficiario']. ' '. $orientacion['apellido_beneficiario'];
    $empleado = $orientacion['nombres_empleado'];
    $cargo = $orientacion['tipo'];
    $telefono = $orientacion['telefono'];
    $cedula = $orientacion['cedula'];
    $fecha = $orientacion['fecha_creacion'];
}

if(isset($id_psicologia)){
    $beneficiario = $psicologia['nombre_beneficiario']. ' '. $psicologia['apellido_beneficiario'];
    $empleado = $psicologia['nombres_empleado'];
    $cargo = $psicologia['tipo'];
    $telefono = $psicologia['telefono'];
    $cedula = $psicologia['cedula_beneficiario'];
    $fecha = $psicologia['fecha_psicologia'];
}

if(isset($id)){
    $beneficiario = $bd['nombres']. ' '. $bd['apellidos'];
    $empleado = $bd['nombres_empleado'];
    $cargo = $bd['tipo'];
    $telefono = $bd['telefono'];
    $cedula = $bd['cedula'];
    $fecha = $bd['fecha_creacion'];
}

if(isset($id_beca)){
    $beneficiario = $bd['nombres']. ' '. $bd['apellidos'];
    $empleado = $bd['nombres_empleado'];
    $cargo = $bd['tipo'];
    $telefono = $bd['telefono'];
    $cedula = $bd['cedula'];
    $fecha = $bd['fecha_creacion'];
}

if(isset($id_ex)){
    $beneficiario = $bd['nombres']. ' '. $bd['apellidos'];
    $empleado = $bd['nombres_empleado'];
    $cargo = $bd['tipo'];
    $telefono = $bd['telefono'];
    $cedula = $bd['cedula'];
    $fecha = $bd['fecha_creacion'];
}

$beneficiario = mb_convert_encoding($beneficiario, 'ISO-8859-1', 'UTF-8');
$empleado = mb_convert_encoding($empleado, 'ISO-8859-1', 'UTF-8');



$date = DateTime::createFromFormat('Y-m-d', $fecha);

$formatter = new IntlDateFormatter('es_ES', IntlDateFormatter::FULL, IntlDateFormatter::NONE);

$formatter->setPattern('EEEE'); // Día completo
$diaTexto = $formatter->format($date);
$diaTexto = ucfirst($diaTexto);

$diaTexto = mb_convert_encoding($diaTexto, 'ISO-8859-1', 'UTF-8');

$numeroDia = $date->format('d');

$formatter->setPattern('MMMM'); // Mes completo
$mesTexto = $formatter->format($date);
$mesTexto = ucfirst($mesTexto);

$anio = $date->format('y');

$pdf = new FPDF();
$pdf->AddPage();

$pdf->Image('pdf/referencia/referencia.png', 0, 0, 210, 297); // Ajusta las coordenadas y dimensiones según la imagen y tamaño de página (A4 en mm)
// Añadir los datos en las posiciones correspondientes
$pdf->SetFont('arial', '', 18);

// PARA AJUSTAR LA POSICION EN X y Y: PARA X ENTRE MENOR SEA EL NRO, EL ELEMENTO DE POSICIONARA MAS  A LA IZQUIERDA, PARA Y ENTRE MENOR SEA EL NUMERO , EL ELEMENTO SE POSICIONARA MAS ARRIBA

if ($beneficiario) {
    $pdf->SetXY(25, 64.5);
    $pdf->Cell(100, 10, "$beneficiario");
}

if ($cedula) {
    $pdf->SetXY(113, 75.5);
    $pdf->Cell(100, 10, "$cedula");
}

$pdf->SetFont('arial', '', 18);


if ($diaTexto) {
    $pdf->SetXY(25, 119.8);
    $pdf->Cell(100, 10, $diaTexto);
}

if ($numeroDia) {
    $pdf->SetXY(25, 201.5);
    $pdf->Cell(100, 10, "$numeroDia");
}

if ($mesTexto) {
    $pdf->SetXY(70, 201.5);
    $pdf->Cell(100, 10, "$mesTexto");
}

if ($anio) {
    $pdf->SetXY(128, 202);
    $pdf->Cell(100, 9, "$anio");
}

if ($empleado) {
    $pdf->SetXY(95, 240);
    $pdf->Cell(100, 9, "$empleado");
}

if ($cargo) {
    $pdf->SetXY(40, 253);
    $pdf->Cell(100, 9, "$cargo");
}

if ($telefono) {
    $pdf->SetXY(48, 265);
    $pdf->Cell(100, 9, "$telefono");
}

$pdf->Output('I', 'Referencia.pdf');

        // 'I' para que el PDF se muestre en el navegador, 'D' para descargar, 'F' Guardar el archivo en un archivo local en el servidor, 'S' Devolver el documento como una cadena de caracteres (string), 'FI' Guardar en el servidor y enviar en línea al navegador, 'FD' Guardar en el servidor y forzar la descarga, 'E' Enviar el archivo por correo electrónico (como archivo adjunto).
//     }
// }
