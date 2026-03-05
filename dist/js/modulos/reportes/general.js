//-------------------------------------------- VALIDACIONES
const hoy = new Date();
const fechaActual = hoy.toISOString().split("T")[0];

document.getElementById("fecha_inicio").setAttribute("max", fechaActual);
document.getElementById("fecha_fin").setAttribute("max", fechaActual);

function validarFechaManual(inputId) {
    const input = document.getElementById(inputId);
    if (input.value && new Date(input.value) > new Date(fechaActual)) {
        return false;
    }
    return true;
}

// Variables globales
let tableGeneral;
let completeData = [];
let lastFilteredData = []; // Para re-render al cambiar tipo de chart

// Gráficos
let chartG = null;
let chartP = null;
let chartGeneral = null;

// Tipo de gráfico global (controlado por el select "Tipo")
let currentChartType = 'bar';

document.addEventListener("DOMContentLoaded", () => {

    // Inicializar DataTable
    inicializarDataTable();

    // Cargar los datos completos
    fetch(BASE_URL + "reportes_general_data")
        .then(response => response.json())
        .then(data => {
            if (data.exito === false) {
                Swal.fire({ icon: "error", title: "Error", text: data.mensaje || "No se pudo cargar la data." });
                return;
            }
            completeData = data;

            // Llenar selectores PNF y Area
            const areaI = document.getElementById("area");
            const pnfI = document.getElementById("pnf");

            if (Array.isArray(completeData)) {
                const areaUnicas = [...new Set(completeData.map((item) => item.nombre_serv).filter(Boolean))];
                areaUnicas.forEach((item) => {
                    const optionE = document.createElement("option");
                    optionE.value = item;
                    optionE.textContent = item;
                    areaI.appendChild(optionE);
                });

                const pnfUnicas = [...new Set(completeData.map((item) => item.nombre_pnf).filter(Boolean))];
                pnfUnicas.forEach((item) => {
                    const optionE = document.createElement("option");
                    optionE.value = item;
                    optionE.textContent = item;
                    pnfI.appendChild(optionE);
                });
            }
        })
        .catch(error => {
            console.error("Error al cargar la data:", error);
            Swal.fire({ icon: "error", title: "Error de conexión", text: "No se pudo conectar con el servidor para obtener los datos." });
        });

    // Submit del formulario
    document.getElementById("form-reporte").addEventListener("submit", function (e) {
        e.preventDefault();

        if (!validarFechaManual("fecha_inicio") || !validarFechaManual("fecha_fin")) {
            Swal.fire({
                icon: "error",
                title: "Formulario inválido",
                text: "La fecha de inicio y fin no pueden ser fechas futuras.",
                confirmButtonText: "Entendido",
            });
            return;
        }

        filtrarYRenderizar();
    });

    // Limpiar
    document.getElementById("btn-limpiar").addEventListener("click", function () {
        document.getElementById("form-reporte").reset();
        document.getElementById("contenedor_general").style.display = "none";
        lastFilteredData = [];

        if (tableGeneral) {
            tableGeneral.clear().draw();
        }
    });

    // Selector "Mostrar" (qué gráfica ver)
    document.getElementById("select-grafica").addEventListener("change", function () {
        actualizarVisibilidadCharts();
    });

    // Selector "Tipo" (bar, pie, doughnut)
    document.getElementById("select-tipo-chart").addEventListener("change", function () {
        currentChartType = this.value;
        // Re-renderizar con los datos filtrados actuales
        if (lastFilteredData.length > 0) {
            renderizarGraficoGenero(lastFilteredData);
            renderizarGraficoPNF(lastFilteredData);
            renderizarGraficoArea(lastFilteredData);
        }
    });

});

// ==================== VISIBILIDAD DE CHARTS ====================
function actualizarVisibilidadCharts() {
    const seleccion = document.getElementById("select-grafica").value;
    const wrapperG = document.getElementById("wrapper-chartG");
    const wrapperP = document.getElementById("wrapper-chartP");
    const wrapperA = document.getElementById("wrapper-chartGeneral");

    if (seleccion === 'todos') {
        wrapperG.style.display = '';
        wrapperP.style.display = '';
        wrapperA.style.display = '';
    } else if (seleccion === 'genero') {
        wrapperG.style.display = '';
        wrapperP.style.display = 'none';
        wrapperA.style.display = 'none';
    } else if (seleccion === 'pnf') {
        wrapperG.style.display = 'none';
        wrapperP.style.display = '';
        wrapperA.style.display = 'none';
    } else if (seleccion === 'area') {
        wrapperG.style.display = 'none';
        wrapperP.style.display = 'none';
        wrapperA.style.display = '';
    }
}

// ==================== DATATABLE ====================
function inicializarDataTable() {
    tableGeneral = $("#tabla_general").DataTable({
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
                title: "Reporte General",
                className: "btn btn-success btn-sm m-1",
            },
            {
                extend: "pdfHtml5",
                text: '<i class="fas fa-file-pdf"></i> Exportar a PDF',
                title: "Reporte General",
                className: "btn btn-danger btn-sm m-1",
                orientation: "landscape",
                pageSize: "A4",
                exportOptions: { columns: ":visible" },
                customize: function (doc) {
                    // Estilo de tabla
                    doc.styles.tableHeader.fillColor = '#4e73df';
                    doc.styles.tableHeader.color = 'white';

                    // Agregar gráficos visibles al PDF
                    const chartMap = [
                        { id: "chartG", wrapperId: "wrapper-chartG", title: "Gráfico por Género" },
                        { id: "chartP", wrapperId: "wrapper-chartP", title: "Gráfico por PNF" },
                        { id: "chartGeneral", wrapperId: "wrapper-chartGeneral", title: "Gráfico por Área" }
                    ];

                    chartMap.forEach(item => {
                        const wrapper = document.getElementById(item.wrapperId);
                        const canvas = document.getElementById(item.id);

                        // Solo exportar charts que estén visibles
                        if (wrapper && canvas && wrapper.style.display !== 'none') {
                            const chartImage = canvas.toDataURL("image/png");
                            doc.content.push({
                                pageBreak: "before",
                                text: item.title,
                                alignment: "center",
                                margin: [0, 20, 0, 10],
                                fontSize: 16,
                                bold: true,
                            });
                            doc.content.push({
                                image: chartImage,
                                width: 700,
                                alignment: "center",
                                margin: [0, 30, 0, 20],
                            });
                        }
                    });
                }
            }
        ],
        language: {
            sEmptyTable: "No hay registros disponibles",
            sInfo: "Mostrando _START_ a _END_ de _TOTAL_ registros",
            sInfoEmpty: "Mostrando 0 a 0 de 0 registros",
            sInfoFiltered: "(filtrado de _MAX_ registros totales)",
            sLengthMenu: "Mostrar _MENU_ registros",
            sLoadingRecords: "Cargando...",
            sProcessing: "Procesando...",
            sSearch: "Buscar:",
            sZeroRecords: "No se encontraron resultados",
            oPaginate: { sFirst: "Primero", sLast: "Último", sNext: "Siguiente", sPrevious: "Anterior" }
        }
    });

    // Mover botones al contenedor deseado
    tableGeneral.buttons().container().appendTo('#botones-exportacion');
}

// ==================== FILTRAR Y RENDERIZAR ====================
function filtrarYRenderizar() {
    const filterFechaInicio = document.getElementById("fecha_inicio").value;
    const filterFechaFin = document.getElementById("fecha_fin").value;
    const filterGenero = document.getElementById("genero").value;
    const filterPnf = document.getElementById("pnf").value;
    const filterArea = document.getElementById("area").value;

    const filteredData = completeData.filter((item) => {
        let match = true;

        // Fecha
        if (filterFechaInicio || filterFechaFin) {
            const itemDate = new Date(item.fecha_creacion.split(' ')[0]);
            if (filterFechaInicio && itemDate < new Date(filterFechaInicio)) match = false;
            if (filterFechaFin && itemDate > new Date(filterFechaFin)) match = false;
        }

        if (filterGenero && item.genero !== filterGenero) match = false;
        if (filterPnf && item.nombre_pnf !== filterPnf) match = false;
        if (filterArea && item.nombre_serv !== filterArea) match = false;

        return match;
    });

    if (filteredData.length === 0) {
        Swal.fire({
            icon: "warning",
            title: "Sin resultados",
            text: "No se encontraron registros con los filtros seleccionados.",
            confirmButtonText: "Entendido",
        });
        document.getElementById("contenedor_general").style.display = "none";
        tableGeneral.clear().draw();
        lastFilteredData = [];
        return;
    }

    // Guardar para re-render
    lastFilteredData = filteredData;

    // Llenar DataTable
    tableGeneral.clear();
    filteredData.forEach(item => {
        const dateParts = item.fecha_creacion.split(' ')[0].split("-");
        const fecha_formateada = dateParts.length === 3 ? `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}` : item.fecha_creacion;
        const nombresApellidos = item.nombres + " " + item.apellidos;

        tableGeneral.row.add([
            fecha_formateada,
            nombresApellidos,
            item.cedula,
            item.nombre_pnf || "N/A",
            item.nombre_serv || "N/A"
        ]);
    });
    tableGeneral.draw();

    document.getElementById("contenedor_general").style.display = "block";

    // Renderizar Gráficos
    renderizarGraficoGenero(filteredData);
    renderizarGraficoPNF(filteredData);
    renderizarGraficoArea(filteredData);
    actualizarVisibilidadCharts();

    // SweetAlert éxito
    Swal.fire({
        icon: "success",
        title: "Reporte generado",
        text: `Se encontraron ${filteredData.length} registro(s) con los filtros aplicados.`,
        confirmButtonText: "Entendido",
        timer: 3000,
        timerProgressBar: true,
    });
}

// ==================== RENDERS DE GRÁFICOS ====================
const bgColors = [
    "rgba(78, 115, 223, 0.8)", "rgba(28, 200, 138, 0.8)", "rgba(54, 185, 204, 0.8)",
    "rgba(246, 194, 62, 0.8)", "rgba(231, 74, 59, 0.8)", "rgba(133, 135, 150, 0.8)",
    "rgba(90, 92, 105, 0.8)", "rgba(255, 128, 66, 0.8)", "rgba(102, 16, 242, 0.8)",
    "rgba(253, 126, 20, 0.8)"
];

function buildChartConfig(type, labels, dataValues, labelTitle) {
    let options = {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
            callbacks: {
                label: function (tooltipItem, data) {
                    let label = data.labels[tooltipItem.index] || '';
                    if (label) label += ': ';
                    label += dataValues[tooltipItem.index];
                    return label;
                }
            }
        },
        legend: { display: true, position: 'bottom' }
    };

    if (type === 'bar') {
        options.scales = {
            yAxes: [{ ticks: { beginAtZero: true } }]
        };
        options.legend.display = false;
    }

    return {
        type: type,
        data: {
            labels: labels,
            datasets: [{
                label: labelTitle,
                data: dataValues,
                backgroundColor: bgColors.slice(0, labels.length),
                borderColor: "white",
                borderWidth: 2
            }]
        },
        options: options
    };
}

function renderizarGraficoGenero(filteredData) {
    const generoMap = { "M": "Masculino", "F": "Femenino" };
    const generosUnicos = [...new Set(filteredData.map(i => i.genero).filter(Boolean))];
    const labels = generosUnicos.length ? generosUnicos.map(g => generoMap[g] || "No especificado") : ["No especificado"];
    const values = generosUnicos.map(g => filteredData.filter(item => item.genero === g).length);

    if (chartG) chartG.destroy();
    const ctx = document.getElementById("chartG").getContext("2d");
    chartG = new Chart(ctx, buildChartConfig(currentChartType, labels, values, "Género"));
}

function renderizarGraficoPNF(filteredData) {
    const pnfUnicos = [...new Set(filteredData.map(i => i.nombre_pnf).filter(Boolean))];
    const labels = pnfUnicos.length ? pnfUnicos : ["No especificado"];
    const values = pnfUnicos.map(pnf => filteredData.filter(item => item.nombre_pnf === pnf).length);

    if (chartP) chartP.destroy();
    const ctx = document.getElementById("chartP").getContext("2d");
    chartP = new Chart(ctx, buildChartConfig(currentChartType, labels, values, "PNF"));
}

function renderizarGraficoArea(filteredData) {
    const areasUnicas = [...new Set(filteredData.map(i => i.nombre_serv).filter(Boolean))];
    const labels = areasUnicas.length ? areasUnicas : ["No especificado"];
    const values = areasUnicas.map(area => filteredData.filter(item => item.nombre_serv === area).length);

    if (chartGeneral) chartGeneral.destroy();
    const ctx = document.getElementById("chartGeneral").getContext("2d");
    chartGeneral = new Chart(ctx, buildChartConfig(currentChartType, labels, values, "Área"));
}
