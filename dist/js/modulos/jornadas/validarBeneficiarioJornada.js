// ==================== FUNCIONES DE VALIDACIÓN PARA BENEFICIARIO JORNADA ====================

// Funciones auxiliares para mostrar y limpiar errores
function showErrorBeneficiarioJornada(field, msg) {
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
}

function clearErrorBeneficiarioJornada(field) {
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
}

const elements = {
    tipo_cedula: document.getElementById('tipo_cedula'),
    cedula: document.getElementById('cedula'),
    nombres: document.getElementById('nombres'),
    apellidos: document.getElementById('apellidos'),
    telefono_prefijo: document.getElementById('telefono_prefijo'),
    telefono_numero: document.getElementById('telefono_numero'),
    telefono: document.getElementById('telefono'),
    genero: document.getElementById('genero'),
    fecha_nacimiento: document.getElementById('fecha_nacimiento'),
    correo: document.getElementById('correo'),
    tipo_paciente: document.getElementById('tipo_paciente'),
    direccion: document.getElementById('direccion')
};

// ==================== FUNCIÓN PRINCIPAL DE VALIDACIÓN ====================
async function validarFormularioBeneficiarioJornada() {
    // Aquí puedes agregar todas las validaciones necesarias
    // Por ahora, solo validaciones básicas requeridas

    const validaciones = [
        validarCedulaBasico(),
        validarNombresBasico(),
        validarApellidosBasico(),
        validarTelefonoBasico(),
        validarGeneroBasico(),
        validarFechaNacimientoBasico(),
        validarTipoPacienteBasico(),
        validarCorreo(),
        validarDireccion()
    ];

    return validaciones.every(v => v === true);
}

// ==================== VALIDACIONES BÁSICAS ====================

function validarCedulaBasico() {
    const cedula = elements.cedula.value.trim();
    const tipoCedula = elements.tipo_cedula.value.trim();

    if (tipoCedula === "") {
        showErrorBeneficiarioJornada(elements.tipo_cedula, "El tipo de cédula es obligatorio");
        return false;
    }

    if (cedula === "") {
        showErrorBeneficiarioJornada(elements.cedula, "La cédula es obligatoria");
        return false;
    }

    if (cedula.length < 6 || cedula.length > 15) {
        showErrorBeneficiarioJornada(elements.cedula, "La cédula debe tener entre 6 y 15 dígitos");
        return false;
    }

    clearErrorBeneficiarioJornada(elements.cedula);
    clearErrorBeneficiarioJornada(elements.tipo_cedula);
    return true;
}

function validarNombresBasico() {
    const nombres = elements.nombres.value.trim();

    if (nombres === "") {
        showErrorBeneficiarioJornada(elements.nombres, "Los nombres son obligatorios");
        return false;
    }

    if (nombres.length < 2 || nombres.length > 50) {
        showErrorBeneficiarioJornada(elements.nombres, "Los nombres deben tener entre 2 y 50 caracteres");
        return false;
    }

    clearErrorBeneficiarioJornada(elements.nombres);
    return true;
}

function validarApellidosBasico() {
    const apellidos = elements.apellidos.value.trim();

    if (apellidos === "") {
        showErrorBeneficiarioJornada(elements.apellidos, "Los apellidos son obligatorios");
        return false;
    }

    if (apellidos.length < 2 || apellidos.length > 50) {
        showErrorBeneficiarioJornada(elements.apellidos, "Los apellidos deben tener entre 2 y 50 caracteres");
        return false;
    }

    clearErrorBeneficiarioJornada(elements.apellidos);
    return true;
}

function validarTelefonoBasico() {
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

    clearErrorBeneficiarioJornada(elements.telefono_numero);
    clearErrorBeneficiarioJornada(elements.telefono_prefijo);
    clearErrorBeneficiarioJornada(elements.telefono);
    return true;
}

function validarGeneroBasico() {
    const genero = elements.genero.value;

    if (!genero || genero === "") {
        showErrorBeneficiarioJornada(elements.genero, "El género es obligatorio");
        return false;
    }

    clearErrorBeneficiarioJornada(elements.genero);
    return true;
}

function validarFechaNacimientoBasico() {
    const fechaNacimiento = elements.fecha_nacimiento.value;

    if (!fechaNacimiento || fechaNacimiento === "") {
        showErrorBeneficiarioJornada(elements.fecha_nacimiento, "La fecha de nacimiento es obligatoria");
        return false;
    }

    const fechaNac = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
        edad--;
    }

    if (edad < 15 || edad > 120) {
        showErrorBeneficiarioJornada(elements.fecha_nacimiento, "La fecha de nacimiento debe ser mayor o igual a 15 años");
        return false;
    }

    clearErrorBeneficiarioJornada(elements.fecha_nacimiento);
    return true;
}

function validarTipoPacienteBasico() {
    const tipoPaciente = elements.tipo_paciente.value;

    if (!tipoPaciente || tipoPaciente === "") {
        showErrorBeneficiarioJornada(elements.tipo_paciente, "El tipo de paciente es obligatorio");
        return false;
    }

    clearErrorBeneficiarioJornada(elements.tipo_paciente);
    return true;
}

function validarCorreo() {
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

    clearError(elements.correo);
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

elements.tipo_cedula.addEventListener('change', validarCedulaBasico);
elements.cedula.addEventListener('input', validarCedulaBasico);
elements.nombres.addEventListener('input', validarNombresBasico);
elements.apellidos.addEventListener('input', validarApellidosBasico);
elements.telefono_prefijo.addEventListener('change', validarTelefonoBasico);
elements.telefono_numero.addEventListener('input', validarTelefonoBasico);
elements.genero.addEventListener('input', validarGeneroBasico);
elements.fecha_nacimiento.addEventListener('input', validarFechaNacimientoBasico);
elements.tipo_paciente.addEventListener('input', validarTipoPacienteBasico);
elements.correo.addEventListener('input', validarCorreo);
elements.direccion.addEventListener('input', validarDireccion);
