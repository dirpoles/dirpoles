<?php
session_start();
if (!isset($_SESSION['usuario'])) {
    header("Location: login.php");
    exit();
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "clientes_db";


$conn = new mysqli($servername, $username, $password, $dbname);


if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Eliminar el cliente
$id_cliente = $_GET['id'];
$sql = "DELETE FROM clientes WHERE id_cliente = $id_cliente";

if ($conn->query($sql) === TRUE) {
    echo "<script>alert('Cliente eliminado exitosamente');</script>";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();

echo "<script>window.location.href = 'consultar.php';</script>";
?>
