<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $usuario = $_POST['usuario'];
    $clave = $_POST['clave'];

    
    $conexion = new mysqli("localhost", "root", "", "USUARIOS");

    
    if ($conexion->connect_error) {
        die("Conexión fallida: " . $conexion->connect_error);
    }

    
    $usuario = $conexion->real_escape_string($usuario);

  
    $sql = "SELECT * FROM usuarios WHERE usuario='$usuario'";
    $result = $conexion->query($sql);

    if ($result) {
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            if (password_verify($clave, $row['clave'])) {
               
                $_SESSION['usuario'] = $usuario;
                header("Location: index.php");
                exit();
            } else {
                
                header("Location: login.php?error=password");
                exit();
            }
        } else {
            
            header("Location: login.php?error=user");
            exit();
        }
    } else {
        
        header("Location: login.php?error=sql");
        exit();
    }

    $conexion->close();
} else {
    
    header("Location: login.php");
    exit();
}
?>
