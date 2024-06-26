<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "clientes";


$conn = new mysqli($servername, $username, $password);


if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}


$sql = "CREATE DATABASE IF NOT EXISTS $dbname";
if ($conn->query($sql) === TRUE) {
    echo "Base de datos creada exitosamente<br>";
} else {
    echo "Error creando base de datos: " . $conn->error;
}


$conn->select_db($dbname);


$sql = "CREATE TABLE IF NOT EXISTS clientes (
    id_cliente INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    cedula VARCHAR(20) NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    sexo CHAR(1) NOT NULL,
    direccion VARCHAR(255),
    email VARCHAR(50),
    telefono VARCHAR(15),
    carrera VARCHAR(50),
    trayecto INT(2),
    seccion VARCHAR(50)
)";

if ($conn->query($sql) === TRUE) {
    echo "Tabla clientes creada exitosamente";
} else {
    echo "Error creando tabla: " . $conn->error;
}

$conn->close();
?>
