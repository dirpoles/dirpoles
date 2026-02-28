<!-- Modal Global para reutilizar -->
<div class="modal fade" id="modalGlobal" tabindex="-1" aria-labelledby="modalGlobalLabel" aria-hidden="true" data-bs-backdrop="static">
    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content border-0 shadow-lg">
            <!-- Header dinámico -->
            <div class="modal-header bg-gradient-primary text-white py-3">
                <div class="d-flex align-items-center">
                    <div class="modal-icon bg-white rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                        <i class="fas fa-person text-primary"></i>
                    </div>
                    <div>
                        <h5 class="modal-title mb-0 fw-bold" id="modalGlobalTitle">Título</h5>
                        <small class="opacity-75" id="modalGlobalSubtitle"></small>
                    </div>
                </div>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>

            <!-- Body dinámico -->
            <div class="modal-body p-0">
                <!-- Contenido se cargará aquí via JavaScript -->
            </div>
        </div>
    </div>
</div>