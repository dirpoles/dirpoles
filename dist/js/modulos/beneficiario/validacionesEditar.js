// dist/js/modulos/beneficiario/ValidacionesEditar.js

/**
 * Inicializa las validaciones para el formulario de edición de beneficiario
 * @param {number} id - ID del beneficiario que se está editando
 */
function inicializarValidacionesEditar(id) {
    const form = document.getElementById('formEditarBeneficiario');
    if (!form) return;

    console.log('Inicializando validaciones para editar beneficiario ID:', id);

    const elements = {
        tipo_cedula: document.getElementById('editar_tipo_cedula'),
        cedula: document.getElementById('editar_cedula'),
        nombres: document.getElementById('editar_nombres'),
        apellidos: document.getElementById('editar_apellidos'),
        correo: document.getElementById('editar_correo'),
        telefono_prefijo: document.getElementById('editar_telefono_prefijo'),
        telefono_numero: document.getElementById('editar_telefono_numero'),
        telefono: document.getElementById('editar_telefono_completo'),
        fecha_nac: document.getElementById('editar_fecha_nac'),
        direccion: document.getElementById('editar_direccion'),
        id_pnf: document.getElementById('editar_id_pnf'),
        genero: document.getElementById('editar_genero'),
        seccion_numero: document.getElementById('editar_seccion_numero'),
        seccion_sede: document.getElementById('editar_seccion_sede'),
        seccion: document.getElementById('editar_seccion'), // Campo oculto
        estatus: document.getElementById('editar_estatus')
    };


    // Variable para almacenar el teléfono original (para validación de unicidad)
    let telefonoOriginal = '';

    // Función para actualizar el campo telefónico oculto
    function actualizarTelefonoCompleto() {
        const prefijo = elements.telefono_prefijo.value;
        const numero = elements.telefono_numero.value.trim();
        if (prefijo && numero.length === 7) {
            elements.telefono.value = prefijo + numero;
        } else {
            elements.telefono.value = '';
        }
    }

    const showError = (field, msg) => {
        const errorElement = document.getElementById(`${field.id}Error`);
        if (errorElement) {
            errorElement.textContent = msg;
            errorElement.style.display = 'block';
        }

        field.classList.add("is-invalid");
        field.classList.remove("is-valid");

        // Aplicar estilo al contenedor Select2 si existe
        if ($(field).hasClass('select2')) {
            $(field).next('.select2-container').find('.select2-selection')
                .addClass('is-invalid')
                .removeClass('is-valid');
        }
    };

    const clearError = (field) => {
        const errorElement = document.getElementById(`${field.id}Error`);
        if (errorElement) {
            errorElement.textContent = "";
            errorElement.style.display = 'none';
        }

        field.classList.remove("is-invalid");
        field.classList.add("is-valid");

        if ($(field).hasClass('select2')) {
            $(field).next('.select2-container').find('.select2-selection')
                .removeClass('is-invalid')
                .addClass('is-valid');
        }
    };

    async function validarCedula() {
        const cedula = elements.cedula.value.trim();
        const tipoCedula = elements.tipo_cedula.value.trim();

        // Limpiar caracteres no numéricos
        elements.cedula.value = cedula.replace(/[^0-9]/g, '');

        if (cedula === "") {
            showError(elements.cedula, "La cédula es obligatoria");
            return false;
        }

        if (tipoCedula === "") {
            showError(elements.tipo_cedula, "El tipo de cédula es obligatorio");
            return false;
        }

        if (cedula.length < 6 || cedula.length > 8) {
            showError(elements.cedula, "La cédula debe tener entre 6 y 8 dígitos");
            return false;
        }

        try {
            const response = await fetch('validar_cedula', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: new URLSearchParams({
                    cedula: cedula,
                    tipo_cedula: tipoCedula,
                    id_beneficiario: id
                })
            });

            if (!response.ok) {
                throw new Error('Error en la petición: ' + response.status);
            }

            const data = await response.json();

            if (data.existe) {
                showError(elements.cedula, "La cédula ya está registrada en el sistema");
                return false;
            }

            clearError(elements.cedula);
            clearError(elements.tipo_cedula);
            return true;
        } catch (error) {
            console.error('Error validando cédula:', error);
            showError(elements.cedula, "Error al validar cédula");
            return false;
        }
    }

    function validarNombre() {
        const nombre = elements.nombres.value;
        const regex = /^[A-Za-zÀ-ÿ\u00f1\u00d1\s]{2,50}$/;

        if (nombre.trim() === "") {
            showError(elements.nombres, "El nombre es obligatorio");
            return false;
        }

        if (!regex.test(nombre)) {
            showError(elements.nombres, "El nombre solo debe contener letras, acentos y espacios, máximo 50 caracteres");
            return false;
        }

        // Prevención básica contra XSS: eliminar etiquetas HTML
        elements.nombres.value = nombre.replace(/<[^>]*>?/gm, "");

        clearError(elements.nombres);
        return true;
    }

    function validarApellido() {
        const apellido = elements.apellidos.value;
        const regex = /^[A-Za-zÀ-ÿ\u00f1\u00d1\s]{2,50}$/;

        if (apellido.trim() === "") {
            showError(elements.apellidos, "El apellido es obligatorio");
            return false;
        }

        if (!regex.test(apellido)) {
            showError(elements.apellidos, "El apellido solo debe contener letras, acentos y espacios, máximo 50 caracteres");
            return false;
        }

        // Prevención básica contra XSS: eliminar etiquetas HTML
        elements.apellidos.value = apellido.replace(/<[^>]*>?/gm, "");

        clearError(elements.apellidos);
        return true;
    }

    async function validarCorreo() {
        const correo = elements.correo.value.trim();
        const correoRegex = /^[a-zA-Z0-9._%+-]+@(hotmail|yahoo|gmail|outlook|uptaeb)\.(com|es|net|org|edu|ve)$/i;

        if (correo === "") {
            showError(elements.correo, "El correo es obligatorio");
            return false;
        }

        if (!correoRegex.test(correo)) {
            showError(elements.correo, "Formato de correo electrónico inválido");
            return false;
        }

        try {
            const response = await fetch('validar_correo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: new URLSearchParams({
                    correo: correo,
                    id_beneficiario: id
                })
            });

            if (!response.ok) throw new Error('Error en la petición');

            const data = await response.json();

            if (data.existe) {
                showError(elements.correo, "El correo electrónico ya está registrado");
                return false;
            }

            clearError(elements.correo);
            return true;
        } catch (error) {
            console.error('Error validando correo:', error);
            return false;
        }
    }

    async function validarTelefono() {
        const prefijo = elements.telefono_prefijo.value;
        const telefono_numero = elements.telefono_numero.value.trim();

        elements.telefono_numero.value = telefono_numero.replace(/[^0-9]/g, '');

        // Actualizar campo oculto
        actualizarTelefonoCompleto();

        if (prefijo === "") {
            showError(elements.telefono_prefijo, "El prefijo es obligatorio");
            return false;
        }

        if (telefono_numero === "") {
            showError(elements.telefono_numero, "El número de teléfono es obligatorio");
            return false;
        }

        if (telefono_numero.length !== 7) {
            showError(elements.telefono_numero, "El número debe tener 7 dígitos");
            return false;
        }

        const telefono = prefijo + telefono_numero;

        try {
            const response = await fetch('validar_telefono', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: new URLSearchParams({
                    telefono: telefono,
                    id_beneficiario: id
                })
            });

            if (!response.ok) throw new Error('Error en la petición');

            const data = await response.json();

            if (data.existe) {
                showError(elements.telefono_numero, "El teléfono ya está registrado");
                return false;
            }

            clearError(elements.telefono_prefijo);
            clearError(elements.telefono_numero);
            return true;
        } catch (error) {
            console.error('Error validando teléfono:', error);
            showError(elements.telefono_numero, "Error al validar teléfono");
            return false;
        }
    }

    function validarFechaNacimiento() {
        const fecha_nacimiento = elements.fecha_nac.value;

        if (!fecha_nacimiento || fecha_nacimiento === "") {
            showError(elements.fecha_nac, "La fecha de nacimiento es obligatoria");
            return false;
        }

        const fechaNac = new Date(fecha_nacimiento);
        const hoy = new Date();
        let edad = hoy.getFullYear() - fechaNac.getFullYear();
        const mes = hoy.getMonth() - fechaNac.getMonth();

        if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
            edad--;
        }

        if (edad < 15) {
            showError(elements.fecha_nac, "Debe tener al menos 15 años");
            return false;
        }

        clearError(elements.fecha_nac);
        return true;
    }

    function validarDireccion() {
        let direccion = elements.direccion.value;

        // Sanitiza: elimina etiquetas HTML pero conserva espacios internos
        direccion = direccion.replace(/<[^>]*>?/gm, "");

        if (!direccion) {
            showError(elements.direccion, "La dirección es obligatoria");
            return false;
        }

        // Bloquear espacios iniciales o finales
        if (/^\s|\s$/.test(direccion)) {
            showError(elements.direccion, "La dirección no puede iniciar ni terminar con espacios");
            return false;
        }

        // Validación de longitud
        if (direccion.length < 5) {
            showError(elements.direccion, "La dirección debe tener al menos 5 caracteres");
            return false;
        }

        if (direccion.length > 250) {
            showError(elements.direccion, "La dirección debe tener máximo 250 caracteres");
            return false;
        }

        // Validación de caracteres permitidos
        const regex = /^[A-Za-zÀ-ÿ0-9 ,.\-#]+$/;

        if (!regex.test(direccion)) {
            showError(elements.direccion, "La dirección solo puede contener letras, números, espacios, comas, puntos, guiones y #");
            return false;
        }

        elements.direccion.value = direccion;
        clearError(elements.direccion);
        return true;
    }

    function validarGenero() {
        const genero = elements.genero.value;

        if (!genero || genero === "") {
            showError(elements.genero, "El género es obligatorio");
            return false;
        }

        clearError(elements.genero);
        return true;
    }

    function validarSeccion() {
        const seccion_numero = elements.seccion_numero.value.trim();
        const seccion_sede = elements.seccion_sede.value;
        let isValid = true;

        // Validar número de sección
        if (!seccion_numero) {
            showError(elements.seccion_numero, "El número de sección es obligatorio");
            isValid = false;
        } else if (!/^[1-4]\d{3}$/.test(seccion_numero)) {
            showError(elements.seccion_numero, "El número debe tener 4 dígitos, comenzando con 1-4");
            isValid = false;
        } else {
            clearError(elements.seccion_numero);
        }

        // Validar sede
        if (!seccion_sede) {
            showError(elements.seccion_sede, "La sede es obligatoria");
            isValid = false;
        } else {
            clearError(elements.seccion_sede);
        }

        // Si ambos son válidos, combinar en campo oculto
        if (isValid) {
            elements.seccion.value = seccion_numero + '-' + seccion_sede;
        } else {
            elements.seccion.value = '';
        }

        return isValid;
    }

    function validarPNF() {
        const pnf = elements.id_pnf.value;

        if (!pnf || pnf === "") {
            showError(elements.id_pnf, "El PNF es obligatorio");
            return false;
        }

        clearError(elements.id_pnf);
        return true;
    }

    function validarEstatus() {
        const estatus = elements.estatus.value;

        if (estatus === "") {
            showError(elements.estatus, "El estatus es obligatorio");
            return false;
        }

        clearError(elements.estatus);
        return true;
    }

    // Asignar eventos de validación en tiempo real
    elements.tipo_cedula.addEventListener('change', validarCedula);
    elements.cedula.addEventListener('input', validarCedula);
    elements.nombres.addEventListener('input', validarNombre);
    elements.apellidos.addEventListener('input', validarApellido);
    elements.correo.addEventListener('input', validarCorreo);
    elements.telefono_prefijo.addEventListener('change', function () {
        validarTelefono();
        actualizarTelefonoCompleto();
    });
    elements.telefono_numero.addEventListener('input', function () {
        // Limitar a 7 dígitos
        if (this.value.length > 7) {
            this.value = this.value.substring(0, 7);
        }
        validarTelefono();
        actualizarTelefonoCompleto();
    });
    elements.fecha_nac.addEventListener('input', validarFechaNacimiento);
    elements.direccion.addEventListener('input', validarDireccion);
    elements.genero.addEventListener('change', validarGenero);
    elements.seccion_numero.addEventListener('input', function () {
        // Limitar a 4 dígitos y solo números
        this.value = this.value.replace(/\D/g, '').substring(0, 4);
        validarSeccion();
    });
    // Para el select de sede con Select2
    if ($(elements.seccion_sede).hasClass('select2')) {
        $(elements.seccion_sede).on('change', validarSeccion);
        $(elements.seccion_sede).on('select2:select', validarSeccion);
        $(elements.seccion_sede).on('clear', validarSeccion);
    } else {
        elements.seccion_sede.addEventListener('change', validarSeccion);
    }
    elements.estatus.addEventListener('change', validarEstatus);

    // Para Select2 (PNF)
    if ($(elements.id_pnf).hasClass('select2')) {
        $(elements.id_pnf).on('change', validarPNF);
        $(elements.id_pnf).on('select2:select', validarPNF);
        $(elements.id_pnf).on('clear', validarPNF);
    } else {
        elements.id_pnf.addEventListener('change', validarPNF);
    }

    // Configurar el envío del formulario
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        console.log('Validando formulario de edición para beneficiario ID:', id);

        const validaciones = [
            await validarCedula(),
            validarNombre(),
            validarApellido(),
            await validarCorreo(),
            await validarTelefono(),
            validarFechaNacimiento(),
            validarDireccion(),
            validarGenero(),
            validarSeccion(),
            validarPNF(),
            validarEstatus()
        ];

        if (validaciones.every(v => v === true)) {
            console.log('Todas las validaciones pasaron, enviando datos...');

            // Obtener el teléfono completo antes de enviar
            actualizarTelefonoCompleto();

            // Crear FormData con todos los campos
            const formData = new FormData(form);

            // Asegurarse de que el ID esté incluido
            formData.append('id_beneficiario', id);

            try {
                const response = await fetch('beneficiario_actualizar', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('Error en la petición: ' + response.status);
                }

                const data = await response.json();

                if (data.exito) {
                    // Mostrar mensaje de éxito
                    if (typeof AlertManager !== 'undefined') {
                        AlertManager.success("Actualización exitosa", data.mensaje).then(() => {
                            // Cerrar el modal
                            const modal = bootstrap.Modal.getInstance(document.getElementById('modalGlobal'));
                            if (modal) {
                                modal.hide();
                            }

                            // Recargar la DataTable si existe
                            if (window.dataTableInstance && typeof window.dataTableInstance.ajax.reload === 'function') {
                                window.dataTableInstance.ajax.reload(null, false);
                                console.log('DataTable recargada después de actualizar beneficiario');
                            } else if (typeof recargarTablaBeneficiarios === 'function') {
                                recargarTablaBeneficiarios();
                            } else {
                                // Si nada funciona, recargar la página
                                setTimeout(() => {
                                    window.location.reload();
                                }, 1000);
                            }
                        });
                    } else {
                        // Si no hay AlertManager, usar Swal directamente
                        Swal.fire({
                            icon: 'success',
                            title: 'Actualización exitosa',
                            text: data.mensaje
                        }).then(() => {
                            const modal = bootstrap.Modal.getInstance(document.getElementById('modalGlobal'));
                            if (modal) {
                                modal.hide();
                            }

                            // Recargar la DataTable
                            if (window.dataTableInstance && typeof window.dataTableInstance.ajax.reload === 'function') {
                                window.dataTableInstance.ajax.reload(null, false);
                            } else if (typeof recargarTablaBeneficiarios === 'function') {
                                recargarTablaBeneficiarios();
                            }
                        });
                    }
                }
            } catch (error) {
                console.error('Error al actualizar beneficiario:', error);
                if (typeof AlertManager !== 'undefined') {
                    AlertManager.error("Error", "Ocurrió un error inesperado al actualizar");
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: "Ocurrió un error inesperado al actualizar"
                    });
                }
            }
        } else {
            console.log('Validaciones fallidas');
            if (typeof AlertManager !== 'undefined') {
                AlertManager.error("Formulario incompleto", "Corrige los campos resaltados antes de continuar");
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Formulario incompleto',
                    text: "Corrige los campos resaltados antes de continuar"
                });
            }
        }
    });

    // También podemos hacer una validación inicial cuando se carga el formulario
    setTimeout(() => {
        // Validar campos que ya tienen valores
        validarNombre();
        validarApellido();
        validarCedula();
        validarCorreo();
        validarTelefono();
        validarFechaNacimiento();
        validarDireccion();
        validarGenero();
        validarSeccion();
        validarPNF();
        validarEstatus();
    }, 500);
}