/**
 * Función para eliminar un horario especifico
 * @param {number} id - ID del horario a eliminar
 */
function eliminarHorario(id) {
    Swal.fire({
        title: '¿Está seguro?',
        text: '¿Está seguro de eliminar este horario? Esta acción no se puede deshacer.',
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
 * Ejecuta la eliminación del horario vía AJAX
 * @param {number} id - ID del horario
 */
async function ejecutarEliminacion(id) {
    try {
        // Enviar solicitud de eliminación
        const response = await fetch('eliminar_horario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: new URLSearchParams({
                id_horario: id
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

            // Recargar la pagina
            setTimeout(() => {
                window.location.reload();
            }, 1500);

            // IMPORTANTE: Cerrar cualquier modal abierto si existe
            const modal = bootstrap.Modal.getInstance(document.querySelector('#modalGeneral'));
            if (modal) {
                modal.hide();
            }

        } else {
            // Mostrar mensaje de error
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.error || data.mensaje || 'Error al eliminar el horario',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#3085d6'
            });
        }

    } catch (error) {
        console.error('Error al eliminar horario:', error);
        Swal.close();
        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error inesperado al eliminar el horario',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#3085d6'
        });
    }
}