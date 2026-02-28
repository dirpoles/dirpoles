$(function () {
    // Event listener para el botón de "Ver Perfil"
    $('#btnVerPerfil').on('click', function (e) {
        e.preventDefault();

        // Obtener el ID del empleado desde la sesión (almacenado en el DOM)
        const idEmpleado = $('#user_id').data('id');

        if (!idEmpleado) {
            AlertManager.error('Error', 'No se pudo obtener el ID del usuario');
            return;
        }

        // Llamar a la función verPerfil
        verPerfil(idEmpleado);
    });
});

/**
 * Función para mostrar los detalles del perfil del empleado
 * @param {number} id - ID del empleado
 */
function verPerfil(id) {
    //Mostrar modal inmediatamente con el spinner
    const modalElement = document.getElementById('modalPerfil');
    const modal = new bootstrap.Modal(modalElement);

    //Limpiar y mostrar spinner en el body del modal
    $('#modalPerfil .modal-body').html(`
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3 text-muted">Cargando información del perfil...</p>
        </div>
    `);

    //Mostrar modal
    modal.show();

    $.ajax({
        url: 'perfil_detalle',
        method: 'GET',
        data: { id_empleado: id },
        dataType: 'json',
        success: function (response) {

            // Verificar si hay datos
            if (!response.exito || !response.data) {
                $('#modalPerfil .modal-body').html(`
                    <div class="alert alert-warning m-4">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        ${response.mensaje || 'No se encontraron datos para este perfil.'}
                    </div>
                `);
                return;
            }
            const perfil = response.data;

            //Generar contenido del modal
            const modalContent = modalVerPerfil(perfil);

            //Mostrar modal
            $('#modalPerfil .modal-body').html(modalContent);
        },
        error: function (xhr, status, error) {
            console.error('Error en la solicitud:', error);

            //Mostrar error en el modal
            $('#modalPerfil .modal-body').html(`
                <div class="alert alert-danger m-4" role="alert">
                    <div class="d-flex align-items-center">
                        <i class="fas fa-exclamation-triangle fa-2x me-3"></i>
                        <div>
                            <h5 class="alert-heading">Error al cargar los datos</h5>
                            <p class="mb-0">No se pudo obtener la información del perfil. Código de error: ${xhr.status}</p>
                            <p class="mb-0 small">${error}</p>
                        </div>
                    </div>
                    <div class="mt-3 text-center">
                        <button class="btn btn-outline-danger" onclick="verPerfil(${id})">
                            <i class="fas fa-redo me-1"></i> Reintentar
                        </button>
                    </div>
                </div>
            `);
        }
    });
}

/**
 * Genera el contenido HTML para el modal de detalles del perfil
 * @param {Object} perfil - Objeto con los datos del perfil
 * @returns {string} HTML del contenido del modal
 */
function modalVerPerfil(perfil) {
    return `
        <div class="container-fluid p-4">
            <div class="row g-4">
                <!-- Información Personal -->
                <div class="col-12">
                    <div class="card border-0 shadow-sm">
                        <div class="card-body">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="text-muted small mb-1">Nombre</label>
                                    <p class="fw-bold mb-0">${perfil.nombre || 'N/A'}</p>
                                </div>
                                <div class="col-md-6">
                                    <label class="text-muted small mb-1">Apellido</label>
                                    <p class="fw-bold mb-0">${perfil.apellido || 'N/A'}</p>
                                </div>
                                <div class="col-md-6">
                                    <label class="text-muted small mb-1">Cédula</label>
                                    <p class="fw-bold mb-0">${perfil.cedula_completa || 'N/A'}</p>
                                </div>
                                <div class="col-md-6">
                                    <label class="text-muted small mb-1">Tipo de Empleado</label>
                                    <p class="fw-bold mb-0">${perfil.tipo || 'N/A'}</p>
                                </div>
                                <div class="col-md-6">
                                    <label class="text-muted small mb-1">Correo Electrónico</label>
                                    <p class="fw-bold mb-0">${perfil.correo || 'N/A'}</p>
                                </div>
                                <div class="col-md-6">
                                    <label class="text-muted small mb-1">Teléfono</label>
                                    <p class="fw-bold mb-0">${perfil.telefono || 'N/A'}</p>
                                </div>
                                <div class="col-md-6">
                                    <label class="text-muted small mb-1">Dirección</label>
                                    <p class="fw-bold mb-0">${perfil.direccion || 'N/A'}</p>
                                </div>
                                <div class="col-md-6">
                                    <label class="text-muted small mb-1">Estatus</label>
                                    <p class="fw-bold mb-0">${perfil.estatus || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}
