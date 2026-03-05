// mobiliario.js - Versión mejorada con paleta de colores optimizada

/**
 * Módulo de utilidades comunes
 */
const Utils = {
  /**
   * Validar que una fecha no sea futura
   * @param {string} inputId - ID del input de fecha
   * @param {string} errorId - ID del elemento para mostrar errores
   * @param {Date} maxDate - Fecha máxima permitida (hoy por defecto)
   * @returns {boolean} - True si la fecha es válida
   */
  validateDate: (inputId, errorId, maxDate = new Date()) => {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);

    if (!input.value) {
      error.textContent = "";
      return true;
    }

    const inputDate = new Date(input.value);
    if (inputDate > maxDate) {
      error.textContent = "La fecha no puede ser futura.";
      return false;
    }
    error.textContent = "";
    return true;
  },

  /**
   * Validar campo requerido
   * @param {string} inputId - ID del input a validar
   * @param {string} errorId - ID del elemento para mostrar errores
   * @param {string} errorMessage - Mensaje de error personalizado
   * @returns {boolean} - True si el campo es válido
   */
  validateRequired: (inputId, errorId, errorMessage = "Este campo no puede estar vacío.") => {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);

    if (!input.value) {
      error.textContent = errorMessage;
      return false;
    }
    error.textContent = "";
    return true;
  },

  /**
   * Formatear fecha de YYYY-MM-DD a DD-MM-YYYY
   * @param {string} dateString - Fecha en formato YYYY-MM-DD
   * @returns {string} - Fecha formateada
   */
  formatDate: (dateString) => {
    if (!dateString) return "";
    const dateParts = dateString.split(" ")[0].split("-");
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  },

  /**
   * Mostrar alerta con SweetAlert
   * @param {string} icon - Tipo de ícono (success, error, etc.)
   * @param {string} title - Título de la alerta
   * @param {string} text - Texto del mensaje
   * @param {string} confirmButtonText - Texto del botón
   */
  showAlert: (icon, title, text, confirmButtonText = "Entendido") => {
    Swal.fire({ icon, title, text, confirmButtonText });
  }
};

/**
 * Módulo de configuración de DataTables
 */
const DataTableConfig = {
  /**
   * Obtener configuración común para DataTables
   * @param {string} title - Título para los botones de exportación
   * @returns {object} - Configuración de DataTable
   */
  getCommonConfig: (title) => ({
    responsive: true,
    autoWidth: false,
    paging: true,
    lengthChange: true,
    searching: true,
    ordering: true,
    info: true,
    dom: "Bfrtip",
    buttons: [
      {
        extend: "excelHtml5",
        text: '<i class="far fa-file-excel"></i> Exportar a Excel',
        title: title,
        className: "btn btn-success",
      },
      {
        extend: "pdfHtml5",
        text: '<i class="fas fa-file-pdf"></i> Exportar a PDF',
        title: title,
        className: "btn btn-danger",
        orientation: "landscape",
        pageSize: "A4",
        exportOptions: { columns: ":visible" },
        customize: DataTableConfig.getPdfCustomizer(title)
      }
    ],
    language: DataTableConfig.getLanguageConfig()
  }),

  /**
   * Personalizador de PDF
   * @param {string} title - Título del reporte
   * @returns {function} - Función de personalización
   */
  getPdfCustomizer: (title) => (doc) => {
    doc.content.splice(0, 0, { text: " ", margin: [0, 0, 0, 0] });
    
    if (doc.content[1]) {
      doc.content[1].bold = true;
      doc.content[1].alignment = "center";
      doc.content[1].color = "black";
      doc.content[1].fontSize = 16;
    }

    if (doc.content[2]) {
      doc.content[2].margin = [0, 0, 0, 0];
      doc.content[2].table.widths = Array(doc.content[2].table.body[0].length + 1)
        .join("*")
        .split("");

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
    }
  },

  /**
   * Configuración de idioma para DataTables
   * @returns {object} - Configuración de idioma
   */
  getLanguageConfig: () => ({
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
  })
};

/**
 * Módulo de manejo de gráficos y filtrado
 */
const DataManager = {
  currentData: [], // Almacena los datos actuales
  filteredData: [], // Almacena los datos filtrados actuales

  /**
   * Aplicar todos los filtros a los datos
   * @param {object} filters - Filtros a aplicar
   * @returns {array} - Datos filtrados
   */
  applyFilters: function(filters) {
    this.filteredData = this.currentData.filter(item => {
      const itemDate = new Date(item.fecha_creacion || item.fecha_registro);
      const startDate = filters.fechaInicio ? new Date(filters.fechaInicio) : null;
      const endDate = filters.fechaFin ? new Date(filters.fechaFin) : null;
      
      // Verificar fechas
      if (startDate && itemDate < startDate) return false;
      if (endDate && itemDate > endDate) return false;
      
      // Verificar otros filtros
      if (filters.tipo) {
        if (item.id_tipo_mobiliario != filters.tipo && item.id_tipo_equipo != filters.tipo) return false;
      }
      if (filters.marca && item.marca !== filters.marca) return false;
      if (filters.modelo && item.modelo !== filters.modelo) return false;
      if (filters.estado && item.estado !== filters.estado) return false;
      if (filters.serial && item.serial !== filters.serial) return false;
      if (filters.ubicacion && item.id_servicios != filters.ubicacion) return false;
      
      return true;
    });
    
    return this.filteredData;
  },

  /**
   * Obtener datos para gráficos basados en filtros
   * @param {string} fieldName - Campo a analizar
   * @param {string} labelField - Campo a usar como etiqueta (opcional)
   * @returns {object} - Objeto con labels y dataValues
   */
  getChartData: function(fieldName, labelField = fieldName) {
    if (this.filteredData.length === 0) {
      return {
        labels: ["No hay datos"],
        dataValues: [0]
      };
    }
    
    // Agrupar valores únicos
    const uniqueValues = [...new Set(
      this.filteredData.map(item => {
        if (labelField && item[labelField]) {
          return item[labelField];
        }
        return item[fieldName] || `${fieldName} desconocido`;
      })
    )];
    
    return {
      labels: uniqueValues,
      dataValues: uniqueValues.map(value => 
        this.filteredData.filter(item => {
          const itemValue = labelField && item[labelField] ? item[labelField] : item[fieldName];
          return itemValue === value || (!itemValue && value === `${fieldName} desconocido`);
        }).length
      )
    };
  }
};

/**
 * Módulo de manejo de gráficos
 */
const ChartManager = {
  charts: {}, // Almacena todas las instancias de gráficos

  // Paleta de colores optimizada (sin blancos/colores claros)
  chartColors: [
    "rgba(75, 192, 192, 0.7)",  // Verde agua
    "rgba(54, 162, 235, 0.7)",  // Azul
    "rgba(255, 206, 86, 0.7)",  // Amarillo
    "rgba(153, 102, 255, 0.7)", // Morado
    "rgba(255, 159, 64, 0.7)",  // Naranja
    "rgba(255, 99, 132, 0.7)",  // Rojo
    "rgba(50, 205, 50, 0.7)",   // Verde lima
    "rgba(106, 90, 205, 0.7)",  // Azul pizarra
    "rgba(220, 20, 60, 0.7)",    // Rojo carmesí
    "rgba(0, 128, 128, 0.7)",    // Verde azulado
    "rgba(139, 69, 19, 0.7)",    // Marrón
    "rgba(128, 0, 128, 0.7)"     // Púrpura
  ],

  /**
   * Configuración común para todos los gráficos
   */
  commonChartOptions: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          min: 0,
          max: 10,
          callback: value => value
        },
        gridLines: {
          color: "rgba(0, 0, 0, 0.1)",
          drawBorder: true
        }
      }],
      xAxes: [{
        gridLines: {
          display: false
        }
      }]
    },
    tooltips: {
      callbacks: {
        label: function(tooltipItem, data) {
          const index = tooltipItem.index;
          const label = data.labels[index];
          const realVal = this._chart.realValues?.[index] || data.datasets[0].data[index];
          return realVal > 10 ? `${label}: ${realVal} (más de 10)` : `${label}: ${realVal}`;
        }
      }
    },
    legend: {
      labels: {
        boxWidth: 0,
        fontSize: 20
      }
    },
    plugins: {
      datalabels: {
        display: true,
        color: "black",
        font: {
          weight: 'bold'
        },
        formatter: (value, context) => {
          const realVal = context.chart.realValues?.[context.dataIndex] || value;
          return realVal > 10 ? "10+" : realVal;
        }
      }
    }
  },

  /**
   * Crear o actualizar un gráfico
   * @param {string} chartId - ID del canvas del gráfico
   * @param {string} chartType - Tipo de gráfico (bar, pie, etc.)
   * @param {array} labels - Etiquetas para el gráfico
   * @param {array} dataValues - Valores para el gráfico
   * @param {string} label - Etiqueta para la leyenda
   */
  createOrUpdateChart: function(chartId, chartType, labels, dataValues, label) {
    const ctx = document.getElementById(chartId)?.getContext('2d');
    if (!ctx) return;

    // Destruir gráfico existente si existe
    if (this.charts[chartId]) {
      this.charts[chartId].destroy();
    }

    // Valores para mostrar (truncados a 10)
    const displayValues = dataValues.map(value => value > 10 ? 10 : value);
    
    // Función para obtener colores cíclicos
    const getColor = (index) => {
      const colors = this.chartColors;
      return colors[index % colors.length];
    };

    // Crear nuevo gráfico
    this.charts[chartId] = new Chart(ctx, {
      type: chartType,
      data: {
        labels: labels,
        datasets: [{
          label: label,
          data: displayValues,
          backgroundColor: labels.map((_, i) => getColor(i).replace('0.7', '0.5')),
          borderColor: labels.map((_, i) => getColor(i)),
          borderWidth: 2
        }]
      },
      options: this.commonChartOptions,
      plugins: [ChartDataLabels]
    });

    // Almacenar valores reales para tooltips
    this.charts[chartId].realValues = dataValues;
  }
};

/**
 * Módulo principal - Inicialización cuando el DOM está listo
 */
$(document).ready(function() {
  // Variables globales
  let tableMob, tableEq;
  const config = {};
  
  // Establecer fecha máxima para inputs de fecha
  const hoy = new Date();
  const fechaActual = hoy.toISOString().split("T")[0];
  document.getElementById("fecha_inicio").setAttribute("max", fechaActual);
  document.getElementById("fecha_fin").setAttribute("max", fechaActual);

  // Event listeners para validación en tiempo real
  document.getElementById("fecha_inicio").addEventListener("input", function() {
    Utils.validateDate("fecha_inicio", "error_fecha_inicio");
  });

  document.getElementById("fecha_fin").addEventListener("input", function() {
    Utils.validateDate("fecha_fin", "error_fecha_fin");
  });

  document.getElementById("tipoReporte").addEventListener("change", function() {
    Utils.validateRequired("tipoReporte", "error_tipoReporte");
    $("#divS").toggle($(this).val() === "equipos");
    $("#contenedor_mob, #contenedor_equipos").hide();
    loadFilterData();
  });

  // Cargar configuración inicial
  fetch("api/endpoint.php")
    .then(response => response.json())
    .then(data => {
      Object.assign(config, data);
      initializeTables();
    })
    .catch(error => console.error("Error cargando configuración:", error));

  /**
   * Inicializar DataTables
   */
  function initializeTables() {
    tableMob = $("#tabla_mob").DataTable(
      DataTableConfig.getCommonConfig("Reporte Mobiliario")
    );
    
    tableEq = $("#tabla_equipos").DataTable(
      DataTableConfig.getCommonConfig("Reporte Equipos")
    );
  }

  /**
   * Cargar datos de filtros según el tipo de reporte
   */
  function loadFilterData() {
    const tipoReport = $("#tipoReporte").val();
    if (!tipoReport) return;

    fetch(`index.php?action=reportes_mobiliario&tipoReporte=${tipoReport}`)
      .then(response => response.json())
      .then(data => populateFilters(data, tipoReport))
      .catch(error => console.error("Error cargando filtros:", error));
  }

  /**
   * Llenar los dropdowns de filtros
   * @param {object} data - Datos de filtros
   * @param {string} tipoReport - Tipo de reporte (mobiliario|equipos)
   */
  function populateFilters(data, tipoReport) {
    const isMobiliario = tipoReport === "mobiliario";
    
    // Definir mapeo de campos según tipo de reporte
    const fieldMappings = isMobiliario ? 
      [
        { field: "tipo", dataField: "tipoMob", idField: "id_tipo_mobiliario", nameField: "nombre" },
        { field: "ubicacion", dataField: "servicio", idField: "id_servicios", nameField: "nombre_serv" },
        { field: "marca", dataField: "marca", idField: "marca", nameField: "marca" },
        { field: "modelo", dataField: "modelo", idField: "modelo", nameField: "modelo" }
      ] : 
      [
        { field: "tipo", dataField: "tipoE", idField: "id_tipo_equipo", nameField: "nombre" },
        { field: "ubicacion", dataField: "servicio", idField: "id_servicios", nameField: "nombre_serv" },
        { field: "marca", dataField: "marca", idField: "marca", nameField: "marca" },
        { field: "modelo", dataField: "modelo", idField: "modelo", nameField: "modelo" },
        { field: "serial", dataField: "serial", idField: "serial", nameField: "serial" }
      ];

    // Llenar cada dropdown
    fieldMappings.forEach(mapping => {
      const select = document.getElementById(mapping.field);
      if (!select) return;
      
      select.innerHTML = '<option value="" selected>Todos</option>';
      
      if (Array.isArray(data[mapping.dataField])) {
        data[mapping.dataField].forEach(item => {
          const option = document.createElement("option");
          option.value = item[mapping.idField];
          option.textContent = item[mapping.nameField] || item[mapping.idField];
          select.appendChild(option);
        });
      }
    });
  }

  /**
   * Manejar envío del formulario
   */
  $("#form-reporte").submit(function(e) {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const formData = $(this).serialize();
    const isMobiliario = $("#tipoReporte").val() === "mobiliario";
    
    $.ajax({
      type: "POST",
      url: "index.php?action=reportes_mobiliario",
      data: formData,
      dataType: "json",
      success: data => {
        DataManager.currentData = data; // Almacenar datos actuales
        updateDisplay();
      },
      error: error => {
        console.error("Error generando reporte:", error);
        Utils.showAlert("error", "Error", "Ocurrió un error al generar el reporte.");
      }
    });
  });

  /**
   * Validar formulario antes de enviar
   * @returns {boolean} - True si el formulario es válido
   */
  function validateForm() {
    const fechaInicioValida = Utils.validateDate("fecha_inicio", "error_fecha_inicio");
    const fechaFinValida = Utils.validateDate("fecha_fin", "error_fecha_fin");
    const tipoReporteValido = Utils.validateRequired("tipoReporte", "error_tipoReporte");

    if (!tipoReporteValido) {
      Utils.showAlert("error", "Formulario inválido", "Debe seleccionar un tipo de reporte.");
      return false;
    }

    const fechaInicio = $("#fecha_inicio").val() ? new Date($("#fecha_inicio").val()) : null;
    const fechaFin = $("#fecha_fin").val() ? new Date($("#fecha_fin").val()) : null;
    
    if (fechaInicio && fechaFin && fechaInicio > fechaFin) {
      Utils.showAlert("error", "Formulario inválido", 
        "La fecha de inicio no puede ser mayor a la fecha final.");
      return false;
    }

    return true;
  }

  /**
   * Actualizar toda la visualización (tablas y gráficos)
   */
  function updateDisplay() {
    const filters = getCurrentFilters();
    const filteredData = DataManager.applyFilters(filters);
    const isMobiliario = $("#tipoReporte").val() === "mobiliario";
    
    if (filteredData.length === 0) {
      Utils.showAlert("error", "Sin resultados", "No se encontraron registros con los filtros aplicados.");
      return;
    }

    displayReport(filteredData, isMobiliario);
    generateCharts(isMobiliario);
    Utils.showAlert("success", "Reporte generado", `Se encontraron ${filteredData.length} registros.`);
  }

  /**
   * Obtener los filtros actuales del formulario
   * @returns {object} - Objeto con los valores de los filtros
   */
  function getCurrentFilters() {
    return {
      tipo: $("#tipo").val(),
      marca: $("#marca").val(),
      modelo: $("#modelo").val(),
      estado: $("#estado").val(),
      serial: $("#serial").val(),
      ubicacion: $("#ubicacion").val(),
      fechaInicio: $("#fecha_inicio").val(),
      fechaFin: $("#fecha_fin").val()
    };
  }

  /**
   * Mostrar reporte en la tabla correspondiente
   * @param {array} data - Datos a mostrar (ya filtrados)
   * @param {boolean} isMobiliario - Indica si es reporte de mobiliario
   */
  function displayReport(data, isMobiliario) {
    const table = isMobiliario ? tableMob : tableEq;
    const container = isMobiliario ? "#contenedor_mob" : "#contenedor_equipos";
    
    table.clear();
    
    data.forEach(item => {
      const rowData = isMobiliario ? 
        [
          Utils.formatDate(item.fecha_registro),
          item.nombre,
          `${item.marca} / ${item.modelo}`,
          item.color,
          item.estado,
          item.nombre_serv
        ] : 
        [
          Utils.formatDate(item.fecha_registro),
          item.nombre,
          `${item.marca} / ${item.modelo}`,
          item.serial,
          item.estado,
          item.nombre_serv
        ];
      
      table.row.add(rowData);
    });
    
    table.draw();
    $(container).show();
  }

  /**
   * Generar gráficos según el tipo de reporte
   * @param {boolean} isMobiliario - Indica si es reporte de mobiliario
   */
  function generateCharts(isMobiliario) {
    if (isMobiliario) {
      generateMobiliarioCharts();
    } else {
      generateEquiposCharts();
    }
  }

  /**
   * Generar gráficos para reporte de mobiliario
   */
  function generateMobiliarioCharts() {
    const chartConfigs = [
      { id: "chartMT", field: "id_tipo_mobiliario", label: "nombre", title: "Tipo" },
      { id: "chartMMA", field: "marca", title: "Marca" },
      { id: "chartMMO", field: "modelo", title: "Modelo" },
      { id: "chartME", field: "estado", title: "Estado" },
      { id: "chartMU", field: "id_servicios", label: "nombre_serv", title: "Ubicación" }
    ];
    
    chartConfigs.forEach(config => {
      const { labels, dataValues } = DataManager.getChartData(
        config.field, 
        config.label || config.field
      );
      
      ChartManager.createOrUpdateChart(
        config.id, 
        "bar", 
        labels, 
        dataValues, 
        config.title
      );
    });
  }

  /**
   * Generar gráficos para reporte de equipos
   */
  function generateEquiposCharts() {
    const chartConfigs = [
      { id: "chartET", field: "id_tipo_equipo", label: "nombre", title: "Tipo" },
      { id: "chartEMA", field: "marca", title: "Marca" },
      { id: "chartEMO", field: "modelo", title: "Modelo" },
      { id: "chartEE", field: "estado", title: "Estado" },
      { id: "chartES", field: "serial", title: "Serial" },
      { id: "chartEU", field: "id_servicios", label: "nombre_serv", title: "Ubicación" }
    ];
    
    chartConfigs.forEach(config => {
      const { labels, dataValues } = DataManager.getChartData(
        config.field, 
        config.label || config.field
      );
      
      ChartManager.createOrUpdateChart(
        config.id, 
        "bar", 
        labels, 
        dataValues, 
        config.title
      );
    });
  }

  // Inicializar filtros al cargar la página si ya hay un tipo seleccionado
  if ($("#tipoReporte").val()) {
    loadFilterData();
  }

  // Manejar cambios en los filtros para actualizar visualización
  $("select.filter-control").change(function() {
    if (DataManager.currentData.length > 0) {
      updateDisplay();
    }
  });
});