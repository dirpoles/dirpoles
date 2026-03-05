$(document).ready(function () {
  $("#tipoReporte").on("change", function () {
    $(".general").hide();
    $("#divBanco").hide();
    $("#divDisc").hide();
    $("#divP").hide();
    $("#divT").hide();
    $("#divE").hide();

    if ($(this).val() === "becas") {
      $("#divBanco").show();
      $(".general").show();
    } else if ($(this).val() === "exoneracion") {
      $("#divDisc").show();
      $(".general").show();
    } else if ($(this).val() === "fames") {
      $("#divP").show();
      $("#divT").show();
      $(".general").show();
    } else if ($(this).val() === "embarazo") {
      $("#divP").show();
      $("#divE").show();
      $(".divE").show();
    }
  });

  const bancoMap = {
    "0102": "BANCO DE VENEZUELA",
    "0156": "100% BANCO",
    "0172": "BANCAMIGA BANCO MICROFINANCIERO C A",
    "0114": "BANCARIBE",
    "0171": "BANCO ACTIVO",
    "0166": "BANCO AGRICOLA DE VENEZUELA",
    "0175": "BANCO BICENTENARIO DEL PUEBLO",
    "0128": "BANCO CARONI",
    "0163": "BANCO DEL TESORO",
    "0115": "BANCO EXTERIOR",
    "0151": "BANCO FONDO COMUN",
    "0173": "BANCO INTERNACIONAL DE DESARROLLO",
    "0105": "BANCO MERCANTIL",
    "0191": "BANCO NACIONAL DE CREDITO",
    "0138": "BANCO PLAZA",
    "0137": "BANCO SOFITASA",
    "0104": "BANCO VENEZOLANO DE CREDITO",
    "0168": "BANCRECER",
    "0134": "BANESCO",
    "0177": "BANFANB",
    "0146": "BANGENTE",
    "0174": "BANPLUS",
    "0108": "BBVA PROVINCIAL",
    "0157": "DELSUR BANCO UNIVERSAL",
    "0169": "MI BANCO",
    "0178": "N58 BANCO DIGITAL BANCO MICROFINANCIERO S A",
  };

  //---------------------------------- VALIDACIONES

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

  function validarTipoReporte() {
    const tipoReporte = document.getElementById("tipoReporte").value;
    const tipoError = document.getElementById("error_tipo_reporte");

    if (!tipoReporte) {
      tipoError.textContent = "Este campo no puede estar vacío.";
      return false;
    } else {
      tipoError.textContent = "";
      return true;
    }
  }

  document
    .getElementById("fecha_inicio")
    .addEventListener("input", function () {
      validarFechaManual("fecha_inicio", "error_fecha_inicio");
    });

  document.getElementById("fecha_fin").addEventListener("input", function () {
    validarFechaManual("fecha_fin", "error_fecha_fin");
  });

  document
    .getElementById("tipoReporte")
    .addEventListener("change", function () {
      validarTipoReporte();
    });

  document
    .getElementById("form-reporte")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const fechaInicioValida = validarFechaManual(
        "fecha_inicio",
        "error_fecha_inicio"
      );
      const fechaFinValida = validarFechaManual("fecha_fin", "error_fecha_fin");
      const tipoReporteValido = validarTipoReporte();

      if (!tipoReporteValido) {
        Swal.fire({
          icon: "error",
          title: "Formulario invalido.",
          text: "El formulario no puede estar vacio.",
          confirmButtonText: "Entendido",
        });
        return;
      }

      if (!fechaInicioValida || !fechaFinValida) {
        Swal.fire({
          icon: "error",
          title: "Formulario invalido.",
          text: "La fecha de inicio y fin no pueden ser fechas futuras.",
          confirmButtonText: "Entendido",
        });
        return;
      }
    });

  //------------------------------------------------------------------------------------------
  //---------------------------------------------------------------------------------------------

  document.getElementById("tipoReporte").addEventListener("change", cargar);

  function cargar() {
    const tipoReporte = document.getElementById("tipoReporte").value;

    let url = "";
    if (tipoReporte === "becas") {
      url = `index.php?action=reportes_trabajo_social&servicio=becas`;
    } else if (tipoReporte === "exoneracion") {
      url = `index.php?action=reportes_trabajo_social&servicio=exoneracion`;
    } else if (tipoReporte === "fames") {
      url = `index.php?action=reportes_trabajo_social&servicio=fames`;
    } else if (tipoReporte === "embarazo") {
      url = `index.php?action=reportes_trabajo_social&servicio=embarazo`;
    }

    if (url !== "") {
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const info = data;
          

          const pnfSelect = document.getElementById("pnf");
          pnfSelect.innerHTML = '<option value="" selected>Todos</option>';

          const bancoI = document.getElementById("banco");
          bancoI.innerHTML = '<option value="" selected>Todos</option>';

          if (Array.isArray(info)) {
            const pnfUnico = [...new Set(info.map((item) => item.id_pnf))];

            pnfUnico.forEach((id) => {
              const pnfItem = info.find((item) => item.id_pnf === id);

              if (pnfItem) {
                const optionE = document.createElement("option");
                optionE.value = id;
                optionE.textContent = pnfItem.nombre_pnf;
                pnfSelect.appendChild(optionE);
              }
            });

            const bancoUnicas = [
              ...new Set(info.map((item) => item.tipo_banco)),
            ];

            bancoUnicas.forEach((codigoBanco) => {
              const option = document.createElement("option");
              option.value = codigoBanco;
              option.textContent = bancoMap[codigoBanco];
              bancoI.appendChild(option);
            });
          }

          const pnfClass = document.querySelector('.divE #pnf');
          pnfClass.innerHTML = '<option value="" selected>Todos</option>';


          if (Array.isArray(info)) {
            const pnfUnico = [...new Set(info.map((item) => item.id_pnf))];

            pnfUnico.forEach((id) => {
              const pnfItem = info.find((item) => item.id_pnf === id);

              if (pnfItem) {
                const optionE = document.createElement("option");
                optionE.value = id;
                optionE.textContent = pnfItem.nombre_pnf;
                pnfClass.appendChild(optionE);
              }
            });
          }

          const patologiaSelect = document.getElementById("patologia");
          patologiaSelect.innerHTML =
            '<option value="" selected>Todos</option>';

          if (Array.isArray(info)) {
            const idsUnicos = [
              ...new Set(info.map((item) => item.id_patologia)),
            ];

            idsUnicos.forEach((id) => {
              const patologia = info.find(
                (item) => item.id_patologia === id
              );
              if (patologia) {
                const option = document.createElement("option");
                option.value = id;
                option.textContent = patologia.nombre_patologia;
                patologiaSelect.appendChild(option);
              }
            });
          }
        })
        .catch((error) =>
          console.error("Error al cargar beneficiarios:", error)
        );
    }
  }

  //-------------------------------------------- DATATABLE -------------------------

  let config = {};
  let tableBecas;
  let tableExoneracion;
  let tableFames;
  let tableEmb;

  fetch("api/endpoint.php")
    .then((response) => response.json())
    .then((data) => {
      config = data; // Guarda las constantes en el objeto config
      console.log("Configuración cargada:", config);

      // Inicializa DataTables aquí (o llama a una función que lo haga)
      tableBecas = $("#tabla_becas").DataTable({
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
            title: "Reporte Becas",
            className: "btn btn-success",
          },
          {
            extend: "pdfHtml5",
            text: '<i class="fas fa-file-pdf"></i> Exportar a PDF',
            title: "Reporte Becas",
            className: "btn btn-danger",
            orientation: "landscape",
            pageSize: "A4",
            exportOptions: {
              columns: ":visible",
            },
            customize: function (doc) {
              // Agrega espacio para evitar superposición con el header
              doc.content.splice(0, 0, { text: " ", margin: [0, 0, 0, 0] });

              // Ajuste del título
              doc.content[1].bold = true;
              doc.content[1].alignment = "center";
              doc.content[1].color = "black";
              doc.content[1].fontSize = 16;

              // Agrega resumen de registros
              const pageInfo = tableBecas.page.info();
              const summaryText = `Mostrando ${pageInfo.start + 1} a ${
                pageInfo.end
              } de ${pageInfo.recordsTotal} registros`;

              doc.content.push({
                text: summaryText,
                alignment: "left",
                margin: [0, 10, 0, 0],
              });

              doc.content[2].margin = [0, 0, 0, 0];
              doc.content[2].table.widths = Array(
                doc.content[2].table.body[0].length + 1
              )
                .join("*")
                .split("");

              const chartIds = ["chartBPnf", "chartBG", "chartBB"];
              const chartTitles = [
                "Gráfico por PNF",
                "Gráfico por Genero",
                "Gráfico por Banco",
              ];

              // Agregar cada gráfico en una página separada
              chartIds.forEach((chartId, index) => {
                const canvas = document.getElementById(chartId);
                if (canvas) {
                  const chartImage = canvas.toDataURL("image/png");

                  // Agregar página nueva
                  doc.content.push({
                    pageBreak: "before",
                    text: chartTitles[index],
                    style: "header",
                    alignment: "center",
                    margin: [0, 20, 0, 10],
                    fontSize: 16,
                    bold: true,
                  });

                  // Agregar gráfico ocupando casi toda la página
                  doc.content.push({
                    image: chartImage,
                    width: 1000, // Aumenta este valor para hacer más grande el gráfico
                    alignment: "center",
                    margin: [0, 30, 0, 20], // Ajusta márgenes para centrar verticalmente
                  });

                  // Puedes agregar texto adicional debajo de cada gráfico si lo necesitas
                  doc.content.push({
                    text: "Los elementos que tengan 10+ indican que hay más de 10 registros existentes.",
                    alignment: "center",
                    margin: [0, 0, 0, 20],
                    fontSize: 12,
                    italics: true,
                  });
                }
              });

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
            },
          },
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
          oPaginate: {
            sFirst: "Primero",
            sLast: "Último",
            sNext: "Siguiente",
            sPrevious: "Anterior",
          },
          oAria: {
            sSortAscending:
              ": Activar para ordenar la columna de manera ascendente",
            sSortDescending:
              ": Activar para ordenar la columna de manera descendente",
          },
        },
      });

      tableExoneracion = $("#tabla_exoneracion").DataTable({
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
            title: "Reporte Exoneracion",
            className: "btn btn-success",
          },
          {
            extend: "pdfHtml5",
            text: '<i class="fas fa-file-pdf"></i> Exportar a PDF',
            title: "Reporte Exoneracion",
            className: "btn btn-danger",
            orientation: "landscape",
            pageSize: "A4",
            exportOptions: {
              columns: ":visible",
            },
            customize: function (doc) {
              // Agrega espacio para evitar superposición con el header
              doc.content.splice(0, 0, { text: " ", margin: [0, 0, 0, 0] });

              // Ajuste del título
              doc.content[1].bold = true;
              doc.content[1].alignment = "center";
              doc.content[1].color = "black";
              doc.content[1].fontSize = 16;

              // Agrega resumen de registros
              const pageInfo = tableExoneracion.page.info();
              const summaryText = `Mostrando ${pageInfo.start + 1} a ${
                pageInfo.end
              } de ${pageInfo.recordsTotal} registros`;

              doc.content.push({
                text: summaryText,
                alignment: "left",
                margin: [0, 10, 0, 0],
              });

              doc.content[2].margin = [0, 0, 0, 0];
              doc.content[2].table.widths = Array(
                doc.content[2].table.body[0].length + 1
              )
                .join("*")
                .split("");

              const chartIds = ["chartEP", "chartEG", "chartED"];
              const chartTitles = [
                "Gráfico por PNF",
                "Gráfico por Genero",
                "Gráfico por Discapacidad",
              ];

              // Agregar cada gráfico en una página separada
              chartIds.forEach((chartId, index) => {
                const canvas = document.getElementById(chartId);
                if (canvas) {
                  const chartImage = canvas.toDataURL("image/png");

                  // Agregar página nueva
                  doc.content.push({
                    pageBreak: "before",
                    text: chartTitles[index],
                    style: "header",
                    alignment: "center",
                    margin: [0, 20, 0, 10],
                    fontSize: 16,
                    bold: true,
                  });

                  // Agregar gráfico ocupando casi toda la página
                  doc.content.push({
                    image: chartImage,
                    width: 1000, // Aumenta este valor para hacer más grande el gráfico
                    alignment: "center",
                    margin: [0, 30, 0, 20], // Ajusta márgenes para centrar verticalmente
                  });

                  // Puedes agregar texto adicional debajo de cada gráfico si lo necesitas
                  doc.content.push({
                    text: "Los elementos que tengan 10+ indican que hay más de 10 registros existentes.",
                    alignment: "center",
                    margin: [0, 0, 0, 20],
                    fontSize: 12,
                    italics: true,
                  });
                }
              });

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
            },
          },
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
          oPaginate: {
            sFirst: "Primero",
            sLast: "Último",
            sNext: "Siguiente",
            sPrevious: "Anterior",
          },
          oAria: {
            sSortAscending:
              ": Activar para ordenar la columna de manera ascendente",
            sSortDescending:
              ": Activar para ordenar la columna de manera descendente",
          },
        },
      });

      tableFames = $("#tabla_fames").DataTable({
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
            title: "Reporte FAMES",
            className: "btn btn-success",
          },
          {
            extend: "pdfHtml5",
            text: '<i class="fas fa-file-pdf"></i> Exportar a PDF',
            title: "Reporte FAMES",
            className: "btn btn-danger",
            orientation: "landscape",
            pageSize: "A4",
            exportOptions: {
              columns: ":visible",
            },
            customize: function (doc) {
              // Agrega espacio para evitar superposición con el header
              doc.content.splice(0, 0, { text: " ", margin: [0, 0, 0, 0] });

              // Ajuste del título
              doc.content[1].bold = true;
              doc.content[1].alignment = "center";
              doc.content[1].color = "black";
              doc.content[1].fontSize = 16;

              // Agrega resumen de registros
              const pageInfo = tableFames.page.info();
              const summaryText = `Mostrando ${pageInfo.start + 1} a ${
                pageInfo.end
              } de ${pageInfo.recordsTotal} registros`;

              doc.content.push({
                text: summaryText,
                alignment: "left",
                margin: [0, 10, 0, 0],
              });

              doc.content[2].margin = [0, 0, 0, 0];
              doc.content[2].table.widths = Array(
                doc.content[2].table.body[0].length + 1
              )
                .join("*")
                .split("");

              const chartIds = ["chartFP", "chartFG", "chartFPT", "chartFTA"];
              const chartTitles = [
                "Gráfico por PNF",
                "Gráfico por Genero",
                "Gráfico por Patologias",
                "Gráfico por Tipo de ayuda",
              ];

              // Agregar cada gráfico en una página separada
              chartIds.forEach((chartId, index) => {
                const canvas = document.getElementById(chartId);
                if (canvas) {
                  const chartImage = canvas.toDataURL("image/png");

                  // Agregar página nueva
                  doc.content.push({
                    pageBreak: "before",
                    text: chartTitles[index],
                    style: "header",
                    alignment: "center",
                    margin: [0, 20, 0, 10],
                    fontSize: 16,
                    bold: true,
                  });

                  // Agregar gráfico ocupando casi toda la página
                  doc.content.push({
                    image: chartImage,
                    width: 1000, // Aumenta este valor para hacer más grande el gráfico
                    alignment: "center",
                    margin: [0, 30, 0, 20], // Ajusta márgenes para centrar verticalmente
                  });

                  // Puedes agregar texto adicional debajo de cada gráfico si lo necesitas
                  doc.content.push({
                    text: "Los elementos que tengan 10+ indican que hay más de 10 registros existentes.",
                    alignment: "center",
                    margin: [0, 0, 0, 20],
                    fontSize: 12,
                    italics: true,
                  });
                }
              });

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
            },
          },
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
          oPaginate: {
            sFirst: "Primero",
            sLast: "Último",
            sNext: "Siguiente",
            sPrevious: "Anterior",
          },
          oAria: {
            sSortAscending:
              ": Activar para ordenar la columna de manera ascendente",
            sSortDescending:
              ": Activar para ordenar la columna de manera descendente",
          },
        },
      });

      tableEmb = $("#tabla_emb").DataTable({
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
            title: "Reporte Gestion Embarazadas",
            className: "btn btn-success",
          },
          {
            extend: "pdfHtml5",
            text: '<i class="fas fa-file-pdf"></i> Exportar a PDF',
            title: "Reporte Gestion Embarazadas",
            className: "btn btn-danger",
            orientation: "landscape",
            pageSize: "A4",
            exportOptions: {
              columns: ":visible",
            },
            customize: function (doc) {
              // Agrega espacio para evitar superposición con el header
              doc.content.splice(0, 0, { text: " ", margin: [0, 0, 0, 0] });

              // Ajuste del título
              doc.content[1].bold = true;
              doc.content[1].alignment = "center";
              doc.content[1].color = "black";
              doc.content[1].fontSize = 16;

              // Agrega resumen de registros
              const pageInfo = tableEmb.page.info();
              const summaryText = `Mostrando ${pageInfo.start + 1} a ${
                pageInfo.end
              } de ${pageInfo.recordsTotal} registros`;

              doc.content.push({
                text: summaryText,
                alignment: "left",
                margin: [0, 10, 0, 0],
              });

              doc.content[2].margin = [0, 0, 0, 0];
              doc.content[2].table.widths = Array(
                doc.content[2].table.body[0].length + 1
              )
                .join("*")
                .split("");

              const chartIds = [
                "chartEmbP",
                "chartEmbG",
                "chartEmbPT",
                "chartEmbE",
              ];
              const chartTitles = [
                "Gráfico por PNF",
                "Gráfico por Genero",
                "Gráfico por Patologias",
                "Gráfico por Estado",
              ];

              // Agregar cada gráfico en una página separada
              chartIds.forEach((chartId, index) => {
                const canvas = document.getElementById(chartId);
                if (canvas) {
                  const chartImage = canvas.toDataURL("image/png");

                  // Agregar página nueva
                  doc.content.push({
                    pageBreak: "before",
                    text: chartTitles[index],
                    style: "header",
                    alignment: "center",
                    margin: [0, 20, 0, 10],
                    fontSize: 16,
                    bold: true,
                  });

                  // Agregar gráfico ocupando casi toda la página
                  doc.content.push({
                    image: chartImage,
                    width: 1000, // Aumenta este valor para hacer más grande el gráfico
                    alignment: "center",
                    margin: [0, 30, 0, 20], // Ajusta márgenes para centrar verticalmente
                  });

                  // Puedes agregar texto adicional debajo de cada gráfico si lo necesitas
                  doc.content.push({
                    text: "Los elementos que tengan 10+ indican que hay más de 10 registros existentes.",
                    alignment: "center",
                    margin: [0, 0, 0, 20],
                    fontSize: 12,
                    italics: true,
                  });
                }
              });

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
            },
          },
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
          oPaginate: {
            sFirst: "Primero",
            sLast: "Último",
            sNext: "Siguiente",
            sPrevious: "Anterior",
          },
          oAria: {
            sSortAscending:
              ": Activar para ordenar la columna de manera ascendente",
            sSortDescending:
              ": Activar para ordenar la columna de manera descendente",
          },
        },
      });
    })
    .catch((error) => {
      console.error("Error cargando configuración:", error);
    });

  //------------------------------------------- SELECCION DE SERVICIO

  $("#tipoReporte").change(function () {
    $("#contenedor_becas").hide();
    $("#contenedor_exoneracion").hide();
    $("#contenedor_fames").hide();
    $("#contenedor_emb").hide();
  });

  //----BECAS----
  let realValuesG = [];
  let realValuesP = [];
  let realValuesB = [];
  let chartGenero = null;
  let chartP = null;
  let chartB = null;

  //---EXONERACION---
  let realValuesEG = [];
  let realValuesEP = [];
  let realValuesED = [];
  let chartEG = null;
  let chartEP = null;
  let chartED = null;

  //---FAMES---
  let realValuesFG = [];
  let realValuesFP = [];
  let realValuesFPT = [];
  let realValuesFTA = [];
  let chartFG = null;
  let chartFP = null;
  let chartFPT = null;
  let chartFTA = null;

  //---GESTION EMBARAZADAS---
  let realValuesEmbG = [];
  let realValuesEmbP = [];
  let realValuesEmbPT = [];
  let realValuesEmbE = [];
  let chartEmbG = null;
  let chartEmbP = null;
  let chartEmbPT = null;
  let chartEmbE = null;

  let filteredData = null;

  $("#form-reporte").submit(function (e) {
    e.preventDefault();

    $.ajax({
      type: "POST",
      url: "index.php?action=reportes_trabajo_social",
      data: $(this).serialize(),
      dataType: "json",
      success: function (data) {
        if (
          $("#tipoReporte").val() === "becas" &&
          validarFechaManual("fecha_inicio", "error_fecha_inicio") &&
          validarFechaManual("fecha_fin", "error_fecha_fin")
        ) {
          tableBecas.clear();

          filteredData = data
            .filter(
              (item) =>
                !$("#fecha_inicio").val() ||
                !$("#fecha_fin").val() ||
                (new Date(item.fecha_creacion) >=
                  new Date($("#fecha_inicio").val()) &&
                  new Date(item.fecha_creacion) <=
                    new Date($("#fecha_fin").val()))
            )
            .filter(
              (item) => !$("#pnf").val() || item.id_pnf === $("#pnf").val()
            )
            .filter(
              (item) =>
                !$("#genero").val() || item.genero === $("#genero").val()
            )
            .filter(
              (item) =>
                !$("#banco").val() || item.tipo_banco === $("#banco").val()
            );

          filteredData.forEach((item) => {
            const dateParts = item.fecha_creacion.split("-");
            const fecha_formateada = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

            const nombresApellidos = item.nombres + " " + item.apellidos;

            const bancos = {
              "0102": "BANCO DE VENEZUELA",
              "0156": "100% BANCO",
              "0172": "BANCAMIGA BANCO MICROFINANCIERO C A",
              "0114": "BANCARIBE",
              "0171": "BANCO ACTIVO",
              "0166": "BANCO AGRICOLA DE VENEZUELA",
              "0175": "BANCO BICENTENARIO DEL PUEBLO",
              "0128": "BANCO CARONI",
              "0163": "BANCO DEL TESORO",
              "0115": "BANCO EXTERIOR",
              "0151": "BANCO FONDO COMUN",
              "0173": "BANCO INTERNACIONAL DE DESARROLLO",
              "0105": "BANCO MERCANTIL",
              "0191": "BANCO NACIONAL DE CREDITO",
              "0138": "BANCO PLAZA",
              "0137": "BANCO SOFITASA",
              "0104": "BANCO VENEZOLANO DE CREDITO",
              "0168": "BANCRECER",
              "0134": "BANESCO",
              "0177": "BANFANB",
              "0146": "BANGENTE",
              "0174": "BANPLUS",
              "0108": "BBVA PROVINCIAL",
              "0157": "DELSUR BANCO UNIVERSAL",
              "0169": "MI BANCO",
              "0178": "N58 BANCO DIGITAL BANCO MICROFINANCIERO S A",
            };

            const nombreBanco = bancos[item.tipo_banco] || item.tipo_banco;

            tableBecas.row.add([
              fecha_formateada,
              nombresApellidos,
              item.cedula,
              item.nombre_pnf,
              nombreBanco,
              item.cta_bcv,
            ]);
          });

          tableBecas.draw();

          if (filteredData.length > 0) {
            $("#contenedor_becas").show();
            $("#contenedor_exoneracion").hide();
            $("#contenedor_fames").hide();
            $("#contenedor_emb").hide();
            Swal.fire({
              icon: "success",
              title: "Reporte generado.",
              text: "Reporte generado con éxito.",
              confirmButtonText: "Entendido",
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Reporte no generado.",
              text: "El reporte no se pudo generar.",
              confirmButtonText: "Entendido",
            });
          }
        } else if (
          $("#tipoReporte").val() === "exoneracion" &&
          validarFechaManual("fecha_inicio", "error_fecha_inicio") &&
          validarFechaManual("fecha_fin", "error_fecha_fin")
        ) {
          tableExoneracion.clear();

          const filteredData = data
            .filter(
              (item) =>
                !$("#fecha_inicio").val() ||
                !$("#fecha_fin").val() ||
                (new Date(item.fecha_creacion) >=
                  new Date($("#fecha_inicio").val()) &&
                  new Date(item.fecha_creacion) <=
                    new Date($("#fecha_fin").val()))
            )
            .filter(
              (item) => !$("#pnf").val() || item.id_pnf === $("#pnf").val()
            )
            .filter(
              (item) =>
                !$("#genero").val() || item.genero === $("#genero").val()
            )
            .filter(
              (item) =>
                !$("#discapacidad").val() ||
                item.otro_motivo === $("#discapacidad").val()
            );

          filteredData.forEach((item) => {
            const dateParts = item.fecha_creacion.split("-");
            const fecha_formateada = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

            const nombresApellidos = item.nombres + " " + item.apellidos;

            const motivoMod =
              item.motivo === "inscripcion"
                ? "Inscripcion"
                : "Paquete de Grado";

            tableExoneracion.row.add([
              fecha_formateada,
              nombresApellidos,
              item.cedula,
              item.nombre_pnf,
              motivoMod,
              item.otro_motivo,
            ]);
          });
          tableExoneracion.draw();

          if (filteredData.length > 0) {
            $("#contenedor_becas").hide();
            $("#contenedor_exoneracion").show();
            $("#contenedor_fames").hide();
            $("#contenedor_emb").hide();
            Swal.fire({
              icon: "success",
              title: "Reporte generado.",
              text: "Reporte generado con éxito.",
              confirmButtonText: "Entendido",
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Reporte no generado.",
              text: "El reporte no se pudo generar.",
              confirmButtonText: "Entendido",
            });
          }
        } else if (
          $("#tipoReporte").val() === "fames" &&
          validarFechaManual("fecha_inicio", "error_fecha_inicio") &&
          validarFechaManual("fecha_fin", "error_fecha_fin")
        ) {
          tableFames.clear();

          const filteredData = data
            .filter(
              (item) =>
                !$("#fecha_inicio").val() ||
                !$("#fecha_fin").val() ||
                (new Date(item.fecha_creacion) >=
                  new Date($("#fecha_inicio").val()) &&
                  new Date(item.fecha_creacion) <=
                    new Date($("#fecha_fin").val()))
            )
            .filter(
              (item) => !$("#pnf").val() || item.id_pnf === $("#pnf").val()
            )
            .filter(
              (item) =>
                !$("#genero").val() || item.genero === $("#genero").val()
            )
            .filter(
              (item) =>
                !$("#patologia").val() ||
                item.id_patologia === $("#patologia").val()
            )
            .filter(
              (item) =>
                !$("#tipoAyuda").val() ||
                item.tipo_ayuda === $("#tipoAyuda").val()
            );

          filteredData.forEach((item) => {
            const dateParts = item.fecha_creacion.split("-");
            const fecha_formateada = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

            const nombresApellidos = item.nombres + " " + item.apellidos;

            tableFames.row.add([
              fecha_formateada,
              nombresApellidos,
              item.cedula,
              item.nombre_pnf,
              item.nombre_patologia,
              item.tipo_ayuda,
              item.otro_tipo,
            ]);
          });
          tableFames.draw();

          if (filteredData.length > 0) {
            $("#contenedor_becas").hide();
            $("#contenedor_exoneracion").hide();
            $("#contenedor_fames").show();
            $("#contenedor_emb").hide();
            Swal.fire({
              icon: "success",
              title: "Reporte generado.",
              text: "Reporte generado con éxito.",
              confirmButtonText: "Entendido",
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Reporte no generado.",
              text: "El reporte no se pudo generar.",
              confirmButtonText: "Entendido",
            });
          }
        } else if (
          $("#tipoReporte").val() === "embarazo" &&
          validarFechaManual("fecha_inicio", "error_fecha_inicio") &&
          validarFechaManual("fecha_fin", "error_fecha_fin")
        ) {
          tableEmb.clear();

          const pnfValue = document.querySelector('.divE #pnf').value;

          const filteredData = data
            .filter(
              (item) =>
                !$("#fecha_inicio").val() ||
                !$("#fecha_fin").val() ||
                (new Date(item.fecha_creacion) >=
                  new Date($("#fecha_inicio").val()) &&
                  new Date(item.fecha_creacion) <=
                    new Date($("#fecha_fin").val()))
            )
            .filter(
              (item) => !pnfValue || item.id_pnf === pnfValue
            )
            .filter(
              (item) =>
                !$("#patologia").val() ||
                item.id_patologia === $("#patologia").val()
            )
            .filter(
              (item) =>
                !$("#estado").val() || item.estado === $("#estado").val()
            )
            .filter(
              (item) =>
                !$("#genero").val() || item.genero === $("#genero").val()
            );

          filteredData.forEach((item) => {
            const dateParts = item.fecha_creacion.split(" ")[0].split("-");
            const fecha_formateada = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

            const nombresApellidos = item.nombres + " " + item.apellidos;

            tableEmb.row.add([
              fecha_formateada,
              nombresApellidos,
              item.cedula,
              item.nombre_pnf,
              item.nombre_patologia,
              item.semanas_gest,
              item.codigo_patria,
              item.serial_patria,
              item.estado,
            ]);
          });
          tableEmb.draw();

          if (filteredData.length > 0) {
            $("#contenedor_becas").hide();
            $("#contenedor_exoneracion").hide();
            $("#contenedor_fames").hide();
            $("#contenedor_emb").show();
            Swal.fire({
              icon: "success",
              title: "Reporte generado.",
              text: "Reporte generado con éxito.",
              confirmButtonText: "Entendido",
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Reporte no generado.",
              text: "El reporte no se pudo generar.",
              confirmButtonText: "Entendido",
            });
          }
        } else {
          tableBecas.clear().draw();
          tableExoneracion.clear().draw();
          tableFames.clear().draw();
          tableEmb.clear().draw();
        }

        //-----------------------------------GRAFICOS---------------------------------------------------------
        // --------------------------------BECAS------------------------------------------------------------------

        //------------------CHART GENERO------------------------------------------------
        const generoMap = {
          M: "Masculino",
          F: "Femenino",
        };

        function matchesG(item) {
          const fechaItem = new Date(item.fecha_creacion.split(" ")[0]); // Convierte la fecha del item a objeto Date (ignora hora si existe)
          const fechaInicio = $("#fecha_inicio").val()
            ? new Date($("#fecha_inicio").val())
            : null;
          const fechaFin = $("#fecha_fin").val()
            ? new Date($("#fecha_fin").val())
            : null;

          return (
            (!$("#genero").val() || item.genero === $("#genero").val()) &&
            (!$("#pnf").val() || item.id_pnf == $("#pnf").val()) &&
            (!$("#banco").val() || item.tipo_banco == $("#banco").val()) &&
            (!fechaInicio || fechaItem >= fechaInicio) &&
            (!fechaFin || fechaItem <= fechaFin)
          );
        }

        const generoSet = new Set(
          data.filter(matchesG).map((item) => item.genero)
        );

        const labelsG =
          generoSet.size > 0
            ? [...generoSet].map(
                (g) => generoMap[g] || "Género no especificado"
              )
            : ["Género no especificado"];

        const dataValuesG = labelsG.map((label) => {
          const valorGenero =
            label === "Masculino" ? "M" : label === "Femenino" ? "F" : null;

          return data.filter((item) => {
            return (
              (valorGenero === null || item.genero === valorGenero) &&
              (!$("#pnf").val() || item.id_pnf == $("#pnf").val()) &&
              (!$("#banco").val() || item.tipo_banco === $("#banco").val())
            );
          }).length;
        });

        // Array de valores para el gráfico: se truncan a 10 si exceden ese valor.
        const displayValuesG = dataValuesG.map((value) =>
          value > 10 ? 10 : value
        );

        // Array de valores reales para usarlos en tooltips.
        realValuesG = dataValuesG; // Se mantienen sin truncar.

        if (chartGenero) {
          chartGenero.destroy();
        }

        const ctxG = document.getElementById("chartBG").getContext("2d");
        chartGenero = new Chart(ctxG, {
          type: "bar",
          data: {
            labels: labelsG,
            datasets: [
              {
                label: "Genero",
                data: displayValuesG,
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
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                    min: 0,
                    max: 10,
                    callback: function (value) {
                      return value;
                    },
                  },
                },
              ],
            },
            tooltips: {
              callbacks: {
                label: function (tooltipItem, data) {
                  const index = tooltipItem.index;
                  const label = data.labels[index];
                  const realVal = realValuesG[index];

                  if (realVal > 10) {
                    return `${label}: ${realVal} (más de 10)`;
                  } else {
                    return `${label}: ${realVal}`;
                  }
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
                formatter: function (value, context) {
                  // Si el valor real es mayor que 10, añade un indicador.
                  const index = context.dataIndex;
                  const realVal = realValuesG[index];
                  return realVal > 10 ? "10+" : realVal;
                },
              },
            },
          },
          plugins: [ChartDataLabels],
        });

        //-------------------------------------------------------------------------------------------
        //----------------------------------CHART PNF------------------------------------------------
        function matchesPNF(item) {
          const fechaItem = new Date(item.fecha_creacion.split(" ")[0]);
          const fechaInicio = $("#fecha_inicio").val()
            ? new Date($("#fecha_inicio").val())
            : null;
          const fechaFin = $("#fecha_fin").val()
            ? new Date($("#fecha_fin").val())
            : null;

          return (
            (!$("#genero").val() || item.genero === $("#genero").val()) &&
            (!$("#pnf").val() || item.id_pnf == $("#pnf").val()) &&
            (!$("#banco").val() || item.tipo_banco == $("#banco").val()) &&
            (!fechaInicio || fechaItem >= fechaInicio) &&
            (!fechaFin || fechaItem <= fechaFin)
          );
        }

        const pnfSet = new Set(
          data.filter(matchesPNF).map((item) => item.nombre_pnf)
        );

        const labelsP = pnfSet.size > 0 ? [...pnfSet] : ["PNF no especificado"];

        const dataValuesP = labelsP.map((label) => {
          if (label === "PNF no especificado") return 0;

          return data.filter((item) => {
            return (
              item.nombre_pnf === label && matchesPNF(item) // ¡Aplica el mismo filtro completo aquí!
            );
          }).length;
        });

        // Array de valores para el gráfico: se truncan a 10 si exceden ese valor.
        const displayValuesP = dataValuesP.map((value) =>
          value > 10 ? 10 : value
        );

        // Array de valores reales para usarlos en tooltips.
        realValuesP = dataValuesP; // Se mantienen sin truncar.

        if (chartP) {
          chartP.destroy();
        }

        const ctxP = document.getElementById("chartBPnf").getContext("2d");
        chartP = new Chart(ctxP, {
          type: "bar",
          data: {
            labels: labelsP,
            datasets: [
              {
                label: "PNF",
                data: displayValuesP,
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
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                    min: 0,
                    max: 10,
                    callback: function (value) {
                      return value;
                    },
                  },
                },
              ],
            },
            tooltips: {
              callbacks: {
                label: function (tooltipItem, data) {
                  const index = tooltipItem.index;
                  const label = data.labels[index];
                  const realVal = realValuesP[index];

                  if (realVal > 10) {
                    return `${label}: ${realVal} (más de 10)`;
                  } else {
                    return `${label}: ${realVal}`;
                  }
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
                formatter: function (value, context) {
                  // Si el valor real es mayor que 10, añade un indicador.
                  const index = context.dataIndex;
                  const realVal = realValuesP[index];
                  return realVal > 10 ? "10+" : realVal;
                },
              },
            },
          },
          plugins: [ChartDataLabels],
        });

        //-------------------------------------------------------------------------------------------
        //---------------------------------CHART BANCOS-------------------------------------------------

        function matchesBancos(item) {
          const fechaItem = new Date(item.fecha_creacion.split(" ")[0]);
          const fechaInicio = $("#fecha_inicio").val()
            ? new Date($("#fecha_inicio").val())
            : null;
          const fechaFin = $("#fecha_fin").val()
            ? new Date($("#fecha_fin").val())
            : null;

          return (
            (!$("#genero").val() || item.genero === $("#genero").val()) &&
            (!$("#pnf").val() || item.id_pnf == $("#pnf").val()) &&
            (!$("#banco").val() || item.tipo_banco == $("#banco").val()) &&
            (!fechaInicio || fechaItem >= fechaInicio) &&
            (!fechaFin || fechaItem <= fechaFin)
          );
        }

        const filterBancos = data.filter(matchesBancos);

        const bancoSet = new Set(filterBancos.map((item) => item.tipo_banco));

        const labelsB =
          bancoSet.size > 0
            ? [...bancoSet].map(
                (codigo) => bancoMap[codigo] || "Banco desconocido"
              )
            : ["Banco no especificado"];

        const dataValuesB = labelsB.map((label) => {
          const codigoBanco = Object.keys(bancoMap).find(
            (codigo) => bancoMap[codigo] === label
          );

          if (!codigoBanco) return 0;

          return filterBancos.filter((item) => item.tipo_banco === codigoBanco)
            .length;
        });

        // Array de valores para el gráfico: se truncan a 10 si exceden ese valor.
        const displayValuesB = dataValuesB.map((value) =>
          value > 10 ? 10 : value
        );

        // Array de valores reales para usarlos en tooltips.
        realValuesB = dataValuesB; // Se mantienen sin truncar.

        if (chartB) {
          chartB.destroy();
        }

        const ctxB = document.getElementById("chartBB").getContext("2d");
        chartB = new Chart(ctxB, {
          type: "bar",
          data: {
            labels: labelsB,
            datasets: [
              {
                label: "Banco",
                data: displayValuesB,
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
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                    min: 0,
                    max: 10,
                    callback: function (value) {
                      return value;
                    },
                  },
                },
              ],
            },
            tooltips: {
              callbacks: {
                label: function (tooltipItem, data) {
                  const index = tooltipItem.index;
                  const label = data.labels[index];
                  const realVal = realValuesB[index];

                  if (realVal > 10) {
                    return `${label}: ${realVal} (más de 10)`;
                  } else {
                    return `${label}: ${realVal}`;
                  }
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
                formatter: function (value, context) {
                  // Si el valor real es mayor que 10, añade un indicador.
                  const index = context.dataIndex;
                  const realVal = realValuesB[index];
                  return realVal > 10 ? "10+" : realVal;
                },
              },
            },
          },
          plugins: [ChartDataLabels],
        });

        //---------------------------------------------------------------------------------
        //---------------------------------------------------------------------------------------------------------
        //-------------------------------------------------------------------------------------------------------
        //-------------------------------------------EXONERACION----------------------------------------------------
        //-----------------------PNF------------------------------------------------

        function matchesEX(item) {
          const fechaItem = new Date(item.fecha_creacion.split(" ")[0]); // Convierte la fecha del ítem a Date (ignora la hora si existe)
          const fechaInicio = $("#fecha_inicio").val()
            ? new Date($("#fecha_inicio").val())
            : null;
          const fechaFin = $("#fecha_fin").val()
            ? new Date($("#fecha_fin").val())
            : null;

          return (
            (!$("#pnf").val() || item.id_pnf == $("#pnf").val()) &&
            (!$("#genero").val() || item.genero === $("#genero").val()) &&
            (!$("#discapacidad").val() ||
              item.otro_motivo === $("#discapacidad").val()) &&
            (!fechaInicio || fechaItem >= fechaInicio) &&
            (!fechaFin || fechaItem <= fechaFin)
          );
        }

        const datosFiltrados = data.filter(matchesEX);

        const pnfSet2 = new Set(datosFiltrados.map((item) => item.nombre_pnf));
        const labelsEP =
          pnfSet2.size > 0 ? [...pnfSet2] : ["PNF no especificado"];

        const dataValuesEP = labelsEP.map((label) => {
          return label === "PNF no especificado"
            ? 0
            : datosFiltrados.filter((item) => item.nombre_pnf === label).length;
        });

        // Array de valores para el gráfico: se truncan a 10 si exceden ese valor.
        const displayValuesEP = dataValuesEP.map((value) =>
          value > 10 ? 10 : value
        );

        // Array de valores reales para usarlos en tooltips.
        realValuesEP = dataValuesEP; // Se mantienen sin truncar.

        if (chartEP) {
          chartEP.destroy();
        }

        const ctxEP = document.getElementById("chartEP").getContext("2d");
        chartEP = new Chart(ctxEP, {
          type: "bar",
          data: {
            labels: labelsEP,
            datasets: [
              {
                label: "PNF",
                data: displayValuesEP,
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
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                    min: 0,
                    max: 10,
                    callback: function (value) {
                      return value;
                    },
                  },
                },
              ],
            },
            tooltips: {
              callbacks: {
                label: function (tooltipItem, data) {
                  const index = tooltipItem.index;
                  const label = data.labels[index];
                  const realVal = realValuesEP[index];

                  if (realVal > 10) {
                    return `${label}: ${realVal} (más de 10)`;
                  } else {
                    return `${label}: ${realVal}`;
                  }
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
                formatter: function (value, context) {
                  // Si el valor real es mayor que 10, añade un indicador.
                  const index = context.dataIndex;
                  const realVal = realValuesEP[index];
                  return realVal > 10 ? "10+" : realVal;
                },
              },
            },
          },
          plugins: [ChartDataLabels],
        });

        //-----------------------GENERO------------------------------------------------
        function matchesEXG(item) {
          const fechaItem = new Date(item.fecha_creacion.split(" ")[0]);
          const fechaInicio = $("#fecha_inicio").val()
            ? new Date($("#fecha_inicio").val())
            : null;
          const fechaFin = $("#fecha_fin").val()
            ? new Date($("#fecha_fin").val())
            : null;

          return (
            (!$("#pnf").val() || item.id_pnf == $("#pnf").val()) &&
            (!$("#genero").val() || item.genero === $("#genero").val()) &&
            (!$("#discapacidad").val() ||
              item.otro_motivo === $("#discapacidad").val()) &&
            (!fechaInicio || fechaItem >= fechaInicio) &&
            (!fechaFin || fechaItem <= fechaFin)
          );
        }

        const datosFiltradosEX = data.filter(matchesEXG);
        const generoSet2 = new Set(datosFiltradosEX.map((item) => item.genero));
        const labelsEG =
          generoSet2.size > 0
            ? [...generoSet2].map(
                (g) => generoMap[g] || "Género no especificado"
              )
            : ["Género no especificado"];

        const dataValuesEG = labelsEG.map((label) => {
          const valorGenero =
            label === "Masculino" ? "M" : label === "Femenino" ? "F" : null;
          return valorGenero === null
            ? 0
            : datosFiltradosEX.filter((item) => item.genero === valorGenero)
                .length;
        });

        // Array de valores para el gráfico: se truncan a 10 si exceden ese valor.
        const displayValuesEG = dataValuesEG.map((value) =>
          value > 10 ? 10 : value
        );

        // Array de valores reales para usarlos en tooltips.
        realValuesEG = dataValuesEG; // Se mantienen sin truncar.

        if (chartEG) {
          chartEG.destroy();
        }

        const ctxEG = document.getElementById("chartEG").getContext("2d");
        chartEG = new Chart(ctxEG, {
          type: "bar",
          data: {
            labels: labelsEG,
            datasets: [
              {
                label: "Genero",
                data: displayValuesEG,
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
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                    min: 0,
                    max: 10,
                    callback: function (value) {
                      return value;
                    },
                  },
                },
              ],
            },
            tooltips: {
              callbacks: {
                label: function (tooltipItem, data) {
                  const index = tooltipItem.index;
                  const label = data.labels[index];
                  const realVal = realValuesEG[index];

                  if (realVal > 10) {
                    return `${label}: ${realVal} (más de 10)`;
                  } else {
                    return `${label}: ${realVal}`;
                  }
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
                formatter: function (value, context) {
                  // Si el valor real es mayor que 10, añade un indicador.
                  const index = context.dataIndex;
                  const realVal = realValuesEG[index];
                  return realVal > 10 ? "10+" : realVal;
                },
              },
            },
          },
          plugins: [ChartDataLabels],
        });

        //-----------------------DISCAPACIDAD------------------------------------------------
        function matchesEXD(item) {
          const fechaItem = new Date(item.fecha_creacion.split(" ")[0]);
          const fechaInicio = $("#fecha_inicio").val()
            ? new Date($("#fecha_inicio").val())
            : null;
          const fechaFin = $("#fecha_fin").val()
            ? new Date($("#fecha_fin").val())
            : null;

          return (
            (!$("#pnf").val() || item.id_pnf == $("#pnf").val()) &&
            (!$("#genero").val() || item.genero === $("#genero").val()) &&
            (!$("#discapacidad").val() ||
              item.otro_motivo === $("#discapacidad").val()) &&
            (!fechaInicio || fechaItem >= fechaInicio) &&
            (!fechaFin || fechaItem <= fechaFin)
          );
        }

        const datosFiltradosEXD = data.filter(matchesEXD);
        const discapacidadSet = new Set(
          datosFiltradosEXD.map((item) => item.otro_motivo)
        );
        const labelsED =
          discapacidadSet.size > 0
            ? [...discapacidadSet]
            : ["Discapacidad no especificada"];

        const dataValuesED = labelsED.map((label) => {
          return label === "Discapacidad no especificada"
            ? 0
            : datosFiltradosEXD.filter((item) => item.otro_motivo === label)
                .length;
        });

        // Array de valores para el gráfico: se truncan a 10 si exceden ese valor.
        const displayValuesED = dataValuesED.map((value) =>
          value > 10 ? 10 : value
        );

        // Array de valores reales para usarlos en tooltips.
        realValuesED = dataValuesED; // Se mantienen sin truncar.

        if (chartED) {
          chartED.destroy();
        }

        const ctxED = document.getElementById("chartED").getContext("2d");
        chartED = new Chart(ctxED, {
          type: "bar",
          data: {
            labels: labelsED,
            datasets: [
              {
                label: "Discapacidad",
                data: displayValuesED,
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
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                    min: 0,
                    max: 10,
                    callback: function (value) {
                      return value;
                    },
                  },
                },
              ],
            },
            tooltips: {
              callbacks: {
                label: function (tooltipItem, data) {
                  const index = tooltipItem.index;
                  const label = data.labels[index];
                  const realVal = realValuesED[index];

                  if (realVal > 10) {
                    return `${label}: ${realVal} (más de 10)`;
                  } else {
                    return `${label}: ${realVal}`;
                  }
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
                formatter: function (value, context) {
                  // Si el valor real es mayor que 10, añade un indicador.
                  const index = context.dataIndex;
                  const realVal = realValuesED[index];
                  return realVal > 10 ? "10+" : realVal;
                },
              },
            },
          },
          plugins: [ChartDataLabels],
        });

        //---------------------------------------------------------------------------------
        //---------------------------------------------------------------------------------------------------------
        //-------------------------------------------------------------------------------------------------------
        //-------------------------------------------FAMES----------------------------------------------------
        //-----------------------PNF------------------------------------------------
        function matchesFAMESPNF(item) {
          const fechaItem = new Date(item.fecha_creacion.split(" ")[0]);
          const fechaInicio = $("#fecha_inicio").val()
            ? new Date($("#fecha_inicio").val())
            : null;
          const fechaFin = $("#fecha_fin").val()
            ? new Date($("#fecha_fin").val())
            : null;

          return (
            (!$("#genero").val() || item.genero === $("#genero").val()) &&
            (!$("#pnf").val() || item.id_pnf == $("#pnf").val()) &&
            (!$("#patologia").val() ||
              item.id_patologia == $("#patologia").val()) &&
            (!$("#tipoAyuda").val() ||
              item.tipo_ayuda === $("#tipoAyuda").val()) &&
            (!fechaInicio || fechaItem >= fechaInicio) &&
            (!fechaFin || fechaItem <= fechaFin)
          );
        }

        const datosFiltradosFPNF = data.filter(matchesFAMESPNF);
        const pnfSetFPNF = new Set(
          datosFiltradosFPNF.map((item) => item.id_pnf)
        );

        const labelsFP =
          pnfSetFPNF.size > 0
            ? [...pnfSetFPNF].map((id) => {
                const item = datosFiltradosFPNF.find((i) => i.id_pnf === id);
                return item ? item.nombre_pnf : "PNF no especificado";
              })
            : ["PNF no especificado"];

        const dataValuesFP = labelsFP.map((label) => {
          if (label === "PNF no especificado") return 0;
          const item = datosFiltradosFPNF.find((i) => i.nombre_pnf === label);
          return item
            ? datosFiltradosFPNF.filter((i) => i.id_pnf === item.id_pnf).length
            : 0;
        });

        // Array de valores para el gráfico: se truncan a 10 si exceden ese valor.
        const displayValuesFP = dataValuesFP.map((value) =>
          value > 10 ? 10 : value
        );

        // Array de valores reales para usarlos en tooltips.
        realValuesFP = dataValuesFP; // Se mantienen sin truncar.

        if (chartFP) {
          chartFP.destroy();
        }

        const ctxFP = document.getElementById("chartFP").getContext("2d");
        chartFP = new Chart(ctxFP, {
          type: "bar",
          data: {
            labels: labelsFP,
            datasets: [
              {
                label: "PNF",
                data: displayValuesFP,
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
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                    min: 0,
                    max: 10,
                    callback: function (value) {
                      return value;
                    },
                  },
                },
              ],
            },
            tooltips: {
              callbacks: {
                label: function (tooltipItem, data) {
                  const index = tooltipItem.index;
                  const label = data.labels[index];
                  const realVal = realValuesFP[index];

                  if (realVal > 10) {
                    return `${label}: ${realVal} (más de 10)`;
                  } else {
                    return `${label}: ${realVal}`;
                  }
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
                formatter: function (value, context) {
                  // Si el valor real es mayor que 10, añade un indicador.
                  const index = context.dataIndex;
                  const realVal = realValuesFP[index];
                  return realVal > 10 ? "10+" : realVal;
                },
              },
            },
          },
          plugins: [ChartDataLabels],
        });

        //-----------------------GENERO------------------------------------------------
        function matchesFAMESG(item) {
          const fechaItem = new Date(item.fecha_creacion.split(" ")[0]);
          const fechaInicio = $("#fecha_inicio").val()
            ? new Date($("#fecha_inicio").val())
            : null;
          const fechaFin = $("#fecha_fin").val()
            ? new Date($("#fecha_fin").val())
            : null;

          return (
            (!$("#genero").val() || item.genero === $("#genero").val()) &&
            (!$("#pnf").val() || item.id_pnf == $("#pnf").val()) &&
            (!$("#patologia").val() ||
              item.id_patologia == $("#patologia").val()) &&
            (!$("#tipoAyuda").val() ||
              item.tipo_ayuda === $("#tipoAyuda").val()) &&
            (!fechaInicio || fechaItem >= fechaInicio) &&
            (!fechaFin || fechaItem <= fechaFin)
          );
        }

        const datosFiltradosFG = data.filter(matchesFAMESG);
        const generoSetFG = new Set(
          datosFiltradosFG.map((item) => item.genero)
        );

        const labelsFG =
          generoSetFG.size > 0
            ? [...generoSetFG].map(
                (g) => generoMap[g] || "Género no especificado"
              )
            : ["Género no especificado"];

        const dataValuesFG = labelsFG.map((label) => {
          const valorGenero =
            label === "Masculino" ? "M" : label === "Femenino" ? "F" : null;
          return valorGenero === null
            ? 0
            : datosFiltradosFG.filter((item) => item.genero === valorGenero)
                .length;
        });
        // Array de valores para el gráfico: se truncan a 10 si exceden ese valor.
        const displayValuesFG = dataValuesFG.map((value) =>
          value > 10 ? 10 : value
        );

        // Array de valores reales para usarlos en tooltips.
        realValuesFG = dataValuesFG; // Se mantienen sin truncar.

        if (chartFG) {
          chartFG.destroy();
        }

        const ctxFG = document.getElementById("chartFG").getContext("2d");
        chartFG = new Chart(ctxFG, {
          type: "bar",
          data: {
            labels: labelsFG,
            datasets: [
              {
                label: "Genero",
                data: displayValuesFG,
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
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                    min: 0,
                    max: 10,
                    callback: function (value) {
                      return value;
                    },
                  },
                },
              ],
            },
            tooltips: {
              callbacks: {
                label: function (tooltipItem, data) {
                  const index = tooltipItem.index;
                  const label = data.labels[index];
                  const realVal = realValuesFG[index];

                  if (realVal > 10) {
                    return `${label}: ${realVal} (más de 10)`;
                  } else {
                    return `${label}: ${realVal}`;
                  }
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
                formatter: function (value, context) {
                  // Si el valor real es mayor que 10, añade un indicador.
                  const index = context.dataIndex;
                  const realVal = realValuesFG[index];
                  return realVal > 10 ? "10+" : realVal;
                },
              },
            },
          },
          plugins: [ChartDataLabels],
        });

        //-----------------------PATOLOGIA------------------------------------------------
        function matchesFAMESPT(item) {
          const fechaItem = new Date(item.fecha_creacion.split(" ")[0]);
          const fechaInicio = $("#fecha_inicio").val()
            ? new Date($("#fecha_inicio").val())
            : null;
          const fechaFin = $("#fecha_fin").val()
            ? new Date($("#fecha_fin").val())
            : null;

          return (
            (!$("#genero").val() || item.genero === $("#genero").val()) &&
            (!$("#pnf").val() || item.id_pnf == $("#pnf").val()) &&
            (!$("#patologia").val() ||
              item.id_patologia == $("#patologia").val()) &&
            (!$("#tipoAyuda").val() ||
              item.tipo_ayuda === $("#tipoAyuda").val()) &&
            (!fechaInicio || fechaItem >= fechaInicio) &&
            (!fechaFin || fechaItem <= fechaFin)
          );
        }

        const datosFiltradosFPT = data.filter(matchesFAMESPT);
        const patologiaSet = new Set(
          datosFiltradosFPT.map((item) => item.nombre_patologia)
        );

        const labelsFPT =
          patologiaSet.size > 0
            ? [...patologiaSet]
            : ["Patología no especificada"];

        const dataValuesFPT = labelsFPT.map((label) => {
          return label === "Patología no especificada"
            ? 0
            : datosFiltradosFPT.filter(
                (item) => item.nombre_patologia === label
              ).length;
        });

        // Array de valores para el gráfico: se truncan a 10 si exceden ese valor.
        const displayValuesFPT = dataValuesFPT.map((value) =>
          value > 10 ? 10 : value
        );

        // Array de valores reales para usarlos en tooltips.
        realValuesFPT = dataValuesFPT; // Se mantienen sin truncar.

        if (chartFPT) {
          chartFPT.destroy();
        }

        const ctxFPT = document.getElementById("chartFPT").getContext("2d");
        chartFPT = new Chart(ctxFPT, {
          type: "bar",
          data: {
            labels: labelsFPT,
            datasets: [
              {
                label: "Patologias",
                data: displayValuesFPT,
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
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                    min: 0,
                    max: 10,
                    callback: function (value) {
                      return value;
                    },
                  },
                },
              ],
            },
            tooltips: {
              callbacks: {
                label: function (tooltipItem, data) {
                  const index = tooltipItem.index;
                  const label = data.labels[index];
                  const realVal = realValuesFPT[index];

                  if (realVal > 10) {
                    return `${label}: ${realVal} (más de 10)`;
                  } else {
                    return `${label}: ${realVal}`;
                  }
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
                formatter: function (value, context) {
                  // Si el valor real es mayor que 10, añade un indicador.
                  const index = context.dataIndex;
                  const realVal = realValuesFPT[index];
                  return realVal > 10 ? "10+" : realVal;
                },
              },
            },
          },
          plugins: [ChartDataLabels],
        });

        //-----------------------TIPO DE AYUDA------------------------------------------------
        function matchesFAMESTA(item) {
          const fechaItem = new Date(item.fecha_creacion.split(" ")[0]);
          const fechaInicio = $("#fecha_inicio").val()
            ? new Date($("#fecha_inicio").val())
            : null;
          const fechaFin = $("#fecha_fin").val()
            ? new Date($("#fecha_fin").val())
            : null;

          return (
            (!$("#genero").val() || item.genero === $("#genero").val()) &&
            (!$("#pnf").val() || item.id_pnf == $("#pnf").val()) &&
            (!$("#patologia").val() ||
              item.id_patologia == $("#patologia").val()) &&
            (!$("#tipoAyuda").val() ||
              item.tipo_ayuda === $("#tipoAyuda").val()) &&
            (!fechaInicio || fechaItem >= fechaInicio) &&
            (!fechaFin || fechaItem <= fechaFin)
          );
        }

        const datosFiltradosFTA = data.filter(matchesFAMESTA);
        const tipoSet = new Set(
          datosFiltradosFTA.map((item) => item.tipo_ayuda)
        );

        const labelsFTA =
          tipoSet.size > 0 ? [...tipoSet] : ["Tipo de ayuda no especificado"];

        const dataValuesFTA = labelsFTA.map((label) => {
          return label === "Tipo de ayuda no especificado"
            ? 0
            : datosFiltradosFTA.filter((item) => item.tipo_ayuda === label)
                .length;
        });

        // Array de valores para el gráfico: se truncan a 10 si exceden ese valor.
        const displayValuesFTA = dataValuesFTA.map((value) =>
          value > 10 ? 10 : value
        );

        // Array de valores reales para usarlos en tooltips.
        realValuesFTA = dataValuesFTA; // Se mantienen sin truncar.

        if (chartFTA) {
          chartFTA.destroy();
        }

        const ctxFTA = document.getElementById("chartFTA").getContext("2d");
        chartFTA = new Chart(ctxFTA, {
          type: "bar",
          data: {
            labels: labelsFTA,
            datasets: [
              {
                label: "Tipo de Ayuda",
                data: displayValuesFTA,
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
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                    min: 0,
                    max: 10,
                    callback: function (value) {
                      return value;
                    },
                  },
                },
              ],
            },
            tooltips: {
              callbacks: {
                label: function (tooltipItem, data) {
                  const index = tooltipItem.index;
                  const label = data.labels[index];
                  const realVal = realValuesFTA[index];

                  if (realVal > 10) {
                    return `${label}: ${realVal} (más de 10)`;
                  } else {
                    return `${label}: ${realVal}`;
                  }
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
                formatter: function (value, context) {
                  // Si el valor real es mayor que 10, añade un indicador.
                  const index = context.dataIndex;
                  const realVal = realValuesFTA[index];
                  return realVal > 10 ? "10+" : realVal;
                },
              },
            },
          },
          plugins: [ChartDataLabels],
        });

        //---------------------------------------------------------------------------------
        //---------------------------------------------------------------------------------------------------------
        //-------------------------------------------------------------------------------------------------------
        //-------------------------------------------GESTION EMBARAZADA----------------------------------------------------
        //-----------------------PNF------------------------------------------------
var pnfValue = document.querySelector('.divE #pnf').value;
        function matchesEMBPNF(item) {
          const fechaItem = new Date(item.fecha_creacion.split(" ")[0]);
          const fechaInicio = $("#fecha_inicio").val()
            ? new Date($("#fecha_inicio").val())
            : null;
          const fechaFin = $("#fecha_fin").val()
            ? new Date($("#fecha_fin").val())
            : null;

          return (
            (!$("#genero").val() || item.genero === $("#genero").val()) &&
            (!pnfValue || item.id_pnf == pnfValue) &&
            (!$("#patologia").val() ||
              item.id_patologia == $("#patologia").val()) &&
            (!$("#estado").val() || item.estado === $("#estado").val()) &&
            (!fechaInicio || fechaItem >= fechaInicio) &&
            (!fechaFin || fechaItem <= fechaFin)
          );
        }

        const datosFiltradosEMBPNF = data.filter(matchesEMBPNF);

        const pnfSetEMBPNF = new Set(
          datosFiltradosEMBPNF.map((item) => item.id_pnf)
        );
        const labelsEmbP =
          pnfSetEMBPNF.size > 0
            ? [...pnfSetEMBPNF].map((id) => {
                const item = datosFiltradosEMBPNF.find((i) => i.id_pnf === id);
                return item ? item.nombre_pnf : "PNF no especificado";
              })
            : ["PNF no especificado"];

        const dataValuesEmbP = labelsEmbP.map((label) => {
          return label === "PNF no especificado"
            ? 0
            : datosFiltradosEMBPNF.filter((item) => item.nombre_pnf === label)
                .length;
        });

        // Array de valores para el gráfico: se truncan a 10 si exceden ese valor.
        const displayValuesEmbP = dataValuesEmbP.map((value) =>
          value > 10 ? 10 : value
        );

        // Array de valores reales para usarlos en tooltips.
        realValuesEmbP = dataValuesEmbP; // Se mantienen sin truncar.

        if (chartEmbP) {
          chartEmbP.destroy();
        }

        const ctxEmbP = document.getElementById("chartEmbP").getContext("2d");
        chartEmbP = new Chart(ctxEmbP, {
          type: "bar",
          data: {
            labels: labelsEmbP,
            datasets: [
              {
                label: "PNF",
                data: displayValuesEmbP,
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
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                    min: 0,
                    max: 10,
                    callback: function (value) {
                      return value;
                    },
                  },
                },
              ],
            },
            tooltips: {
              callbacks: {
                label: function (tooltipItem, data) {
                  const index = tooltipItem.index;
                  const label = data.labels[index];
                  const realVal = realValuesEmbP[index];

                  if (realVal > 10) {
                    return `${label}: ${realVal} (más de 10)`;
                  } else {
                    return `${label}: ${realVal}`;
                  }
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
                formatter: function (value, context) {
                  // Si el valor real es mayor que 10, añade un indicador.
                  const index = context.dataIndex;
                  const realVal = realValuesEmbP[index];
                  return realVal > 10 ? "10+" : realVal;
                },
              },
            },
          },
          plugins: [ChartDataLabels],
        });

        //-----------------------GENERO------------------------------------------------

        function matchesEMBG(item) {
          const fechaItem = new Date(item.fecha_creacion.split(" ")[0]);
          const fechaInicio = $("#fecha_inicio").val()
            ? new Date($("#fecha_inicio").val())
            : null;
          const fechaFin = $("#fecha_fin").val()
            ? new Date($("#fecha_fin").val())
            : null;

          return (
            (!$("#genero").val() || item.genero === $("#genero").val()) &&
            (!pnfValue || item.id_pnf == pnfValue) &&
            (!$("#patologia").val() ||
              item.id_patologia == $("#patologia").val()) &&
            (!$("#estado").val() || item.estado === $("#estado").val()) &&
            (!fechaInicio || fechaItem >= fechaInicio) &&
            (!fechaFin || fechaItem <= fechaFin)
          );
        }

        const datosFiltradosEMBG = data.filter(matchesEMBG);
        const generoSetEMBG = new Set(
          datosFiltradosEMBG.map((item) => item.genero)
        );

        const labelsEmbG =
          generoSetEMBG.size > 0
            ? [...generoSetEMBG].map(
                (g) => generoMap[g] || "Género no especificado"
              )
            : ["Género no especificado"];

        const dataValuesEmbG = labelsFG.map((label) => {
          const valorGenero =
            label === "Masculino" ? "M" : label === "Femenino" ? "F" : null;
          return valorGenero === null
            ? 0
            : datosFiltradosEMBG.filter((item) => item.genero === valorGenero)
                .length;
        });

        // Array de valores para el gráfico: se truncan a 10 si exceden ese valor.
        const displayValuesEmbG = dataValuesEmbG.map((value) =>
          value > 10 ? 10 : value
        );

        // Array de valores reales para usarlos en tooltips.
        realValuesEmbG = dataValuesEmbG; // Se mantienen sin truncar.

        if (chartEmbG) {
          chartEmbG.destroy();
        }

        const ctxEmbG = document.getElementById("chartEmbG").getContext("2d");
        chartEmbG = new Chart(ctxEmbG, {
          type: "bar",
          data: {
            labels: labelsEmbG,
            datasets: [
              {
                label: "Genero",
                data: displayValuesEmbG,
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
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                    min: 0,
                    max: 10,
                    callback: function (value) {
                      return value;
                    },
                  },
                },
              ],
            },
            tooltips: {
              callbacks: {
                label: function (tooltipItem, data) {
                  const index = tooltipItem.index;
                  const label = data.labels[index];
                  const realVal = realValuesEmbG[index];

                  if (realVal > 10) {
                    return `${label}: ${realVal} (más de 10)`;
                  } else {
                    return `${label}: ${realVal}`;
                  }
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
                formatter: function (value, context) {
                  // Si el valor real es mayor que 10, añade un indicador.
                  const index = context.dataIndex;
                  const realVal = realValuesEmbG[index];
                  return realVal > 10 ? "10+" : realVal;
                },
              },
            },
          },
          plugins: [ChartDataLabels],
        });

        //-----------------------PATOLOGIA------------------------------------------------

        function matchesEMBPT(item) {
          const fechaItem = new Date(item.fecha_creacion.split(" ")[0]);
          const fechaInicio = $("#fecha_inicio").val()
            ? new Date($("#fecha_inicio").val())
            : null;
          const fechaFin = $("#fecha_fin").val()
            ? new Date($("#fecha_fin").val())
            : null;

          return (
            (!$("#genero").val() || item.genero === $("#genero").val()) &&
            (!pnfValue || item.id_pnf == pnfValue) &&
            (!$("#patologia").val() ||
              item.id_patologia == $("#patologia").val()) &&
            (!$("#estado").val() || item.estado === $("#estado").val()) &&
            (!fechaInicio || fechaItem >= fechaInicio) &&
            (!fechaFin || fechaItem <= fechaFin)
          );
        }

        const datosFiltradosEMBPT = data.filter(matchesEMBPT);
        const patologiaSetEMBPT = new Set(
          datosFiltradosEMBPT.map((item) => item.id_patologia)
        );

        const labelsEmbPT =
          patologiaSetEMBPT.size > 0
            ? [...patologiaSetEMBPT].map((id) => {
                const item = data.find((d) => d.id_patologia === id);
                return item
                  ? item.nombre_patologia
                  : "Patología no especificada";
              })
            : ["Patología no especificada"];

        const dataValuesEmbPT = labelsEmbPT.map((label) => {
          return label === "Patología no especificada"
            ? 0
            : datosFiltradosEMBPT.filter((item) => {
                const patologia = data.find(
                  (d) => d.nombre_patologia === label
                );
                return patologia
                  ? item.id_patologia === patologia.id_patologia
                  : false;
              }).length;
        });

        // Array de valores para el gráfico: se truncan a 10 si exceden ese valor.
        const displayValuesEmbPT = dataValuesEmbPT.map((value) =>
          value > 10 ? 10 : value
        );

        // Array de valores reales para usarlos en tooltips.
        realValuesEmbPT = dataValuesEmbPT; // Se mantienen sin truncar.

        if (chartEmbPT) {
          chartEmbPT.destroy();
        }

        const ctxEmbPT = document.getElementById("chartEmbPT").getContext("2d");
        chartEmbPT = new Chart(ctxEmbPT, {
          type: "bar",
          data: {
            labels: labelsEmbPT,
            datasets: [
              {
                label: "Patologias",
                data: displayValuesEmbPT,
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
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                    min: 0,
                    max: 10,
                    callback: function (value) {
                      return value;
                    },
                  },
                },
              ],
            },
            tooltips: {
              callbacks: {
                label: function (tooltipItem, data) {
                  const index = tooltipItem.index;
                  const label = data.labels[index];
                  const realVal = realValuesEmbPT[index];

                  if (realVal > 10) {
                    return `${label}: ${realVal} (más de 10)`;
                  } else {
                    return `${label}: ${realVal}`;
                  }
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
                formatter: function (value, context) {
                  // Si el valor real es mayor que 10, añade un indicador.
                  const index = context.dataIndex;
                  const realVal = realValuesEmbPT[index];
                  return realVal > 10 ? "10+" : realVal;
                },
              },
            },
          },
          plugins: [ChartDataLabels],
        });

        //-----------------------Estado------------------------------------------------

        function matchesEMBEST(item) {
          const fechaItem = new Date(item.fecha_creacion.split(" ")[0]);
          const fechaInicio = $("#fecha_inicio").val()
            ? new Date($("#fecha_inicio").val())
            : null;
          const fechaFin = $("#fecha_fin").val()
            ? new Date($("#fecha_fin").val())
            : null;

          return (
            (!$("#genero").val() || item.genero === $("#genero").val()) &&
            (!pnfValue || item.id_pnf == pnfValue) &&
            (!$("#patologia").val() ||
              item.id_patologia == $("#patologia").val()) &&
            (!$("#estado").val() || item.estado === $("#estado").val()) &&
            (!fechaInicio || fechaItem >= fechaInicio) &&
            (!fechaFin || fechaItem <= fechaFin)
          );
        }

        const datosFiltradosEMBEST = data.filter(matchesEMBEST);
        const estadoSet = new Set(
          datosFiltradosEMBEST.map((item) => item.estado)
        );

        const labelsEmbE =
          estadoSet.size > 0 ? [...estadoSet] : ["Estado no especificado"];

        const dataValuesEmbE = labelsEmbE.map((label) => {
          return label === "Estado no especificado"
            ? 0
            : datosFiltradosEMBEST.filter((item) => item.estado === label)
                .length;
        });

        // Array de valores para el gráfico: se truncan a 10 si exceden ese valor.
        const displayValuesEmbE = dataValuesEmbE.map((value) =>
          value > 10 ? 10 : value
        );

        // Array de valores reales para usarlos en tooltips.
        realValuesEmbE = dataValuesEmbE; // Se mantienen sin truncar.

        if (chartEmbE) {
          chartEmbE.destroy();
        }

        const ctxEmbE = document.getElementById("chartEmbE").getContext("2d");
        chartEmbE = new Chart(ctxEmbE, {
          type: "bar",
          data: {
            labels: labelsEmbE,
            datasets: [
              {
                label: "Estado",
                data: displayValuesEmbE,
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
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                    min: 0,
                    max: 10,
                    callback: function (value) {
                      return value;
                    },
                  },
                },
              ],
            },
            tooltips: {
              callbacks: {
                label: function (tooltipItem, data) {
                  const index = tooltipItem.index;
                  const label = data.labels[index];
                  const realVal = realValuesEmbE[index];

                  if (realVal > 10) {
                    return `${label}: ${realVal} (más de 10)`;
                  } else {
                    return `${label}: ${realVal}`;
                  }
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
                formatter: function (value, context) {
                  // Si el valor real es mayor que 10, añade un indicador.
                  const index = context.dataIndex;
                  const realVal = realValuesEmbE[index];
                  return realVal > 10 ? "10+" : realVal;
                },
              },
            },
          },
          plugins: [ChartDataLabels],
        });
      },

      error: function (xhr, status, error) {
        let mensaje = "Ha ocurrido un error inesperado.";

        try {
          // Intenta parsear la respuesta sin depender de responseJSON
          const response = xhr.responseText
            ? JSON.parse(xhr.responseText)
            : null;
          if (response && response.message) {
            mensaje = response.message;
          }
        } catch (e) {
          console.error("Error al parsear respuesta:", e);
          // Si el mensaje no es JSON, podrías mostrar el texto plano
          if (xhr.responseText) {
            mensaje = xhr.responseText;
          }
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
});
