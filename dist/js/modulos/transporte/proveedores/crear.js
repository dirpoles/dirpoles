function abrirModalCrearProveedor() {
    const modal = document.getElementById('modalGenerico');

    // 1. Ajustamos el título del modal genérico
    document.getElementById('modalGenericoTitle').innerHTML = '<i class="fas fa-truck me-2"></i> Registrar Nuevo Proveedor';

    // 2. Inyectamos el contenido dinámico
    document.getElementById('modalContenido').innerHTML = `
        <form id="formCrearProveedor" novalidate>
            <div class="modal-body">
                <div class="row">
                    <div id="tipoDocPR" class="col-md-3 mb-3">
                        <label for="tipo_documento" class="form-label font-weight-bold">Tipo</label>
                        <select name="tipo_documento" id="tipo_documento" class="form-control">
                            <option value="" disabled selected>Seleccione</option>
                            <option value="V">V - Venezolano</option>
                            <option value="E">E - Extranjero</option>
                            <option value="J">J - Jurídico</option>
                            <option value="G">G - Gubernamental</option>
                        </select>
                        <div id="tipo_documentoError" class="invalid-feedback"></div>
                    </div>

                    <div id="numDocPR" class="col-md-3 mb-3">
                        <label for="num_documento" class="form-label font-weight-bold">Documento</label>
                        <input type="text" name="num_documento" id="num_documento" class="form-control" 
                               placeholder="Ej: 12345678" maxlength="20">
                        <div id="num_documentoError" class="invalid-feedback"></div>
                    </div>

                    <div id="nombrePR" class="col-md-6 mb-3">
                        <label for="nombre" class="form-label font-weight-bold">Nombre o Razón Social</label>
                        <input type="text" name="nombre" id="nombre" class="form-control" 
                               placeholder="Ej: Inversiones XYZ C.A." maxlength="100">
                        <div id="nombreError" class="invalid-feedback"></div>
                    </div>
                </div>

                <div class="row mt-2">
                    <div id="prefijoPR" class="col-md-3 mb-3">
                        <label for="prefijo" class="form-label font-weight-bold">Prefijo</label>
                        <select name="prefijo" id="prefijo" class="form-control">
                            <option value="" selected disabled>Cod.</option>
                            <option value="0412">0412</option>
                            <option value="0424">0424</option>
                            <option value="0416">0416</option>
                            <option value="0426">0426</option>
                            <option value="0414">0414</option>
                            <option value="0251">0251</option>
                            <option value="0422">0422</option>
                        </select>
                    </div>

                    <div id="telefonoPR" class="col-md-3 mb-3">
                        <label for="numero_telefono" class="form-label font-weight-bold">Teléfono</label>
                        <input type="tel" name="numero_telefono" id="numero_telefono" class="form-control" 
                               placeholder="7 dígitos" maxlength="7">
                        <div id="numero_telefonoError" class="invalid-feedback"></div>
                    </div>
                    
                    <input type="hidden" name="telefono" id="telefono">

                    <div id="correoPR" class="col-md-6 mb-3">
                        <label for="correo" class="form-label font-weight-bold">Correo Electrónico</label>
                        <input type="email" name="correo" id="correo" class="form-control" 
                               placeholder="proveedor@empresa.com">
                        <div id="correoError" class="invalid-feedback"></div>
                    </div>
                </div>

                <div class="row mt-2">
                    <div id="direccionPR" class="col-md-12 mb-3">
                        <label for="direccion" class="form-label font-weight-bold">Dirección Fiscal / Comercial</label>
                        <textarea name="direccion" id="direccion" class="form-control" rows="2" 
                                  placeholder="Av. Principal, Edificio XYZ, Piso 5" maxlength="100"></textarea>
                        <div id="direccionError" class="invalid-feedback"></div>
                    </div>
                </div>
            </div>
            
            <div class="modal-footer border-top-0 d-flex justify-content-end">
                <button type="button" class="btn btn-secondary shadow-sm" data-bs-dismiss="modal">
                    <i class="fas fa-times me-1"></i> Cerrar
                </button>
                <button type="submit" class="btn btn-success shadow-sm">
                    <i class="fas fa-save me-1"></i> Registrar Proveedor
                </button>
            </div>
        </form>
    `;

    // 3. Cargar las validaciones usando el TransporteLoader
    TransporteLoader.cargar('proveedores', 'validar_crear', function () {
        if (typeof inicializarValidacionesProveedor === 'function') {
            inicializarValidacionesProveedor();
        }

        // 4. Mostramos el modal
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
    });
}