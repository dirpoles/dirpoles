document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("click", function (e) {
    const btnAyuda = e.target.closest("#btn-ayuda");
    if (btnAyuda) {
      try {
        const driverObj = window.driver.js.driver({
          showProgress: true,
          nextBtnText: "Siguiente",
          prevBtnText: "Anterior",
          doneBtnText: "Finalizar",
          popoverClass: "mi-popover",
          steps: [
            {
              element: "#nombre_patologia-input",
              popover: {
                title: "Nombre de la Patología",
                description: "Ingresa el nombre de la patología.",
                align: "center",
              },
            },
            {
              element: "#tipo_patologia-input",
              popover: {
                title: "Tipo de Patología",
                description: "Selecciona el tipo de patología de la lista desplegable.",
                align: "center",
              },
            },
            {
              element: "#nombre_pnf-input",
              popover: {
                title: "Nombre del PNF",
                description: "Ingresa el nombre del PNF académico.",
                align: "center",
              },
            },
            {
              element: "#nombre_serv-input",
              popover: {
                title: "Nombre del Servicio",
                description: "Ingresa el nombre del servicio institucional.",
                align: "center",
              },
            },
            {
              element: "#tipo-input",
              popover: {
                title: "Tipo de Empleado",
                description: "Ingresa el cargo o tipo de empleado.",
                align: "center",
              },
            },
            {
              element: "#id_servicios-input",
              popover: {
                title: "Servicio Asociado",
                description: "Selecciona el servicio al cual pertenece este tipo de empleado.",
                align: "center",
              },
            },
            {
              element: "#nombre_mobiliario-input",
              popover: {
                title: "Nombre del Mobiliario",
                description: "Ingresa el nombre del tipo de mobiliario.",
                align: "center",
              },
            },
            {
              element: "#descripcion_mobiliario-input",
              popover: {
                title: "Descripción del Mobiliario",
                description: "Añade detalles o descripción sobre el mobiliario.",
                align: "center",
              },
            },
            {
              element: "#nombre_equipo-input",
              popover: {
                title: "Nombre del Equipo",
                description: "Ingresa el nombre del equipo tecnológico.",
                align: "center",
              },
            },
            {
              element: "#descripcion_equipo-input",
              popover: {
                title: "Descripción del Equipo",
                description: "Añade detalles o características técnicas del equipo.",
                align: "center",
              },
            },
            {
              element: "#nombre_presentacion-input",
              popover: {
                title: "Presentación para Insumos",
                description: "Ingresa el nombre de la presentación (ej. Cápsulas, Sobres, Ampollas).",
                align: "center",
              },
            },
          ],
        });
        driverObj.drive();
      } catch (error) {
        console.error("Error al inicializar driver:", error);
      }
    }
  });
});
