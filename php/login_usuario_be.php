<?php

    include 'conexion_be.php';

    $usuario = $_POST['usuario'];
    $clave = $_POST['clave'];

    $validar_login = mysqli_query($conexion, "SELECT * FROM usuarios WHERE usuario='$usuario'
    and clave='$clave'");

    if(mysqli_num_rows($validar_login) > 0){
        header("location:../principal.php");
        exit;
    }else{
        echo '
            <script>
                alert("Usuario no existe, por favor verifique los datos introducidos");
                window.location = "../index.php";
            </script>
        ';
        exit;
    }
?>