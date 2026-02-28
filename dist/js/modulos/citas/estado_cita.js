/**
 * Función para mostrar los detalles de una cita en un modal
 * @param {number} id - ID de la cita
 * @param {number} id_beneficiario - ID del beneficiario
 */

async function actualizarEstadoCita(id_cita, id_beneficiario) {
    try {
        const response = await fetch('obtener_estados_cita', {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({ id_cita: id_cita, id_beneficiario: id_beneficiario })
        });

        if (!response.ok) throw new Error('Error HTTP');

        const data = await response.json();

        if (!data.exito) {
            Swal.fire('Error', data.mensaje, 'error');
            return;
        }

        const modal = document.getElementById('modalCita');
        const modalBody = modal.querySelector('.modal-body');

        modalBody.innerHTML = generarModalEstadoCita(data, id_beneficiario);

        // Título y subtítulo dinámicos (opcional pero recomendado)
        document.getElementById('modalCitaTitle').textContent = 'Cambiar estado de la cita';
        document.getElementById('modalCitaSubtitle').textContent = 'Seleccione el nuevo estado';

        // Mostrar modal
        new bootstrap.Modal(modal).show();


    } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudo cargar el estado de la cita', 'error');
    }
}

function generarModalEstadoCita(data, id_beneficiario) {
    const opciones = data.estados.map(e => `
        <option value="${e.id_estado}" ${e.id_estado == data.estado_actual ? 'selected' : ''}>
            ${e.nombre}
        </option>
    `).join('');

    return `
        <form id="formEstadoCita">
            <div class="mb-3">
                <label class="form-label fw-bold d-block mb-2">
                    <i class="fas fa-calendar-check me-2 text-primary"></i> Estado de la Cita
                </label>

                <div class="d-flex flex-wrap gap-2 justify-content-center">
                    <!-- Pendiente -->
                    <input type="radio" class="btn-check" name="estatus" id="estado1" value="1" required>
                    <label class="btn btn-outline-warning" for="estado1">
                        <i class="fas fa-clock me-1"></i> Pendiente
                    </label>

                    <!-- Confirmada -->
                    <input type="radio" class="btn-check" name="estatus" id="estado2" value="2">
                    <label class="btn btn-outline-info" for="estado2">
                        <i class="fas fa-check-circle me-1"></i> Confirmada
                    </label>

                    <!-- Atendida -->
                    <input type="radio" class="btn-check" name="estatus" id="estado3" value="3">
                    <label class="btn btn-outline-success" for="estado3">
                        <i class="fas fa-user-check me-1"></i> Atendida
                    </label>

                    <!-- Cancelada -->
                    <input type="radio" class="btn-check" name="estatus" id="estado4" value="4">
                    <label class="btn btn-outline-danger" for="estado4">
                        <i class="fas fa-times-circle me-1"></i> Cancelada
                    </label>

                    <!-- No asistió -->
                    <input type="radio" class="btn-check" name="estatus" id="estado5" value="5">
                    <label class="btn btn-outline-secondary" for="estado5">
                        <i class="fas fa-user-slash me-1"></i> No asistió
                    </label>
                </div>
            </div>

            <input type="hidden" name="id_cita" value="${data.id_cita}">
            <input type="hidden" name="id_beneficiario" value="${id_beneficiario}">

            <div class="modal-footer d-flex justify-content-between">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                    <i class="fas fa-times me-1"></i> Cancelar
                </button>
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save me-1"></i> Actualizar Estado
                </button>
            </div>
        </form>
    `;
}

document.addEventListener('submit', async function (e) {
    if (e.target.id !== 'formEstadoCita') return;

    e.preventDefault();

    const formData = new FormData(e.target);

    try {
        const response = await fetch('actualizar_estado_cita', {
            method: 'POST',
            body: formData,
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        });

        const data = await response.json();

        if (!data.exito) {
            Swal.fire('Error', data.mensaje, 'error');
            return;
        }

        Swal.fire('Éxito', data.mensaje, 'success')
            .then(() => {
                $('#modalCita').modal('hide');
                // Recargar DataTable con Ajax
                if (window.dataTableInstance) {
                    window.dataTableInstance.ajax.reload(null, false);
                } else if ($.fn.DataTable.isDataTable('#tabla_citas')) {
                    $('#tabla_citas').DataTable().ajax.reload(null, false);
                }
            });

    } catch (error) {
        Swal.fire('Error', 'Error al actualizar el estado', 'error');
    }
});


