/**
 * Función para eliminar un equipo
 * @param {number} id - ID del equipo a eliminar
 */
function eliminarEquipo(id) {
    Swal.fire({
        title: '¿Está seguro?',
        text: '¿Está seguro de eliminar este equipo? Esta acción no se puede deshacer.',
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
            await ejecutarEliminacionEquipo(id);
        }
    }).catch((error) => {
        console.error('Error en el modal de confirmación:', error);
    });
}

/**
 * Ejecuta la eliminación del equipo vía AJAX
 * @param {number} id - ID del equipo
 */
async function ejecutarEliminacionEquipo(id) {
    try {
        const response = await fetch('equipo_eliminar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: new URLSearchParams({
                id_equipo: id
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

            if ($.fn.DataTable.isDataTable('#tabla_equipos')) {
                $('#tabla_equipos').DataTable().ajax.reload(null, false);
            }
        } else {
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.mensaje || 'Error al eliminar el equipo',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#3085d6'
            });
        }
    } catch (error) {
        console.error('Error al eliminar el equipo:', error);

        Swal.close();

        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error inesperado al eliminar el equipo',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#3085d6'
        });
    }
}
