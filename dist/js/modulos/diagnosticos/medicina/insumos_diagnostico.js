
document.addEventListener('DOMContentLoaded', function () {

    const tablaInsumosBody = document.getElementById('lista_insumos');
    const btnAgregarInsumo = document.getElementById('btnAgregarInsumo');

    // Insumos disponibles (inyectados desde PHP en la vista)
    const insumosDisponibles = window.inventarioInsumos || [];

    if (!btnAgregarInsumo || !tablaInsumosBody) return;

    // Función para crear opciones del select
    const generarOpcionesInsumos = () => {
        let opciones = '<option value="" selected disabled>Seleccione...</option>';
        insumosDisponibles.forEach(insumo => {
            let textoExtra = insumo.estatus === 'Vencido' ? ' (VENCIDO)' : '';
            opciones += `<option value="${insumo.id_insumo}" data-max="${insumo.cantidad}">
                            ${insumo.nombre_insumo} (Disp: ${insumo.cantidad})${textoExtra}
                         </option>`;
        });
        return opciones;
    };

    // Función para agregar fila
    window.agregarInsumoRow = function () {
        const rowId = Date.now();
        const row = document.createElement('tr');
        row.id = `row-${rowId}`;

        row.innerHTML = `
            <td>
                <select name="insumos[id][]" class="form-select select2-insumo" required style="width: 100%;">
                    ${generarOpcionesInsumos()}
                </select>
                <div class="invalid-feedback">Seleccione un insumo</div>
            </td>
            <td>
                <input type="number" name="insumos[cantidad][]" class="form-control input-cantidad" min="1" required disabled>
                <div class="invalid-feedback">Cantidad inválida</div>
            </td>
            <td class="text-center">
                <button type="button" class="btn btn-danger btn-sm" onclick="eliminarInsumoRow('${rowId}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;

        tablaInsumosBody.appendChild(row);

        // Inicializar Select2 en el nuevo select
        $(`#row-${rowId} .select2-insumo`).select2({
            theme: 'bootstrap-5',
            width: '100%'
        });

        // Validar cantidad máxima al cambiar selección
        $(`#row-${rowId} .select2-insumo`).on('change', function () {
            const selectedOption = $(this).find(':selected');
            const max = selectedOption.data('max');
            const inputCantidad = row.querySelector('.input-cantidad');

            if (inputCantidad) {
                if (max) {
                    inputCantidad.removeAttribute('disabled');
                    inputCantidad.max = max;
                    inputCantidad.placeholder = `Máx: ${max}`;
                    if (parseInt(inputCantidad.value) > max) {
                        inputCantidad.value = max;
                    }
                } else {
                    inputCantidad.setAttribute('disabled', true);
                    inputCantidad.value = '';
                    inputCantidad.placeholder = '';
                }
            }
        });

        // Validar input cantidad
        const inputCant = row.querySelector('.input-cantidad');
        inputCant.addEventListener('input', function () {
            const max = parseInt(this.max);
            const val = parseInt(this.value);
            if (val > max) {
                this.value = max;
                Swal.fire('Atención', `La cantidad disponible es ${max}`, 'warning');
            }
        });
    };

    // Función para eliminar fila
    window.eliminarInsumoRow = function (rowId) {
        const row = document.getElementById(`row-${rowId}`);
        if (row) row.remove();
    };

    // Event listener del botón
    btnAgregarInsumo.addEventListener('click', agregarInsumoRow);

});
