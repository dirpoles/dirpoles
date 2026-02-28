document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('formulario-beneficiario');
    if (!form) return;

    const elements = {
        tipo_cedula: document.getElementById('tipo_cedula'),
        cedula: document.getElementById('cedula'),
        nombres: document.getElementById('nombres'),
        apellidos: document.getElementById('apellidos'),
        correo: document.getElementById('correo'),
        telefono_prefijo: document.getElementById('telefono_prefijo'),
        telefono_numero: document.getElementById('telefono_numero'),
        telefono: document.getElementById('telefono'),
        fecha_nacimiento: document.getElementById('fecha_nac'),
        direccion: document.getElementById('direccion'),
        id_pnf: document.getElementById('id_pnf'),
        genero: document.getElementById('genero'),
        seccion_numero: document.getElementById('seccion_numero'),
        seccion_sede: document.getElementById('seccion_sede'),
        seccion: document.getElementById('seccion')
    };

    const showError = (field, msg) => {
        // Para todos los campos, incluyendo Select2
        const errorElement = document.getElementById(`${field.id}Error`);
        if (errorElement) {
            errorElement.textContent = msg;
            errorElement.style.display = 'block';
        }

        field.classList.add("is-invalid");
        field.classList.remove("is-valid");

        // Solo para Select2 - también aplicar estilo al contenedor visible
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
                    tipo_cedula: tipoCedula
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
                body: new URLSearchParams({ correo: correo })
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

        if (prefijo === "") {
            showError(elements.telefono, "El prefijo es obligatorio");
            showError(elements.telefono_numero, "");
            return false;
        }

        if (telefono_numero === "") {
            showError(elements.telefono, "El número de teléfono es obligatorio");
            showError(elements.telefono_numero, "");
            return false;
        }

        if (telefono_numero.length !== 7) {
            showError(elements.telefono, "El número debe tener 7 dígitos");
            showError(elements.telefono_numero, "");
            return false;
        }

        const telefono = prefijo + telefono_numero;
        elements.telefono.value = telefono;

        try {
            const response = await fetch('validar_telefono', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: new URLSearchParams({ telefono: telefono })
            });

            if (!response.ok) throw new Error('Error en la petición');

            const data = await response.json();

            if (data.existe) {
                showError(elements.telefono, "El teléfono ya está registrado");
                showError(elements.telefono_numero, "");
                return false;
            }

            clearError(elements.telefono);
            clearError(elements.telefono_numero);
            return true;
        } catch (error) {
            console.error('Error validando teléfono:', error);
            showError(elements.telefono, "Error al validar teléfono");
            showError(elements.telefono_numero, "");
            return false;
        }
    }

    function validarFechaNacimiento() {
        const fecha_nacimiento = elements.fecha_nacimiento.value;

        if (!fecha_nacimiento || fecha_nacimiento === "") {
            showError(elements.fecha_nacimiento, "La fecha de nacimiento es obligatoria");
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
            showError(elements.fecha_nacimiento, "Debe tener al menos 15 años");
            return false;
        }

        clearError(elements.fecha_nacimiento);
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

    elements.tipo_cedula.addEventListener('change', validarCedula);
    elements.cedula.addEventListener('input', validarCedula);
    elements.nombres.addEventListener('input', validarNombre);
    elements.apellidos.addEventListener('input', validarApellido);
    elements.correo.addEventListener('input', validarCorreo);
    elements.telefono_prefijo.addEventListener('change', validarTelefono);
    elements.telefono_numero.addEventListener('input', validarTelefono);
    elements.fecha_nacimiento.addEventListener('input', validarFechaNacimiento);
    elements.direccion.addEventListener('input', validarDireccion);
    elements.genero.addEventListener('change', validarGenero);
    $('#id_pnf').on('change', validarPNF);
    $('#id_pnf').on('select2:select', validarPNF);
    $('#id_pnf').on('clear', validarPNF);
    elements.seccion_numero.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
        validarSeccion();
    });
    $('#seccion_sede').on('change', validarSeccion);
    $('#seccion_sede').on('select2:select', validarSeccion);
    $('#seccion_sede').on('clear', validarSeccion);
    form.addEventListener('reset', function () {
        form.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
            el.classList.remove('is-valid', 'is-invalid');
        });
        form.querySelectorAll('.form-text.text-danger').forEach(msg => {
            msg.textContent = "";
        });
    });

    // También agregar validación al enviar el formulario, envíando mediante AJAX
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

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
            validarPNF()
        ];

        if (validaciones.every(v => v === true)) {
            try {
                const formData = new FormData(form);
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData
                });

                AlertManager.close();

                if (response.ok) {
                    const data = await response.json();

                    if (data.exito) {
                        AlertManager.success("Registro exitoso", data.mensaje).then(() => {
                            window.location.reload();
                        });
                    } else {
                        AlertManager.error("Error", data.error || data.mensaje || "Error desconocido");
                    }
                } else {
                    AlertManager.error("Error", "Error en la petición al servidor");
                }
            } catch (error) {
                AlertManager.close();
                console.error(error);
                AlertManager.error("Error", "Ocurrió un error inesperado");
            }
        } else {
            AlertManager.error("Formulario incompleto", "Corrige los campos resaltados antes de continuar");
        }
    });
});