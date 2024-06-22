<?php
    include 'conexion_be.php';

    $usuario = $_POST['usuario'];
    $clave = $_POST['clave'];
    
    $query = "INSERT INTO usuarios(usuario, clave) 
              VALUES('$usuario', '$clave')";

    $ejecutar = mysqli_query($conexion, $query);

    if($ejecutar){
        echo '
            <script>
                alert("Usuario almacenado exitosamente");
                window.location = "../index.php";
            </script>
        ';
    }else{
        echo '
            <script>
                alert("Inténtalo de nuevo, Usuario no almacenado");
                window.location = "../index.php";
            </script>
        ';
    }

    mysqli_close($conexion);

?>