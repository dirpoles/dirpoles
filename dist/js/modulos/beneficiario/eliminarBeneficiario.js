// dist/js/modulos/beneficiario/eliminarBeneficiario.js

/**
 * Función para eliminar un beneficiario
 * @param {number} id - ID del beneficiario a eliminar
 */
function eliminarBeneficiario(id) {
    Swal.fire({
        title: '¿Está seguro?',
        text: '¿Está seguro de eliminar este beneficiario? Esta acción no se puede deshacer.',
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
 * Ejecuta la eliminación del beneficiario vía AJAX
 * @param {number} id - ID del beneficiario
 */
async function ejecutarEliminacion(id) {
    try {
        // Enviar solicitud de eliminación
        const response = await fetch('beneficiario_eliminar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: new URLSearchParams({
                id_beneficiario: id
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

            recargarTablaDespuesDeEliminar();

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
                text: data.error || data.mensaje || 'Error al eliminar el beneficiario',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#3085d6'
            });
        }

    } catch (error) {
        console.error('Error al eliminar beneficiario:', error);

        Swal.close();

        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error inesperado al eliminar el beneficiario',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#3085d6'
        });
    }
}

/**
 * Recarga la tabla después de eliminar un beneficiario
 */
function recargarTablaDespuesDeEliminar() {
    // Verificar si existe la instancia de DataTable
    if (window.dataTableInstance && typeof window.dataTableInstance.ajax.reload === 'function') {
        window.dataTableInstance.ajax.reload(null, false);
        console.log('DataTable recargada después de eliminar beneficiario');
    }
    // Intentar usar la función global
    else if (typeof recargarTablaBeneficiarios === 'function') {
        recargarTablaBeneficiarios();
    }
    // Si nada funciona, recargar la página
    else {
        console.warn('No se encontró método para recargar la tabla, recargando página...');
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    }
}

// Asegurar que la función esté disponible globalmente
if (typeof window !== 'undefined') {
    window.eliminarBeneficiario = eliminarBeneficiario;
}