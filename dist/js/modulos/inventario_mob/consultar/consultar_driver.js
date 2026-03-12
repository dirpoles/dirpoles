window.onload = function () {
  document.getElementById("btn-ayuda").addEventListener("click", function () {
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
    const mobiliarioSteps = [
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
        element: "#btn-crear",
        popover: {
          title: "Crear Nuevo Mobiliario",
          description:
            "Abre el formulario para agregar un nuevo mobiliario al inventario. Completa todos los campos requeridos.",
          side: "bottom",
          align: "center",
        },
      },
      {
        element: "#btn-consultar",
        popover: {
          title: "Consultar Movimientos",
          description:
            "Visualiza el historial completo de entradas y salidas de mobiliario. Filtra por fechas si es necesario.",
          side: "bottom",
          align: "center",
        },
      },
      {
        element: "#tr_mobiliario",
        popover: {
          title: "Informacion de la tabla",
          description: "Muestra la informacion del inventario de mobiliario.",
          side: "bottom",
          align: "center",
        },
      },
      {
        element: "#btn-ver",
        popover: {
          title: "Ver Mobiliario",
          description: "Visualiza la informacion del mobiliario.",
          side: "right",
          align: "center",
        },
      },
      {
        element: "#btn-editar",
        popover: {
          title: "Editar Mobiliario",
          description: "Edita la informacion del mobiliario.",
          side: "right",
          align: "center",
        },
      },
      {
        element: "#btn-eliminar",
        popover: {
          title: "Eliminar Mobiliario",
          description: "Elimina el mobiliario del inventario.",
          side: "right",
          align: "center",
        },
      },
    ];

    // Steps para Equipo
    const equipoSteps = [
        {
          element: "#btn-excele",
          popover: {
            title: "Exportar a Excel",
            description:
              "Descarga todos los datos de la tabla en formato Excel para su análisis y reportes.",
            side: "bottom",
            align: "center",
          }
        },
        {
          element: "#btn-pdfe",
          popover: {
            title: "Exportar a PDF",
            description:
              "Genera un reporte profesional en PDF con los datos del inventario, listo para imprimir o compartir.",
            side: "bottom",
            align: "center",
          }
        },
        {
          element: "#btn-creare",
          popover: {
            title: "Crear Nuevo Equipo",
            description:
              "Abre el formulario para agregar un nuevo equipo al inventario. Completa todos los campos requeridos.",
            side: "bottom",
            align: "center",
          }
        },
        {
          element: "#btn-consultare",
          popover: {
            title: "Consultar Movimientos",
            description:
              "Visualiza el historial completo de entradas y salidas de equipos. Filtra por fechas si es necesario.",
            side: "bottom",
            align: "center",
          }
        },
        {
          element: "#tr_equipos",
          popover: {
            title: "Informacion de la tabla",
            description:
              "Muestra la informacion del inventario de equipos.",
            side: "bottom",
            align: "center",
          }
        },
        {
          element: "#btn-vere",
          popover: {
            title: "Ver Equipo",
            description:
              "Visualiza la informacion del equipo.",
            side: "right",
            align: "center",
          }
        },
        {
          element: "#btn-editare",
          popover: {
            title: "Editar Equipo",
            description:
              "Edita la informacion del equipo.",
            side: "right",
            align: "center",
          }
        },
        {
          element: "#btn-eliminare",
          popover: {
            title: "Eliminar Equipo",
            description:
              "Elimina el equipo del inventario.",
            side: "right",
            align: "center",
          }
        }
      ]

      const fichaSteps = [
        {
          element: "#btn-excelf",
          popover: {
            title: "Exportar a Excel",
            description:
              "Descarga todos los datos de la tabla en formato Excel para su análisis y reportes.",
            side: "bottom",
            align: "center",
          }
        },
        {
          element: "#btn-pdff",
          popover: {
            title: "Exportar a PDF",
            description:
              "Genera un reporte profesional en PDF con los datos de las fichas tecnicas, listo para imprimir o compartir.",
            side: "bottom",
            align: "center",
          }
        },
        {
          element: "#btn-crearf",
          popover: {
            title: "Crear Nueva Ficha Técnica",
            description:
              "Abre el formulario para agregar una nueva ficha tecnica.",
            side: "bottom",
            align: "center",
          }
        },
        {
          element: "#tr_fichas",
          popover: {
            title: "Informacion de la tabla",
            description:
              "Muestra la informacion de las fichas tecnicas.",
            side: "bottom",
            align: "center",
          }
        },
        {
          element: "#btn-verf",
          popover: {
            title: "Ver Ficha Técnica",
            description:
              "Visualiza la informacion de la ficha tecnica.",
            side: "right",
            align: "center",
          }
        },
        {
          element: "#btn-editarf",
          popover: {
            title: "Editar Ficha Técnica",
            description:
              "Edita la informacion de la ficha tecnica.",
            side: "right",
            align: "center",
          }
        },
        {
          element: "#btn-eliminarf",
          popover: {
            title: "Eliminar Ficha Técnica",
            description:
              "Elimina la ficha tecnica.",
            side: "right",
            align: "center",
          }
        }
      ]

    // Función para iniciar el tour según la pestaña activa
    function iniciarTourSegunTab() {
      // Destruir el driver actual si existe
      destruirDriverActual();

      // Pequeño delay para asegurar que todo esté listo
      setTimeout(() => {
        // Determinar qué pestaña está activa
        if ($("#mobiliario-tab").hasClass("active")) {
          driverActual = crearDriverConSteps(mobiliarioSteps);
          driverActual.drive();
        } else if ($("#equipos-tab").hasClass("active")) {
          driverActual = crearDriverConSteps(equipoSteps);
          driverActual.drive();
        } else if ($("#fichas-tab").hasClass("active")) {
          driverActual = crearDriverConSteps(fichaSteps);
          driverActual.drive();
        }
      }, 300);
    }

    // Llamar a la función para iniciar el tour
    iniciarTourSegunTab();
  });
});