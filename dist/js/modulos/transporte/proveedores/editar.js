document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formEditarProveedor');
    if (!form) return;

    // Elementos del formulario
    const elements = {
        tipo_documento: form.querySelector('#tipo_documento'),
        num_documento: form.querySelector('#num_documento'),
        nombre: form.querySelector('#nombre'),
        prefijo: form.querySelector('#prefijo'),
        numero_telefono: form.querySelector('#numero_telefono'),
        correo: form.querySelector('#correo'),
        direccion: form.querySelector('#direccion'),
        id_proveedor: form.querySelector('#id_proveedor')
    };

    // Helper functions
    const showError = (field, msg) => {
        // Buscar si ya existe un elemento de error
        let errorElement = document.getElementById(`${field.id}Error`);
        
        // Si no existe, crearlo
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.id = `${field.id}Error`;
            errorElement.className = 'invalid-feedback';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = msg;
        field.classList.add('is-invalid');
    };

    function validarTipoDocumento() {
        const tipo_documento = elements.tipo_documento.value;
        if (tipo_documento === "" || tipo_documento === null) {
            showError(elements.tipo_documento, "Este campo es obligatorio");
            return false;
        }
        clearError(elements.tipo_documento);
        return true;
    };

    const clearError = (field) => {
        const errorElement = document.getElementById(`${field.id}Error`);
        if (errorElement) {
            errorElement.textContent = '';
        }
        field.classList.remove('is-invalid');
    };

    // Validaciones específicas
    function validarDocumento() {
        const tipo_documento = elements.tipo_documento.value;
        let num_documento = elements.num_documento.value.trim();
        
        // Limpiar caracteres no numéricos
        elements.num_documento.value = num_documento.replace(/[^0-9]/g, '');
        num_documento = elements.num_documento.value;
        
        if (num_documento === "") {
            showError(elements.num_documento, "El número de documento es obligatorio");
            return false;
        }
        
        if (num_documento.length < 7 || num_documento.length > 10) {
            showError(elements.num_documento, 'Introduzca un documento válido (7 u 10 dígitos)');
            return false;
        }
        
        // Validación con AJAX
        return new Promise((resolve) => {
            fetch("index.php?action=validar_cedula", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `cedula=${encodeURIComponent(num_documento)}&tipo_cedula=${encodeURIComponent(tipo_documento)}&id_proveedor=${encodeURIComponent(elements.id_proveedor.value)}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.existe) {
                    showError(elements.num_documento, "El documento ya está registrado");
                    resolve(false);
                } else {
                    clearError(elements.num_documento);
                    resolve(true);
                }
            })
            .catch(() => {
                showError(elements.num_documento, "Error al verificar el documento");
                resolve(false);
            });
        });
    }

    function validarNombre() {
        const nombre = elements.nombre.value.trim();
        const regex = /^[a-zA-ZÀ-ÿ\s]{2,50}$/;
        
        if (nombre === "") {
            showError(elements.nombre, "El nombre es obligatorio");
            return false;
        }
        
        if (!regex.test(nombre)) {
            showError(elements.nombre, "Solo letras y espacios, máximo 50 caracteres");
            return false;
        }
        
        clearError(elements.nombre);
        return true;
    }

    function validarCorreo() {
        const correo = elements.correo.value.trim();
        const correoRegex = /^[a-zA-Z0-9._%+-]+@(hotmail|yahoo|gmail|outlook)\.(com|es|net|org)$/i;
        
        if (correo === "") {
            showError(elements.correo, "El correo es obligatorio");
            return false;
        }
        
        if (!correoRegex.test(correo)) {
            showError(elements.correo, "Correo inválido. Dominios permitidos: hotmail, yahoo, gmail, outlook");
            return false;
        }

        const idProveedor = document.querySelector('input[name="id_proveedor"]')?.value || null;
        
        // Validación con AJAX
        return new Promise((resolve) => {
            fetch("index.php?action=validar_correo", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `correo=${encodeURIComponent(correo)}&id_proveedor=${idProveedor}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.existe) {
                    showError(elements.correo, "El correo ya está registrado");
                    resolve(false);
                } else {
                    clearError(elements.correo);
                    resolve(true);
                }
            })
            .catch(() => {
                showError(elements.correo, "Error al verificar el correo");
                resolve(false);
            });
        });
    }

    function validarTelefono() {
        const prefijo = elements.prefijo.value;
        let numero = elements.numero_telefono.value.trim();
        let valido = true;
        
        // Limpiar caracteres no numéricos
        elements.numero_telefono.value = numero.replace(/[^0-9]/g, '');
        numero = elements.numero_telefono.value;
        
        if (!prefijo) {
            showError(elements.prefijo, 'Seleccione un prefijo');
            valido = false;
        } else {
            clearError(elements.prefijo);
        }

        if (numero === "") {
            showError(elements.numero_telefono, "Número es obligatorio");
            valido = false;
        } else if (numero.length !== 7) {
            showError(elements.numero_telefono, "Debe tener 7 dígitos");
            valido = false;
        } else {
            clearError(elements.numero_telefono);
        }

        if (!valido) return Promise.resolve(false);
        
        // Validación con AJAX
        const telefonoCompleto = prefijo + numero;
        return new Promise((resolve) => {
            fetch("index.php?action=validar_telefono", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `telefono=${encodeURIComponent(telefonoCompleto)}&id_proveedor=${encodeURIComponent(elements.id_proveedor.value)}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.existe) {
                    showError(elements.numero_telefono, "El teléfono ya está registrado");
                    resolve(false);
                } else {
                    clearError(elements.numero_telefono);
                    // Concatenar prefijo y número en el campo oculto
                    document.getElementById('telefono').value = telefonoCompleto;
                    resolve(true);
                }
            })
            .catch(() => {
                showError(elements.numero_telefono, "Error al verificar el teléfono");
                resolve(false);
            });
        });
    }

    function validarDireccion() {
        const direccion = elements.direccion.value.trim();
        if (direccion === "") {
            showError(elements.direccion, "La dirección es obligatoria");
            return false;
        }
        
        if (direccion.length < 10) {
            showError(elements.direccion, "Mínimo 10 caracteres");
            return false;
        }
        
        clearError(elements.direccion);
        return true;
    }

    // Event Listeners para validación en tiempo real
    elements.num_documento.addEventListener('input', function() {
        validarDocumento();
    });
    elements.tipo_documento.addEventListener('change', validarTipoDocumento);
    elements.nombre.addEventListener('input', validarNombre);
    elements.correo.addEventListener('input', validarCorreo);
    
    elements.prefijo.addEventListener('change', function() {
        if (this.value) {
            clearError(elements.prefijo);
        }
    });
    
    elements.numero_telefono.addEventListener('input', validarTelefono);
    elements.direccion.addEventListener('input', validarDireccion);

    // Submit Handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Realizar todas las validaciones
        const isTipoDocValid = validarTipoDocumento();
        const cedulaValida = await validarDocumento();
        const nombreValido = validarNombre();
        const correoValido = await validarCorreo();
        const telefonoValido = await validarTelefono();
        const direccionValida = validarDireccion();
        
        const isValid = isTipoDocValid && cedulaValida && nombreValido && correoValido && 
                        telefonoValido && direccionValida;
        
        if (!isValid) {
            Swal.fire({
                icon: 'error',
                title: 'Validación',
                text: 'Revise los campos resaltados',
                confirmButtonColor: '#d33'
            });
            return;
        }

        // Envío del formulario
        try {
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success === true) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Empleado registrado!',
                    text: data.message,
                    confirmButtonColor: '#3085d6'
                });
                
                window.location.href = 'index.php?action=gestionar_transporte';
            } else {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.message,
                    confirmButtonColor: '#d33'
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
                confirmButtonColor: '#d33'
            });
        }
    });
});