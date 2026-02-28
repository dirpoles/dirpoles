
/**
 * Función para eliminar un diagnostico
 * @param {number} id - ID del diagnostico a eliminar
 * @param {number} idSolicitud - ID de la solicitud de servicio
 * @param {number} idDetalle - ID del detalle de la patologia
 * @param {number} idBeneficiario - ID del beneficiario
 */
function eliminarDiagnostico(id, idSolicitud, idDetalle, idBeneficiario) {
    Swal.fire({
        title: '¿Está seguro?',
        text: '¿Está seguro de eliminar este diagnostico? Esta acción no se puede deshacer.',
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
            await ejecutarEliminacion(id, idSolicitud, idDetalle, idBeneficiario);
        }
    }).catch((error) => {
        console.error('Error en el modal de confirmación:', error);
    });
}

/**
 * Ejecuta la eliminación del diagnostico vía AJAX
 * @param {number} id - ID del diagnostico
 * @param {number} idSolicitud - ID de la solicitud de servicio
 * @param {number} idDetalle - ID del detalle de la patologia
 * @param {number} idBeneficiario - ID del beneficiario
 */
async function ejecutarEliminacion(id, idSolicitud, idDetalle, idBeneficiario) {
    try {
        // Enviar solicitud de eliminación
        const response = await fetch('diagnostico_medicina_eliminar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: new URLSearchParams({
                id_consulta_med: id,
                id_solicitud_serv: idSolicitud,
                id_detalle_patologia: idDetalle,
                id_beneficiario: idBeneficiario
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
                timer: 1000,
                showConfirmButton: false,
                timerProgressBar: true
            });
            $('#modalDiagnostico').modal('hide');

            // Recargar DataTable
            if ($.fn.DataTable.isDataTable('#tabla_medicina')) {
                $('#tabla_medicina').DataTable().ajax.reload(null, false);
            }

        } else {
            // Mostrar mensaje de error
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.error || data.mensaje || 'Error al eliminar el diagnostico',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#3085d6'
            });
        }

    } catch (error) {
        console.error('Error al eliminar diagnostico:', error);

        Swal.close();

        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error inesperado al eliminar el diagnostico',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#3085d6'
        });
    }
}