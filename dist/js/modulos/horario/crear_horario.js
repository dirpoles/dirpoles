// Función global para ser llamada desde el modal (DataTable)
window.seleccionarPsicologo = async function(id, nombre) {
    const idEmpleadoInput = document.getElementById('id_empleado');
    const psicologoNombreInput = document.getElementById('psicologo_nombre');
    const contenedorHorarios = document.getElementById('contenedorHorarios');
    
    if (idEmpleadoInput && psicologoNombreInput) {
        idEmpleadoInput.value = id;
        psicologoNombreInput.value = nombre;
        
        // Disparar evento de carga de horarios (definido en el scope de DOMContentLoaded)
        window.dispatchEvent(new CustomEvent('psicologoSeleccionado', { detail: { id: id } }));
        
        $('#modalSeleccionarPsicologo').modal('hide');
        
        // Si no hay filas, agregar la primera automáticamente
        if (contenedorHorarios && contenedorHorarios.querySelectorAll('tr:not(.fila-vacia)').length === 0) {
            const btnAgregar = document.getElementById('btnAgregarFila');
            if (btnAgregar) btnAgregar.click();
        }
    }
};

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('formulario-horario');
    const contenedorHorarios = document.getElementById('contenedorHorarios');
    const btnAgregarFila = document.getElementById('btnAgregarFila');
    const btnRegistrarHorario = document.getElementById('btnRegistrarHorario');
    const idEmpleadoInput = document.getElementById('id_empleado');
    const psicologoNombreInput = document.getElementById('psicologo_nombre');
    const btnEliminarPsicologo = document.getElementById('btnEliminarPsicologo');

    let horarioActualPsicologo = []; // Días que ya tiene registrados en la DB

    // ========== Gestión de Filas Dinámicas ==========

    function actualizarEstadoBotonGuardar() {
        const filas = contenedorHorarios.querySelectorAll('tr:not(.fila-vacia)');
        btnRegistrarHorario.disabled = (filas.length === 0 || !idEmpleadoInput.value);
    }

    function mostrarFilaVacia() {
        if (!contenedorHorarios) return;
        const filas = contenedorHorarios.querySelectorAll('tr:not(.fila-vacia)');
        if (filas.length === 0) {
            contenedorHorarios.innerHTML = `
                <tr class="fila-vacia">
                    <td colspan="4" class="text-center text-muted py-4">
                        No has añadido ningún día. Haz clic en "Añadir un Día" para comenzar.
                    </td>
                </tr>`;
        } else {
            const filaVacia = contenedorHorarios.querySelector('.fila-vacia');
            if (filaVacia) filaVacia.remove();
        }
    }

    function agregarFila() {
        mostrarFilaVacia();
        const filasExistentes = contenedorHorarios.querySelectorAll('tr:not(.fila-vacia)').length;
        
        if (filasExistentes >= 6) {
            AlertManager.warning('Límite alcanzado', 'Solo puedes agregar hasta 6 días (Lunes a Sábado).');
            return;
        }

        const tr = document.createElement('tr');
        const idUnico = Date.now() + Math.floor(Math.random() * 1000);
        
        tr.innerHTML = `
            <td>
                <select name="horarios[${idUnico}][dia_semana]" class="form-control select-dia" required>
                    <option value="" disabled selected>Seleccione</option>
                    <option value="Lunes">Lunes</option>
                    <option value="Martes">Martes</option>
                    <option value="Miércoles">Miércoles</option>
                    <option value="Jueves">Jueves</option>
                    <option value="Viernes">Viernes</option>
                    <option value="Sábado">Sábado</option>
                </select>
                <div class="invalid-feedback">Día duplicado o ya registrado.</div>
            </td>
            <td>
                <input type="time" name="horarios[${idUnico}][hora_inicio]" class="form-control input-hora-inicio" min="07:00" max="23:59" required>
            </td>
            <td>
                <input type="time" name="horarios[${idUnico}][hora_fin]" class="form-control input-hora-fin" min="07:00" max="23:59" required>
            </td>
            <td class="text-center">
                <button type="button" class="btn btn-outline-danger btn-sm btn-remover-fila" title="Quitar este día">
                    <i class="fa-solid fa-times"></i>
                </button>
            </td>
        `;

        contenedorHorarios.appendChild(tr);
        actualizarEstadoBotonGuardar();

        // Eventos para la nueva fila
        const btnRemover = tr.querySelector('.btn-remover-fila');
        btnRemover.addEventListener('click', () => {
            tr.remove();
            mostrarFilaVacia();
            actualizarEstadoBotonGuardar();
            validarTodosLosDias();
        });

        const selectDia = tr.querySelector('.select-dia');
        selectDia.addEventListener('change', () => {
            validarDiaFila(tr);
            validarTodosLosDias();
        });

        const inputsHora = tr.querySelectorAll('input[type="time"]');
        inputsHora.forEach(input => {
            input.addEventListener('change', () => validarRangoHorasFila(tr));
        });
    }

    // ========== Validaciones ==========

    function validarDiaFila(fila) {
        const select = fila.querySelector('.select-dia');
        const dia = select.value;
        
        if (!dia) return;

        // 1. Validar contra lo que ya tiene en DB
        const yaExisteEnDB = horarioActualPsicologo.some(h => h.dia_semana === dia);
        
        // 2. Validar contra otras filas del formulario
        const otrasFilas = Array.from(contenedorHorarios.querySelectorAll('tr:not(.fila-vacia)')).filter(f => f !== fila);
        const duplicadoEnForm = otrasFilas.some(f => f.querySelector('.select-dia').value === dia);

        if (yaExisteEnDB) {
            select.classList.add('is-invalid');
            fila.querySelector('.invalid-feedback').textContent = `El psicólogo ya tiene un horario para los ${dia}.`;
            return false;
        } else if (duplicadoEnForm) {
            select.classList.add('is-invalid');
            fila.querySelector('.invalid-feedback').textContent = `Ya has añadido ${dia} en otra fila.`;
            return false;
        } else {
            select.classList.remove('is-invalid');
            select.classList.add('is-valid');
            return true;
        }
    }

    function validarTodosLosDias() {
        const filas = contenedorHorarios.querySelectorAll('tr:not(.fila-vacia)');
        let todosValidos = true;
        filas.forEach(fila => {
            if (!validarDiaFila(fila)) todosValidos = false;
        });
        return todosValidos;
    }

    function validarRangoHorasFila(fila) {
        const hInicio = fila.querySelector('.input-hora-inicio');
        const hFin = fila.querySelector('.input-hora-fin');
        
        if (!hInicio.value || !hFin.value) return true;

        const inicioMin = convertirAMinutos(hInicio.value);
        const finMin = convertirAMinutos(hFin.value);

        let esValido = true;
        let msg = "";

        if (inicioMin < 420) { // 7:00 AM
            msg = "Mínimo 7:00 AM";
            esValido = false;
        } else if (finMin > 1439) { // 11:59 PM
            msg = "Máximo 11:59 PM";
            esValido = false;
        } else if (finMin <= inicioMin) {
            msg = "Fin debe ser después del inicio";
            esValido = false;
        } else if ((finMin - inicioMin) < 60) {
            msg = "Mínimo 1 hora";
            esValido = false;
        }

        if (!esValido) {
            hFin.setCustomValidity(msg);
            hFin.classList.add('is-invalid');
            AlertManager.warning('Horario inválido', msg);
        } else {
            hFin.setCustomValidity("");
            hFin.classList.remove('is-invalid');
            hFin.classList.add('is-valid');
            hInicio.classList.add('is-valid');
        }

        return esValido;
    }

    function convertirAMinutos(hora) {
        const [h, m] = hora.split(':').map(Number);
        return h * 60 + m;
    }

    // ========== Psicólogo e Inicialización ==========

    async function cargarHorarioActual(id) {
        if (!id) return;
        try {
            const response = await fetch(`obtener_horario_psicologo?id_empleado=${id}`);
            const data = await response.json();
            if (data.exito) {
                horarioActualPsicologo = data.data.horario || [];
                validarTodosLosDias();
            }
        } catch (error) {
            console.error('Error cargando horario:', error);
        }
    }

    // Escuchar el evento personalizado desde la función global
    window.addEventListener('psicologoSeleccionado', (e) => {
        cargarHorarioActual(e.detail.id);
        actualizarEstadoBotonGuardar();
    });

    if (btnAgregarFila) btnAgregarFila.addEventListener('click', agregarFila);

    if (btnEliminarPsicologo) {
        btnEliminarPsicologo.addEventListener('click', () => {
            idEmpleadoInput.value = "";
            psicologoNombreInput.value = "";
            horarioActualPsicologo = [];
            if (contenedorHorarios) {
                contenedorHorarios.innerHTML = "";
                mostrarFilaVacia();
            }
            actualizarEstadoBotonGuardar();
            validarTodosLosDias();
        });
    }

    // Botón de Limpiar Todo (reset)
    const btnLimpiarHorario = document.getElementById('btnLimpiarHorario');
    if (btnLimpiarHorario) {
        btnLimpiarHorario.addEventListener('click', (e) => {
            // No prevenimos el default porque queremos que resetee el form nativamente (id_empleado, etc.)
            // Pero como id_empleado y psicologo_nombre son readonly/hidden, el reset nativo los limpia
            // Pero las filas dinámicas NO se limpian solas
            if (contenedorHorarios) {
                contenedorHorarios.innerHTML = "";
                setTimeout(() => {
                    mostrarFilaVacia();
                    horarioActualPsicologo = [];
                    actualizarEstadoBotonGuardar();
                }, 50); // Pequeño delay para dejar que ocurra el reset nativo
            }
        });
    }

    // ========== Submit ==========

    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            if (!idEmpleadoInput.value) {
                AlertManager.error('Error', 'Debe seleccionar un psicólogo.');
                return;
            }

            if (!validarTodosLosDias()) {
                AlertManager.error('Error', 'Hay días duplicados o ya registrados.');
                return;
            }

            const filas = contenedorHorarios.querySelectorAll('tr:not(.fila-vacia)');
            for (let fila of filas) {
                if (!validarRangoHorasFila(fila)) {
                    AlertManager.error('Error', 'Verifique los rangos de horas.');
                    return;
                }
            }

            const formData = new FormData(form);
            
            try {
                AlertManager.loading('Registrando horarios...');
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();
                if (data.exito) {
                    AlertManager.success('¡Éxito!', data.mensaje);
                    setTimeout(() => window.location.href = 'consultar_horarios', 1500);
                } else {
                    AlertManager.error('Error', data.mensaje);
                }
            } catch (error) {
                AlertManager.error('Error de red', 'No se pudo conectar con el servidor.');
            }
        });
    }

    // Detectar si venimos de crear_empleado con un ID
    const urlParams = new URLSearchParams(window.location.search);
    const idRef = urlParams.get('id_empleado');
    const nombreRef = urlParams.get('nombre');
    if (idRef && nombreRef && idEmpleadoInput && psicologoNombreInput) {
        idEmpleadoInput.value = idRef;
        psicologoNombreInput.value = decodeURIComponent(nombreRef);
        cargarHorarioActual(idRef);
        actualizarEstadoBotonGuardar();
        agregarFila();
    }
});

// Inicialización del DataTable del Modal (fuera del DOMContentLoaded de arriba si se desea, o aquí)
$(document).ready(function() {
    if ($('#tablaPsicologosModal').length) {
        $('#tablaPsicologosModal').DataTable({
            ajax: { url: 'psicologos_data_json', dataSrc: 'data' },
            columns: [
                { data: 'cedula_completa' },
                { data: 'nombre_completo' },
                { data: 'correo' },
                { data: 'telefono' },
                {
                    data: 'id_empleado',
                    render: function (data, type, row) {
                        return `<button class="btn btn-sm btn-primary" onclick="seleccionarPsicologo('${data}', '${row.nombre_completo}')">
                                    <i class="fas fa-check"></i> Seleccionar
                                </button>`;
                    }
                }
            ],
            language: { url: 'plugins/DataTables/js/languaje.json' }
        });
    }
});