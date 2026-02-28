/**
 * Función para aceptar una referencia
 * @param {number} id - ID de la referencia
 * @param {number} id_empleado_origen - ID del empleado
 */
const aceptarReferencia = async (id, id_empleado_origen) => {
    try {
        const result = await AlertManager.confirm(
            '¿Deseas aceptar esta referencia?',
            'La referencia cambiará a estado "Aceptada" y se registrará en el historial.'
        );

        if (result.isConfirmed) {
            const formData = new FormData();
            formData.append('id_referencia', id);
            formData.append('estado', 'Aceptada');
            formData.append('id_empleado_origen', id_empleado_origen);

            const response = await fetch('referencia_gestionar', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.exito) {
                await AlertManager.success('Referencia aceptada correctamente');
                // Recargar tabla si existe
                // Cambia esto dentro de tus funciones aceptar/rechazar:
                if ($.fn.DataTable.isDataTable('#tabla_referencias')) {
                    $('#tabla_referencias').DataTable().ajax.reload(null, false);
                    // null, false permite recargar sin resetear la paginación actual
                }
            } else {
                await AlertManager.error(data.mensaje || 'Error al aceptar la referencia');
            }
        }
    } catch (error) {
        console.error('Error:', error);
        await AlertManager.error('Ocurrió un error al procesar la solicitud');
    }
};

/**
 * Función para rechazar una referencia
 * @param {number} id - ID de la referencia
 * @param {number} id_empleado_origen - ID del empleado
 */
const rechazarReferencia = async (id, id_empleado_origen) => {
    try {
        const result = await Swal.fire({
            title: '¿Deseas rechazar esta referencia?',
            text: 'Por favor, indica el motivo del rechazo:',
            input: 'textarea',
            inputPlaceholder: 'Escribe el motivo aquí...',
            inputAttributes: {
                'aria-label': 'Motivo del rechazo'
            },
            showCancelButton: true,
            confirmButtonText: 'Sí, rechazar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            showLoaderOnConfirm: true,
            preConfirm: (motivo) => {
                if (!motivo) {
                    Swal.showValidationMessage('Debes ingresar un motivo para rechazar');
                }
                return motivo;
            },
            allowOutsideClick: () => !Swal.isLoading()
        });

        if (result.isConfirmed) {
            const motivo = result.value;

            const formData = new FormData();
            formData.append('id_referencia', id);
            formData.append('estado', 'Rechazada');
            formData.append('observaciones', motivo);
            formData.append('id_empleado_origen', id_empleado_origen);

            const response = await fetch('referencia_gestionar', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.exito) {
                await AlertManager.success('Referencia rechazada correctamente');
                if ($.fn.DataTable.isDataTable('#tabla_referencias')) {
                    $('#tabla_referencias').DataTable().ajax.reload(null, false);
                }
            } else {
                await AlertManager.error(data.mensaje || 'Error al rechazar la referencia');
            }
        }
    } catch (error) {
        console.error('Error:', error);
        await AlertManager.error('Ocurrió un error al procesar la solicitud');
    }
};