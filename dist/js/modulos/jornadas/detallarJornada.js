let aforoMaximo = 0;
let beneficiariosActuales = 0;
let tablaBeneficiarios;

document.addEventListener('DOMContentLoaded', function () {
    // Obtener el ID de la jornada de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const idJornada = urlParams.get('id_jornada');

    if (!idJornada) {
        AlertManager.error('Error', 'No se especificó el ID de la jornada');
        return;
    }

    // Establecer el ID de la jornada en el campo oculto del formulario
    document.getElementById('id_jornada').value = idJornada;

    // ==================== CARGAR DETALLES DE LA JORNADA ====================
    cargarDetallesJornada(idJornada);

    // ==================== INICIALIZAR DATATABLE ====================
    tablaBeneficiarios = $('#tabla_beneficiarios_atendidos').DataTable({
        ajax: {
            url: `beneficiarios_jornada_json?id_jornada=${idJornada}`,
            dataSrc: 'data'
        },
        searching: true,
        layout: {
            topStart: {
                buttons: [
                    {
                        extend: 'excel',
                        text: '<i class="fas fa-file-excel"></i> Excel',
                        className: 'btn btn-success',
                        exportOptions: {
                            columns: ':visible:not(:last-child)', // Excluir columna de acciones
                            format: {
                                body: function (data, row, column, node) {
                                    // Limpiar HTML para Excel
                                    return data.replace(/<[^>]*>/g, '');
                                }
                            }
                        }
                    },
                    {
                        extend: 'pdf',
                        text: '<i class="fas fa-file-pdf"></i> PDF',
                        className: 'btn btn-danger',
                        orientation: 'landscape',
                        pageSize: 'A4',
                        exportOptions: {
                            columns: ':visible:not(:last-child)', // Excluir columna de acciones
                            stripHtml: true
                        }
                    }
                ]
            }
        },
        ordering: true,
        order: [[7, 'desc']], // Ordenar por fecha de atención descendente
        responsive: true,
        pageLength: 10,
        lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "Todos"]],
        language: {
            url: 'plugins/DataTables/js/languaje.json'
        },
        columns: [
            {
                data: 'nombres',
                render: function (data) {
                    return data || '<span class="text-muted">No especificado</span>';
                }
            },
            {
                data: 'apellidos',
                render: function (data) {
                    return data || '<span class="text-muted">No especificado</span>';
                }
            },
            {
                data: null,
                render: function (data) {
                    if (!data.tipo_cedula || !data.cedula) {
                        return '<span class="text-muted">No especificado</span>';
                    }
                    return data.tipo_cedula + '-' + data.cedula;
                }
            },
            {
                data: 'fecha_nacimiento',
                render: function (data) {
                    if (!data) return '<span class="text-muted">N/A</span>';
                    const fechaNac = new Date(data);
                    const hoy = new Date();
                    let edad = hoy.getFullYear() - fechaNac.getFullYear();
                    const mes = hoy.getMonth() - fechaNac.getMonth();
                    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
                        edad--;
                    }
                    return edad;
                }
            },
            {
                data: 'genero',
                render: function (data) {
                    return data || '<span class="text-muted">No especificado</span>';
                }
            },
            {
                data: 'tipo_paciente',
                render: function (data) {
                    return data || '<span class="text-muted">No especificado</span>';
                }
            },
            {
                data: 'telefono',
                render: function (data) {
                    return data || '<span class="text-muted">No especificado</span>';
                }
            },
            {
                data: 'fecha_atencion',
                render: function (data) {
                    if (!data) return '<span class="text-muted">N/A</span>';
                    return new Date(data).toLocaleDateString('es-VE');
                }
            },
            // Columna de acciones
            {
                data: 'id_jornada_beneficiario',
                title: 'Acciones',
                orderable: false,
                searchable: false,
                width: '140px',
                render: function (data, type, row) {
                    const tieneDiagnostico = parseInt(row.tiene_diagnostico) === 1;
                    const btnAgregarClass = tieneDiagnostico ? 'btn-secondary disabled' : 'btn-success btn-agregar-diagnostico';
                    const titleAgregar = tieneDiagnostico ? 'Diagnóstico ya registrado' : 'Agregar Diagnóstico';

                    return `
                        <div class="btn-group btn-group-sm" role="group">
                            <button class="btn ${btnAgregarClass}"
                                    data-id_jornada_beneficiario="${data}"
                                    data-id_jornada="${idJornada}"
                                    data-bs-toggle="tooltip"
                                    title="${titleAgregar}"
                                    ${tieneDiagnostico ? 'disabled' : ''}>
                                <i class="fas fa-plus"></i>
                            </button>
                            <button class="btn btn-info btn-ver-diagnostico"
                                    data-id_jornada_beneficiario="${data}"
                                    data-id_jornada="${idJornada}"
                                    data-bs-toggle="tooltip"
                                    title="Ver Diagnóstico">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-warning btn-editar-diagnostico"
                                    data-id_jornada_beneficiario="${data}"
                                    data-id_jornada="${idJornada}"
                                    data-bs-toggle="tooltip"
                                    title="Editar Diagnóstico">
                                <i class="fas fa-edit"></i>
                            </button>
                        </div>
                    `;
                }
            }
        ],
        initComplete: function (settings, json) {
            if (json && json.error) {
                console.error('Error: ', json.error);
                $('#tabla_beneficiarios_atendidos').DataTable().clear().draw();
            }

            // Actualizar contador de beneficiarios
            beneficiariosActuales = json.data ? json.data.length : 0;
            actualizarContadorAforo();

            // Inicializar tooltips
            $('[data-bs-toggle="tooltip"]').tooltip();

            // Asignar eventos a los botones de acción
            asignarEventosBotonesBeneficiarios();
        },
        drawCallback: function (settings) {
            // Actualizar contador después de cada recarga
            const info = this.api().page.info();
            beneficiariosActuales = info.recordsTotal;
            actualizarContadorAforo();

            // Re-inicializar tooltips después de cada dibujado
            $('[data-bs-toggle="tooltip"]').tooltip();

            // Re-asignar eventos a los botones después de cada recarga
            asignarEventosBotonesBeneficiarios();
        }
    });

    // ==================== MANEJO DEL FORMULARIO ====================
    const form = document.getElementById('formulario-beneficiario-jornada');

    if (!form) {
        console.error('Formulario no encontrado');
        return;
    }

    // Elementos del formulario
    const elements = {
        tipo_cedula: document.getElementById('tipo_cedula'),
        cedula: document.getElementById('cedula'),
        nombres: document.getElementById('nombres'),
        apellidos: document.getElementById('apellidos'),
        correo: document.getElementById('correo'),
        telefono_prefijo: document.getElementById('telefono_prefijo'),
        telefono_numero: document.getElementById('telefono_numero'),
        telefono: document.getElementById('telefono'),
        fecha_nacimiento: document.getElementById('fecha_nacimiento'),
        genero: document.getElementById('genero'),
        tipo_paciente: document.getElementById('tipo_paciente'),
        direccion: document.getElementById('direccion'),
        id_jornada: document.getElementById('id_jornada')
    };

    // Combinar teléfono cuando se modifique prefijo o número
    elements.telefono_prefijo.addEventListener('change', combinarTelefono);
    elements.telefono_numero.addEventListener('input', combinarTelefono);

    function combinarTelefono() {
        const prefijo = elements.telefono_prefijo.value;
        const numero = elements.telefono_numero.value;
        if (prefijo && numero) {
            elements.telefono.value = prefijo + numero;
        }
    }

    // Limpiar validaciones al resetear formulario
    form.addEventListener('reset', function () {
        form.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
            el.classList.remove('is-valid', 'is-invalid');
        });
        form.querySelectorAll('.form-text.text-danger').forEach(msg => {
            msg.textContent = "";
        });
    });

    // ==================== ENVÍO DEL FORMULARIO ====================
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Importar validaciones desde el archivo externo
        if (typeof validarFormularioBeneficiarioJornada !== 'function') {
            AlertManager.error('Error', 'Error al cargar el sistema de validaciones');
            return;
        }

        // Validar formulario
        const esValido = await validarFormularioBeneficiarioJornada(elements);

        if (!esValido) {
            AlertManager.warning('Formulario incompleto', 'Corrige los campos resaltados antes de continuar');
            return;
        }

        // Validar aforo disponible
        if (beneficiariosActuales >= aforoMaximo) {
            AlertManager.error('Aforo completo', `No se pueden agregar más beneficiarios. El aforo máximo de esta jornada es de ${aforoMaximo} beneficiarios.`);
            return;
        }

        // Enviar datos mediante AJAX
        try {
            const formData = new FormData(form);

            const response = await fetch('agregar_beneficiario_jornada', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            AlertManager.close();

            if (response.ok) {
                const data = await response.json();

                if (data.exito) {
                    AlertManager.success('Registro exitoso', data.mensaje);

                    // Limpiar el formulario
                    form.reset();

                    // Recargar la tabla de beneficiarios
                    tablaBeneficiarios.ajax.reload(null, false);
                } else {
                    AlertManager.error('Error', data.mensaje || 'Error al registrar el beneficiario');
                }
            } else {
                AlertManager.error('Error', 'Error en la petición al servidor');
            }
        } catch (error) {
            AlertManager.close();
            console.error('Error:', error);
            AlertManager.error('Error', 'Ocurrió un error inesperado al registrar el beneficiario');
        }
    });
});

// ==================== FUNCIÓN PARA CARGAR DETALLES DE LA JORNADA ====================
async function cargarDetallesJornada(idJornada) {
    try {
        const response = await fetch(`jornada_detalle?id_jornada=${idJornada}`, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (!response.ok) {
            throw new Error('Error al cargar los detalles de la jornada');
        }

        const data = await response.json();

        if (data && !data.exito) {
            // Si data tiene la estructura correcta
            const jornada = data;

            // Capturar aforo máximo
            aforoMaximo = parseInt(jornada.aforo_maximo) || 0;

            // Llenar los spans con los datos
            document.getElementById('nombre_jornada').textContent = jornada.nombre_jornada || 'N/A';
            document.getElementById('tipo_jornada').textContent = jornada.tipo_jornada || 'N/A';
            document.getElementById('aforo_maximo').textContent = jornada.aforo_maximo || 'N/A';
            document.getElementById('fecha_inicio').textContent = formatearFecha(jornada.fecha_inicio);
            document.getElementById('fecha_fin').textContent = formatearFecha(jornada.fecha_fin);
            document.getElementById('ubicacion').textContent = jornada.ubicacion || 'N/A';
            document.getElementById('descripcion').textContent = jornada.descripcion || 'N/A';

            // Actualizar display de aforo
            document.getElementById('aforo_max_display').textContent = aforoMaximo;
            actualizarContadorAforo();
        } else {
            AlertManager.error('Error', 'No se encontraron detalles para esta jornada');
        }
    } catch (error) {
        console.error('Error:', error);
        AlertManager.error('Error', 'No se pudieron cargar los detalles de la jornada');
    }
}

// ==================== FUNCIÓN AUXILIAR PARA FORMATEAR FECHAS ====================
function formatearFecha(fecha) {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-VE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// ==================== FUNCIÓN PARA ACTUALIZAR CONTADOR DE AFORO ====================
function actualizarContadorAforo() {
    // Actualizar contador de texto
    document.getElementById('beneficiarios_count').textContent = beneficiariosActuales;

    // Calcular porcentaje
    const porcentaje = aforoMaximo > 0 ? (beneficiariosActuales / aforoMaximo) * 100 : 0;

    // Actualizar barra de progreso
    const progressBar = document.getElementById('progress_aforo');
    progressBar.style.width = porcentaje + '%';
    progressBar.setAttribute('aria-valuenow', porcentaje);

    // Cambiar color según el porcentaje
    progressBar.classList.remove('bg-success', 'bg-warning', 'bg-danger');

    if (porcentaje < 70) {
        progressBar.classList.add('bg-success');
    } else if (porcentaje < 90) {
        progressBar.classList.add('bg-warning');
    } else {
        progressBar.classList.add('bg-danger');
    }

    // Deshabilitar botón de agregar si está completo
    const btnAgregar = document.getElementById('btnAgregar');
    if (btnAgregar) {
        if (beneficiariosActuales >= aforoMaximo) {
            btnAgregar.disabled = true;
            btnAgregar.title = 'Aforo completo';
        } else {
            btnAgregar.disabled = false;
            btnAgregar.title = '';
        }
    }
}

// ====================FUNCIÓN PARA ASIGNAR EVENTOS A BOTONES DE BENEFICIARIOS ====================
function asignarEventosBotonesBeneficiarios() {
    // Eliminar eventos anteriores para evitar duplicados
    $(document).off('click', '.btn-agregar-diagnostico');
    $(document).off('click', '.btn-ver-diagnostico');

    // Evento para agregar diagnóstico
    $(document).on('click', '.btn-agregar-diagnostico', function () {
        const id_beneficiario = $(this).data('id_jornada_beneficiario');
        const id_jornada = $(this).data('id_jornada');

        console.log('Agregar diagnóstico para:', { id_beneficiario, id_jornada });

        agregarDiagnostico(id_beneficiario, id_jornada);
    });

    // Evento para ver diagnóstico
    $(document).on('click', '.btn-ver-diagnostico', function () {
        const id_jornada_beneficiario = $(this).data('id_jornada_beneficiario');

        console.log('Ver diagnóstico para id_jornada_beneficiario:', id_jornada_beneficiario);

        if (typeof verDiagnostico === 'function') {
            verDiagnostico(id_jornada_beneficiario);
        } else {
            console.error('La función verDiagnostico no está definida');
            AlertManager.error('Error', 'No se pudo cargar el visualizador de diagnósticos.');
        }
    });

    // Evento para editar diagnóstico
    $(document).on('click', '.btn-editar-diagnostico', function () {
        const id_jornada_beneficiario = $(this).data('id_jornada_beneficiario');

        if (typeof editarDiagnostico === 'function') {
            editarDiagnostico(id_jornada_beneficiario);
        } else {
            console.error('La función editarDiagnostico no está definida');
            AlertManager.error('Error', 'No se pudo cargar el editor de diagnósticos.');
        }
    });
}
