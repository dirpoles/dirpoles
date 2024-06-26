<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/login.css"> 
    <title>Login</title>
</head>
<body>
    <div class="contenedor">
        <form action="login_usuario_be.php" method="POST">
        <h2>¡Bienvenido al inicio de sesión!</h2>
        <?php
        
        if (isset($_GET['error'])) {
            $error = $_GET['error'];
            if ($error == "user") {
                echo "<div class='error'><p>Usuario no encontrado</p></div>";
            } elseif ($error == "password") {
                echo "<div class='error'><p>Contraseña incorrecta</p></div>";
            } elseif ($error == "sql") {
                echo "<div class='error'><p>Error en la consulta SQL</p></div>";
            }
        }
        ?>
        <label class="user" for="usuario">Nombre de Usuario</label>
        <input type="text" id="usuario" name="usuario" required>
        <label class="pass" for="clave">Contraseña</label>
        <input type="password" id="clave" name="clave" required>
        <div class="button">
            <button type="submit">Iniciar sesión</button>
        </div>
        <p>Bienestar estudiantil de la Universidad Politécnica Territorial Andrés Eloy Blanco</p>
        </form>
    </div>
</body>
</html>
