document.getElementById('buscar-usuario').addEventListener('click', function() {
    const buscarCampo = document.getElementById('buscar-campo').value;
    fetch(`buscar_usuario.php?buscar=${buscarCampo}`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('resultado-busqueda').innerHTML = data;
        });
});

document.getElementById('ver-todos').addEventListener('click', function() {
    fetch('buscar_usuario.php?buscar=')
        .then(response => response.text())
        .then(data => {
            document.getElementById('resultado-busqueda').innerHTML = data;
        });
});

function cargarUsuario(id) {
    fetch(`cargar_usuario.php?id=${id}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('cedula').value = data.cedula;
            document.getElementById('nombre').value = data.nombre;
            document.getElementById('apellido').value = data.apellido;
            document.getElementById('fecha_nacimiento').value = data.fecha_nacimiento;
            document.getElementById('direccion').value = data.direccion;
            document.getElementById('email').value = data.email;
            document.getElementById('rol').value = data.rol;
            document.getElementById('usuario').value = data.usuario;
            document.getElementById('clave').value = data.clave;
            // Bloquear campos
            document.querySelectorAll('input').forEach(input => input.disabled = true);
            // Mostrar botón de editar
            document.getElementById('editar').style.display = 'block';
        });
}

document.getElementById('editar').addEventListener('click', function() {
    document.querySelectorAll('input').forEach(input => input.disabled = false);
    document.getElementById('editar').style.display = 'none';
});
