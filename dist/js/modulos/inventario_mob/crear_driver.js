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
        element: "#input_tipo_mobiliario",
        popover: {
          title: "Tipo de Mobiliario",
          description:
            "Selecciona el tipo de mobiliario que estás registrando (sillas, mesas, escritorios, etc.).",
          align: "center",
        },
      },
      {
        element: "#input_ubicacion",
        popover: {
          title: "Ubicación",
          description:
            "Selecciona el servicio o área donde se ubicará el mobiliario.",
          align: "center",
        },
      },
      {
        element: "#input_marca",
        popover: {
          title: "Marca",
          description: "Especifica la marca del mobiliario.",
          align: "center",
        },
      },
      {
        element: "#input_modelo",
        popover: {
          title: "Modelo",
          description: "Indica el modelo del mobiliario.",
          align: "center",
        },
      },
      {
        element: "#input_color",
        popover: {
          title: "Color",
          description: "Especifica el color del mobiliario.",
          align: "center",
        },
      },
      {
        element: "#input_estado",
        popover: {
          title: "Estado",
          description:
            "Selecciona el estado actual del mobiliario: Bueno, Regular o Malo.",
          align: "center",
        },
      },
      {
        element: "#input_cantidad",
        popover: {
          title: "Cantidad",
          description:
            "Indica la cantidad de unidades de este mobiliario que se están registrando.",
          align: "center",
        },
      },
      {
        element: "#input_fecha_adquisicion",
        popover: {
          title: "Fecha de Adquisición",
          description:
            "Selecciona la fecha en que fue adquirido el mobiliario.",
          align: "center",
        },
      },
      {
        element: "#input_descripcion",
        popover: {
          title: "Descripción",
          description:
            "Proporciona una descripción detallada del mobiliario (material, dimensiones, características especiales, etc.).",
          align: "center",
        },
      },
      {
        element: "#input_observaciones",
        popover: {
          title: "Observaciones",
          description:
            "Agrega cualquier observación adicional relevante sobre el mobiliario (condiciones especiales, mantenimiento, etc.).",
          align: "center",
        },
      },
      {
        element: "#btnEliminarFilaMobiliario",
        popover: {
          title: "Eliminar Fila",
          description:
            "Eliminar la fila actual.",
          align: "center",
        },
      },
      {
        element: "#btnAgregarFilaMobiliario",
        popover: {
          title: "Agregar Fila",
          description:
            "Agregar una nueva fila.",
          align: "center",
        },
      },
    ];

    // Steps para Equipo
    const equipoSteps = [
      {
        element: "#input_tipo_equipo",
        popover: {
          title: "Tipo de Equipo",
          description: "Selecciona el tipo de equipo que estás registrando.",
          align: "center",
        },
      },
      {
        element: "#input_ubicacion_equipo",
        popover: {
          title: "Ubicación",
          description:
            "Selecciona el servicio o área donde se ubicará el equipo.",
          align: "center",
        },
      },
      {
        element: "#input_marca_equipo",
        popover: {
          title: "Marca",
          description: "Especifica la marca del equipo.",
          align: "center",
        },
      },
      {
        element: "#input_modelo_equipo",
        popover: {
          title: "Modelo",
          description: "Indica el modelo del equipo.",
          align: "center",
        },
      },
      {
        element: "#input_serial_equipo",
        popover: {
          title: "Serial",
          description:
            "Registra el número de serie del equipo para identificación única.",
          align: "center",
        },
      },
      {
        element: "#input_color_equipo",
        popover: {
          title: "Color",
          description: "Especifica el color del equipo.",
          align: "center",
        },
      },
      {
        element: "#input_estado_equipo",
        popover: {
          title: "Estado",
          description:
            "Selecciona el estado actual del equipo: Nuevo, Bueno, Regular, Malo o En reparación.",
          align: "center",
        },
      },
      {
        element: "#input_fecha_adquisicion_equipo",
        popover: {
          title: "Fecha de Adquisición",
          description: "Selecciona la fecha en que fue adquirido el equipo.",
          align: "center",
        },
      },
      {
        element: "#input_descripcion_equipo",
        popover: {
          title: "Descripción Adicional",
          description:
            "Proporciona información adicional sobre el equipo, características técnicas o especificaciones importantes.",
          align: "center",
        },
      },
      {
        element: "#input_observaciones_equipo",
        popover: {
          title: "Observaciones",
          description:
            "Agrega cualquier observación relevante sobre el equipo, como condiciones especiales, mantenimiento requerido, et.",
          align: "center",
        },
      },
      {
        element: "#btnAgregarFilaEquipo",
        popover: {
          title: "Agregar Fila",
          description:
            "Agregar una nueva fila.",
          align: "center",
        },
      },
    ];

    // Función para iniciar el tour según la pestaña activa
    function iniciarTourSegunTab() {
      // Destruir el driver actual si existe
      destruirDriverActual();
    
        // Determinar qué pestaña está activa
        if ($("#mobiliario-tab").hasClass("active")) {
          driverActual = crearDriverConSteps(mobiliarioSteps);
          driverActual.drive();
        } else if ($("#equipo-tab").hasClass("active")) {
          driverActual = crearDriverConSteps(equipoSteps);
          driverActual.drive();
        }
    }

    // Llamar a la función para iniciar el tour
    iniciarTourSegunTab();
  });
};