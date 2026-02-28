document.addEventListener('DOMContentLoaded', function () {
    // Mostrar mensaje de redirección si el middleware lo dejó en session
    if (window.REDIRECT_MESSAGE) {
        try {
            const m = window.REDIRECT_MESSAGE;
            // Usar AlertManager si está cargado, si no usar Swal directamente
            if (typeof AlertManager !== 'undefined') {
                AlertManager.warning(m.titulo || 'Alerta', m.mensaje || 'Debes iniciar sesión');
            } else if (typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'warning',
                    title: m.titulo || 'Alerta',
                    text: m.mensaje || 'Debes iniciar sesión',
                    confirmButtonText: 'Entendido'
                });
            } else {
                alert(m.mensaje || 'Debes iniciar sesión');
            }
        } catch (e) {
            // no interrumpir flujo
            console.error('Error al mostrar REDIRECT_MESSAGE:', e);
        }
    }

    // Detectar si se llegó desde un logout exitoso
    if (window.location.search.includes("logout=true")) {
        if (typeof AlertManager !== 'undefined') {
            AlertManager.success('Sesión cerrada', 'Has cerrado sesión exitosamente.');
        } else if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'success',
                title: 'Sesión cerrada',
                text: 'Has cerrado sesión exitosamente.',
                timer: 2000,
                showConfirmButton: false
            });
        }

        // Con esto limpiamos la URL para no repetir el mensaje
        history.replaceState(null, "", window.location.pathname);
    }

    const form = document.getElementById('formulario-login');
    if (!form) return;

    const elements = {
        correo: form.querySelector('#correo'),
        password: form.querySelector('#password'),
        submitBtn: form.querySelector('button[type="submit"]')
    };

    const showError = (field, msg) => {
        let errorElement = document.getElementById(`${field.id}Error`);
        if (!errorElement) return;
        errorElement.textContent = msg;
        field.classList.add("is-invalid");
    }

    const clearError = (field) => {
        const errorElement = document.getElementById(`${field.id}Error`);
        if (errorElement) {
            errorElement.textContent = "";
        }
        field.classList.remove("is-invalid");
    }

    // Validaciones ya existentes (las dejo como antes)
    async function validarCorreo() {
        const correo = elements.correo.value.trim();
        const correoRegex = /^[a-zA-Z0-9._%+-]+@(hotmail|yahoo|gmail|outlook)\.(com|es|net|org)$/i;

        if (correo === "") {
            showError(elements.correo, "El correo es obligatorio");
            return false;
        }

        if (!correoRegex.test(correo)) {
            showError(elements.correo, "Correo Electrónico inválido");
            return false;
        }

        clearError(elements.correo);
        return true;
    }

    async function validarPassword() {
        const password = elements.password.value.trim();
        const passwordRegex = /^(?=.*[A-Za-z])[A-Za-z\d]{8}$/;

        if (password === "") {
            showError(elements.password, "La contraseña es obligatoria");
            return false;
        }

        if (!passwordRegex.test(password)) {
            showError(elements.password, "Contraseña inválida");
            return false;
        }

        clearError(elements.password);
        return true;
    }

    // validación en tiempo real
    elements.correo.addEventListener("input", () => validarCorreo());
    elements.password.addEventListener("input", () => validarPassword());

    // Helper: obtiene todos los mensajes de error visibles (para mostrar en SweetAlert)
    function obtenerMensajesErrores() {
        const msgs = [];
        const correoErr = document.getElementById('correoError')?.textContent.trim();
        const passErr = document.getElementById('passwordError')?.textContent.trim();
        if (correoErr) msgs.push(correoErr);
        if (passErr) msgs.push(passErr);
        return msgs;
    }

    // Interceptar envío
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Ejecutar validaciones secuenciales
        const vCorreo = await validarCorreo();
        const vPass = await validarPassword();

        // Si hay algún error, evitar envío y mostrar SweetAlert con los mensajes exactos
        if (!vCorreo || !vPass) {
            const errores = obtenerMensajesErrores();
            const texto = errores.length ? errores.join('<br>') : 'Hay errores en el formulario, por favor verifícalos.';
            if (typeof Swal !== 'undefined' && Swal.fire) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Corrige los siguientes errores',
                    html: texto,
                    confirmButtonText: 'Entendido'
                });
            } else {
                alert('Corrige los errores: \n' + errores.join('\n'));
            }
            return;
        }

        // Preparar envío AJAX (se usa form.action para respetar rutas amigables)
        try {
            // Deshabilitar botón y mostrar estado
            if (elements.submitBtn) {
                elements.submitBtn.disabled = true;
                var originalText = elements.submitBtn.innerHTML;
                elements.submitBtn.innerHTML = 'Ingresando...';
            }

            const payload = new URLSearchParams();
            payload.append('correo', elements.correo.value.trim());
            payload.append('password', elements.password.value.trim());

            const response = await fetch(form.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json'
                },
                credentials: 'same-origin',
                body: payload.toString()
            });

            // comprobar status
            if (!response.ok) {
                throw new Error('Error en la petición: ' + response.status);
            }

            // parsear JSON
            const data = await response.json();

            // Esperamos un objeto JSON con al menos 'estado' y opcionalmente 'mensaje'
            if (data && data.estado === 'exito') {
                // Éxito: mostrar SweetAlert y redirigir a 'inicio'
                if (typeof Swal !== 'undefined' && Swal.fire) {
                    await Swal.fire({
                        icon: 'success',
                        title: data.titulo || '¡Bienvenido!',
                        text: data.mensaje || 'Has iniciado sesión correctamente.',
                        timer: 2000,
                        showConfirmButton: false
                    });
                }
                // Obtengo base URL a partir de form.action (para no depender de variables globales)
                const baseUrl = form.action.replace(/\/?iniciar_sesion\/?$/i, '');
                window.location.href = baseUrl + '/inicio';
                return;
            } else {
                // Error de credenciales u otro
                const msg = (data && data.mensaje) ? data.mensaje : 'Credenciales inválidas';
                if (typeof Swal !== 'undefined' && Swal.fire) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: msg
                    });
                } else {
                    alert(msg);
                }
            }

        } catch (err) {
            console.error(err);
            if (typeof Swal !== 'undefined' && Swal.fire) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: 'No se pudo completar la solicitud. Intenta de nuevo.'
                });
            } else {
                alert('No se pudo completar la solicitud. ' + err.message);
            }
        } finally {
            if (elements.submitBtn) {
                elements.submitBtn.disabled = false;
                elements.submitBtn.innerHTML = originalText;
            }
        }
    });
});
