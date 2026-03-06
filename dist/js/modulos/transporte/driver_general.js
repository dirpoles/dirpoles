window.onload = function () {
  document.getElementById("btn-ayuda").addEventListener("click", function () {
    // Variables locales dentro del evento
    let driverActual = null;

    function crearDriverConSteps(steps) {
      const validSteps = steps.filter(step => {
        return document.querySelector(step.element) !== null;
      });

      return window.driver.js.driver({
        showProgress: true,
        nextBtnText: "Siguiente",
        prevBtnText: "Anterior",
        doneBtnText: "Finalizar",
        popoverClass: "mi-popover",
        steps: validSteps,
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

    // Steps para Inicio
    const inicioSteps = [
      {
        element: "#transporteTab",
        popover: {
          title: "Navegación",
          description:
            "Navega entre las diferentes pestañas del módulo de transporte.",
          align: "center",
        },
      },{
        element: "#inicio-tab-content",
        popover: {
          title: "Estadísticas",
          description:
            "Estadísticas generales del módulo de transporte.",
          align: "center",
        },
      },
      {
        element: "#calendario-tab-content",
        popover: {
          title: "Calendario",
          description:
            "Calendario donde se reflejan las rutas y asignaciones.",
          align: "center",
        },
      },
      {
        element: "#accesos-tab-content",
        popover: {
          title: "Accesos Rápidos",
          description: "Accesos rápidos al módulo de transporte.",
          align: "center",
        },
      }
    ];

    // Steps para Vehículos
    const vehiculosSteps = [
      {
        element: "#btnExcel",
        popover: {
          title: "Exportar a Excel",
          description: "Exportar la tabla a Excel.",
          align: "center",
        },
      },
      {
        element: "#btnPdf",
        popover: {
          title: "Exportar a PDF",
          description: "Exportar la tabla a PDF.",
          align: "center",
        },
      },
      {
        element: "#btnCrear",
        popover: {
          title: "Crear Vehículo",
          description: "Crear un nuevo vehículo.",
          align: "center",
        },
      },
      {
        element: "#trVehiculos",
        popover: {
          title: "Informacion de la tabla",
          description: "Muestra la informacion de los vehiculos registrados.",
          align: "center",
        },
      },
      {
        element: "#btnVer",
        popover: {
          title: "Ver Vehículo",
          description:
            "Ver la informacion del vehiculo.",
          align: "center",
        },
      },
      {
        element: "#btnEditar",
        popover: {
          title: "Editar Vehículo",
          description:
            "Editar la informacion del vehiculo.",
          align: "center",
        },
      },
      {
        element: "#btnEliminar",
        popover: {
          title: "Eliminar Vehículo",
          description:
            "Eliminar el vehiculo.",
          align: "center",
        },
      }
    ];

    const proveedoresSteps = [
      {
        element: "#btnExcel",
        popover: {
          title: "Exportar a Excel",
          description: "Exportar la tabla a Excel.",
          align: "center",
        },
      },
      {
        element: "#btnPdf",
        popover: {
          title: "Exportar a PDF",
          description: "Exportar la tabla a PDF.",
          align: "center",
        },
      },
      {
        element: "#btnCrear",
        popover: {
          title: "Crear Proveedor",
          description: "Crear un nuevo proveedor.",
          align: "center",
        },
      },
      {
        element: "#trProveedores",
        popover: {
          title: "Informacion de la tabla",
          description: "Muestra la informacion de los proveedores registrados.",
          align: "center",
        },
      },
      {
        element: "#btnVer",
        popover: {
          title: "Ver Proveedor",
          description:
            "Ver la informacion del proveedor.",
          align: "center",
        },
      },
      {
        element: "#btnEditar",
        popover: {
          title: "Editar Proveedor",
          description:
            "Editar la informacion del proveedor.",
          align: "center",
        },
      },
      {
        element: "#btnEliminar",
        popover: {
          title: "Eliminar Proveedor",
          description:
            "Eliminar el proveedor.",
          align: "center",
        },
      }
    ];

    const rutasSteps = [
      {
        element: "#btnExcel",
        popover: {
          title: "Exportar a Excel",
          description: "Exportar la tabla a Excel.",
          align: "center",
        },
      },
      {
        element: "#btnPdf",
        popover: {
          title: "Exportar a PDF",
          description: "Exportar la tabla a PDF.",
          align: "center",
        },
      },
      {
        element: "#btnCrear",
        popover: {
          title: "Crear Ruta",
          description: "Crear una nueva ruta.",
          align: "center",
        },
      },
      {
        element: "#trRutas",
        popover: {
          title: "Informacion de la tabla",
          description: "Muestra la informacion de las rutas registradas.",
          align: "center",
        },
      },
      {
        element: "#btnVer",
        popover: {
          title: "Ver Ruta",
          description:
            "Ver la informacion de la ruta.",
          align: "center",
        },
      },
      {
        element: "#btnEditar",
        popover: {
          title: "Editar Ruta",
          description:
            "Editar la informacion de la ruta.",
          align: "center",
        },
      },
      {
        element: "#btnEliminar",
        popover: {
          title: "Eliminar Ruta",
          description:
            "Eliminar la ruta.",
          align: "center",
        },
      }
    ];

    const asignacionesSteps = [
      {
        element: "#btnExcel",
        popover: {
          title: "Exportar a Excel",
          description: "Exportar la tabla a Excel.",
          align: "center",
        },
      },
      {
        element: "#btnPdf",
        popover: {
          title: "Exportar a PDF",
          description: "Exportar la tabla a PDF.",
          align: "center",
        },
      },
      {
        element: "#btnCrear",
        popover: {
          title: "Crear Asignacion",
          description: "Crear una nueva asignacion.",
          align: "center",
        },
      },
      {
        element: "#trAsignarRecursos",
        popover: {
          title: "Informacion de la tabla",
          description: "Muestra la informacion de las asignaciones registradas.",
          align: "center",
        },
      },
      {
        element: "#btnVer",
        popover: {
          title: "Ver Asignacion",
          description:
            "Ver la informacion de la asignacion.",
          align: "center",
        },
      },
      {
        element: "#btnEditar",
        popover: {
          title: "Editar Asignacion",
          description:
            "Editar la informacion de la asignacion.",
          align: "center",
        },
      },
      {
        element: "#btnEliminar",
        popover: {
          title: "Eliminar Asignacion",
          description:
            "Eliminar la asignacion.",
          align: "center",
        },
      }
    ];

    const repuestosSteps = [
      {
        element: "#btnExcel",
        popover: {
          title: "Exportar a Excel",
          description: "Exportar la tabla a Excel.",
          align: "center",
        },
      },
      {
        element: "#btnPdf",
        popover: {
          title: "Exportar a PDF",
          description: "Exportar la tabla a PDF.",
          align: "center",
        },
      },
      {
        element: "#btnCrear",
        popover: {
          title: "Crear Repuesto",
          description: "Crear un nuevo repuesto.",
          align: "center",
        },
      },
      {
        element: "#btnAgregarEntrada",
        popover: {
          title: "Agregar Entrada",
          description: "Agregar un nuevo repuesto al inventario.",
          align: "center",
        },
      },
      {
        element: "#btnMovimientos",
        popover: {
          title: "Movimientos del Inventario",
          description: "Ver los movimientos del inventario.",
          align: "center",
        },
      },
      {
        element: "#trRepuestos",
        popover: {
          title: "Informacion de la tabla",
          description: "Muestra la informacion de los repuestos registrados.",
          align: "center",
        },
      },
      {
        element: "#btnVer",
        popover: {
          title: "Ver Repuesto",
          description:
            "Ver la informacion del repuesto.",
          align: "center",
        },
      },
      {
        element: "#btnEditar",
        popover: {
          title: "Editar Repuesto",
          description:
            "Editar la informacion del repuesto.",
          align: "center",
        },
      },
      {
        element: "#btnEliminar",
        popover: {
          title: "Eliminar Repuesto",
          description:
            "Eliminar el repuesto.",
          align: "center",
        },
      }
    ];

    const mantenimientosSteps = [
      {
        element: "#btnExcel",
        popover: {
          title: "Exportar a Excel",
          description: "Exportar la tabla a Excel.",
          align: "center",
        },
      },
      {
        element: "#btnPdf",
        popover: {
          title: "Exportar a PDF",
          description: "Exportar la tabla a PDF.",
          align: "center",
        },
      },
      {
        element: "#btnCrear",
        popover: {
          title: "Crear Mantenimiento",
          description: "Crear un nuevo mantenimiento.",
          align: "center",
        },
      },
      {
        element: "#trMantenimientos",
        popover: {
          title: "Informacion de la tabla",
          description: "Muestra la informacion de los mantenimientos registrados.",
          align: "center",
        },
      },
      {
        element: "#btnVer",
        popover: {
          title: "Ver Mantenimiento",
          description:
            "Ver la informacion del mantenimiento.",
          align: "center",
        },
      },
      {
        element: "#btnEditar",
        popover: {
          title: "Editar Mantenimiento",
          description:
            "Editar la informacion del mantenimiento.",
          align: "center",
        },
      },
      {
        element: "#btnEliminar",
        popover: {
          title: "Eliminar Mantenimiento",
          description:
            "Eliminar el mantenimiento.",
          align: "center",
        },
      }
    ];

    // Función para iniciar el tour según la pestaña activa
    function iniciarTourSegunTab() {
      // Destruir el driver actual si existe
      destruirDriverActual();

      // Pequeño delay para asegurar que todo esté listo
      setTimeout(() => {
        // Determinar qué pestaña está activa
        if ($("#inicio-tab").hasClass("active")) {
          driverActual = crearDriverConSteps(inicioSteps);
          driverActual.drive();
        } else if ($("#vehiculos-tab").hasClass("active")) {
          driverActual = crearDriverConSteps(vehiculosSteps);
          driverActual.drive();
        } else if ($("#proveedores-tab").hasClass("active")) {
          driverActual = crearDriverConSteps(proveedoresSteps);
          driverActual.drive();
        } else if ($("#rutas-tab").hasClass("active")) {
          driverActual = crearDriverConSteps(rutasSteps);
          driverActual.drive();
        } else if ($("#asignar_recursos-tab").hasClass("active")) {
          driverActual = crearDriverConSteps(asignacionesSteps);
          driverActual.drive();
        } else if ($("#repuestos-tab").hasClass("active")) {
          driverActual = crearDriverConSteps(repuestosSteps);
          driverActual.drive();
        } else if ($("#mantenimientos-tab").hasClass("active")) {
          driverActual = crearDriverConSteps(mantenimientosSteps);
          driverActual.drive();
        }

      }, 300);
    }

    // Llamar a la función para iniciar el tour
    iniciarTourSegunTab();
  });
};
