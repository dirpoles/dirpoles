<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "citas";


$conn = new mysqli($servername, $username, $password);


if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}


$sql = "CREATE DATABASE IF NOT EXISTS $dbname";
if ($conn->query($sql) === TRUE) {
    echo "Base de datos creada correctamente<br>";
} else {
    echo "Error al crear la base de datos: " . $conn->error;
}


$conn->select_db($dbname);


$sql = "CREATE TABLE IF NOT EXISTS citas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL,
    descripcion VARCHAR(255) NOT NULL
)";
if ($conn->query($sql) === TRUE) {
    echo "Tabla de citas creada correctamente<br>";
} else {
    echo "Error al crear la tabla de citas: " . $conn->error;
}

$conn->close();
?>
