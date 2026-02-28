<!-- Modal para seleccionar beneficiario -->
<div class="modal fade" id="modalSeleccionarBeneficiario" tabindex="-1" aria-labelledby="modalSeleccionarBeneficiarioLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalSeleccionarBeneficiarioLabel">Seleccionar Beneficiario</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="table-responsive">
                    <table id="tablaBeneficiariosModal" class="table table-striped table-bordered" style="width:100%">
                        <thead>
                            <tr>
                                <th>Cédula</th>
                                <th>Nombre Completo</th>
                                <th>PNF</th>
                                <th>Sección</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Los datos se cargarán por AJAX -->
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            </div>
        </div>
    </div>
</div>