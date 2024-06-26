<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Administrador</title>
    <link rel="shortcut icon" href="imagenes/favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="css/estilos.css">
</head>
<body>
    <div class="contenedor">
        <nav class="nav">
            <ul class="list">
                <div class="profile">
                    <img src="imagenes/usuario.png" class="user__profile">
                <div class="titles">
                    <h2 class="h--title">Administrador</h2>
                    <h2 class="h--title2">Jefe</h2>
                </div>
                </div>
    
                <li class="list__item">
                    <div class="list__button">
                        <img src="imagenes/home.svg" class="list__img">
                        <a href="#" class="nav__link">Inicio</a>
                    </div>
                </li>
    <!--Clientes-->
                <li class="list__item list__item--click">
                    <div class="list__button list__button--click">
                        <img src="imagenes/user.svg" class="list__img">
                        <a href="#" class="nav__link">Clientes</a>
                        <img src="imagenes/arrow.svg" class="list__arrow">
                    </div>
    
    <!--Submenu-->
                    <ul class="list__show">
                        <li class="list__inside">
                            <a href="cliente/index.php" class="nav__link nav__link--inside">Crear</a>
                        </li>
    
                        <li class="list__inside">
                            <a href="cliente/consultar" class="nav__link nav__link--inside">Consultar</a>
                        </li>
                    </ul>
                </li>
    <!--Reportes-->
                <li class="list__item list__item--click">
                    <div class="list__button list__button--click">
                        <img src="imagenes/library.svg" class="list__img">
                        <a href="#" class="nav__link">Reportes</a>
                        <img src="imagenes/arrow.svg" class="list__arrow">
                    </div>
    
    <!--Submenu-->
                    <ul class="list__show">
                        <li class="list__inside">
                            <a href="#" class="nav__link nav__link--inside">Crear</a>
                        </li>
    
                        <li class="list__inside">
                            <a href="#" class="nav__link nav__link--inside">Consultar</a>
                        </li>
                    </ul>
                </li>
    <!--Usuario-->
                <li class="list__item list__item--click">
                    <div class="list__button list__button--click">
                        <img src="imagenes/user-plus.svg" class="list__img">
                        <a href="#" class="nav__link">Usuario</a>
                        <img src="imagenes/arrow.svg" class="list__arrow">
                    </div>
    
    <!--Submenu-->
                    <ul class="list__show">
                        <li class="list__inside">
                            <a href="usuario.php" class="nav__link nav__link--inside">Crear</a>
                        </li>
    
                        <li class="list__inside">
                            <a href="#" class="nav__link nav__link--inside">Consultar</a>
                        </li>
                    </ul>
                </li>
    <!--Citas-->
                <li class="list__item list__item--click">
                    <div class="list__button list__button--click">
                        <img src="imagenes/calendar.svg" class="list__img">
                        <a href="#" class="nav__link">Citas</a>
                        <img src="imagenes/arrow.svg" class="list__arrow">
                    </div>
    
    <!--Submenu-->
                    <ul class="list__show">
                        <li class="list__inside">
                            <a href="#" class="nav__link nav__link--inside">Crear</a>
                        </li>
    
                        <li class="list__inside">
                            <a href="#" class="nav__link nav__link--inside">Consultar</a>
                        </li>
                    </ul>
                </li>

                <div class="logout--div">
                    <li class="list__item list__item--logout">
                        <div class="list__button list__button--click">
                            <img src="imagenes/logout.svg" class="list__img">
                            <a href="#" class="nav__link">Cerrar sesión</a>
                        </div>
                    </li>
                </div>
                

            </ul>
        </nav>

        <div class="container--right">
            <div class="container-title">
                <h1>Citas</h1>
            </div>
            <div class="contenido--low">
                <div class="calendario">

<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "citas";

$mysqli = new mysqli($servername, $username, $password, $dbname);

if ($mysqli->connect_error) {
    die("Error de conexión: " . $mysqli->connect_error);
}

function build_calendar($month, $year, $mysqli) {
    $daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    $firstDayOfMonth = mktime(0, 0, 0, $month, 1, $year);
    $numberDays = date('t', $firstDayOfMonth);
    $dateComponents = getdate($firstDayOfMonth);
    $monthName = $dateComponents['month'];
    $dayOfWeek = $dateComponents['wday'];
    $dateToday = date('Y-m-d');

    $calendar = "<h2>$monthName $year</h2>";
    $calendar .= "<table>";
    $calendar .= "<tr>";

    foreach($daysOfWeek as $day) {
        $calendar .= "<th>$day</th>";
    }

    $calendar .= "</tr><tr>";

    if ($dayOfWeek > 0) {
        $calendar .= str_repeat('<td></td>', $dayOfWeek);
    }

    $currentDay = 1;

    while ($currentDay <= $numberDays) {
        if ($dayOfWeek == 7) {
            $dayOfWeek = 0;
            $calendar .= "</tr><tr>";
        }

        $currentDate = "$year-$month-" . str_pad($currentDay, 2, '0', STR_PAD_LEFT);
        $calendar .= "<td><div class='day-number'>$currentDay</div>";

        $stmt = $mysqli->prepare("SELECT id, descripcion FROM citas WHERE fecha = ?");
        $stmt->bind_param("s", $currentDate);
        $stmt->execute();
        $result = $stmt->get_result();

        $citas_count = $result->num_rows;

        while ($row = $result->fetch_assoc()) {
            $calendar .= "<div class='cita' onclick='showDetails(" . $row['id'] . ")'>" . $row['descripcion'] . "</div>";
        }

        $stmt->close();

        if ($citas_count < 3) {
            $calendar .= "<form method='POST' action='add_cita.php'>
                            <input type='hidden' name='date' value='$currentDate'>
                            <input type='text' name='descripcion' required>
                            <input type='submit' value='Agregar'>
                          </form>";
        } else {
            $calendar .= "<div class='limit'>Máximo de citas alcanzado</div>";
        }

        $calendar .= "</td>";

        $currentDay++;
        $dayOfWeek++;
    }

    if ($dayOfWeek != 7) {
        $remainingDays = 7 - $dayOfWeek;
        $calendar .= str_repeat('<td></td>', $remainingDays);
    }

    $calendar .= "</tr>";
    $calendar .= "</table>";

    return $calendar;
}

$dateComponents = getdate();
$month = $dateComponents['mon'];
$year = $dateComponents['year'];

echo build_calendar($month, $year, $mysqli);

$mysqli->close();
?>
</div>
      </div>       
        </div>
    </div>
    

    <script src="scripts/main.js"></script>
</body>
</html>
