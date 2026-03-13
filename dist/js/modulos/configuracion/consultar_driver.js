window.onload = function () {
  addEventListener("click", function (e) {
    const btnAyuda = e.target.closest("#btn-ayuda");
    if (btnAyuda) {
    // Variables locales dentro del evento
    let driverActual = null;

    function crearDriverConSteps(steps) {
      return window.driver.js.driver({
        showProgress: true,
        nextBtnText: "Siguiente",
        prevBtnText: "Anterior",
        doneBtnText: "Finalizar",
        popoverClass: "mi-popover",
        steps: steps,
        onDestroy: function () {
          driverActual = null;
        },
      });
    }

    // Función para destruir el driver actual si existe
    function destruirDriverActual() {
      if (driverActual) {
        try {
          if (driverActual.isActive) {
            driverActual.destroy();
          }
        } catch (e) {
          console.log("Error al destruir driver:", e);
        }
        driverActual = null;
      }
    }

    // Steps para Mobiliario
    const patologiasSteps = [
      {
        element: "#btn-excel",
        popover: {
          title: "Exportar a Excel",
          description:
            "Descarga todos los datos de la tabla en formato Excel para su análisis y reportes.",
          side: "bottom",
          align: "center",
        },
      },
      {
        element: "#btn-pdf",
        popover: {
          title: "Exportar a PDF",
          description:
            "Genera un reporte profesional en PDF con los datos del inventario, listo para imprimir o compartir.",
          side: "bottom",
          align: "center",
        },
      },
      {
        element: "#tr-patologia",
        popover: {
          title: "Tabla de Configuración",
          description:
            "En esta tabla podrás ver todos los registros asociados a la opción seleccionada.",
          side: "bottom",
          align: "center",
        },
      },
      {
        element: "#btn-editar",
        popover: {
          title: "Editar Configuración",
          description: "Edita la información del registro seleccionado.",
          side: "right",
          align: "center",
        },
      },
    ];

    // Steps para PNF
    const pnfSteps = [
      {
        element: "#btn-excel",
        popover: { title: "Exportar a Excel", description: "Descarga todos los datos de la tabla de PNF en formato Excel para su análisis y reportes.", side: "bottom", align: "center" }
      },
      {
        element: "#btn-pdf",
        popover: { title: "Exportar a PDF", description: "Genera un reporte profesional en PDF con los datos de PNF, listo para imprimir o compartir.", side: "bottom", align: "center" }
      },
      {
        element: "#tr-pnf",
        popover: { title: "Tabla de PNF", description: "En esta tabla podrás ver todos los Programas Nacionales de Formación (PNF) registrados.", side: "bottom", align: "center" }
      },
      {
        element: "#btn-editar",
        popover: { title: "Editar PNF", description: "Edita la información del PNF seleccionado.", side: "right", align: "center" }
      }
    ];

    // Steps para Servicio
    const servicioSteps = [
      {
        element: "#btn-excel",
        popover: { title: "Exportar a Excel", description: "Descarga todos los datos de la tabla de Servicios en formato Excel para su análisis.", side: "bottom", align: "center" }
      },
      {
        element: "#btn-pdf",
        popover: { title: "Exportar a PDF", description: "Genera un reporte en PDF con los datos de los Servicios registrados.", side: "bottom", align: "center" }
      },
      {
        element: "#tr-servicio",
        popover: { title: "Tabla de Servicios", description: "En esta tabla podrás ver todos los servicios registrados.", side: "bottom", align: "center" }
      },
      {
        element: "#btn-editar",
        popover: { title: "Editar Servicio", description: "Edita la información del Servicio seleccionado.", side: "right", align: "center" }
      }
    ];

    // Steps para Tipo de Empleado
    const tipoEmpleadoSteps = [
      {
        element: "#btn-excel",
        popover: { title: "Exportar a Excel", description: "Descarga todos los datos de los Tipos de Empleados en formato Excel.", side: "bottom", align: "center" }
      },
      {
        element: "#btn-pdf",
        popover: { title: "Exportar a PDF", description: "Genera un reporte en PDF de los Tipos de Empleados.", side: "bottom", align: "center" }
      },
      {
        element: "#tr-tipo_empleado",
        popover: { title: "Tabla de Tipos de Empleado", description: "En esta tabla podrás ver los cargos o tipos de empleados registrados.", side: "bottom", align: "center" }
      },
      {
        element: "#btn-editar",
        popover: { title: "Editar Tipo de Empleado", description: "Edita la información del Tipo de Empleado seleccionado.", side: "right", align: "center" }
      }
    ];

    // Steps para Tipo de Mobiliario
    const tipoMobiliarioSteps = [
      {
        element: "#btn-excel",
        popover: { title: "Exportar a Excel", description: "Descarga todos los Tipos de Mobiliario en formato Excel.", side: "bottom", align: "center" }
      },
      {
        element: "#btn-pdf",
        popover: { title: "Exportar a PDF", description: "Genera un reporte en PDF de los Tipos de Mobiliario.", side: "bottom", align: "center" }
      },
      {
        element: "#tr-tipo_mobiliario",
        popover: { title: "Tabla de Tipos de Mobiliario", description: "En esta tabla podrás ver las categorías o tipos de mobiliario de inventario.", side: "bottom", align: "center" }
      },
      {
        element: "#btn-editar",
        popover: { title: "Editar Tipo de Mobiliario", description: "Edita la información de este Tipo de Mobiliario.", side: "right", align: "center" }
      }
    ];

    // Steps para Tipo de Equipo
    const tipoEquipoSteps = [
      {
        element: "#btn-excel",
        popover: { title: "Exportar a Excel", description: "Descarga todos los Tipos de Equipos en formato Excel.", side: "bottom", align: "center" }
      },
      {
        element: "#btn-pdf",
        popover: { title: "Exportar a PDF", description: "Genera un reporte en PDF de los Tipos de Equipos Tecnológicos.", side: "bottom", align: "center" }
      },
      {
        element: "#tr-tipo_equipo",
        popover: { title: "Tabla de Tipos de Equipo", description: "En esta tabla podrás ver las categorías o tipos de equipos registrados.", side: "bottom", align: "center" }
      },
      {
        element: "#btn-editar",
        popover: { title: "Editar Tipo de Equipo", description: "Edita la información de este Tipo de Equipo.", side: "right", align: "center" }
      }
    ];

    // Steps para Presentación de Insumo
    const presentacionInsumoSteps = [
      {
        element: "#btn-excel",
        popover: { title: "Exportar a Excel", description: "Descarga las Presentaciones de Insumos Médicos en formato Excel.", side: "bottom", align: "center" }
      },
      {
        element: "#btn-pdf",
        popover: { title: "Exportar a PDF", description: "Genera un reporte en PDF de las Presentaciones de Insumos Médicos.", side: "bottom", align: "center" }
      },
      {
        element: "#tr-presentacion_insumo",
        popover: { title: "Tabla de Presentaciones", description: "En esta tabla podrás ver las presentaciones de insumos médicos registradas.", side: "bottom", align: "center" }
      },
      {
        element: "#btn-editar",
        popover: { title: "Editar Presentación", description: "Edita la información de esta Presentación de Insumo.", side: "right", align: "center" }
      }
    ];

    // Función para iniciar el tour según la pestaña activa
    function iniciarTourSegunTab() {
      // Destruir el driver actual si existe
      destruirDriverActual();

        // Determinar qué pestaña está activa
        if ($("#patologias-tab").hasClass("active")) {
          driverActual = crearDriverConSteps(patologiasSteps);
          driverActual.drive();
        } else if ($("#pnf-tab").hasClass("active")) {
          driverActual = crearDriverConSteps(pnfSteps);
          driverActual.drive();
        } else if ($("#servicios-tab").hasClass("active")) {
          driverActual = crearDriverConSteps(servicioSteps);
          driverActual.drive();
        } else if ($("#tipo_empleados-tab").hasClass("active")) {
          driverActual = crearDriverConSteps(tipoEmpleadoSteps);
          driverActual.drive();
        } else if ($("#tipo_mobiliarios-tab").hasClass("active")) {
          driverActual = crearDriverConSteps(tipoMobiliarioSteps);
          driverActual.drive();
        } else if ($("#tipo_equipos-tab").hasClass("active")) {
          driverActual = crearDriverConSteps(tipoEquipoSteps);
          driverActual.drive();
        } else if ($("#presentacion_insumos-tab").hasClass("active")) {
          driverActual = crearDriverConSteps(presentacionInsumoSteps);
          driverActual.drive();
        }
    }

    // Llamar a la función para iniciar el tour
    iniciarTourSegunTab();
    }
  });
};