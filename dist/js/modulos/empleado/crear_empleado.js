document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('formulario-empleado');
    if (!form) return;

    const elements = {
        tipo_cedula: document.getElementById('tipo_cedula'),
        cedula: document.getElementById('cedula'),
        nombre: document.getElementById('nombre'),
        apellido: document.getElementById('apellido'),
        correo: document.getElementById('correo'),
        telefono_prefijo: document.getElementById('telefono_prefijo'),
        telefono_numero: document.getElementById('telefono_numero'),
        telefono: document.getElementById('telefono'),
        id_tipo_empleado: document.getElementById('id_tipo_empleado'),
        fecha_nacimiento: document.getElementById('fecha_nacimiento'),
        clave: document.getElementById('clave'),
        estatus: document.getElementById('estatus'),
        direccion: document.getElementById('direccion')
    };

    const showError = (field, msg) => {
        const errorElement = document.getElementById(`${field.id}Error`);
        if (errorElement) errorElement.textContent = msg;

        field.classList.add("is-invalid");
        field.classList.remove("is-valid");

        // Si es Select2, aplicar al contenedor visible
        if ($(field).hasClass('select2')) {
            $(field).next('.select2-container').find('.select2-selection')
                .addClass('is-invalid')
                .removeClass('is-valid');
        }
    };

    const clearError = (field) => {
        const errorElement = document.getElementById(`${field.id}Error`);
        if (errorElement) errorElement.textContent = "";

        field.classList.remove("is-invalid");
        field.classList.add("is-valid");

        // Si es Select2, aplicar al contenedor visible
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
        const nombre = elements.nombre.value;
        const regex = /^[A-Za-zÀ-ÿ\u00f1\u00d1\s]{2,50}$/;

        if (nombre.trim() === "") {
            showError(elements.nombre, "El nombre es obligatorio");
            return false;
        }

        if (!regex.test(nombre)) {
            showError(elements.nombre, "El nombre solo debe contener letras, acentos y espacios, máximo 50 caracteres");
            return false;
        }

        // Prevención básica contra XSS: eliminar etiquetas HTML
        elements.nombre.value = nombre.replace(/<[^>]*>?/gm, "");

        clearError(elements.nombre);
        return true;
    }

    function validarApellido() {
        const apellido = elements.apellido.value;
        const regex = /^[A-Za-zÀ-ÿ\u00f1\u00d1\s]{2,50}$/;

        if (apellido.trim() === "") {
            showError(elements.apellido, "El apellido es obligatorio");
            return false;
        }

        if (!regex.test(apellido)) {
            showError(elements.apellido, "El apellido solo debe contener letras, acentos y espacios, máximo 50 caracteres");
            return false;
        }

        // Prevención básica contra XSS: eliminar etiquetas HTML
        elements.apellido.value = apellido.replace(/<[^>]*>?/gm, "");

        clearError(elements.apellido);
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

    function validarTipoEmpleado() {
        const id_tipo_empleado = elements.id_tipo_empleado.value;

        if (!id_tipo_empleado || id_tipo_empleado === "") {
            showError(elements.id_tipo_empleado, "El tipo de empleado es obligatorio");
            return false;
        }

        clearError(elements.id_tipo_empleado);
        return true;
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

    function validarClave() {
        const clave = elements.clave.value;
        const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/;

        if (!clave || clave === "") {
            showError(elements.clave, "La clave es obligatoria");
            return false;
        }

        if (!regex.test(clave)) {
            showError(elements.clave, "La clave debe tener al menos 8 caracteres, una letra, un número y un carácter especial");
            return false;
        }

        clearError(elements.clave);
        return true;
    }

    function validarEstatus() {
        const estatus = elements.estatus.value;

        if (!estatus || estatus === "") {
            showError(elements.estatus, "El estatus es obligatorio");
            return false;
        }

        clearError(elements.estatus);
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

    elements.tipo_cedula.addEventListener('change', validarCedula);
    elements.cedula.addEventListener('input', validarCedula);
    elements.nombre.addEventListener('input', validarNombre);
    elements.apellido.addEventListener('input', validarApellido);
    elements.correo.addEventListener('input', validarCorreo);
    elements.telefono_prefijo.addEventListener('change', validarTelefono);
    elements.telefono_numero.addEventListener('input', validarTelefono);
    // Cuando cambia (cualquier cambio)
    $('#id_tipo_empleado').on('change', () => validarTipoEmpleado());
    $('#id_tipo_empleado').on('select2:select', () => validarTipoEmpleado());
    $('#id_tipo_empleado').on('select2:clear', () => validarTipoEmpleado());
    elements.fecha_nacimiento.addEventListener('input', validarFechaNacimiento);
    elements.clave.addEventListener('input', validarClave);
    elements.estatus.addEventListener('change', validarEstatus);
    elements.direccion.addEventListener('input', validarDireccion);
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
            validarTipoEmpleado(),
            validarFechaNacimiento(),
            validarClave(),
            validarEstatus(),
            validarDireccion()
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