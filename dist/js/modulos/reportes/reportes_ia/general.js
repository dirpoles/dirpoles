/**
 * Reporte General con IA
 * ======================
 * Maneja el botón "Generar reporte con IA" (#btn-ia), el modal de resultados
 * (#modal-reporte-ia), el botón copiar (#btn-copiar-ia) e imprimir (#btn-imprimir-ia).
 *
 * Flujo:
 *   1. Verifica salud del microservicio (GET  reportes_general_ia_health)
 *   2. Pide confirmación al usuario (SweetAlert)
 *   3. Envía los filtros al backend (POST reportes_general_ia)
 *   4. Renderiza el análisis en el modal (resumen, hallazgos, recomendaciones)
 */
document.addEventListener("DOMContentLoaded", function () {

    const btnIA = document.getElementById("btn-ia");
    if (!btnIA) return;

    // ==================== BOTÓN PRINCIPAL: GENERAR REPORTE CON IA ====================
    btnIA.addEventListener("click", function () {
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
                                        renderizarAnalisis(resData.analisis, {
                                            fechaInicio: filterFechaInicio,
                                            fechaFin: filterFechaFin,
                                            genero: filterGenero,
                                            pnf: filterPnf,
                                            area: filterArea
                                        });
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

    // ==================== RENDERIZAR EL ANÁLISIS EN EL MODAL ====================
    function renderizarAnalisis(analisis, filtros) {
        // ---- 1. Estadísticas resumidas de la muestra ----
        const statsContainer = document.getElementById("ia-resumen-stats");

        let totalReg = 0;
        if (analisis && typeof analisis === "object") {
            totalReg = analisis.total_registros
                || (analisis.datos_analizados && analisis.datos_analizados.total_registros)
                || 0;
        }
        if (!totalReg && typeof lastFilteredData !== "undefined" && lastFilteredData.length) {
            totalReg = lastFilteredData.length;
        }
        if (!totalReg && typeof completeData !== "undefined" && completeData.length) {
            totalReg = completeData.length;
        }

        statsContainer.innerHTML = `
            <div class="col-md-3 mb-2 mb-md-0 border-right">
                <h4 class="font-weight-bold text-primary mb-0">${totalReg}</h4>
                <small class="text-muted font-weight-bold">Registros Analizados</small>
            </div>
            <div class="col-md-3 mb-2 mb-md-0 border-right">
                <h6 class="font-weight-bold text-gray-800 mb-0">Géneros</h6>
                <small class="text-muted font-weight-bold">${filtros.genero ? (filtros.genero === 'M' ? 'Masc.' : 'Fem.') : 'Todos'}</small>
            </div>
            <div class="col-md-3 mb-2 mb-md-0 border-right">
                <h6 class="font-weight-bold text-gray-800 mb-0">PNF</h6>
                <small class="text-muted font-weight-bold text-truncate d-inline-block" style="max-width: 100%;">${filtros.pnf || 'Todos'}</small>
            </div>
            <div class="col-md-3">
                <h6 class="font-weight-bold text-gray-800 mb-0">Área</h6>
                <small class="text-muted font-weight-bold text-truncate d-inline-block" style="max-width: 100%;">${filtros.area || 'Todas'}</small>
            </div>
        `;

        // ---- 2. Contenido textual del análisis ----
        const contentDiv = document.getElementById("ia-reporte-contenido");
        contentDiv.innerHTML = construirContenidoAnalisis(analisis);

        // ---- 3. Mostrar el modal ----
        const modalElement = document.getElementById("modal-reporte-ia");
        const modalInstance = new bootstrap.Modal(modalElement);
        modalInstance.show();
    }

    /**
     * Construye el HTML del análisis. Soporta el formato actual del microservicio
     * (resumen / hallazgos / recomendaciones) y formatos anteriores como fallback.
     */
    function construirContenidoAnalisis(analisis) {
        if (!analisis) return "<p>No se recibió contenido del análisis.</p>";

        // Formato actual del microservicio (AnalisisOutput)
        if (typeof analisis === "object" && (analisis.resumen || analisis.hallazgos || analisis.recomendaciones)) {
            let html = "";

            if (analisis.resumen) {
                html += `<h6 class="font-weight-bold text-primary mb-2">Resumen</h6>`;
                html += `<p>${escapeHtml(analisis.resumen)}</p>`;
            }

            if (Array.isArray(analisis.hallazgos) && analisis.hallazgos.length) {
                html += `<h6 class="font-weight-bold text-primary mt-3 mb-2">Hallazgos</h6>`;
                html += `<ul class="mb-0">`;
                analisis.hallazgos.forEach(h => {
                    html += `<li>${escapeHtml(h)}</li>`;
                });
                html += `</ul>`;
            }

            if (Array.isArray(analisis.recomendaciones) && analisis.recomendaciones.length) {
                html += `<h6 class="font-weight-bold text-primary mt-3 mb-2">Recomendaciones</h6>`;
                html += `<ul class="mb-0">`;
                analisis.recomendaciones.forEach(r => {
                    html += `<li>${escapeHtml(r)}</li>`;
                });
                html += `</ul>`;
            }

            if (html) return html;
        }

        // Formatos anteriores (fallback)
        let fullReportText = "";
        if (typeof analisis === 'string') {
            fullReportText = analisis;
        } else if (analisis.analisis) {
            fullReportText = analisis.analisis;
        } else if (analisis.resultado) {
            fullReportText = analisis.resultado;
        } else if (analisis.reporte) {
            fullReportText = analisis.reporte;
        } else {
            fullReportText = JSON.stringify(analisis, null, 2);
        }

        // Convertir saltos de línea en párrafos
        return fullReportText
            .split(/\r?\n/)
            .map(line => line.trim())
            .filter(Boolean)
            .map(line => `<p>${escapeHtml(line)}</p>`)
            .join("");
    }

    function escapeHtml(text) {
        return String(text)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // ==================== COPIAR REPORTE ====================
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

    // ==================== IMPRIMIR REPORTE ====================
    document.getElementById("btn-imprimir-ia").addEventListener("click", function () {
        const reportHtml = document.getElementById("ia-reporte-contenido").innerHTML;
        if (!reportHtml) return;

        // Quitar los iconos decorativos (FontAwesome) que no se renderizan en la impresión
        const printHtml = reportHtml.replace(/<i[^>]*><\/i>/gi, "");

        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
            <html>
                <head>
                    <title>Reporte Analítico - Inteligencia Artificial</title>
                    <style>
                        @page { size: A4; margin: 12mm; }
                        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; line-height: 1.4; font-size: 11.5px; }
                        h1 { color: #004a99; font-size: 16px; border-bottom: 2px solid #004a99; padding-bottom: 6px; margin: 0 0 12px 0; }
                        h6 { color: #004a99; font-size: 12px; margin: 10px 0 4px 0; page-break-after: avoid; }
                        p, li { page-break-inside: avoid; }
                        p { margin: 0 0 8px 0; }
                        ul { margin: 0 0 10px 0; padding-left: 18px; }
                        li { margin-bottom: 3px; }
                        i { display: none !important; }
                        .footer { margin-top: 20px; font-size: 9px; color: #777; border-top: 1px solid #ddd; padding-top: 6px; text-align: center; }
                    </style>
                </head>
                <body>
                    <h1>Análisis Textual - Inteligencia Artificial DIRPOLES</h1>
                    ${printHtml}
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

});