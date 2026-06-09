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
                    // popoverOffset: 30,

                    steps: [
                        {
                            element: "#fecha_inicio",
                            popover: {
                                title: "Fecha Inicio",
                                description: "Seleccione la fecha inicial para filtrar el reporte.",
                                align: "center",
                            },
                        },
                        {
                            element: "#fecha_fin",
                            popover: {
                                title: "Fecha Fin",
                                description: "Seleccione la fecha final para filtrar el reporte.",
                                align: "center",
                            },
                        },
                        {
                            element: "#genero",
                            popover: {
                                title: "Género",
                                description: "Filtre los resultados especificando un género.",
                                align: "center",
                            },
                        },
                        {
                            element: "#pnfd",
                            popover: {
                                title: "PNF",
                                description: "Filtre los resultados por Programa Nacional de Formación.",
                                align: "center",
                            },
                        },
                        {
                            element: "#aread",
                            popover: {
                                title: "Área",
                                description: "Filtre los resultados por el área o departamento involucrado.",
                                align: "center",
                            },
                        }
                    ],
                });
                driverObj.drive();
            } catch (error) {
                console.error("Error al inicializar driver:", error);
            }
        }
    });
});

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

    // Botón de Inteligencia Artificial (Análisis con IA)
    document.getElementById("btn-ia").addEventListener("click", function () {
        // 1. Mostrar SweetAlert para verificar salud
        Swal.fire({
            title: "Verificando conexión...",
            text: "Comprobando el estado del microservicio de IA.",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        // Hacer petición al health check
        fetch(BASE_URL + "reportes_general_ia_health")
            .then(response => response.json())
            .then(health => {
                if (health.exito && health.activo) {
                    // Si el microservicio está activo, preguntar si se desea generar el análisis
                    Swal.fire({
                        title: "¡Microservicio Activo!",
                        text: "¿Desea generar el reporte textual analítico mediante Inteligencia Artificial?",
                        icon: "question",
                        showCancelButton: true,
                        confirmButtonColor: "#4e73df",
                        cancelButtonColor: "#858796",
                        confirmButtonText: '<i class="fas fa-brain mr-1"></i> Sí, generar',
                        cancelButtonText: 'Cancelar'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // Obtener filtros actuales
                            const filterFechaInicio = document.getElementById("fecha_inicio").value;
                            const filterFechaFin = document.getElementById("fecha_fin").value;
                            const filterGenero = document.getElementById("genero").value;
                            const filterPnf = document.getElementById("pnf").value;
                            const filterArea = document.getElementById("area").value;

                            // Formar data a enviar
                            const formData = new FormData();
                            formData.append("fecha_inicio", filterFechaInicio);
                            formData.append("fecha_fin", filterFechaFin);
                            formData.append("genero", filterGenero);
                            formData.append("pnf", filterPnf);
                            formData.append("area", filterArea);

                            // Mostrar loading de generación
                            Swal.fire({
                                title: "Generando reporte...",
                                html: "El modelo de IA está analizando los datos resumidos. <br>Esto puede tomar unos segundos...",
                                allowOutsideClick: false,
                                didOpen: () => {
                                    Swal.showLoading();
                                }
                            });

                            // Enviar petición para generar el reporte
                            fetch(BASE_URL + "reportes_general_ia", {
                                method: "POST",
                                body: formData
                            })
                                .then(res => res.json())
                                .then(resData => {
                                    if (resData.exito) {
                                        Swal.close();

                                        // Rellenar las estadísticas resumidas de la muestra en el modal
                                        const statsContainer = document.getElementById("ia-resumen-stats");

                                        // Determinar cantidad de registros filtrados o totales
                                        const totalReg = (resData.analisis && resData.analisis.datos_analizados)
                                            ? resData.analisis.datos_analizados.total_registros
                                            : (lastFilteredData.length || completeData.length || 0);

                                        // Armamos el HTML del resumen
                                        statsContainer.innerHTML = `
                                        <div class="col-md-3 mb-2 mb-md-0 border-right">
                                            <h4 class="font-weight-bold text-primary mb-0">${totalReg}</h4>
                                            <small class="text-muted font-weight-bold">Registros Analizados</small>
                                        </div>
                                        <div class="col-md-3 mb-2 mb-md-0 border-right">
                                            <h6 class="font-weight-bold text-gray-800 mb-0">Géneros</h6>
                                            <small class="text-muted font-weight-bold">${filterGenero ? (filterGenero === 'M' ? 'Masc.' : 'Fem.') : 'Todos'}</small>
                                        </div>
                                        <div class="col-md-3 mb-2 mb-md-0 border-right">
                                            <h6 class="font-weight-bold text-gray-800 mb-0">PNF</h6>
                                            <small class="text-muted font-weight-bold text-truncate d-inline-block" style="max-width: 100%;">${filterPnf || 'Todos'}</small>
                                        </div>
                                        <div class="col-md-3">
                                            <h6 class="font-weight-bold text-gray-800 mb-0">Área</h6>
                                            <small class="text-muted font-weight-bold text-truncate d-inline-block" style="max-width: 100%;">${filterArea || 'Todas'}</small>
                                        </div>
                                    `;

                                        // Llenar el texto generado por la IA
                                        const contentDiv = document.getElementById("ia-reporte-contenido");
                                        let fullReportText = "";

                                        if (resData.analisis) {
                                            if (typeof resData.analisis === 'string') {
                                                fullReportText = resData.analisis;
                                            } else if (resData.analisis.analisis) {
                                                fullReportText = resData.analisis.analisis;
                                            } else if (resData.analisis.resultado) {
                                                fullReportText = resData.analisis.resultado;
                                            } else if (resData.analisis.reporte) {
                                                fullReportText = resData.analisis.reporte;
                                            } else {
                                                fullReportText = JSON.stringify(resData.analisis, null, 2);
                                            }
                                        }

                                        contentDiv.textContent = fullReportText;

                                        // Mostrar el modal
                                        const modalElement = document.getElementById("modal-reporte-ia");
                                        const modalInstance = new bootstrap.Modal(modalElement);
                                        modalInstance.show();

                                    } else {
                                        Swal.fire({
                                            icon: "error",
                                            title: "Error al generar reporte",
                                            text: resData.mensaje || "Ocurrió un error inesperado al procesar con la IA."
                                        });
                                    }
                                })
                                .catch(err => {
                                    console.error("Error al llamar a reportes_general_ia:", err);
                                    Swal.fire({
                                        icon: "error",
                                        title: "Error de Servidor",
                                        text: "No se pudo establecer comunicación con el backend para la IA."
                                    });
                                });
                        }
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Microservicio Inactivo",
                        text: "El microservicio de IA no se encuentra disponible. Verifique que esté corriendo."
                    });
                }
            })
            .catch(err => {
                console.error("Error al verificar estado de la IA:", err);
                Swal.fire({
                    icon: "error",
                    title: "Error de Conexión",
                    text: "No se pudo consultar el estado del microservicio de IA."
                });
            });
    });

    // Acción para copiar el reporte al portapapeles
    document.getElementById("btn-copiar-ia").addEventListener("click", function () {
        const textToCopy = document.getElementById("ia-reporte-contenido").textContent;
        if (!textToCopy) return;

        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                Swal.fire({
                    icon: "success",
                    title: "Copiado",
                    text: "El reporte se ha copiado al portapapeles correctamente.",
                    timer: 1500,
                    showConfirmButton: false
                });
            })
            .catch(err => {
                console.error("Error al copiar texto: ", err);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No se pudo copiar el texto automáticamente."
                });
            });
    });

    // Acción para imprimir el reporte de la IA
    document.getElementById("btn-imprimir-ia").addEventListener("click", function () {
        const reportText = document.getElementById("ia-reporte-contenido").textContent;
        if (!reportText) return;

        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
            <html>
                <head>
                    <title>Reporte Analítico - Inteligencia Artificial</title>
                    <style>
                        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; line-height: 1.6; }
                        h1 { color: #004a99; font-size: 24px; border-bottom: 2px solid #004a99; padding-bottom: 10px; margin-bottom: 20px; }
                        .footer { margin-top: 50px; font-size: 11px; color: #777; border-top: 1px solid #ddd; padding-top: 10px; text-align: center; }
                        pre { white-space: pre-wrap; font-family: inherit; font-size: 14px; }
                    </style>
                </head>
                <body>
                    <h1>Análisis Textual - Inteligencia Artificial DIRPOLES</h1>
                    <pre>${reportText}</pre>
                    <div class="footer">
                        Generado de forma automática por el sistema DIRPOLES 4 - ${new Date().toLocaleString()}
                    </div>
                    <script>
                        window.onload = function() {
                            window.print();
                            window.onafterprint = function() {
                                window.close();
                            };
                        }
                    <\/script>
                </body>
            </html>
        `);
        printWindow.document.close();
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
