/**
 * Gestión de consulta de Embarazadas
 * Maneja los eventos de Ver, Editar y Eliminar para el módulo de Embarazadas
 */

$(function () {
    asignarEventosBotones();
});

/**
 * Asigna eventos a los botones de acción de la tabla
 * Usa delegación de eventos para manejar elementos dinámicos
 */
function asignarEventosBotones() {
    // Asignar nuevos eventos con delegación
    $(document).on('click', '.btn-ver', function () {
        const id = $(this).data('id');
        const tipo = $(this).data('tipo');

        if (tipo == 'embarazadas') {
            verEmbarazada(id, tipo);
        }
    });

    $(document).on('click', '.btn-editar', function () {
        const id = $(this).data('id');
        const tipo = $(this).data('tipo');
        if (tipo == 'embarazadas') {
            editarEmbarazada(id, tipo);
        }
    });

    $(document).on('click', '.btn-eliminar', function () {
        const id = $(this).data('id');
        const idSolicitud = $(this).data('id-solicitud');
        const idDetallePatologia = $(this).data('id-detalle-patologia');
        const idBeneficiario = $(this).data('id-beneficiario');
        const tipo = $(this).data('tipo');

        if (tipo == 'embarazadas') {
            eliminarEmbarazada(id, idSolicitud, idDetallePatologia, idBeneficiario);
        }
    });
}

/**
 * Eliminar una embarazada
 * @param {number} id - ID de la embarazada
 * @param {number} idSolicitud - ID de la solicitud de servicio
 * @param {number} idDetallePatologia - ID de la tabla puente de la patologia
 * @param {number} idBeneficiario - ID del beneficiario
 */
function eliminarEmbarazada(id, idSolicitud, idDetallePatologia, idBeneficiario) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción eliminará el registro de embarazada y su solicitud de servicio asociada?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch('embarazada_eliminar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: `id_gestion=${id}&id_solicitud_serv=${idSolicitud}&id_detalle_patologia=${idDetallePatologia}&id_beneficiario=${idBeneficiario}`
            })
                .then(response => response.json())
                .then(data => {
                    if (data.exito) {
                        AlertManager.success('Eliminado', data.mensaje);
                        // Recargar tabla
                        $('#tabla_ts').DataTable().ajax.reload();
                    } else {
                        AlertManager.error('Error', data.mensaje);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    AlertManager.error('Error de conexión', 'No se pudo eliminar el registro de embarazada');
                });
        }
    });
}
