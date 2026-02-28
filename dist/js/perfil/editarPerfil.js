$(function () {
    // Event listener para el botón de "Editar Perfil"
    $('#modalEditarPerfil').on('show.bs.modal', async function () {
        const idEmpleado = $('#user_id').data('id');

        if (!idEmpleado) {
            AlertManager.error('Error', 'No se pudo obtener el ID del usuario');
            return;
        }

        // Cargar datos del perfil
        try {
            const response = await fetch(`perfil_detalle?id_empleado=${idEmpleado}`);
            if (!response.ok) throw new Error('Error al cargar datos');

            const result = await response.json();

            if (result.exito && result.data) {
                const perfil = result.data;

                // Rellenar formulario
                $('#edit_id_empleado').val(perfil.id_empleado);
                $('#edit_nombre').val(perfil.nombre);
                $('#edit_apellido').val(perfil.apellido);

                // Separar cédula completa (V-12345678)
                const cedulaParts = perfil.cedula_completa.split('-');
                $('#edit_tipo_cedula').val(cedulaParts[0]);
                $('#edit_cedula').val(cedulaParts[1]);

                $('#edit_correo').val(perfil.correo);

                // Separar teléfono (04121234567)
                const telefono = perfil.telefono;
                $('#edit_telefono_prefijo').val(telefono.substring(0, 4));
                $('#edit_telefono_numero').val(telefono.substring(4));
                $('#edit_telefono').val(telefono);

                $('#edit_direccion').val(perfil.direccion);

                // Limpiar campos de contraseña
                $('#edit_clave_actual').val('');
                $('#edit_clave').val('');

                // Inicializar validaciones
                initValidationEditarPerfil();
            } else {
                AlertManager.error('Error', result.mensaje || 'No se pudieron cargar los datos');
            }
        } catch (error) {
            console.error(error);
            AlertManager.error('Error', 'Error de conexión');
        }
    });
});

function initValidationEditarPerfil() {
    const form = document.getElementById('formEditarPerfil');
    const elements = {
        id_empleado: document.getElementById('edit_id_empleado'),
        nombre: document.getElementById('edit_nombre'),
        apellido: document.getElementById('edit_apellido'),
        correo: document.getElementById('edit_correo'),
        telefono: document.getElementById('edit_telefono'),
        telefono_prefijo: document.getElementById('edit_telefono_prefijo'),
        telefono_numero: document.getElementById('edit_telefono_numero'),
        direccion: document.getElementById('edit_direccion'),
        clave_actual: document.getElementById('edit_clave_actual'),
        clave: document.getElementById('edit_clave'),
    };

    // ========== Funciones de Validación ==========

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

        elements.apellido.value = apellido.replace(/<[^>]*>?/gm, "");
        clearError(elements.apellido);
        return true;
    }

    async function validarCorreo() {
        const correo = elements.correo.value.trim();
        const id_empleado = elements.id_empleado.value;
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
                    id_empleado: id_empleado // Excluir el usuario actual
                })
            });

            if (!response.ok) throw new Error('Error en la petición');

            const data = await response.json();
            console.log('Validación correo:', { correo, id_empleado, response: data });

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
        const id_empleado = elements.id_empleado.value;

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
                body: new URLSearchParams({
                    telefono: telefono,
                    id_empleado: id_empleado // Excluir el usuario actual
                })
            });

            if (!response.ok) throw new Error('Error en la petición');

            const data = await response.json();
            console.log('Validación teléfono:', { telefono, id_empleado, response: data });

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

    function validarDireccion() {
        let direccion = elements.direccion.value;

        direccion = direccion.replace(/<[^>]*>?/gm, "");

        if (!direccion) {
            showError(elements.direccion, "La dirección es obligatoria");
            return false;
        }

        if (/^\s|\s$/.test(direccion)) {
            showError(elements.direccion, "La dirección no puede iniciar ni terminar con espacios");
            return false;
        }

        if (direccion.length < 5) {
            showError(elements.direccion, "La dirección debe tener al menos 5 caracteres");
            return false;
        }

        if (direccion.length > 250) {
            showError(elements.direccion, "La dirección debe tener máximo 250 caracteres");
            return false;
        }

        const regex = /^[A-Za-zÀ-ÿ0-9 ,.\-#]+$/;

        if (!regex.test(direccion)) {
            showError(elements.direccion, "La dirección solo puede contener letras, números, espacios, comas, puntos, guiones y #");
            return false;
        }

        elements.direccion.value = direccion;
        clearError(elements.direccion);
        return true;
    }

    function validarClave() {
        const clave = elements.clave.value;
        const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/;

        // Si está vacío, es válido (opcional)
        if (!clave || clave === "") {
            clearError(elements.clave);
            return true;
        }

        // Si tiene contenido, validar formato
        if (!regex.test(clave)) {
            showError(elements.clave, "La clave debe tener al menos 8 caracteres, una letra y un número");
            return false;
        }

        clearError(elements.clave);
        return true;
    }

    async function validarClaveActual() {
        const clave_actual = elements.clave_actual.value;
        const id_empleado = elements.id_empleado.value;

        // Siempre es requerida
        if (!clave_actual || clave_actual === "") {
            showError(elements.clave_actual, "Debes ingresar tu contraseña actual para guardar cambios");
            return false;
        }

        // Validar contraseña actual en el servidor
        try {
            const response = await fetch('validar_clave_actual', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: new URLSearchParams({
                    clave_actual: clave_actual,
                    id_empleado: id_empleado
                })
            });

            if (!response.ok) throw new Error('Error en la petición');

            const data = await response.json();

            if (!data.valida) {
                showError(elements.clave_actual, "La contraseña actual es incorrecta");
                return false;
            }

            clearError(elements.clave_actual);
            return true;
        } catch (error) {
            console.error('Error validando contraseña:', error);
            return false;
        }
    }

    // ========== Event Listeners ==========
    elements.nombre.addEventListener('input', validarNombre);
    elements.apellido.addEventListener('input', validarApellido);
    elements.correo.addEventListener('blur', validarCorreo); // Cambiar a blur para evitar muchas llamadas
    elements.telefono_prefijo.addEventListener('change', validarTelefono);
    elements.telefono_numero.addEventListener('blur', validarTelefono); // Cambiar a blur
    elements.direccion.addEventListener('input', validarDireccion);
    elements.clave.addEventListener('input', validarClave);
    elements.clave_actual.addEventListener('blur', validarClaveActual); // Cambiar a blur

    // ========== Submit Handler ==========
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Validar todos los campos (await para las validaciones async)
        const isNombreValid = validarNombre();
        const isApellidoValid = validarApellido();
        const isCorreoValid = await validarCorreo();
        const isTelefonoValid = await validarTelefono();
        const isDireccionValid = validarDireccion();
        const isClaveValid = validarClave();
        const isClaveActualValid = await validarClaveActual();

        if (isNombreValid && isApellidoValid && isCorreoValid && isTelefonoValid && isDireccionValid && isClaveValid && isClaveActualValid) {
            try {
                const formData = new FormData(form);

                // Si la nueva clave está vacía, removerla del FormData
                if (!formData.get('clave') || formData.get('clave').trim() === '') {
                    formData.delete('clave');
                }

                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.exito) {
                        $('#modalEditarPerfil').modal('hide');
                        AlertManager.success("Perfil actualizado", data.mensaje);

                        // Actualizar nombre en el header
                        $('.text-gray-600.small').text(formData.get('nombre') + ' ' + formData.get('apellido'));

                        // Limpiar formulario
                        form.reset();
                    } else {
                        AlertManager.error("Error", data.mensaje || "Error al actualizar");
                    }
                } else {
                    AlertManager.error("Error", "Error del servidor");
                }
            } catch (error) {
                console.error(error);
                AlertManager.error("Error", "Ocurrió un error inesperado");
            }
        } else {
            AlertManager.warning("Formulario incompleto", "Por favor corrige los errores");
        }
    });
}

// ========== Funciones Auxiliares ==========
function showError(field, msg) {
    const errorElement = document.getElementById(`${field.id}Error`);
    if (errorElement) {
        errorElement.textContent = msg;
        errorElement.style.display = 'block';
    }
    field.classList.add("is-invalid");
    field.classList.remove("is-valid");
}

function clearError(field) {
    const errorElement = document.getElementById(`${field.id}Error`);
    if (errorElement) {
        errorElement.textContent = "";
        errorElement.style.display = 'none';
    }
    field.classList.remove("is-invalid");
    field.classList.add("is-valid");
}
