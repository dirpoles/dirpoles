
<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "clientes_db";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Obtener datos del formulario y validar
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

$errors = [];

// Validar cédula
if (!preg_match('/^\d+$/', $cedula)) {
    $errors[] = "La cédula solo debe contener números.";
}

// Validar nombre y apellido
if (!preg_match('/^[a-zA-Z\s]+$/', $nombre)) {
    $errors[] = "El nombre solo debe contener letras y espacios.";
}
if (!preg_match('/^[a-zA-Z\s]+$/', $apellido)) {
    $errors[] = "El apellido solo debe contener letras y espacios.";
}

// Validar email
if ($email && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Ingrese un correo electrónico válido.";
}

// Validar teléfono
if ($telefono && !preg_match('/^\d+$/', $telefono)) {
    $errors[] = "El teléfono solo debe contener números.";
}

// Si hay errores, mostrar los errores y detener el proceso
if (!empty($errors)) {
    echo '<div class="error-message">';
    foreach ($errors as $error) {
        echo "<p>$error</p>";
    }
    echo '</div>';
    echo '<script>
            setTimeout(function() {
                window.location.href = "index.php";
            }, 3000);
          </script>';
    exit();
}

// Verificar si el cliente ya existe por la cédula
$sql_check = "SELECT id_cliente FROM clientes WHERE cedula = '$cedula'";
$result_check = $conn->query($sql_check);

if ($result_check->num_rows > 0) {
   $message = '<div style="text-align: center; margin: auto; padding: 20px; background-color: #ffe0e0; color: #aa0000; font-size: 20px; width: fit-content;">Ya existe una persona con la cédula ' . $cedula . ' en la base de datos.</div>';
echo $message;

    
    
} else {
    // Insertar datos en la tabla
    $sql_insert = "INSERT INTO clientes (cedula, nombre, apellido, fecha_nacimiento, sexo, direccion, email, telefono, carrera, trayecto, seccion)
    VALUES ('$cedula', '$nombre', '$apellido', '$fecha_nacimiento', '$sexo', '$direccion', '$email', '$telefono', '$carrera', '$trayecto', '$seccion')";

    if ($conn->query($sql_insert) === TRUE) {
        
        $message = '<div style="text-align: center; margin: auto; padding: 20px; background-color: #e0f0ff; color: #0000aa; font-size: 20px; width: fit-content;">Agregado exitosamente.</div>';
echo $message;

        
    } else {
        echo '<div class="error-message">';
        echo "Error: " . $sql_insert . "<br>" . $conn->error;
        echo '</div>';
    }
}

$conn->close();

echo '<script>
        setTimeout(function() {
            window.location.href = "index.php";
        }, 3000);
      </script>';
?>
