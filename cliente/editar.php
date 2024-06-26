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

// Obtener el cliente para editarlor
$id_cliente = $_GET['id'];
$sql = "SELECT * FROM clientes WHERE id_cliente = $id_cliente";
$result = $conn->query($sql);
$cliente = $result->fetch_assoc();

// Actualizar el cliente
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $cedula = $_POST['cedula'];
    $nombre = $_POST['nombre'];
    $apellido = $_POST['apellido'];
    $fecha_nacimiento = $_POST['fecha_nacimiento'];
    $sexo = $_POST['sexo'];
    $direccion = $_POST['direccion'];
    $email = $_POST['email'];
    $telefono = $_POST['telefono'];
    $carrera = $_POST['carrera'];
    $trayecto = $_POST['trayecto'];
    $seccion = $_POST['seccion'];

    $sql_update = "UPDATE clientes SET cedula='$cedula', nombre='$nombre', apellido='$apellido', fecha_nacimiento='$fecha_nacimiento', sexo='$sexo', direccion='$direccion', email='$email', telefono='$telefono', carrera='$carrera', trayecto='$trayecto', seccion='$seccion' WHERE id_cliente=$id_cliente";

    if ($conn->query($sql_update) === TRUE) {
        echo "<script>alert('Cliente actualizado exitosamente');</script>";
        echo "<script>window.location.href = 'consultar.php';</script>";
    } else {
        echo "Error: " . $sql_update . "<br>" . $conn->error;
    }
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editar Cliente</title>
    <link rel="shortcut icon" href="../favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
<div class="container">
    <h1>Editar Cliente</h1>
    <form action="editar.php?id=<?php echo $id_cliente; ?>" method="POST">
        <div class="grupo-formulario">
            <label for="cedula">Cédula:</label>
            <input type="text" id="cedula" name="cedula" value="<?php echo $cliente['cedula']; ?>" required>
        </div>
        <div class="grupo-formulario">
            <label for="nombre">Nombre:</label>
            <input type="text" id="nombre" name="nombre" value="<?php echo $cliente['nombre']; ?>" required>
        </div>
        <div class="grupo-formulario">
            <label for="apellido">Apellido:</label>
            <input type="text" id="apellido" name="apellido" value="<?php echo $cliente['apellido']; ?>" required>
        </div>
        <div class="grupo-formulario">
            <label for="fecha_nacimiento">Fecha de Nacimiento:</label>
            <input type="date" id="fecha_nacimiento" name="fecha_nacimiento" value="<?php echo $cliente['fecha_nacimiento']; ?>" required>
        </div>
        <div class="grupo-formulario">
            <label for="sexo">Sexo:</label>
            <select id="sexo" name="sexo" required>
                <option value="M" <?php if ($cliente['sexo'] == 'M') echo 'selected'; ?>>Masculino</option>
                <option value="F" <?php if ($cliente['sexo'] == 'F') echo 'selected'; ?>>Femenino</option>
            </select>
        </div>
        <div class="grupo-formulario">
            <label for="direccion">Dirección:</label>
            <input type="text" id="direccion" name="direccion" value="<?php echo $cliente['direccion']; ?>">
        </div>
        <div class="grupo-formulario">
            <label for="email">Correo Electrónico:</label>
            <input type="email" id="email" name="email" value="<?php echo $cliente['email']; ?>">
        </div>
        <div class="grupo-formulario">
            <label for="telefono">Teléfono:</label>
            <input type="text" id="telefono" name="telefono" value="<?php echo $cliente['telefono']; ?>">
        </div>
        <div class="grupo-formulario">
            <label for="carrera">Carrera:</label>
            <select id="carrera" name="carrera">
                <option value="informatica" <?php if ($cliente['carrera'] == 'informatica') echo 'selected'; ?>>PNF Informática</option>
                <option value="administracion" <?php if ($cliente['carrera'] == 'administracion') echo 'selected'; ?>>PNF Administración</option>
                <option value="agroalimentacion" <?php if ($cliente['carrera'] == 'agroalimentacion') echo 'selected'; ?>>PNF Agroalimentación</option>
                <option value="contaduria" <?php if ($cliente['carrera'] == 'contaduria') echo 'selected'; ?>>PNF Contaduría</option>
            </select>
        </div>
        <div class="grupo-formulario">
            <label for="trayecto">Trayecto:</label>
            <select id="trayecto" name="trayecto">
                <option value="1" <?php if ($cliente['trayecto'] == '1') echo 'selected'; ?>>1</option>
                <option value="2" <?php if ($cliente['trayecto'] == '2') echo 'selected'; ?>>2</option>
                <option value="3" <?php if ($cliente['trayecto'] == '3') echo 'selected'; ?>>3</option>
                <option value="4" <?php if ($cliente['trayecto'] == '4') echo 'selected'; ?>>4</option>
            </select>
        </div>
        <div class="grupo-formulario">
            <label for="seccion">Sección:</label>
            <input type="text" id="seccion" name="seccion" value="<?php echo $cliente['seccion']; ?>">
        </div>
        <input type="submit" value="Actualizar">
    </form>
</div>
</body>
</html>
