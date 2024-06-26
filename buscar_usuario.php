<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "nombre_de_tu_base_de_datos";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

$criterio = '';
if (isset($_GET['criterio'])) {
    $criterio = $conn->real_escape_string($_GET['criterio']);
}

$sql = "SELECT * FROM usuarios WHERE id LIKE '%$criterio%' OR cedula LIKE '%$criterio%' OR nombre LIKE '%$criterio%' OR usuario LIKE '%$criterio%'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo "<table border='1'>";
    echo "<tr><th>ID</th><th>Cédula</th><th>Nombre</th><th>Apellido</th><th>Fecha de Nacimiento</th><th>Edad</th><th>Dirección</th><th>Email</th><th>Rol</th><th>Usuario</th></tr>";
    while ($row = $result->fetch_assoc()) {
        echo "<tr>";
        echo "<td>" . $row['id'] . "</td>";
        echo "<td>" . $row['cedula'] . "</td>";
        echo "<td>" . $row['nombre'] . "</td>";
        echo "<td>" . $row['apellido'] . "</td>";
        echo "<td>" . $row['fecha_nacimiento'] . "</td>";
        echo "<td>" . $row['edad'] . "</td>";
        echo "<td>" . $row['direccion'] . "</td>";
        echo "<td>" . $row['email'] . "</td>";
        echo "<td>" . $row['rol'] . "</td>";
        echo "<td>" . $row['usuario'] . "</td>";
        echo "</tr>";
    }
    echo "</table>";
} else {
    echo "No se encontraron resultados.";
}

$conn->close();
?>
