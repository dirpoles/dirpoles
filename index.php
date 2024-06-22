<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="estilos/login.css">
    <title>Direccion de Politicas Estudiantiles</title>
</head>
<body>
    <div class="contenedor">
        <form action="php/login_usuario_be.php" method="POST">
        <h2>¡Bienvenido al inicio de sesión!</h2>
        <label class="user" for="usuario">Nombre de Usuario</label>
        <input type="text" id="usuario" name="usuario">
        <label class="pass" for="clave">Contraseña</label>
        <input type="password" id="clave" name="clave">
        <div class="button">
            <button>Iniciar sesión</button>
        </div>
        <p>Bienestar estudiantil de la Universidad Politécnica Territorial Andrés Eloy Blanco</p>
        </form>
    </div>
</body>
</html>