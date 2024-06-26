<?php
include 'conexion_bd.php';

$cedula = $_POST['cedula'];
$nombre = $_POST['nombre'];
$apellido = $_POST['apellido'];
$fecha_nacimiento = $_POST['fecha_nacimiento'];
$direccion = $_POST['direccion'];
$email = $_POST['email'];
$rol = $_POST['rol'];
$usuario = $_POST['usuario'];
$clave = $_POST['clave'];
$foto = $_FILES['foto']['tmp_name'];

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

// Verificar que el usuario y la cédula no existan
$sql = "SELECT * FROM usuarios WHERE usuario='$usuario' OR cedula='$cedula'";
$result = $conexion->query($sql);

if ($result->num_rows > 0) {
    die("El nombre de usuario o la cédula ya existen.");
}

// Insertar usuario
$clave_encriptada = password_hash($clave, PASSWORD_DEFAULT);
$fotoContenido = $foto ? file_get_contents($foto) : NULL;

$sql = $conexion->prepare("INSERT INTO usuarios (cedula, nombre, apellido, fecha_nacimiento, edad, direccion, email, rol, usuario, clave, foto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
$sql->bind_param('ssssisssssb', $cedula, $nombre, $apellido, $fecha_nacimiento, $edad, $direccion, $email, $rol, $usuario, $clave_encriptada, $fotoContenido);

if ($sql->execute() === TRUE) {
    echo "Usuario creado correctamente.";
} else {
    echo "Error al crear el usuario: " . $conexion->error;
}

$conexion->close();
?>
