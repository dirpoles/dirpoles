/**
 * Función para eliminar una ficha técnica
 * @param {number} id - ID de la ficha técnica a eliminar
 */
function eliminarFichaTecnica(id) {
    Swal.fire({
        title: '¿Está seguro?',
        text: '¿Está seguro de eliminar esta ficha técnica? Esta acción no se puede deshacer.',
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
            await ejecutarEliminacionFicha(id);
        }
    }).catch((error) => {
        console.error('Error en el modal de confirmación:', error);
    });
}

/**
 * Ejecuta la eliminación de la ficha técnica vía AJAX
 * @param {number} id - ID de la ficha técnica
 */
async function ejecutarEliminacionFicha(id) {
    try {
        const response = await fetch('ficha_eliminar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: new URLSearchParams({
                id_ficha: id
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
                title: 'Eliminada',
                text: data.mensaje,
                timer: 1500,
                showConfirmButton: false,
                timerProgressBar: true
            });

            // Recargar DataTable
            if ($.fn.DataTable.isDataTable('#tabla_fichas')) {
                $('#tabla_fichas').DataTable().ajax.reload(null, false);
            }
        } else {
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.mensaje || 'Error al eliminar la ficha técnica',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#3085d6'
            });
        }
    } catch (error) {
        console.error('Error al eliminar la ficha técnica:', error);

        Swal.close();

        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error inesperado al eliminar la ficha técnica',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#3085d6'
        });
    }
}
