/**
 * HELP_GUIDES – Contenido textual de todas las guías del Centro de Ayuda.
 *
 * Cada key representa un identificador único de guía.
 * El modal lee estos datos para renderizar pasos, tips y notas.
 */
const HELP_GUIDES = {

    /* ═══════════════════════════════════════════
       INICIO DE SESIÓN Y PANEL PRINCIPAL
       ═══════════════════════════════════════════ */

    login_acceso: {
        category: "Inicio de Sesión",
        title: "¿Cómo iniciar sesión en el sistema?",
        steps: [
            { icon: "fa-envelope", text: 'Ingrese su <b>correo electrónico</b> registrado en el campo de usuario.' },
            { icon: "fa-lock", text: 'Introduzca su <b>contraseña</b> de seguridad (mínimo 8 dígitos, debe incluir al menos una letra). Ejemplo: <code>M2345678</code>.' },
            { icon: "fa-sign-in-alt", text: 'Haga clic en el botón <b>"Iniciar"</b> para acceder al panel principal.' }
        ],
        tip: "Si ha olvidado su contraseña, contacte al administrador del sistema para restablecerla."
    },

    login_dashboard: {
        category: "Inicio de Sesión",
        title: "¿Qué es el Calendario de Actividades?",
        steps: [
            { icon: "fa-calendar-alt", text: 'Al ingresar, visualizará el <b>Calendario de Actividades</b> como pantalla principal.' },
            { icon: "fa-tasks", text: 'El calendario muestra las <b>tareas y eventos programados</b> del sistema.' },
            { icon: "fa-chart-line", text: 'También se presentan <b>métricas esenciales</b> con indicadores clave de la gestión.' }
        ],
        tip: "Puede navegar entre meses usando las flechas del calendario para ver eventos pasados o futuros."
    },

    /* ═══════════════════════════════════════════
       GESTIÓN DE EMPLEADOS
       ═══════════════════════════════════════════ */

    empleados_crear: {
        category: "Empleados",
        title: "¿Cómo registrar un nuevo empleado?",
        steps: [
            { icon: "fa-mouse-pointer", text: 'En el menú lateral, seleccione <b>Gestionar Empleados >> Crear</b>.' },
            { icon: "fa-edit", text: 'Complete el formulario con los <b>datos personales</b>, el cargo y asigne el <b>Rol</b> correspondiente (Administrador, Medicina, Psicología, etc.).' },
            { icon: "fa-check-circle", text: 'Presione el botón <b>"Registrar"</b> para guardar el nuevo empleado.' }
        ],
        tip: "Los roles disponibles son: Administrador, Medicina, Psicología, Orientación, Trabajo Social, Discapacidad, Secretaria y Transporte."
    },

    empleados_consultar: {
        category: "Empleados",
        title: "¿Cómo consultar, editar o eliminar empleados?",
        steps: [
            { icon: "fa-mouse-pointer", text: 'Seleccione <b>Gestionar Empleados >> Consultar</b> en el menú lateral.' },
            { icon: "fa-list", text: 'Se mostrará el <b>listado de empleados</b> registrados en el sistema.' },
            { icon: "fa-pencil-alt", text: 'Use el botón <b class="text-warning">Amarillo</b> para <b>editar</b> los datos de un empleado.' },
            { icon: "fa-trash-alt", text: 'Use el botón <b class="text-danger">Rojo</b> para <b>eliminar</b> el acceso de un empleado.' }
        ],
        tip: "Antes de eliminar un empleado, asegúrese de que no tenga citas o diagnósticos pendientes asignados."
    },

    /* ═══════════════════════════════════════════
       GESTIÓN DE BENEFICIARIOS
       ═══════════════════════════════════════════ */

    beneficiarios_crear: {
        category: "Beneficiarios",
        title: "¿Cómo registrar un nuevo beneficiario?",
        steps: [
            { icon: "fa-mouse-pointer", text: 'Seleccione <b>Gestionar Beneficiarios >> Crear</b> en el menú lateral.' },
            { icon: "fa-edit", text: 'Complete los datos del estudiante: <b>Cédula, Nombres, PNF</b> y demás campos requeridos.' },
            { icon: "fa-check-circle", text: 'Haga clic en <b>"Registrar"</b> para guardar el beneficiario.' }
        ],
        tip: "PNF se refiere al Programa Nacional de Formación al que pertenece el estudiante."
    },

    beneficiarios_consultar: {
        category: "Beneficiarios",
        title: "¿Cómo consultar, editar o eliminar beneficiarios?",
        steps: [
            { icon: "fa-mouse-pointer", text: 'Seleccione <b>Gestionar Beneficiarios >> Consultar</b>.' },
            { icon: "fa-list", text: 'Se mostrará el <b>listado de beneficiarios</b> registrados.' },
            { icon: "fa-pencil-alt", text: 'Use el botón <b class="text-warning">Amarillo</b> para <b>editar</b> datos.' },
            { icon: "fa-trash-alt", text: 'Use el botón <b class="text-danger">Rojo</b> para <b>eliminar</b> al beneficiario.' }
        ],
        tip: "El sistema almacena toda la información de forma organizada en la base de datos para consultas rápidas y seguras."
    },

    /* ═══════════════════════════════════════════
       GESTIÓN DE CITAS
       ═══════════════════════════════════════════ */

    citas_crear: {
        category: "Citas",
        title: "¿Cómo agendar una nueva cita?",
        steps: [
            { icon: "fa-mouse-pointer", text: 'Seleccione la opción <b>Gestionar Citas >> Crear</b>.' },
            { icon: "fa-user-check", text: 'Seleccione al <b>beneficiario</b> y asigne al <b>psicólogo disponible</b>.' },
            { icon: "fa-clock", text: 'Presione en <b>"Horario"</b> para visualizar la disponibilidad de cada psicólogo antes de asignar.' },
            { icon: "fa-calendar-plus", text: 'Complete los datos del solicitante, asigne la <b>fecha</b> y el <b>servicio requerido</b>.' },
            { icon: "fa-check-circle", text: 'Confirme la cita para guardarla en el sistema.' }
        ],
        tip: "Siempre revise el horario del psicólogo antes de asignar la cita para evitar conflictos."
    },

    citas_consultar: {
        category: "Citas",
        title: "¿Cómo consultar o modificar citas?",
        steps: [
            { icon: "fa-mouse-pointer", text: 'Seleccione la opción <b>Gestionar Citas >> Consultar</b>.' },
            { icon: "fa-list", text: 'Visualice el <b>listado de citas agendadas</b>.' },
            { icon: "fa-pencil-alt", text: 'Use el botón <b class="text-warning">Amarillo</b> para <b>modificar</b> horarios o datos.' },
            { icon: "fa-trash-alt", text: 'Use el botón <b class="text-danger">Rojo</b> para <b>cancelar</b> o eliminar registros.' }
        ],
        tip: "Si necesita reagendar una cita, edítela en lugar de eliminarla para conservar el historial."
    },

    /* ═══════════════════════════════════════════
       DIAGNÓSTICOS
       ═══════════════════════════════════════════ */

    diagnosticos_general: {
        category: "Diagnósticos",
        title: "¿Cómo registrar un diagnóstico?",
        steps: [
            { icon: "fa-mouse-pointer", text: 'Diríjase a la sección <b>"Diagnósticos"</b> en el menú del sistema.' },
            { icon: "fa-file-medical", text: 'Seleccione el <b>área correspondiente</b> (Psicología, Medicina, Orientación, Trabajo Social o Discapacidad).' },
            { icon: "fa-edit", text: 'Registre los <b>hallazgos médicos o técnicos</b>, resultados de evaluación y recomendaciones.' },
            { icon: "fa-check-circle", text: 'Guarde el diagnóstico para que quede asociado al expediente del beneficiario.' }
        ],
        tip: "Después de registrar el diagnóstico, puede generar la Constancia o Recipe correspondiente."
    },

    diagnosticos_psicologia: {
        category: "Diagnósticos",
        title: "Atención en Psicología",
        steps: [
            { icon: "fa-brain", text: 'Acceda al módulo de <b>Diagnósticos</b> y seleccione <b>Psicología</b>.' },
            { icon: "fa-user-check", text: 'Busque al beneficiario por nombre o cédula.' },
            { icon: "fa-edit", text: 'Asiente los <b>hallazgos de la consulta</b> y las <b>recomendaciones terapéuticas</b>.' },
            { icon: "fa-save", text: 'Guarde el registro. Toda la información se almacena de forma estructurada para consultas rápidas.' }
        ],
        tip: "Use la sección de Gestionar Citas para organizar previamente la agenda de atención psicológica."
    },

    diagnosticos_medicina: {
        category: "Diagnósticos",
        title: "Consulta de Medicina General",
        steps: [
            { icon: "fa-stethoscope", text: 'Diríjase a <b>Diagnósticos</b> y seleccione el área de <b>Medicina</b>.' },
            { icon: "fa-user-check", text: 'Busque al beneficiario en el sistema.' },
            { icon: "fa-edit", text: 'Ingrese el <b>resultado de la evaluación médica</b> y el <b>tratamiento indicado</b>.' },
            { icon: "fa-save", text: 'Guarde el diagnóstico para que quede en el expediente.' }
        ],
        tip: "Tras registrar el diagnóstico, puede generar la Constancia o Recipe desde el mismo formulario."
    },

    diagnosticos_orientacion: {
        category: "Diagnósticos",
        title: "Registro en Orientación",
        steps: [
            { icon: "fa-compass", text: 'Acceda a <b>Diagnósticos</b> y seleccione <b>Orientación</b>.' },
            { icon: "fa-user-check", text: 'Localice al estudiante por nombre o cédula.' },
            { icon: "fa-edit", text: 'Documente los <b>resultados de entrevistas</b>, observaciones y <b>recomendaciones</b> sugeridas.' },
            { icon: "fa-save", text: 'Guarde para que el historial de orientación sea persistente y organizado.' }
        ],
        tip: "El sistema garantiza que todo el historial de orientación quede almacenado de forma segura."
    },

    diagnosticos_trabajo_social: {
        category: "Diagnósticos",
        title: "Diagnóstico de Trabajo Social",
        steps: [
            { icon: "fa-hands-helping", text: 'Diríjase a <b>Diagnósticos</b> y seleccione <b>Trabajo Social</b>.' },
            { icon: "fa-user-check", text: 'Busque al beneficiario en el sistema.' },
            { icon: "fa-edit", text: 'Asiente los resultados de <b>entrevistas, visitas domiciliarias o estudios socioeconómicos</b>.' },
            { icon: "fa-save", text: 'Verifique que la información socio-familiar esté completa y guarde.' }
        ],
        tip: "Es importante completar todos los campos correctamente para asegurar la precisión de los indicadores sociales."
    },

    diagnosticos_discapacidad: {
        category: "Diagnósticos",
        title: "Evaluación en Discapacidad",
        steps: [
            { icon: "fa-wheelchair", text: 'Acceda a <b>Diagnósticos</b> y seleccione <b>Discapacidad</b>.' },
            { icon: "fa-user-check", text: 'Localice al estudiante con diversidad funcional.' },
            { icon: "fa-edit", text: 'Ingrese las <b>condiciones específicas</b> y las <b>necesidades de apoyo</b> detectadas.' },
            { icon: "fa-save", text: 'Complete correctamente todos los campos del formulario y guarde.' }
        ],
        tip: "Asegúrese de detallar todas las necesidades de apoyo para facilitar el seguimiento institucional."
    },

    /* ═══════════════════════════════════════════
       INVENTARIO MÉDICO
       ═══════════════════════════════════════════ */

    inventario_crear: {
        category: "Inventario Médico",
        title: "¿Cómo registrar nuevos insumos?",
        steps: [
            { icon: "fa-mouse-pointer", text: 'En el menú lateral, seleccione <b>Inventario Médico >> Crear</b>.' },
            { icon: "fa-edit", text: 'Complete los datos del insumo: nombre, cantidad, fecha de vencimiento y demás especificaciones.' },
            { icon: "fa-check-circle", text: 'Presione <b>"Registrar"</b> para guardar el nuevo insumo en el sistema.' }
        ],
        tip: "Registre siempre la fecha de vencimiento para llevar un control adecuado de los medicamentos."
    },

    inventario_entradas_salidas: {
        category: "Inventario Médico",
        title: "¿Cómo registrar entradas y salidas de stock?",
        steps: [
            { icon: "fa-mouse-pointer", text: 'Diríjase a <b>Inventario Médico >> Consultar</b>.' },
            { icon: "fa-list", text: 'Visualice el listado de insumos disponibles con sus <b>cantidades</b> y <b>fechas de vencimiento</b>.' },
            { icon: "fa-plus-circle", text: 'Use el botón de acción para registrar una <b>Entrada</b> (sumar stock de nuevos suministros).' },
            { icon: "fa-minus-circle", text: 'Use el botón de acción para registrar una <b>Salida</b> (descontar por uso durante jornadas de salud).' }
        ],
        tip: "Mantenga el inventario actualizado después de cada jornada de salud para un control preciso."
    },

    /* ═══════════════════════════════════════════
       TRANSPORTE
       ═══════════════════════════════════════════ */

    transporte_vehiculos: {
        category: "Transporte",
        title: "¿Cómo gestionar vehículos?",
        steps: [
            { icon: "fa-mouse-pointer", text: 'En el menú lateral, seleccione <b>Gestionar Transporte >> Vehículos</b>.' },
            { icon: "fa-car", text: 'Desde aquí puede <b>registrar</b> nuevas unidades, <b>consultar</b> el estado de las existentes o <b>modificar</b> datos técnicos.' },
            { icon: "fa-check-circle", text: 'Complete los campos requeridos y guarde los cambios.' }
        ],
        tip: "Mantenga actualizados los datos técnicos de cada vehículo para facilitar el seguimiento de mantenimiento."
    },

    transporte_rutas: {
        category: "Transporte",
        title: "¿Cómo gestionar rutas y horarios?",
        steps: [
            { icon: "fa-mouse-pointer", text: 'Diríjase a la sección <b>"Rutas"</b> dentro del módulo de Transporte.' },
            { icon: "fa-route", text: 'Defina los <b>trayectos</b> (ej. Ruta del Oeste), asigne <b>conductores</b> y establezca los <b>horarios de salida y retorno</b>.' },
            { icon: "fa-check-circle", text: 'Guarde la configuración de la ruta.' }
        ],
        tip: "Puede visualizar las asignaciones de rutas directamente en el calendario del Dashboard."
    },

    transporte_proveedores: {
        category: "Transporte",
        title: "¿Cómo gestionar proveedores?",
        steps: [
            { icon: "fa-mouse-pointer", text: 'Seleccione <b>"Proveedores"</b> en el módulo de Transporte.' },
            { icon: "fa-edit", text: 'Registre o modifique la información de los proveedores de servicios y suministros.' },
            { icon: "fa-check-circle", text: 'Guarde los datos del proveedor.' }
        ],
        tip: "Vincule los proveedores con los repuestos para un control más eficiente de la cadena de suministro."
    },

    transporte_repuestos: {
        category: "Transporte",
        title: "¿Cómo controlar el inventario de repuestos?",
        steps: [
            { icon: "fa-mouse-pointer", text: 'Acceda a <b>Gestionar Transporte >> Repuestos</b>.' },
            { icon: "fa-plus-circle", text: 'Registre nuevas piezas indicando el <b>proveedor</b> y la <b>cantidad</b>.' },
            { icon: "fa-exchange-alt", text: 'Registre cada <b>ingreso</b> o <b>egreso</b> de material por concepto de reparación.' }
        ],
        tip: "Cada movimiento de repuestos queda registrado para auditorías y control administrativo."
    },

    transporte_mantenimiento: {
        category: "Transporte",
        title: "¿Cómo registrar mantenimientos?",
        steps: [
            { icon: "fa-mouse-pointer", text: 'Acceda a la sección de <b>"Mantenimientos"</b> dentro del módulo de Transporte.' },
            { icon: "fa-history", text: 'Consulte el <b>historial de reparaciones</b> de cada vehículo.' },
            { icon: "fa-eye", text: 'Use el botón <b class="text-primary">Azul</b> para <b>visualizar</b> detalles del mantenimiento.' },
            { icon: "fa-pencil-alt", text: 'Use el botón <b class="text-warning">Amarillo</b> para <b>modificar</b> registros.' },
            { icon: "fa-trash-alt", text: 'Use el botón <b class="text-danger">Rojo</b> para <b>eliminar</b> entradas erróneas.' }
        ],
        tip: "Registre periódicamente los mantenimientos preventivos para asegurar la operatividad de la flota."
    },

    /* ═══════════════════════════════════════════
       MOBILIARIO Y EQUIPOS
       ═══════════════════════════════════════════ */

    mobiliario_crear: {
        category: "Mobiliario y Equipos",
        title: "¿Cómo registrar mobiliario o equipos?",
        steps: [
            { icon: "fa-mouse-pointer", text: 'En el menú lateral, seleccione <b>Mobiliario y Equipos >> Crear</b>.' },
            { icon: "fa-edit", text: 'Llene los campos con las <b>especificaciones del producto</b>.' },
            { icon: "fa-check-circle", text: 'Haga clic en <b>"Guardar"</b> para registrar el equipo o mobiliario.' }
        ],
        tip: "Sea lo más detallado posible en las especificaciones para facilitar futuras auditorías."
    },

    mobiliario_ficha: {
        category: "Mobiliario y Equipos",
        title: "¿Cómo asignar una Ficha Técnica?",
        steps: [
            { icon: "fa-mouse-pointer", text: 'Seleccione la opción <b>"Ficha Técnica"</b> en el módulo de Mobiliario.' },
            { icon: "fa-clipboard-list", text: 'Asigne <b>cantidades específicas</b> de equipos o mobiliarios a un <b>área</b> o <b>responsable</b>.' },
            { icon: "fa-check-circle", text: 'Guarde la ficha para mantener el control de asignaciones.' }
        ],
        tip: "La ficha técnica permite un control detallado de quién es responsable de cada activo."
    },

    mobiliario_consultar: {
        category: "Mobiliario y Equipos",
        title: "¿Cómo consultar el inventario de mobiliario?",
        steps: [
            { icon: "fa-mouse-pointer", text: 'Seleccione <b>Mobiliario y Equipos >> Consultar</b>.' },
            { icon: "fa-list", text: 'Visualice el listado completo de activos registrados.' },
            { icon: "fa-pencil-alt", text: 'Use el botón <b class="text-warning">Amarillo</b> para <b>modificar</b>.' },
            { icon: "fa-trash-alt", text: 'Use el botón <b class="text-danger">Rojo</b> para <b>eliminar</b>.' }
        ],
        tip: "Realice revisiones periódicas del inventario para mantener la información actualizada."
    },

    /* ═══════════════════════════════════════════
       JORNADAS
       ═══════════════════════════════════════════ */

    jornadas_crear: {
        category: "Jornadas",
        title: "¿Cómo crear una jornada?",
        steps: [
            { icon: "fa-mouse-pointer", text: 'Acceda a <b>"Jornadas"</b> en el menú del sistema.' },
            { icon: "fa-edit", text: 'Defina el <b>nombre de la jornada</b>, la <b>fecha</b> y el <b>propósito institucional</b>.' },
            { icon: "fa-check-circle", text: 'Guarde la jornada para que quede registrada en el sistema.' }
        ],
        tip: "Las jornadas son eventos especiales de atención masiva. Puede realizar seguimiento de las actividades realizadas durante estos operativos."
    },

    /* ═══════════════════════════════════════════
       REFERENCIAS SOCIALES
       ═══════════════════════════════════════════ */

    referencias_crear: {
        category: "Referencias Sociales",
        title: "¿Cómo gestionar referencias sociales?",
        steps: [
            { icon: "fa-mouse-pointer", text: 'Seleccione la opción <b>Gestionar Referencias >> Crear</b>.' },
            { icon: "fa-search", text: 'Busque al beneficiario por su <b>nombre o cédula</b>.' },
            { icon: "fa-edit", text: 'Complete los campos del formulario con el <b>motivo de la derivación</b> a otra institución o departamento.' },
            { icon: "fa-check-circle", text: 'Haga clic en <b>"Guardar Referencia"</b> para formalizar el proceso.' }
        ],
        tip: "Las referencias permiten canalizar casos a otras instituciones o departamentos especializados para una atención integral."
    },

    /* ═══════════════════════════════════════════
       REPORTES
       ═══════════════════════════════════════════ */

    reportes_general: {
        category: "Reportes",
        title: "¿Cómo generar un reporte general?",
        steps: [
            { icon: "fa-mouse-pointer", text: 'En el menú lateral, haga clic en <b>Reportes >> General</b>.' },
            { icon: "fa-filter", text: 'Seleccione el rango de fechas en <b>"Fecha de inicio"</b> y <b>"Fecha fin"</b>.' },
            { icon: "fa-sliders-h", text: 'Seleccione el <b>Género</b> u otros filtros que desee consultar.' },
            { icon: "fa-chart-bar", text: 'Haga clic en el botón azul <b>"Generar Reporte"</b>.' },
            { icon: "fa-table", text: 'El sistema mostrará una <b>tabla de resultados</b> y <b>gráficas estadísticas</b> automáticas.' }
        ],
        tip: "Los reportes generales ofrecen una visión global del estado del sistema."
    },

    reportes_area: {
        category: "Reportes",
        title: "¿Cómo generar un reporte por área específica?",
        steps: [
            { icon: "fa-mouse-pointer", text: 'Vaya a <b>"Reportes"</b> y seleccione el <b>departamento específico</b> (Psicología, Medicina, Orientación, etc.).' },
            { icon: "fa-calendar-alt", text: 'Indique el periodo de tiempo en <b>"Fecha de inicio"</b> y <b>"Fecha fin"</b>.' },
            { icon: "fa-concierge-bell", text: 'Seleccione el <b>Servicio</b> (ej. Consultas, Morbilidad).' },
            { icon: "fa-file-alt", text: 'Elija el <b>Tipo de reporte</b> que desea analizar.' },
            { icon: "fa-chart-bar", text: 'Presione <b>"Generar Reporte"</b> para cargar la previsualización de datos y gráficas.' }
        ],
        tip: "El sistema genera automáticamente gráficas estadísticas basadas en los filtros aplicados para un análisis rápido."
    },

    /* ═══════════════════════════════════════════
       EXPORTACIÓN DE DATOS
       ═══════════════════════════════════════════ */

    exportar_datos: {
        category: "Exportación",
        title: "¿Cómo exportar reportes a Excel o PDF?",
        steps: [
            { icon: "fa-table", text: 'Una vez generado un reporte, <b>verifique</b> que los datos en la tabla de resultados sean correctos.' },
            { icon: "fa-file-excel", text: 'Haga clic en <b>"Exportar a Excel"</b> para obtener un archivo <b>.xlsx</b> editable con toda la data organizada.' },
            { icon: "fa-file-pdf", text: 'Haga clic en <b>"Exportar a PDF"</b> para generar un documento oficial con el <b>membrete de la UPTAEB</b> y la Dirección de Políticas Estudiantiles.' }
        ],
        tip: "El formato Excel es ideal para análisis de datos, mientras que el PDF se usa para documentos oficiales y entregas institucionales."
    },

    /* ═══════════════════════════════════════════
       SEGURIDAD Y CONFIGURACIÓN
       ═══════════════════════════════════════════ */

    seguridad_configuracion: {
        category: "Seguridad",
        title: "¿Cómo gestionar la configuración del sistema?",
        steps: [
            { icon: "fa-mouse-pointer", text: 'Seleccione <b>Seguridad >> Configuración >> Crear</b> en el menú lateral.' },
            { icon: "fa-edit", text: 'Complete los campos con la <b>información de configuración</b> requerida.' },
            { icon: "fa-check-circle", text: 'Haga clic en <b>"Registrar"</b> para guardar los parámetros.' }
        ],
        tip: "La configuración permite gestionar los parámetros generales del sistema. Solo el administrador debe realizar cambios aquí."
    },

    seguridad_bitacora: {
        category: "Seguridad",
        title: "¿Cómo revisar la bitácora del sistema?",
        steps: [
            { icon: "fa-mouse-pointer", text: 'Seleccione <b>Seguridad >> Bitácora</b> en el menú lateral.' },
            { icon: "fa-history", text: 'Visualice el <b>historial completo de movimientos</b> del sistema.' },
            { icon: "fa-info-circle", text: 'Cada registro muestra: <b>usuario</b> que realizó la acción, <b>tipo de acción</b> (Insertó, Eliminó, Editó) y la <b>fecha/hora exacta</b>.' }
        ],
        tip: "La bitácora es una herramienta de auditoría que registra automáticamente todas las acciones realizadas en el sistema."
    },

    /* ═══════════════════════════════════════════
       SOPORTE TÉCNICO
       ═══════════════════════════════════════════ */

    soporte_tecnico: {
        category: "Soporte",
        title: "¿Cómo obtener soporte técnico?",
        steps: [
            { icon: "fa-exclamation-triangle", text: 'Si encuentra errores no identificados o problemas técnicos en el sistema, puede solicitar asistencia.' },
            { icon: "fa-envelope", text: 'Envíe un correo detallando el problema a: <b>educacionmediadaticl@uptaeb.edu.ve</b>' },
            { icon: "fa-map-marker-alt", text: 'También puede dirigirse presencialmente al <b>Soporte técnico de la UPTAEB</b>.' }
        ],
        tip: "Al reportar un problema, incluya capturas de pantalla y la descripción exacta de los pasos que realizó antes del error."
    }
};
