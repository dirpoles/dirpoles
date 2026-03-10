
/**
 * Función para eliminar un vehiculo
 * @param {number} id - ID del vehiculo a eliminar
 */
function eliminarVehiculo(id) {
    Swal.fire({
        title: '¿Está seguro?',
        text: '¿Está seguro de eliminar este vehiculo? Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        allowOutsideClick: false,
        allowEscapeKey: false,
        reverseButtons: true,
        showCloseButton: false,
        focusCancel: true
    }).then(async (result) => {
        if (result.isConfirmed) {
            await ejecutarEliminacion(id);
        }
    }).catch((error) => {
        console.error('Error en el modal de confirmación:', error);
    });
}

/**
 * Ejecuta la eliminación del vehiculo vía AJAX
 * @param {number} id - ID del vehiculo
 */
async function ejecutarEliminacion(id) {
    try {
        // Enviar solicitud de eliminación
        const response = await fetch('vehiculo_eliminar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: new URLSearchParams({
                id_vehiculo: id
            })
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();

        Swal.close();

        if (data.exito) {
            await Swal.fire({
                icon: 'success',
                title: 'Eliminado',
                text: data.mensaje,
                showConfirmButton: false,
                timerProgressBar: true
            });

            // Recargar DataTable
            if ($.fn.DataTable.isDataTable('#tabla_vehiculos')) {
                $('#tabla_vehiculos').DataTable().ajax.reload(null, false);
            }

        } else {
            // Mostrar mensaje de error
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.error || data.mensaje || 'Error al eliminar el vehiculo',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#3085d6'
            });
        }

    } catch (error) {
        console.error('Error al eliminar vehiculo:', error);
        Swal.close();

        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error inesperado al eliminar el vehiculo',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#3085d6'
        });
    }
}