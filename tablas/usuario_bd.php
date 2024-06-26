<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "usuarios";


$conn = new mysqli($servername, $username, $password);


if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}


$sql = "CREATE DATABASE IF NOT EXISTS $dbname";
if ($conn->query($sql) === TRUE) {
    echo "Base de datos creada correctamente<br>";
} else {
    echo "Error al crear la base de datos: " . $conn->error . "<br>";
}


$conn->select_db($dbname);

// Eliminar tabla si existe para evitar dolores de cabeza jajaja
$sql = "DROP TABLE IF EXISTS usuarios";
if ($conn->query($sql) === TRUE) {
    echo "Tabla de usuarios eliminada correctamente<br>";
} else {
    echo "Error al eliminar la tabla: " . $conn->error . "<br>";
}


$sql = "CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cedula VARCHAR(20) NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    edad INT NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL,
    rol VARCHAR(50) NOT NULL,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    clave VARCHAR(255) NOT NULL,
    foto LONGBLOB
)";
if ($conn->query($sql) === TRUE) {
    echo "Tabla de usuarios creada correctamente<br>";
} else {
    echo "Error al crear la tabla: " . $conn->error . "<br>";
}

// Verificar la estructura de la tabla porque batalle mas que quien sabe en esta tabla jajajaja
$sql = "DESCRIBE usuarios";
$result = $conn->query($sql);
$columns = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $columns[] = $row['Field'];
    }
}

if (in_array('cedula', $columns)) {
    // primer usuario admin
    $cedulaEjemplo = '12345678';
    $nombreEjemplo = 'Gabriel';
    $apellidoEjemplo = 'Garcia';
    $fechaNacimientoEjemplo = '1997-03-08';
    $edadEjemplo = 27;
    $direccionEjemplo = 'Direccion Ejemplo';
    $emailEjemplo = 'gabriel@abcd.com';
    $rolEjemplo = 'admin';
    $usuarioEjemplo = 'gabriel';
    $claveEjemplo = '123456';
    $claveEncriptada = password_hash($claveEjemplo, PASSWORD_DEFAULT);
    $fotoEjemplo = NULL;

    $sql = "INSERT INTO usuarios (cedula, nombre, apellido, fecha_nacimiento, edad, direccion, email, rol, usuario, clave, foto) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);
    $null = NULL;  
    $stmt->bind_param('ssssisssssb', $cedulaEjemplo, $nombreEjemplo, $apellidoEjemplo, $fechaNacimientoEjemplo, $edadEjemplo, $direccionEjemplo, $emailEjemplo, $rolEjemplo, $usuarioEjemplo, $claveEncriptada, $null);

    if ($stmt->execute() === TRUE) {
        echo "Usuario admin creado correctamente<br>";
    } else {
        echo "Error al crear el usuario de admin: " . $stmt->error . "<br>";
    }

    $stmt->close();
} 
?>
