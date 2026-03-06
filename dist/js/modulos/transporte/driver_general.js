window.onload = function () {
  document.addEventListener("click", function (e) {
    const btnAyuda = e.target.closest("#btn-ayuda");
    const btnAyudaModal = e.target.closest("#btnAyudaModal");

    if (btnAyuda || btnAyudaModal) {
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
          side: "right",
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

    const vehiculosModalSteps = [
      {
        element: "#placaV",
        popover: {
          title: "Placa",
          description: "Ingresa la placa del vehículo.",
          align: "center",
        },
      },
      {
        element: "#modeloV",
        popover: {
          title: "Modelo",
          description: "Ingresa el modelo del vehículo.",
          align: "center",
        },
      },
      {
        element: "#tipoV",
        popover: {
          title: "Tipo de Vehículo",
          description: "Selecciona el tipo de vehículo (Autobús, Camioneta, Automóvil).",
          align: "center",
        },
      },
      {
        element: "#fechaV",
        popover: {
          title: "Fecha de Adquisición",
          description: "Selecciona la fecha en que se adquirió el vehículo.",
          align: "center",
        },
      },
      {
        element: "#estadoV",
        popover: {
          title: "Estado Actual",
          description: "Selecciona el estado actual del vehículo (Activo, Inactivo, Mantenimiento).",
          align: "center",
        },
      },
      {
        element: "#footerV",
        popover: {
          title: "Acciones",
          description: "Presiona 'Registrar Vehículo' para guardar o 'Cerrar' para cancelar.",
          align: "center",
        },
      }
    ];

    const proveedoresSteps = [
      {
        element: "#btnExcelPR",
        popover: {
          title: "Exportar a Excel",
          description: "Exportar la tabla a Excel.",
          align: "center",
        },
      },
      {
        element: "#btnPdfPR",
        popover: {
          title: "Exportar a PDF",
          description: "Exportar la tabla a PDF.",
          align: "center",
        },
      },
      {
        element: "#btnCrearPR",
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
        element: "#btnVerPR",
        popover: {
          title: "Ver Proveedor",
          description:
            "Ver la informacion del proveedor.",
          align: "center",
        },
      },
      {
        element: "#btnEditarPR",
        popover: {
          title: "Editar Proveedor",
          description:
            "Editar la informacion del proveedor.",
          align: "center",
        },
      },
      {
        element: "#btnEliminarPR",
        popover: {
          title: "Eliminar Proveedor",
          description:
            "Eliminar el proveedor.",
          align: "center",
        },
      }
    ];

    const proveedoresModalSteps = [
      {
        element: "#tipoDocPR",
        popover: {
          title: "Tipo de Documento",
          description: "Selecciona el tipo de documento del proveedor.",
          align: "center",
        },
      },
      {
        element: "#numDocPR",
        popover: {
          title: "Número de Documento",
          description: "Ingresa el número de documento del proveedor.",
          align: "center",
        },
      },
      {
        element: "#nombrePR",
        popover: {
          title: "Nombre o Razón Social",
          description: "Ingresa el nombre o razón social del proveedor.",
          align: "center",
        },
      },
      {
        element: "#prefijoPR",
        popover: {
          title: "Prefijo Telefónico",
          description: "Selecciona el código de área del teléfono.",
          align: "center",
        },
      },
      {
        element: "#telefonoPR",
        popover: {
          title: "Teléfono",
          description: "Ingresa los 7 dígitos del número de teléfono.",
          align: "center",
        },
      },
      {
        element: "#correoPR",
        popover: {
          title: "Correo Electrónico",
          description: "Ingresa el correo electrónico del proveedor.",
          align: "center",
        },
      },
      {
        element: "#direccionPR",
        popover: {
          title: "Dirección",
          description: "Ingresa la dirección fiscal o comercial del proveedor.",
          align: "center",
        },
      }
    ];

    const rutasSteps = [
      {
        element: "#btnExcelR",
        popover: {
          title: "Exportar a Excel",
          description: "Exportar la tabla a Excel.",
          align: "center",
        },
      },
      {
        element: "#btnPdfR",
        popover: {
          title: "Exportar a PDF",
          description: "Exportar la tabla a PDF.",
          align: "center",
        },
      },
      {
        element: "#btnCrearR",
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
        element: "#btnVerR",
        popover: {
          title: "Ver Ruta",
          description:
            "Ver la informacion de la ruta.",
          align: "center",
        },
      },
      {
        element: "#btnEditarR",
        popover: {
          title: "Editar Ruta",
          description:
            "Editar la informacion de la ruta.",
          align: "center",
        },
      },
      {
        element: "#btnEliminarR",
        popover: {
          title: "Eliminar Ruta",
          description:
            "Eliminar la ruta.",
          align: "center",
        },
      }
    ];

    const rutasModalSteps = [
      {
        element: "#nombreRU",
        popover: {
          title: "Nombre de la Ruta",
          description: "Ingresa el nombre identificador de la ruta.",
          align: "center",
        },
      },
      {
        element: "#tipoRU",
        popover: {
          title: "Tipo de Ruta",
          description: "Selecciona el tipo de ruta (Extra-Urbana, Inter-Urbana, Vacacional, etc.).",
          align: "center",
        },
      },
      {
        element: "#horarioSalidaRU",
        popover: {
          title: "Hora de Salida",
          description: "Selecciona la hora de salida de la ruta.",
          align: "center",
        },
      },
      {
        element: "#horarioLlegadaRU",
        popover: {
          title: "Hora de Llegada",
          description: "Selecciona la hora estimada de llegada.",
          align: "center",
        },
      },
      {
        element: "#estatusRU",
        popover: {
          title: "Estatus",
          description: "Selecciona el estatus de la ruta (Activa o Inactiva).",
          align: "center",
        },
      },
      {
        element: "#puntoPartidaRU",
        popover: {
          title: "Punto de Partida",
          description: "Ingresa el lugar de origen de la ruta.",
          align: "center",
        },
      },
      {
        element: "#puntoDestinoRU",
        popover: {
          title: "Punto de Destino",
          description: "Ingresa el lugar de destino de la ruta.",
          align: "center",
        },
      },
      {
        element: "#trayectoriaRU",
        popover: {
          title: "Trayectoria",
          description: "Describe el recorrido completo de la ruta.",
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

    const asignacionesModalSteps = [
      {
        element: "#rutaAR",
        popover: {
          title: "Ruta Asignada",
          description: "Selecciona la ruta que será asignada.",
          align: "center",
        },
      },
      {
        element: "#fechaAR",
        popover: {
          title: "Fecha de Asignación",
          description: "Selecciona la fecha de la asignación.",
          align: "center",
        },
      },
      {
        element: "#vehiculoAR",
        popover: {
          title: "Vehículo",
          description: "Selecciona el vehículo a asignar.",
          align: "center",
        },
      },
      {
        element: "#choferAR",
        popover: {
          title: "Chofer / Conductor",
          description: "Selecciona el chofer o conductor asignado.",
          align: "center",
        },
      },
      {
        element: "#estatusAR",
        popover: {
          title: "Estatus",
          description: "Selecciona el estatus de la asignación (Activa o Inactiva).",
          align: "center",
        },
      }
    ];

    const repuestosSteps = [
      {
        element: "#btnExcelRE",
        popover: {
          title: "Exportar a Excel",
          description: "Exportar la tabla a Excel.",
          align: "center",
        },
      },
      {
        element: "#btnPdfRE",
        popover: {
          title: "Exportar a PDF",
          description: "Exportar la tabla a PDF.",
          align: "center",
        },
      },
      {
        element: "#btnCrearRE",
        popover: {
          title: "Crear Repuesto",
          description: "Crear un nuevo repuesto.",
          align: "center",
        },
      },
      {
        element: "#btnAgregarEntradaRE",
        popover: {
          title: "Agregar Entrada",
          description: "Agregar un nuevo repuesto al inventario.",
          align: "center",
        },
      },
      {
        element: "#btnMovimientosRE",
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
        element: "#btnVerRE",
        popover: {
          title: "Ver Repuesto",
          description:
            "Ver la informacion del repuesto.",
          align: "center",
        },
      },
      {
        element: "#btnEditarRE",
        popover: {
          title: "Editar Repuesto",
          description:
            "Editar la informacion del repuesto.",
          align: "center",
        },
      },
      {
        element: "#btnEliminarRE",
        popover: {
          title: "Eliminar Repuesto",
          description:
            "Eliminar el repuesto.",
          align: "center",
        },
      }
    ];

    const repuestosModalSteps = [
      {
        element: "#nombreRE",
        popover: {
          title: "Nombre del Repuesto",
          description: "Ingresa el nombre del repuesto.",
          align: "center",
        },
      },
      {
        element: "#proveedorRE",
        popover: {
          title: "Proveedor",
          description: "Selecciona el proveedor del repuesto.",
          align: "center",
        },
      },
      {
        element: "#descripcionRE",
        popover: {
          title: "Descripción",
          description: "Ingresa las especificaciones técnicas del repuesto.",
          align: "center",
        },
      },
      {
        element: "#fechaRE",
        popover: {
          title: "Fecha de Registro",
          description: "Selecciona la fecha de registro del repuesto.",
          align: "center",
        },
      },
      {
        element: "#estatusRE",
        popover: {
          title: "Estado Actual",
          description: "Selecciona el estado del repuesto (Nuevo, Usado, Dañado).",
          align: "center",
        },
      }
    ];

    const mantenimientosSteps = [
      {
        element: "#btnExcelM",
        popover: {
          title: "Exportar a Excel",
          description: "Exportar la tabla a Excel.",
          align: "center",
        },
      },
      {
        element: "#btnPdfM",
        popover: {
          title: "Exportar a PDF",
          description: "Exportar la tabla a PDF.",
          align: "center",
        },
      },
      {
        element: "#btnCrearM",
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
        element: "#btnVerM",
        popover: {
          title: "Ver Mantenimiento",
          description:
            "Ver la informacion del mantenimiento.",
          align: "center",
        },
      },
      {
        element: "#btnEditarM",
        popover: {
          title: "Editar Mantenimiento",
          description:
            "Editar la informacion del mantenimiento.",
          align: "center",
        },
      },
      {
        element: "#btnEliminarM",
        popover: {
          title: "Eliminar Mantenimiento",
          description:
            "Eliminar el mantenimiento.",
          align: "center",
        },
      }
    ];

    const mantenimientosModalSteps = [
      {
        element: "#vehiculoMA",
        popover: {
          title: "Vehículo",
          description: "Selecciona el vehículo al que se le realizará el mantenimiento.",
          align: "center",
        },
      },
      {
        element: "#fechaMA",
        popover: {
          title: "Fecha",
          description: "Selecciona la fecha del mantenimiento.",
          align: "center",
        },
      },
      {
        element: "#tipoMA",
        popover: {
          title: "Tipo de Mantenimiento",
          description: "Selecciona si es Preventivo o Correctivo.",
          align: "center",
        },
      },
      {
        element: "#descripcionMA",
        popover: {
          title: "Descripción",
          description: "Describe el trabajo realizado en el mantenimiento.",
          align: "center",
        },
      },
      {
        element: "#repuestosMA",
        popover: {
          title: "Repuestos del Inventario",
          description: "Indica si se utilizarán repuestos del inventario.",
          align: "center",
        },
      }
    ];

    // Función para iniciar el tour según la pestaña activa o modal
    function iniciarTourSegunTab() {
      // Destruir el driver actual si existe
      destruirDriverActual();

      // Pequeño delay para asegurar que todo esté listo
      setTimeout(() => {
        // Determinar qué pestaña está activa en la pantalla principal o usar logica de modal
        if ($("#inicio-tab").hasClass("active")) {
          driverActual = crearDriverConSteps(inicioSteps);
          driverActual.drive();
        } else if ($("#vehiculos-tab").hasClass("active")) {
          if (btnAyudaModal) {
            driverActual = crearDriverConSteps(vehiculosModalSteps);
            driverActual.drive();
          } else {
            driverActual = crearDriverConSteps(vehiculosSteps);
            driverActual.drive();
          }
        } else if ($("#proveedores-tab").hasClass("active")) {
          if (btnAyudaModal) {
            driverActual = crearDriverConSteps(proveedoresModalSteps);
            driverActual.drive();
          } else {
            driverActual = crearDriverConSteps(proveedoresSteps);
            driverActual.drive();
          }
        } else if ($("#rutas-tab").hasClass("active")) {
          if (btnAyudaModal) {
            driverActual = crearDriverConSteps(rutasModalSteps);
            driverActual.drive();
          } else {
            driverActual = crearDriverConSteps(rutasSteps);
            driverActual.drive();
          }
        } else if ($("#asignar_recursos-tab").hasClass("active")) {
          if (btnAyudaModal) {
            driverActual = crearDriverConSteps(asignacionesModalSteps);
            driverActual.drive();
          } else {
            driverActual = crearDriverConSteps(asignacionesSteps);
            driverActual.drive();
          }
        } else if ($("#repuestos-tab").hasClass("active")) {
          if (btnAyudaModal) {
            driverActual = crearDriverConSteps(repuestosModalSteps);
            driverActual.drive();
          } else {
            driverActual = crearDriverConSteps(repuestosSteps);
            driverActual.drive();
          }
        } else if ($("#mantenimientos-tab").hasClass("active")) {
          if (btnAyudaModal) {
            driverActual = crearDriverConSteps(mantenimientosModalSteps);
            driverActual.drive();
          } else {
            driverActual = crearDriverConSteps(mantenimientosSteps);
            driverActual.drive();
          }
        }

      }, 300);
    }

    // Llamar a la función para iniciar el tour
    iniciarTourSegunTab();
    } // FIN if(btnAyuda || btnAyudaModal)
  });
};
