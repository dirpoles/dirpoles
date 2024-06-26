<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "calendario_citas";

$mysqli = new mysqli($servername, $username, $password, $dbname);

if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $date = $_POST['date'];
    $descripcion = $_POST['descripcion'];

    $stmt = $mysqli->prepare("INSERT INTO citas (fecha, descripcion) VALUES (?, ?)");
    $stmt->bind_param("ss", $date, $descripcion);
    $stmt->execute();
    $stmt->close();
}

$mysqli->close();
header("Location: ../index.php");
?>
