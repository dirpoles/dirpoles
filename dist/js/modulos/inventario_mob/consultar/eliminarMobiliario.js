/**
 * Función para eliminar un mobiliario
 * @param {number} id - ID del mobiliario a eliminar
 */
function eliminarMobiliario(id) {
    Swal.fire({
        title: '¿Está seguro?',
        text: '¿Está seguro de eliminar este mobiliario? Esta acción no se puede deshacer.',
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
            await ejecutarEliminacionMobiliario(id);
        }
    }).catch((error) => {
        console.error('Error en el modal de confirmación:', error);
    });
}

/**
 * Ejecuta la eliminación del mobiliario vía AJAX
 * @param {number} id - ID del mobiliario
 */
async function ejecutarEliminacionMobiliario(id) {
    try {
        const response = await fetch('mobiliario_eliminar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: new URLSearchParams({
                id_mobiliario: id
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
                timer: 1500,
                showConfirmButton: false,
                timerProgressBar: true
            });

            // Recargar DataTable
            if ($.fn.DataTable.isDataTable('#tabla_mobiliario')) {
                $('#tabla_mobiliario').DataTable().ajax.reload(null, false);
            }
        } else {
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.mensaje || 'Error al eliminar el mobiliario',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#3085d6'
            });
        }
    } catch (error) {
        console.error('Error al eliminar el mobiliario:', error);

        Swal.close();

        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error inesperado al eliminar el mobiliario',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#3085d6'
        });
    }
}
