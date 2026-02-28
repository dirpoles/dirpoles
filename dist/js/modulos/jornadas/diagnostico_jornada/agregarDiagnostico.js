/**
 * Genera el contenido HTML para el modal de agregar diagnóstico a un beneficiario
 * @param {string|number} id_beneficiario - ID de la relación jornada-beneficiario
 * @param {string|number} id_jornada - ID de la jornada
 * @returns {string} HTML del contenido del modal
 */
/**
 * Genera el contenido HTML para el modal de agregar diagnóstico a un beneficiario
 * @param {string|number} id_beneficiario - ID de la relación jornada-beneficiario
 * @param {string|number} id_jornada - ID de la jornada
 * @returns {string} HTML del contenido del modal
 */
function AgregarDiagnostico(id_beneficiario, id_jornada) {
    return `
        <form id="formAgregarDiagnostico" novalidate>
            <!-- Tarjeta Principal -->
            <div class="card border-0 rounded-0 bg-light">
                <div class="card-body p-4">
                    <div class="row justify-content-center">
                        <div class="col-md-10">
                            <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                                <i class="fas fa-stethoscope me-2"></i> Detalles del Diagnóstico Médico
                            </h6>
                            
                            <!-- Diagnóstico -->
                            <div class="mb-3">
                                <label for="diagnostico" class="form-label text-muted small mb-1">
                                    <i class="fas fa-notes-medical text-danger me-1"></i> Diagnóstico
                                    <span class="text-danger">*</span>
                                </label>
                                <textarea class="form-control" 
                                          id="diagnostico" 
                                          name="diagnostico" 
                                          rows="3"
                                          placeholder="Ingrese el diagnóstico del paciente..."
                                          required></textarea>
                                <div class="text-danger form-text" id="diagnosticoError"></div>
                            </div>

                            <!-- Tratamiento -->
                            <div class="mb-3">
                                <label for="tratamiento" class="form-label text-muted small mb-1">
                                    <i class="fas fa-pills text-success me-1"></i> Tratamiento
                                    <span class="text-danger">*</span>
                                </label>
                                <textarea class="form-control" 
                                          id="tratamiento" 
                                          name="tratamiento" 
                                          rows="3"
                                          placeholder="Indique el tratamiento prescrito..."
                                          required></textarea>
                                <div class="text-danger form-text" id="tratamientoError"></div>
                            </div>

                            <!-- Observaciones -->
                            <div class="mb-3">
                                <label for="observaciones" class="form-label text-muted small mb-1">
                                    <i class="fas fa-eye text-info me-1"></i> Observaciones
                                </label>
                                <textarea class="form-control" 
                                          id="observaciones" 
                                          name="observaciones" 
                                          rows="2"
                                          placeholder="Observaciones adicionales (opcional)..."></textarea>
                                <div class="text-danger form-text" id="observacionesError"></div>
                            </div>

                            <hr>

                            <!-- Sección de Insumos -->
                             <h6 class="fw-bold text-secondary mb-3 d-flex align-items-center">
                                <i class="fas fa-prescription-bottle-alt me-2"></i> Insumos Utilizados
                            </h6>
                            
                            <div class="row g-2 mb-3 align-items-end">
                                <div class="col-md-6">
                                    <label for="selectInsumo" class="form-label small text-muted">Insumo</label>
                                    <select class="form-select" id="selectInsumo">
                                        <option value="" selected disabled>Cargando insumos...</option>
                                    </select>
                                </div>
                                <div class="col-md-3">
                                    <label for="cantidadInsumo" class="form-label small text-muted">Cantidad</label>
                                    <input type="number" class="form-control" id="cantidadInsumo" min="1" disabled>
                                    <div class="form-text text-end x-small" id="stockInsumo"></div>
                                </div>
                                <div class="col-md-3">
                                    <button type="button" class="btn btn-secondary w-100" id="btnAgregarInsumo" disabled>
                                        <i class="fas fa-plus"></i> Agregar
                                    </button>
                                </div>
                            </div>

                            <div class="table-responsive mb-3">
                                <table class="table table-sm table-bordered table-hover" id="tablaInsumosAgregados">
                                    <thead class="table-light">
                                        <tr>
                                            <th>Insumo</th>
                                            <th class="text-center" width="80px">Cant.</th>
                                            <th class="text-center" width="50px"><i class="fas fa-trash"></i></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr id="noInsumosRow">
                                            <td colspan="3" class="text-center text-muted small">No se han agregado insumos</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </div>
                    
                    <!-- Campos ocultos -->
                    <input type="hidden" name="id_jornada_beneficiario" id="id_jornada_beneficiario" value="${id_beneficiario || ''}">
                    <input type="hidden" name="id_jornada" id="id_jornada_hidden" value="${id_jornada || ''}">
                </div>
            </div>
            
            <!-- Footer del Modal -->
            <div class="modal-footer border-top-0 bg-light py-3">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                    <i class="fas fa-times me-1"></i> Cancelar
                </button>
                <button type="submit" class="btn btn-primary" id="btnGuardarDiagnostico">
                    <i class="fas fa-save me-1"></i> Guardar Diagnóstico
                </button>
            </div>
        </form>
    `;
}

// Variables globales para el manejo de insumos
let insumosDisponibles = [];
let insumosSeleccionados = [];

// ==================== FUNCIONES DE VALIDACIÓN PARA DIAGNÓSTICO ====================

// Funciones auxiliares para mostrar y limpiar errores
function showErrorDiagnostico(field, msg) {
    const errorElement = document.getElementById(`${field.id}Error`);
    if (errorElement) errorElement.textContent = msg;

    field.classList.add("is-invalid");
    field.classList.remove("is-valid");
}

function clearErrorDiagnostico(field) {
    const errorElement = document.getElementById(`${field.id}Error`);
    if (errorElement) errorElement.textContent = "";

    field.classList.remove("is-invalid");
    field.classList.add("is-valid");
}

function validarDiagnostico() {
    const diagnostico = document.getElementById('diagnostico');
    let isValid = true;

    // Validar Diagnóstico
    if (!diagnostico.value.trim()) {
        showErrorDiagnostico(diagnostico, "El diagnóstico es obligatorio");
        isValid = false;
    } else if (diagnostico.value.trim().length < 5) {
        showErrorDiagnostico(diagnostico, "El diagnóstico debe tener al menos 5 caracteres");
        isValid = false;
    } else {
        clearErrorDiagnostico(diagnostico);
    }

    return isValid;
}

function validarTratamiento() {
    const tratamiento = document.getElementById('tratamiento');
    let isValid = true;
    if (!tratamiento.value.trim()) {
        showErrorDiagnostico(tratamiento, "El tratamiento es obligatorio");
        isValid = false;
    } else if (tratamiento.value.trim().length < 5) {
        showErrorDiagnostico(tratamiento, "El tratamiento debe tener al menos 5 caracteres");
        isValid = false;
    } else {
        clearErrorDiagnostico(tratamiento);
    }
    return isValid;
}

function validarObservaciones() {
    const observaciones = document.getElementById('observaciones');
    let isValid = true;
    if (!observaciones.value.trim()) {
        showErrorDiagnostico(observaciones, "Las observaciones son obligatorias");
        isValid = false;
    } else if (observaciones.value.trim().length < 5) {
        showErrorDiagnostico(observaciones, "Las observaciones deben tener al menos 5 caracteres");
        isValid = false;
    } else {
        clearErrorDiagnostico(observaciones);
    }
    return isValid;
}

// Asignar eventos de validación en tiempo real cuando el modal se abre y el formulario existe
document.addEventListener('input', async function (e) {
    if (e.target && e.target.id === 'diagnostico') {
        validarDiagnostico();
    }
    if (e.target && e.target.id === 'tratamiento') {
        validarTratamiento();
    }
    if (e.target && e.target.id === 'observaciones') {
        validarObservaciones();
    }
});

/**
 * Abre el modal para agregar un diagnóstico
 * @param {string|number} id_beneficiario 
 * @param {string|number} id_jornada 
 */
async function agregarDiagnostico(id_beneficiario, id_jornada) {
    insumosSeleccionados = []; // Resetear insumos seleccionados

    // 1. Generar HTML del formulario
    const modalContent = AgregarDiagnostico(id_beneficiario, id_jornada);

    // 2. Insertar en el modal
    const modalBody = document.querySelector('#modalDiagnostico .modal-body');
    if (modalBody) {
        modalBody.innerHTML = modalContent;
    } else {
        console.error('No se encontró el modal de diagnóstico');
        return;
    }

    // 3. Mostrar modal
    const modalElement = document.getElementById('modalDiagnostico');
    let modal = bootstrap.Modal.getInstance(modalElement);
    if (!modal) {
        modal = new bootstrap.Modal(modalElement);
    }
    modal.show();

    // 4. Cargar Insumos
    const selectInsumo = document.getElementById('selectInsumo');
    const inputCantidad = document.getElementById('cantidadInsumo');
    const spanStock = document.getElementById('stockInsumo');
    const btnAgregarInsumo = document.getElementById('btnAgregarInsumo');
    const tbody = document.querySelector('#tablaInsumosAgregados tbody');

    try {
        const response = await fetch('insumos_validos_json');
        insumosDisponibles = await response.json();

        selectInsumo.innerHTML = '<option value="" selected disabled>Seleccione un insumo</option>';
        insumosDisponibles.sort((a, b) => a.nombre_insumo.localeCompare(b.nombre_insumo));

        insumosDisponibles.forEach(insumo => {
            selectInsumo.innerHTML += `<option value="${insumo.id_insumo}" data-stock="${insumo.cantidad}">${insumo.nombre_insumo} (Stock: ${insumo.cantidad})</option>`;
        });

    } catch (error) {
        console.error('Error cargando insumos:', error);
        selectInsumo.innerHTML = '<option value="" disabled>Error al cargar insumos</option>';
    }

    // Eventos de Insumos
    selectInsumo.addEventListener('change', function () {
        const option = this.options[this.selectedIndex];
        const stock = parseInt(option.dataset.stock) || 0;

        if (stock > 0) {
            inputCantidad.disabled = false;
            inputCantidad.max = stock;
            inputCantidad.value = 1;
            btnAgregarInsumo.disabled = false;
            spanStock.textContent = `Disponible: ${stock}`;
            spanStock.className = 'form-text text-end x-small text-success';
        } else {
            inputCantidad.disabled = true;
            inputCantidad.value = '';
            btnAgregarInsumo.disabled = true;
            spanStock.textContent = 'Sin stock';
            spanStock.className = 'form-text text-end x-small text-danger';
        }
    });

    inputCantidad.addEventListener('input', function () {
        const max = parseInt(this.max);
        let val = parseInt(this.value);
        if (val > max) this.value = max;
        if (val < 1) this.value = 1;
    });

    btnAgregarInsumo.addEventListener('click', function () {
        const idInsumo = parseInt(selectInsumo.value);
        const cantidad = parseInt(inputCantidad.value);
        const option = selectInsumo.options[selectInsumo.selectedIndex];
        const nombreInsumo = option.text.split(' (Stock:')[0];

        if (!idInsumo || !cantidad) return;

        // Verificar si ya existe
        const existente = insumosSeleccionados.find(i => i.id_insumo === idInsumo);
        if (existente) {
            AlertManager.warning('Insumo ya agregado', 'Ya has agregado este insumo a la lista.');
            return;
        }

        insumosSeleccionados.push({
            id_insumo: idInsumo,
            nombre: nombreInsumo,
            cantidad: cantidad
        });

        actualizarTablaInsumos();

        // Reset campos
        selectInsumo.value = '';
        inputCantidad.value = '';
        inputCantidad.disabled = true;
        btnAgregarInsumo.disabled = true;
        spanStock.textContent = '';
    });

    function actualizarTablaInsumos() {
        tbody.innerHTML = '';
        if (insumosSeleccionados.length === 0) {
            tbody.innerHTML = '<tr id="noInsumosRow"><td colspan="3" class="text-center text-muted small">No se han agregado insumos</td></tr>';
            return;
        }

        insumosSeleccionados.forEach((insumo, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${insumo.nombre}</td>
                <td class="text-center">${insumo.cantidad}</td>
                <td class="text-center">
                    <button type="button" class="btn btn-sm btn-outline-danger btn-eliminar-insumo" data-index="${index}">
                        <i class="fas fa-times"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Event listener para botones eliminar
        const btnsEliminar = tbody.querySelectorAll('.btn-eliminar-insumo');
        btnsEliminar.forEach(btn => {
            btn.addEventListener('click', function () {
                const index = parseInt(this.dataset.index);
                insumosSeleccionados.splice(index, 1);
                actualizarTablaInsumos();
            });
        });
    }


    // 5. Configurar manejo del formulario
    const form = document.getElementById('formAgregarDiagnostico');
    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            if (!validarDiagnostico() || !validarTratamiento() || !validarObservaciones()) {
                AlertManager.warning('Formulario incompleto', 'Corrige los campos resaltados antes de continuar');
                return;
            }

            try {
                const formData = new FormData(form);
                // Agregar insumos al FormData
                formData.append('insumos', JSON.stringify(insumosSeleccionados));

                const response = await fetch('agregar_diagnostico_jornada', {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();

                if (data.exito) {
                    AlertManager.success('Éxito', 'Diagnóstico agregado correctamente');
                    modal.hide();

                    // Recargar tabla si es necesario
                    if (typeof tablaBeneficiarios !== 'undefined') {
                        tablaBeneficiarios.ajax.reload(null, false);
                    }
                } else {
                    AlertManager.error('Error', data.mensaje);
                }

                modal.hide();

            } catch (error) {
                console.error('Error:', error);
                AlertManager.error('Error', 'Ocurrió un error al procesar la solicitud');
            }
        });
    }
}
