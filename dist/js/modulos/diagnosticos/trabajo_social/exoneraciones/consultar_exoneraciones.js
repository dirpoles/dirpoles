/**
 * Gestión de consulta de Exoneraciones
 * Maneja los eventos de Ver, Editar y Eliminar para el módulo de Exoneraciones
 */

$(function () {
    asignarEventosBotones();
});

/**
 * Asigna eventos a los botones de acción de la tabla
 * Usa delegación de eventos para manejar elementos dinámicos
 */
function asignarEventosBotones() {
    // Asignar eventos con delegación (SIN eliminar eventos previos para no interferir con otros módulos)
    $(document).on('click', '.btn-ver', function () {
        const id = $(this).data('id');
        const tipo = $(this).data('tipo');

        // Solo ejecutar si es del tipo 'exoneraciones'
        if (tipo === 'exoneraciones') {
            verExoneracion(id, tipo);
        }
    });

    $(document).on('click', '.btn-editar', function () {
        const id = $(this).data('id');
        const tipo = $(this).data('tipo');

        // Solo ejecutar si es del tipo 'exoneraciones'
        if (tipo === 'exoneraciones') {
            editarExoneracion(id, tipo);
        }
    });

    $(document).on('click', '.btn-eliminar', function () {
        const id = $(this).data('id');
        const tipo = $(this).data('tipo');
        const idSolicitud = $(this).data('id-solicitud');

        // Solo ejecutar si es del tipo 'exoneraciones'
        if (tipo === 'exoneraciones') {
            eliminarExoneracion(id, idSolicitud);
        }
    });
}

/**
 * Eliminar una exoneración
 * @param {number} id - ID de la exoneración
 * @param {number} idSolicitud - ID de la solicitud de servicio
 */
function eliminarExoneracion(id, idSolicitud) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción eliminará la exoneración y su solicitud de servicio asociada",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch('exoneracion_eliminar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: `id_exoneracion=${id}&id_solicitud_serv=${idSolicitud}`
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
                    AlertManager.error('Error de conexión', 'No se pudo eliminar la exoneración');
                });

        }
    });
}
