$(document).ready(function () {
  //-------------------------------------------- VALIDACIONES
  const hoy = new Date();
  const fechaActual = hoy.toISOString().split("T")[0];

  document.getElementById("fecha_inicio").setAttribute("max", fechaActual);
  document.getElementById("fecha_fin").setAttribute("max", fechaActual);

  function validarFechaManual(inputId, errorId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);

    if (new Date(input.value) > new Date(fechaActual)) {
      error.textContent = "La fecha no puede ser futura.";
      return false;
    } else {
      error.textContent = "";
      return true;
    }
  }

  document.getElementById("fecha_inicio").addEventListener("input", function () {
    validarFechaManual("fecha_inicio", "error_fecha_inicio");
  });

  document.getElementById("fecha_fin").addEventListener("input", function () {
    validarFechaManual("fecha_fin", "error_fecha_fin");
  });

  document.getElementById("form-reporte").addEventListener("submit", function (event) {
    const fechaInicioValida = validarFechaManual("fecha_inicio", "error_fecha_inicio");
    const fechaFinValida = validarFechaManual("fecha_fin", "error_fecha_fin");

    if (!fechaInicioValida || !fechaFinValida) {
      event.preventDefault();
      toastr.error("La fecha no puede ser futura.", "Error");
    }
  });

  //---------------------------------------------------------------------
  // Configuración inicial
  let config = {};
  let tableGeneral;
  let allData = []; // Almacenará todos los datos originales
  let filteredData = []; // Almacenará los datos filtrados
  const charts = {
    genero: null,
    areaOrigen: null,
    areaDestino: null,
    estado: null,
    empleadoOrigen: null,
    empleadoDestino: null
  };

  // Cargar datos de filtros
  fetch("index.php?action=reportes_referencias&data=1")
    .then((response) => response.json())
    .then((data) => {
      if (data && Array.isArray(data)) {
        allData = data;
        populateDropdowns(data);
      }
    })
    .catch((error) => console.error("Error al cargar la data de filtros:", error));

  // Función para poblar los dropdowns con datos únicos
  function populateDropdowns(data) {
    const dropdowns = {
      areaOr: { property: "servicio_origen", idProperty: "id_servicio_origen" },
      areaDest: { property: "servicio_destino", idProperty: "id_servicio_destino" },
      empOr: { property: "nombre_empleado_origen", idProperty: "id_empleado_origen" },
      empDest: { property: "nombre_empleado_destino", idProperty: "id_empleado_destino" }
    };

    for (const [id, config] of Object.entries(dropdowns)) {
      const element = document.getElementById(id);
      element.innerHTML = '<option value="" selected>Todos</option>';
      
      // Usamos un Set para valores únicos
      const uniqueValues = [...new Set(data.map(item => item[config.property]))];
      
      uniqueValues.forEach(value => {
        const item = data.find(i => i[config.property] === value);
        if (item) {
          const option = document.createElement("option");
          option.value = item[config.idProperty];
          option.textContent = value;
          element.appendChild(option);
        }
      });
    }
  }

  // Cargar configuración de DataTable
  fetch("api/endpoint.php")
    .then((response) => response.json())
    .then((data) => {
      config = data;
      console.log("Configuración cargada:", config);
      initializeDataTable();
    })
    .catch((error) => {
      console.error("Error cargando configuración:", error);
    });

  function initializeDataTable() {
    tableGeneral = $("#tabla_general").DataTable({
      responsive: true,
      autoWidth: false,
      paging: true,
      lengthChange: true,
      searching: true,
      ordering: true,
      info: true,
      dom: "Bfrtip",
      buttons: getExportButtons(),
      language: getDataTableLanguageConfig()
    });
  }

  function getExportButtons() {
    return [
      {
        extend: "excelHtml5",
        text: '<i class="far fa-file-excel"></i> Exportar a Excel',
        title: "Reporte de Referencias",
        className: "btn btn-success",
      },
      {
        extend: "pdfHtml5",
        text: '<i class="fas fa-file-pdf"></i> Exportar a PDF',
        title: "Reporte de Referencias",
        className: "btn btn-danger",
        orientation: "landscape",
        pageSize: "A4",
        exportOptions: {
          columns: ":visible",
        },
        customize: customizePDF
      }
    ];
  }

  function customizePDF(doc) {
    doc.content.splice(0, 0, { text: " ", margin: [0, 0, 0, 0] });
    doc.content[1].bold = true;
    doc.content[1].alignment = "center";
    doc.content[1].color = "black";
    doc.content[1].fontSize = 16;

    const pageInfo = tableGeneral.page.info();
    const summaryText = `Mostrando ${pageInfo.start + 1} a ${pageInfo.end} de ${pageInfo.recordsTotal} registros`;
    doc.content.push({
      text: summaryText,
      alignment: "left",
      margin: [0, 10, 0, 0],
    });

    doc.content[2].margin = [0, 0, 0, 0];
    doc.content[2].table.widths = Array(doc.content[2].table.body[0].length + 1)
      .join("*")
      .split("");

    addChartsToPDF(doc);
    
    doc.content[2].layout = {
      hLineWidth: () => 0.5,
      vLineWidth: () => 0.5,
      hLineColor: () => "#000000",
      vLineColor: () => "#000000",
      paddingLeft: () => 4,
      paddingRight: () => 4,
      paddingTop: () => 2,
      paddingBottom: () => 2,
    };

    doc.header = {
      image: "data:image/png;base64," + config.BASE_HEADER,
      width: 800,
      alignment: "center",
      opacity: 1,
      margin: [0, 0, 0, 0],
    };

    doc.background = {
      image: "data:image/png;base64," + config.BASE_FONDO,
      width: 400,
      opacity: 0.2,
    };
  }

  function addChartsToPDF(doc) {
    const chartConfigs = [
      { id: "chartGenero", title: "Gráfico por Genero" },
      { id: "chartAO", title: "Gráfico por Área de Origen" },
      { id: "chartAD", title: "Gráfico por Área de Destino" },
      { id: "chartE", title: "Gráfico por Estado" },
      { id: "chartEO", title: "Gráfico por Empleado de Origen" },
      { id: "chartED", title: "Gráfico por Empleado de Destino" }
    ];

    chartConfigs.forEach((chart, index) => {
      const canvas = document.getElementById(chart.id);
      if (canvas) {
        const chartImage = canvas.toDataURL("image/png");
        
        doc.content.push({
          pageBreak: index === 0 ? undefined : "before",
          text: chart.title,
          style: "header",
          alignment: "center",
          margin: [0, 20, 0, 10],
          fontSize: 16,
          bold: true,
        });

        doc.content.push({
          image: chartImage,
          width: 600,
          alignment: "center",
          margin: [0, 30, 0, 20],
        });

        doc.content.push({
          text: "Los elementos que tengan 10+ indican que hay más de 10 registros existentes.",
          alignment: "center",
          margin: [0, 0, 0, 20],
          fontSize: 12,
          italics: true,
        });
      }
    });
  }

  function getDataTableLanguageConfig() {
    return {
      sEmptyTable: "No hay registros disponibles",
      sInfo: "Mostrando _START_ a _END_ de _TOTAL_ registros",
      sInfoEmpty: "Mostrando 0 a 0 de 0 registros",
      sInfoFiltered: "(filtrado de _MAX_ registros totales)",
      sLengthMenu: "Mostrar _MENU_ registros",
      sLoadingRecords: "Cargando...",
      sProcessing: "Procesando...",
      sSearch: "Buscar:",
      sZeroRecords: "No se encontraron resultados",
      oPaginate: {
        sFirst: "Primero",
        sLast: "Último",
        sNext: "Siguiente",
        sPrevious: "Anterior",
      },
      oAria: {
        sSortAscending: ": Activar para ordenar la columna de manera ascendente",
        sSortDescending: ": Activar para ordenar la columna de manera descendente",
      },
    };
  }

  // Función para filtrar datos basados en TODOS los filtros seleccionados
  function applyAllFilters(data) {
    const filters = {
      fecha_inicio: $("#fecha_inicio").val(),
      fecha_fin: $("#fecha_fin").val(),
      genero: $("#genero").val(),
      estatus: $("#estatus").val(),
      areaOr: $("#areaOr").val(),
      areaDest: $("#areaDest").val(),
      empOr: $("#empOr").val(),
      empDest: $("#empDest").val()
    };

    return data.filter(item => {
      const fechaItem = item.fecha_referencia;
        const fechaInicio = filters.fecha_inicio;
        const fechaFin = filters.fecha_fin;

      return (
        (!fechaInicio || fechaItem >= fechaInicio) &&
        (!fechaFin || fechaItem <= fechaFin) &&
        (!filters.genero || item.genero === filters.genero) &&
        (!filters.estatus || item.estado === filters.estatus) &&
        (!filters.areaOr || item.id_servicio_origen == filters.areaOr) &&
        (!filters.areaDest || item.id_servicio_destino == filters.areaDest) &&
        (!filters.empOr || item.id_empleado_origen == filters.empOr) &&
        (!filters.empDest || item.id_empleado_destino == filters.empDest)
      );
    });
  }

  // Función para actualizar la tabla con los datos filtrados
  function updateTable(data) {
    tableGeneral.clear();

    data.forEach((item) => {
      const dateParts = item.fecha_referencia.split(" ")[0].split("-");
      const fecha_formateada = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
      const nombresApellidos = item.nombres + " " + item.apellidos;

      tableGeneral.row.add([
        fecha_formateada,
        nombresApellidos,
        item.cedula,
        item.genero === "M" ? "Masculino" : "Femenino",
        item.servicio_origen,
        item.servicio_destino,
        item.nombre_empleado_origen,
        item.nombre_empleado_destino,
        item.motivo,
        item.estado,
      ]);
    });

    tableGeneral.draw();
    return data.length > 0;
  }

  // Función para crear o actualizar gráficos
  function createOrUpdateChart(chartId, chartInstance, labels, dataValues, title) {
    const displayValues = dataValues.map(value => value > 10 ? 10 : value);
    const ctx = document.getElementById(chartId).getContext("2d");

    if (chartInstance) {
      chartInstance.destroy();
    }

    return new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: title,
          data: displayValues,
          backgroundColor: [
            "rgba(75, 192, 192, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(231, 233, 237, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 99, 132, 0.2)",
          ],
          borderColor: [
            "rgba(75, 192, 192, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(231, 233, 237, 1)",
            "rgba(255, 159, 64, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 99, 132, 1)",
          ],
          borderWidth: 2,
        }],
      },
      options: getChartOptions(dataValues),
      plugins: [ChartDataLabels],
    });
  }

  function getChartOptions(realValues) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            min: 0,
            max: 10,
            callback: value => value,
          },
        }],
      },
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {
            const index = tooltipItem.index;
            const label = data.labels[index];
            const realVal = realValues[index];
            return `${label}: ${realVal}${realVal > 10 ? " (más de 10)" : ""}`;
          },
        },
      },
      legend: {
        labels: {
          boxWidth: 0,
          fontSize: 20,
        },
      },
      plugins: {
        datalabels: {
          display: true,
          color: "black",
          formatter: (value, context) => {
            const index = context.dataIndex;
            const realVal = realValues[index];
            return realVal > 10 ? "10+" : realVal;
          },
        },
      },
    };
  }

  // Función para obtener datos para gráficos basados en los filtros actuales
  function getFilteredChartData(data, fieldConfig, defaultLabels = null) {
    const { filterId, labelField, valueField } = fieldConfig;
    const filterValue = $(`#${filterId}`).val();
    
    // Si hay un filtro aplicado para este campo, mostramos solo ese valor
    if (filterValue) {
      const filteredItems = data.filter(item => item[valueField] == filterValue);
      const label = filteredItems[0] ? filteredItems[0][labelField] : `${labelField} desconocido`;
      return {
        labels: [label],
        dataValues: [filteredItems.length]
      };
    }
    // Si no hay filtro para este campo, mostramos todos los valores únicos que cumplen con los otros filtros
    else {
      const uniqueValues = [...new Set(data.map(item => item[valueField]))];
      return {
        labels: defaultLabels || uniqueValues.map(value => {
          const item = data.find(i => i[valueField] == value);
          return item ? item[labelField] : `${labelField} desconocido`;
        }),
        dataValues: uniqueValues.map(value => data.filter(item => item[valueField] == value).length)
      };
    }
  }

  // Función para actualizar todos los gráficos basados en los datos filtrados
  function updateAllCharts(data) {
    // Gráfico por Género
    const generoData = getFilteredChartData(data, {
      filterId: "genero",
      labelField: "genero",
      valueField: "genero"
    }, ["Masculino", "Femenino"]);
    charts.genero = createOrUpdateChart(
      "chartGenero", 
      charts.genero, 
      generoData.labels, 
      generoData.dataValues, 
      "Género"
    );

    // Gráfico por Estado
    const estadoData = getFilteredChartData(data, {
      filterId: "estatus",
      labelField: "estado",
      valueField: "estado"
    }, ["Aceptada", "Pendiente", "Rechazada"]);
    charts.estado = createOrUpdateChart(
      "chartE", 
      charts.estado, 
      estadoData.labels, 
      estadoData.dataValues, 
      "Estado"
    );

    // Gráfico por Área Origen
    const areaOrigenData = getFilteredChartData(data, {
      filterId: "areaOr",
      labelField: "servicio_origen",
      valueField: "id_servicio_origen"
    });
    charts.areaOrigen = createOrUpdateChart(
      "chartAO", 
      charts.areaOrigen, 
      areaOrigenData.labels, 
      areaOrigenData.dataValues, 
      "Área Origen"
    );

    // Gráfico por Área Destino
    const areaDestinoData = getFilteredChartData(data, {
      filterId: "areaDest",
      labelField: "servicio_destino",
      valueField: "id_servicio_destino"
    });
    charts.areaDestino = createOrUpdateChart(
      "chartAD", 
      charts.areaDestino, 
      areaDestinoData.labels, 
      areaDestinoData.dataValues, 
      "Área Destino"
    );

    // Gráfico por Empleado Origen
    const empleadoOrigenData = getFilteredChartData(data, {
      filterId: "empOr",
      labelField: "nombre_empleado_origen",
      valueField: "id_empleado_origen"
    });
    charts.empleadoOrigen = createOrUpdateChart(
      "chartEO", 
      charts.empleadoOrigen, 
      empleadoOrigenData.labels, 
      empleadoOrigenData.dataValues, 
      "Empleado Origen"
    );

    // Gráfico por Empleado Destino
    const empleadoDestinoData = getFilteredChartData(data, {
      filterId: "empDest",
      labelField: "nombre_empleado_destino",
      valueField: "id_empleado_destino"
    });
    charts.empleadoDestino = createOrUpdateChart(
      "chartED", 
      charts.empleadoDestino, 
      empleadoDestinoData.labels, 
      empleadoDestinoData.dataValues, 
      "Empleado Destino"
    );
  }

  // Función para manejar el envío del formulario
  $("#form-reporte").submit(function (e) {
    e.preventDefault();

    $("#contenedor_general").show();

    $.ajax({
      type: "POST",
      url: "index.php?action=reportes_referencias",
      data: $(this).serialize(),
      dataType: "json",
      success: function (data) {
        if (!validarFechaManual("fecha_inicio", "error_fecha_inicio") || 
            !validarFechaManual("fecha_fin", "error_fecha_fin")) {
          tableGeneral.clear().draw();
          return;
        }

        // Almacenamos todos los datos originales
        allData = data;
        
        // Aplicamos todos los filtros
        filteredData = applyAllFilters(data);
        
        // Actualizamos la tabla con los datos filtrados
        const hasData = updateTable(filteredData);

        if (hasData) {
          $("#contenedor_general").show();
          Swal.fire({
            icon: "success",
            title: "Reporte generado.",
            text: "Reporte generado con éxito.",
            confirmButtonText: "Entendido",
          });

          // Actualizar todos los gráficos con los datos filtrados
          updateAllCharts(filteredData);
        } else {
          Swal.fire({
            icon: "error",
            title: "Reporte no generado.",
            text: "No se encontraron registros con los filtros seleccionados.",
            confirmButtonText: "Entendido",
          });
        }
      },
      error: function (xhr, status, error) {
        let mensaje = "Ha ocurrido un error inesperado.";
        if (xhr.responseJSON && xhr.responseJSON.message) {
          mensaje = xhr.responseJSON.message;
        }

        Swal.fire({
          icon: "error",
          title: "Error en el servidor",
          text: mensaje,
          confirmButtonText: "Entendido",
        });

        console.error("Error en la solicitud AJAX:", error);
      },
    });
  });

  // Event listeners para los filtros que actualizan los gráficos cuando cambian
  $("#genero, #estatus, #areaOr, #areaDest, #empOr, #empDest").change(function() {
    if (allData.length > 0) {
      filteredData = applyAllFilters(allData);
      updateAllCharts(filteredData);
    }
  });
});