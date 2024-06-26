<?php
include 'conexion_bd.php';

$id_usuario = $_POST['id_usuario'];
$cedula = $_POST['cedula'];
$nombre = $_POST['nombre'];
$apellido = $_POST['apellido'];
$fecha_nacimiento = $_POST['fecha_nacimiento'];
$direccion = $_POST['direccion'];
$email = $_POST['email'];
$rol = $_POST['rol'];
$usuario = $_POST['usuario'];
$clave = $_POST['clave'];
$foto = $_FILES['foto'];

// Validaciones
if (!ctype_digit($cedula)) {
    die("La cédula debe contener solo números.");
}

if (!preg_match("/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/", $clave)) {
    die("La contraseña debe contener al menos 8 caracteres, una mayúscula, un número y un carácter especial.");
}

// Calcular edad
$fecha_actual = new DateTime();
$fecha_nac = new DateTime($fecha_nacimiento);
$edad = $fecha_actual->diff($fecha_nac)->y;

// Actualizar usuario
$clave_encriptada = password_hash($clave, PASSWORD_DEFAULT);

$sql = "UPDATE usuarios SET cedula='$cedula', nombre='$nombre', apellido='$apellido', fecha_nacimiento='$fecha_nacimiento', edad='$edad', direccion='$direccion', email='$email', rol='$rol', usuario='$usuario', clave='$clave_encriptada', foto='$foto' WHERE id_usuario='$id_usuario'";

if ($conexion->query($sql) === TRUE) {
    echo "Usuario actualizado correctamente.";
} else {
    echo "Error al actualizar el usuario: " . $conexion->error;
}

$conexion->close();
?>
