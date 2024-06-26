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


$search = isset($_POST['search']) ? $_POST['search'] : '';
$sort = isset($_GET['sort']) ? $_GET['sort'] : 'nombre';
$order = isset($_GET['order']) ? $_GET['order'] : 'ASC';

// Consulta de clientes con los filtros filtros 
$sql = "SELECT * FROM clientes WHERE nombre LIKE '%$search%' OR apellido LIKE '%$search%' OR cedula LIKE '%$search%' ORDER BY $sort $order";
$result = $conn->query($sql);

function sortOrder($column) {
    $sort = isset($_GET['sort']) ? $_GET['sort'] : 'nombre';
    $order = isset($_GET['order']) ? $_GET['order'] : 'ASC';
    return ($sort == $column && $order == 'ASC') ? 'DESC' : 'ASC';
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Consultar Clientes</title>
    <link rel="shortcut icon" href="../favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="consulta.css">
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        .container {
            width: 80%;
            margin: 0 auto;
        }
        h1 {
            text-align: center;
        }
        form {
            margin-bottom: 20px;
            text-align: center;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #f2f2f2;
            cursor: pointer;
        }
        th.sortable:hover {
            background-color: #ddd;
        }
        tbody tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        tbody tr:hover {
            background-color: #f1f1f1;
        }
        .scrollable {
            overflow-x: auto;
        }
        .btn {
            padding: 5px 10px;
            background-color: #007BFF;
            color: white;
            border: none;
            cursor: pointer;
            text-decoration: none;
        }
        .btn:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
<div class="container">
    <h1>Consultar Clientes</h1>
    <form method="POST" action="consultar.php">
        <input type="text" name="search" placeholder="Buscar por nombre, apellido o cédula" value="<?php echo $search; ?>">
        <input type="submit" value="Buscar">
    </form>
    <div class="scrollable">
        <table>
            <thead>
                <tr>
                    <th class="sortable" onclick="window.location='consultar.php?sort=cedula&order=<?php echo sortOrder('cedula'); ?>'">Cédula</th>
                    <th class="sortable" onclick="window.location='consultar.php?sort=nombre&order=<?php echo sortOrder('nombre'); ?>'">Nombre</th>
                    <th class="sortable" onclick="window.location='consultar.php?sort=apellido&order=<?php echo sortOrder('apellido'); ?>'">Apellido</th>
                    <th>Fecha de Nacimiento</th>
                    <th>Sexo</th>
                    <th>Dirección</th>
                    <th>Correo Electrónico</th>
                    <th>Teléfono</th>
                    <th>Carrera</th>
                    <th>Trayecto</th>
                    <th>Sección</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <?php
                if ($result->num_rows > 0) {
                    while($row = $result->fetch_assoc()) {
                        echo "<tr>";
                        echo "<td>" . $row['cedula'] . "</td>";
                        echo "<td>" . $row['nombre'] . "</td>";
                        echo "<td>" . $row['apellido'] . "</td>";
                        echo "<td>" . $row['fecha_nacimiento'] . "</td>";
                        echo "<td>" . $row['sexo'] . "</td>";
                        echo "<td>" . $row['direccion'] . "</td>";
                        echo "<td>" . $row['email'] . "</td>";
                        echo "<td>" . $row['telefono'] . "</td>";
                        echo "<td>" . $row['carrera'] . "</td>";
                        echo "<td>" . $row['trayecto'] . "</td>";
                        echo "<td>" . $row['seccion'] . "</td>";
                        echo "<td>
                                <a class='btn' href='editar.php?id=" . $row['id_cliente'] . "'>Editar</a>
                                <a class='btn' href='eliminar.php?id=" . $row['id_cliente'] . "' onclick='return confirm(\"¿Estás seguro de que deseas eliminar este cliente?\");'>Eliminar</a>
                              </td>";
                        echo "</tr>";
                    }
                } else {
                    echo "<tr><td colspan='12'>No se encontraron resultados</td></tr>";
                }
                ?>
            </tbody>
        </table>
    </div>
</div>
</body>
</html>

<?php
$conn->close();
?>
