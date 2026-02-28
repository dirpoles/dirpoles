// dist/js/modulos/beneficiario/editarBeneficiario.js

/**
 * Función para mostrar el formulario de edición de un beneficiario
 * @param {number} id - ID del beneficiario
 */
function editarBeneficiario(id) {
    // ✅ 1. Mostrar modal INMEDIATAMENTE con spinner
    const modalElement = document.getElementById('modalGlobal');
    const modal = new bootstrap.Modal(modalElement);

    // Configurar título del modal
    $('#modalGlobalTitle').text('Editar Beneficiario');
    $('#modalGlobalSubtitle').text(`ID: ${id}`).show();

    // Limpiar y mostrar spinner en el body del modal
    $('#modalGlobal .modal-body').html(`
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3 text-muted">Cargando información del beneficiario...</p>
        </div>
    `);

    // Mostrar modal
    modal.show();

    // ✅ 2. Hacer AJAX para obtener datos del beneficiario y PNFs
    $.ajax({
        url: 'beneficiario_detalle_editar',
        method: 'GET',
        data: { id_beneficiario: id },
        dataType: 'json',
        success: function (data) {
            console.log('Datos recibidos para editar beneficiario:', data);

            // Verificar si hay datos
            if (!data || !data.data) {
                $('#modalGlobal .modal-body').html(`
                    <div class="alert alert-warning m-4">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        No se encontraron datos para este beneficiario.
                    </div>
                `);
                return;
            }

            const beneficiario = data.data;
            const pnfs = data.pnf || [];

            // ✅ 3. Separar teléfono en prefijo y número
            let telefonoPrefijo = '';
            let telefonoNumero = '';

            if (beneficiario.telefono && beneficiario.telefono.length >= 11) {
                telefonoPrefijo = beneficiario.telefono.substring(0, 4);
                telefonoNumero = beneficiario.telefono.substring(4);
            } else if (beneficiario.telefono) {
                telefonoNumero = beneficiario.telefono;
            }

            // ✅ 4. Generar opciones para el select de PNF
            let opcionesPNF = '<option value="">Seleccione un PNF</option>';
            if (Array.isArray(pnfs)) {
                pnfs.forEach(function (pnf) {
                    const selected = (pnf.id_pnf == beneficiario.id_pnf) ? 'selected' : '';
                    opcionesPNF += `<option value="${pnf.id_pnf}" ${selected}>${pnf.nombre_pnf || pnf.nombre}</option>`;
                });
            }

            // ✅ 5. Generar opciones para el select de género
            const generos = [
                { valor: 'M', texto: 'Masculino' },
                { valor: 'F', texto: 'Femenino' }
            ];
            let opcionesGenero = '<option value="">Seleccione un género</option>';
            generos.forEach(function (genero) {
                const selected = (genero.valor === beneficiario.genero) ? 'selected' : '';
                opcionesGenero += `<option value="${genero.valor}" ${selected}>${genero.texto}</option>`;
            });

            // ✅ 6. Separar la sección en número y sede
            let seccionNumero = '';
            let seccionSede = '';
            let seccionCompleta = beneficiario.seccion || '';

            if (seccionCompleta) {
                const seccionPartes = seccionCompleta.split('-');
                if (seccionPartes.length === 2) {
                    seccionNumero = seccionPartes[0] || '';
                    seccionSede = seccionPartes[1] || '';
                } else {
                    // Si no tiene formato correcto, usar el valor completo como número
                    seccionNumero = seccionCompleta;
                }
            }

            // ✅ 7. Generar el formulario de edición
            const formularioHTML = generarFormularioEdicion({
                id: beneficiario.id_beneficiario || id,
                nombres: beneficiario.nombres || '',
                apellidos: beneficiario.apellidos || '',
                tipo_cedula: beneficiario.tipo_cedula || 'V',
                cedula: beneficiario.cedula || '',
                correo: beneficiario.correo || '',
                telefonoPrefijo: telefonoPrefijo,
                telefonoNumero: telefonoNumero,
                fecha_nac: beneficiario.fecha_nac || '',
                direccion: beneficiario.direccion || '',
                genero: beneficiario.genero || '',
                id_pnf: beneficiario.id_pnf || '',
                seccionNumero: seccionNumero,      // Número de la sección
                seccionSede: seccionSede,          // Sede de la sección
                seccionCompleta: seccionCompleta,  // Sección completa
                estatus: beneficiario.estatus,
                opcionesPNF: opcionesPNF,
                opcionesGenero: opcionesGenero
            });

            // ✅ 8. Insertar el formulario en el modal
            $('#modalGlobal .modal-body').html(formularioHTML);

            // ✅ 9. Inicializar Select2 para los campos (si está disponible)
            if (typeof $.fn.select2 !== 'undefined') {
                $('#editar_id_pnf').select2({
                    theme: 'bootstrap-5',
                    dropdownParent: $('#modalGlobal')
                });

                // Sede de sección
                $('#editar_seccion_sede').select2({
                    theme: 'bootstrap-5',
                    dropdownParent: $('#modalGlobal'),
                    minimumResultsForSearch: -1 // Ocultar búsqueda si hay pocas opciones
                });
            }

            // ✅ 10. Inicializar validaciones
            inicializarValidacionesEditar(id);
        },
        error: function (xhr, status, error) {
            console.error('Error en la solicitud:', error);

            // ✅ 11. Mostrar error en el modal
            $('#modalGlobal .modal-body').html(`
                <div class="alert alert-danger m-4" role="alert">
                    <div class="d-flex align-items-center">
                        <i class="fas fa-exclamation-triangle fa-2x me-3"></i>
                        <div>
                            <h5 class="alert-heading">Error al cargar los datos</h5>
                            <p class="mb-0">No se pudo obtener la información del beneficiario. Código de error: ${xhr.status}</p>
                            <p class="mb-0 small">${error}</p>
                        </div>
                    </div>
                    <div class="mt-3 text-center">
                        <button class="btn btn-outline-danger" onclick="editarBeneficiario(${id})">
                            <i class="fas fa-redo me-1"></i> Reintentar
                        </button>
                    </div>
                </div>
            `);
        }
    });
}

/**
 * Genera el formulario HTML para editar un beneficiario
 * @param {Object} datos - Objeto con los datos del beneficiario y opciones
 * @returns {string} HTML del formulario
 */
function generarFormularioEdicion(datos) {
    return `
        <form id="formEditarBeneficiario" data-id="${datos.id}">
            <!-- Tarjeta de Información Principal -->
            <div class="card border-0 rounded-0 bg-light">
                <div class="card-body p-4">
                    <div class="row">
                        <!-- Columna Izquierda - Datos Personales -->
                        <div class="col-md-6 border-end">
                            <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                                <i class="fas fa-user-circle me-2"></i> Información Personal
                            </h6>
                            
                            <!-- Nombres -->
                            <div class="mb-3">
                                <label for="editar_nombres" class="form-label text-muted small mb-1">
                                    <i class="fas fa-user text-primary me-1"></i> Nombres
                                </label>
                                <input type="text" 
                                    class="form-control form-control-sm" 
                                    id="editar_nombres" 
                                    name="nombres"
                                    value="${datos.nombres}"
                                    >
                                <div id="editar_nombresError" class="form-text text-danger"></div>
                            </div>
                            
                            <!-- Apellidos -->
                            <div class="mb-3">
                                <label for="editar_apellidos" class="form-label text-muted small mb-1">
                                    <i class="fas fa-user text-primary me-1"></i> Apellidos
                                </label>
                                <input type="text" 
                                    class="form-control form-control-sm" 
                                    id="editar_apellidos" 
                                    name="apellidos"
                                    value="${datos.apellidos}"
                                    >
                                <div id="editar_apellidosError" class="form-text text-danger"></div>
                            </div>
                            
                            <!-- Cédula (con tipo de cédula) -->
                            <div class="mb-3">
                                <label class="form-label text-muted small mb-1">
                                    <i class="fas fa-id-card text-primary me-1"></i> Cédula de Identidad
                                </label>
                                <div class="row g-2">
                                    <div class="col-4">
                                        <select class="form-select form-select-sm" 
                                                id="editar_tipo_cedula" 
                                                name="tipo_cedula"
                                                >
                                            <option value="V" ${datos.tipo_cedula === 'V' ? 'selected' : ''}>V</option>
                                            <option value="E" ${datos.tipo_cedula === 'E' ? 'selected' : ''}>E</option>
                                        </select>
                                        <div id="editar_tipo_cedulaError" class="form-text text-danger"></div>
                                    </div>
                                    <div class="col-8">
                                        <input type="text" 
                                            class="form-control form-control-sm" 
                                            id="editar_cedula" 
                                            name="cedula"
                                            value="${datos.cedula}"
                                            
                                            pattern="[0-9]{7,8}"
                                            title="La cédula debe contener entre 7 y 8 dígitos">
                                        <div id="editar_cedulaError" class="form-text text-danger"></div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Correo -->
                            <div class="mb-3">
                                <label for="editar_correo" class="form-label text-muted small mb-1">
                                    <i class="fas fa-envelope text-primary me-1"></i> Correo Electrónico
                                </label>
                                <input type="email" 
                                    class="form-control form-control-sm" 
                                    id="editar_correo" 
                                    name="correo"
                                    value="${datos.correo}"
                                    >
                                <div id="editar_correoError" class="form-text text-danger"></div>
                            </div>
                            
                            <!-- Teléfono CON PREFIJO + NÚMERO -->
                            <div class="mb-3">
                                <label class="form-label text-muted small mb-1">
                                    <i class="fas fa-phone text-primary me-1"></i> Teléfono
                                </label>
                                <div class="input-group input-group-sm">
                                    <select name="editar_telefono_prefijo" 
                                            id="editar_telefono_prefijo" 
                                            class="form-select w-auto" 
                                            style="max-width: 100px;">
                                        <option value="" ${!datos.telefonoPrefijo ? 'selected' : ''}>Prefijo</option>
                                        <option value="0416" ${datos.telefonoPrefijo === '0416' ? 'selected' : ''}>0416</option>
                                        <option value="0426" ${datos.telefonoPrefijo === '0426' ? 'selected' : ''}>0426</option>
                                        <option value="0414" ${datos.telefonoPrefijo === '0414' ? 'selected' : ''}>0414</option>
                                        <option value="0424" ${datos.telefonoPrefijo === '0424' ? 'selected' : ''}>0424</option>
                                        <option value="0412" ${datos.telefonoPrefijo === '0412' ? 'selected' : ''}>0412</option>
                                        <option value="0422" ${datos.telefonoPrefijo === '0422' ? 'selected' : ''}>0422</option>
                                    </select>
                                    <input type="text" 
                                        name="editar_telefono_numero" 
                                        id="editar_telefono_numero" 
                                        class="form-control" 
                                        placeholder="Número" 
                                        maxlength="7"
                                        pattern="[0-9]{7}"
                                        title="El número debe contener 7 dígitos"
                                        value="${datos.telefonoNumero}">
                                </div>
                                <div id="editar_telefono_numeroError" class="form-text text-danger"></div>
                                <div id="editar_telefonoError" class="form-text text-danger"></div>
                            </div>
                        </div>
                        
                        <!-- Columna Derecha - Datos Académicos y Adicionales -->
                        <div class="col-md-6">
                            <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                                <i class="fas fa-graduation-cap me-2"></i> Información Académica
                            </h6>
                            
                            <!-- PNF (Select2) -->
                            <div class="mb-3">
                                <label for="editar_id_pnf" class="form-label text-muted small mb-1">
                                    <i class="fas fa-university text-primary me-1"></i> Programa Nacional de Formación (PNF)
                                </label>
                                <select class="form-select form-select-sm select2" 
                                        id="editar_id_pnf" 
                                        name="id_pnf"
                                        >
                                    ${datos.opcionesPNF}
                                </select>
                                <div id="editar_id_pnfError" class="form-text text-danger"></div>
                            </div>
                            
                            <!-- Sección -->
                            <div class="mb-3">
                                <label class="form-label text-muted small mb-1">
                                    <i class="fas fa-users text-primary me-1"></i> Sección
                                </label>
                                <div class="row g-2">
                                    <div class="col-md-6">
                                        <input type="text" 
                                            class="form-control form-control-sm" 
                                            id="editar_seccion_numero" 
                                            name="seccion_numero"
                                            placeholder="Número"
                                            value="${datos.seccionNumero}"
                                            maxlength="4"
                                            pattern="[1-4][0-9]{3}"
                                            title="Debe ingresar 4 dígitos comenzando con 1-4"
                                            >
                                        <div id="editar_seccion_numeroError" class="form-text text-danger"></div>
                                    </div>
                                    <div class="col-md-6">
                                        <select class="form-select form-select-sm select2" 
                                                id="editar_seccion_sede" 
                                                name="seccion_sede"
                                                >
                                            <option value="" disabled>Seleccione una sede</option>
                                            <option value="M" ${datos.seccionSede === 'M' ? 'selected' : ''}>MORÁN</option>
                                            <option value="C" ${datos.seccionSede === 'C' ? 'selected' : ''}>CRESPO</option>
                                            <option value="J" ${datos.seccionSede === 'J' ? 'selected' : ''}>JIMÉNEZ</option>
                                            <option value="U" ${datos.seccionSede === 'U' ? 'selected' : ''}>URDANETA</option>
                                            <option value="B" ${datos.seccionSede === 'B' ? 'selected' : ''}>BARQUISIMETO</option>
                                        </select>
                                        <div id="editar_seccion_sedeError" class="form-text text-danger"></div>
                                    </div>
                                </div>
                                <!-- Campo oculto para el valor combinado -->
                                <input type="hidden" id="editar_seccion" name="seccion" value="${datos.seccionCompleta || ''}">
                            </div>
                            
                            <!-- Fecha de Nacimiento -->
                            <div class="mb-3">
                                <label for="editar_fecha_nac" class="form-label text-muted small mb-1">
                                    <i class="fas fa-birthday-cake text-primary me-1"></i> Fecha de Nacimiento
                                </label>
                                <input type="date" 
                                    class="form-control form-control-sm" 
                                    id="editar_fecha_nac" 
                                    name="fecha_nac"
                                    value="${datos.fecha_nac}"
                                    >
                                <div id="editar_fecha_nacError" class="form-text text-danger"></div>
                            </div>
                            
                            <!-- Género -->
                            <div class="mb-3">
                                <label for="editar_genero" class="form-label text-muted small mb-1">
                                    <i class="fas fa-venus-mars text-primary me-1"></i> Género
                                </label>
                                <select class="form-select form-select-sm" 
                                        id="editar_genero" 
                                        name="genero"
                                        >
                                    ${datos.opcionesGenero}
                                </select>
                                <div id="editar_generoError" class="form-text text-danger"></div>
                            </div>
                            
                            <!-- Estatus -->
                            <div class="mb-3">
                                <label for="editar_estatus" class="form-label text-muted small mb-1">
                                    <i class="fas fa-chart-line text-primary me-1"></i> Estado del Beneficiario
                                </label>
                                <select class="form-select form-select-sm" 
                                        id="editar_estatus" 
                                        name="estatus">
                                    <option value="1" ${datos.estatus == 1 ? 'selected' : ''}>Activo</option>
                                    <option value="0" ${datos.estatus == 0 ? 'selected' : ''}>Inactivo</option>
                                </select>
                                <div id="editar_estatusError" class="form-text text-danger"></div>
                            </div>
                            
                            
                        </div>
                        <!-- Dirección -->
                        <div class="mb-3">
                            <label for="editar_direccion" class="form-label text-muted small mb-1">
                                <i class="fas fa-map-marker-alt text-primary me-1"></i> Dirección
                            </label>
                            <textarea class="form-control form-control-sm" 
                                    id="editar_direccion" 
                                    name="direccion"
                                    rows="2"
                                    >${datos.direccion}</textarea>
                            <div id="editar_direccionError" class="form-text text-danger"></div>
                        </div>
                        <!-- Campos ocultos -->
                        <input type="hidden" name="id_beneficiario" value="${datos.id}">
                        <input type="hidden" id="editar_telefono_completo" name="telefono" value="">
                    </div>
                </div>
            </div>
            
            <!-- Footer del Modal -->
            <div class="modal-footer border-top-0 bg-light py-3">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                    <i class="fas fa-times me-1"></i> Cancelar
                </button>
                <button type="submit" class="btn btn-primary" id="btnGuardarCambios">
                    <i class="fas fa-save me-1"></i> Guardar Cambios
                </button>
            </div>
        </form>
    `;
}