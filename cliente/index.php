<?php
session_start();
if (!isset($_SESSION['usuario'])) {
    header("Location: login.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Agregar Cliente</title>
    <link rel="shortcut icon" href="../favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="estilos.css">
</head>
<script>
        function validateForm() {
            const cedula = document.getElementById('cedula').value;
            const nombre = document.getElementById('nombre').value;
            const apellido = document.getElementById('apellido').value;
            const email = document.getElementById('email').value;
            const telefono = document.getElementById('telefono').value;

            // Validar que la cedula solo contenga números
            if (!/^\d+$/.test(cedula)) {
                alert("La cédula solo debe contener números.");
                return false;
            }

            // Validar que el nombre y apellido solo contengan letras y espacios
            if (!/^[a-zA-Z\s]+$/.test(nombre)) {
                alert("El nombre solo debe contener letras y espacios.");
                return false;
            }
            if (!/^[a-zA-Z\s]+$/.test(apellido)) {
                alert("El apellido solo debe contener letras y espacios.");
                return false;
            }

            // Validar el formato del coreo
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email && !emailPattern.test(email)) {
                alert("Ingrese un correo electrónico válido.");
                return false;
            }

            // Validar que el teléfono solo contenga numeros
            if (telefono && !/^\d+$/.test(telefono)) {
                alert("El teléfono solo debe contener números.");
                return false;
            }

            return true;
        }
    </script>
<body>
    <div class="contenedor">
        <nav class="nav">
            <ul class="list">
                <div class="profile">
                    <img src="../imagenes/usuario.png" class="user__profile">
                <div class="titles">
                    <h2 class="h--title">Administrador</h2>
                    <h2 class="h--title2">Jefe</h2>
                </div>
                </div>
    
                <li class="list__item">
                    <div class="list__button">
                        <img src="../imagenes/home.svg" class="list__img">
                        <a href="#" class="nav__link">Inicio</a>
                    </div>
                </li>
    <!--Clientes-->
                <li class="list__item list__item--click">
                    <div class="list__button list__button--click">
                        <img src="../imagenes/user.svg" class="list__img">
                        <a href="#" class="nav__link">Clientes</a>
                        <img src="../imagenes/arrow.svg" class="list__arrow">
                    </div>
    
    <!--Submenu-->
                    <ul class="list__show">
                        <li class="list__inside">
                            <a href="index.php" class="nav__link nav__link--inside">Crear</a>
                        </li>
    
                        <li class="list__inside">
                            <a href="consultar.php" class="nav__link nav__link--inside">Consultar</a>
                        </li>
                    </ul>
                </li>
    <!--Reportes-->
                <li class="list__item list__item--click">
                    <div class="list__button list__button--click">
                        <img src="../imagenes/library.svg" class="list__img">
                        <a href="#" class="nav__link">Reportes</a>
                        <img src="../imagenes/arrow.svg" class="list__arrow">
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
                        <img src="../imagenes/user-plus.svg" class="list__img">
                        <a href="#" class="nav__link">Usuario</a>
                        <img src="../imagenes/arrow.svg" class="list__arrow">
                    </div>
    
    <!--Submenu-->
                    <ul class="list__show">
                        <li class="list__inside">
                            <a href="../usuario.php" class="nav__link nav__link--inside">Crear</a>
                        </li>
    
                        <li class="list__inside">
                            <a href="#" class="nav__link nav__link--inside">Consultar</a>
                        </li>
                    </ul>
                </li>
    <!--Citas-->
                <li class="list__item list__item--click">
                    <div class="list__button list__button--click">
                        <img src="../imagenes/calendar.svg" class="list__img">
                        <a href="#" class="nav__link">Citas</a>
                        <img src="../imagenes/arrow.svg" class="list__arrow">
                    </div>
    
    <!--Submenu-->
                    <ul class="list__show">
                        <li class="list__inside">
                            <a href="#" class="nav__link nav__link--inside">Crear</a>
                        </li>
    
                        <li class="list__inside">
                            <a href="../index.php" class="nav__link nav__link--inside">Consultar</a>
                        </li>
                    </ul>
                </li>

                <div class="logout--div">
                    <li class="list__item list__item--logout">
                        <div class="list__button list__button--click">
                            <img src="../imagenes/logout.svg" class="list__img">
                            <a href="#" class="nav__link">Cerrar sesión</a>
                        </div>
                    </li>
                </div>
                

            </ul>
        </nav>

        <div class="container--right">
            
            <div class="contenido--low">
             <div class="formulario">
    <h1>Formulario de Registro</h1>
    <form action="proceso.php" method="POST">
        <div class="grupo-formulario">
            <label for="cedula">Cédula:</label>
            <input type="text" id="cedula" name="cedula" maxlength="10" style="width: 150px;" required>
        </div>
        <div class="grupo-formulario">
            <label for="nombre">Nombre:</label>
            <input type="text" id="nombre" name="nombre" required>
        </div>
        <div class="grupo-formulario">
            <label for="apellido">Apellido:</label>
            <input type="text" id="apellido" name="apellido" required>
        </div>
        <div class="grupo-formulario">
            <label for="fecha_nacimiento">Fecha de Nacimiento:</label>
            <input type="date" id="fecha_nacimiento" name="fecha_nacimiento" style="width: 300px;" required>
            <label for="sexo">Sexo:</label>
            <select id="sexo" name="sexo" style="width: 120px;">
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
            </select>
            <label for="telefono">Teléfono:</label>
            <input type="text" id="telefono" name="telefono">
        </div>
        <div class="grupo-formulario">
            <label for="direccion">Dirección:</label>
            <input type="text" id="direccion" name="direccion">
        </div>
        <div class="grupo-formulario">
            <label for="email">Correo Electrónico:</label>
            <input type="email" id="email" name="email">
        </div>
        <div class="grupo-formulario">
            <label for="carrera">Carrera:</label>
            <select id="carrera" name="carrera" style="width: 700px;">
                <option value="informatica">PNF Informática</option>
                <option value="administracion">PNF Administración</option>
                <option value="agroalimentacion">PNF Agroalimentación</option>
                <option value="contaduria">PNF Contaduría</option>
            </select>
            <label for="trayecto">Trayecto:</label>
            <select id="trayecto" name="trayecto" style="width: 150px;">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
            </select>
            <label for="seccion">Sección:</label>
            <input type="text" id="seccion" name="seccion">
        </div>
        <input type="submit" value="Registrar">
    </form>
    <div id="successMessage" class="success-message"></div>
</div>   
      </div>       
        </div>
    </div>
    
<script>
        function showSuccessMessage() {
            const successMessage = document.getElementById('successMessage');
            successMessage.style.display = 'block';
            setTimeout(() => {
                successMessage.style.display = 'none';
                document.getElementById('clientForm').reset();
            }, 3000);
        }
    </script>
    <script src="../scripts/main.js"></script>
</body>
</html>
