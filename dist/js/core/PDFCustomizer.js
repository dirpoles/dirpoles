class PDFCustomizer {
    static getConfig(title = 'LISTADO DE REGISTROS', entityName = 'registros') {
        return function (doc) {
            const now = new Date();
            const fecha = now.toLocaleDateString('es-ES');
            const hora = now.toLocaleTimeString('es-ES');

            // Margenes (izquierda, arriba, derecha, abajo)
            doc.pageMargins = [40, 60, 40, 60];

            // Fecha y hora de generación
            doc.content.splice(1, 0, {
                text: 'Generado: ' + fecha + ' - ' + hora,
                alignment: 'right',
                margin: [0, 0, 0, 10],
                fontSize: 8,
                color: '#666666'
            });

            // Encabezado
            doc['header'] = function (currentPage, pageCount, pageSize) {
                return {
                    columns: [
                        {
                            text: 'SISTEMA DIRPOLES 4',
                            alignment: 'left',
                            fontSize: 10,
                            bold: true,
                            color: '#2E4053',
                            margin: [40, 30]
                        },
                        {
                            text: 'Página ' + currentPage + ' de ' + pageCount,
                            alignment: 'right',
                            fontSize: 10,
                            margin: [0, 30, 40, 0]
                        }
                    ]
                };
            };

            // Pie de página
            doc['footer'] = function (currentPage, pageCount, pageSize) {
                return {
                    columns: [
                        {
                            text: '© ' + new Date().getFullYear() + ' - Universidad Politécnica Territorial "Andrés Eloy Blanco"',
                            alignment: 'left',
                            fontSize: 8,
                            color: '#666666',
                            margin: [40, 10]
                        },
                        {
                            text: 'Confidencial - Uso Interno',
                            alignment: 'right',
                            fontSize: 8,
                            italic: true,
                            color: '#666666',
                            margin: [0, 10, 40, 0]
                        }
                    ]
                };
            };

            // Título principal
            if (doc.content[0]) {
                doc.content[0].text = title.toUpperCase();
                doc.content[0].alignment = 'center';
                doc.content[0].fontSize = 16;
                doc.content[0].bold = true;
                doc.content[0].margin = [0, 0, 0, 15];
            }

            // Estilo de la tabla
            if (doc.content[2] && doc.content[2].table) {
                // Encabezado de tabla
                doc.content[2].table.headerRows = 1;
                doc.content[2].table.widths = Array(doc.content[2].table.body[0].length).fill('auto');

                // Estilo celdas encabezado
                doc.content[2].table.body[0].forEach(function (cell) {
                    cell.fillColor = '#2E4053'; // Color fondo
                    cell.color = '#FFFFFF'; // Color texto
                    cell.bold = true;
                    cell.alignment = 'center';
                });

                // Filas alternas
                for (let i = 1; i < doc.content[2].table.body.length; i++) {
                    if (i % 2 === 0) {
                        doc.content[2].table.body[i].forEach(function (cell) {
                            cell.fillColor = '#F8F9F9';
                        });
                    }
                }

                // Información adicional
                doc.content.push({
                    text: `\n\nTotal de ${entityName}: ${doc.content[2].table.body.length - 1}`,
                    alignment: 'right',
                    fontSize: 10,
                    bold: true,
                    margin: [0, 20, 0, 0]
                });
            }

            return doc;
        };
    }

    static forBeneficiarios() {
        return this.getConfig('LISTADO DE BENEFICIARIOS REGISTRADOS', 'beneficiarios');
    }

    static forEmpleados() {
        return this.getConfig('LISTADO DE EMPLEADOS REGISTRADOS', 'empleados');
    }

    static forCitas() {
        return this.getConfig('LISTADO DE CITAS REGISTRADAS', 'citas');
    }

    static forHorarios() {
        return this.getConfig('LISTADO DE HORARIOS REGISTRADOS', 'horarios');
    }

    static forBitacora() {
        return this.getConfig('LISTADO DE MOVIMIENTOS DE LA BITÁCORA', 'bitacora');
    }

    static forDiagnosticos() {
        return this.getConfig('LISTADO DE MOVIMIENTOS DE LOS DIAGNOSTICOS', 'diagnosticos');
    }

    static forInventarioMedico() {
        return this.getConfig('LISTADO DE MOVIMIENTOS DEL INVENTARIO MÉDICO', 'inventario');
    }

    static forReferencias() {
        return this.getConfig('LISTADO DE MOVIMIENTOS DE LAS REFERENCIAS', 'referencias');
    }

    static forJornadas() {
        return this.getConfig('LISTADO DE MOVIMIENTOS DE LAS JORNADAS', 'jornadas');
    }

    static forInventarioMob() {
        return this.getConfig('LISTADO DE MOVIMIENTOS DEL INVENTARIO DE MOBILIARIO', 'mobiliario');
    }
    // Agrega más métodos estáticos para otros módulos
}