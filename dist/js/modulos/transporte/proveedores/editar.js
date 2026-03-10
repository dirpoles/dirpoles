function editarProveedor(id) {
    const modalElement = document.getElementById('modalGenerico');
    const modal = new bootstrap.Modal(modalElement);

    // Ajustamos el título del modal genérico
    document.getElementById('modalGenericoTitle').innerHTML = '<i class="fas fa-car me-2"></i> Editar Proveedor';

    // Limpiar contenido y poner un spinner de carga
    document.getElementById('modalContenido').innerHTML = `
        <div class="text-center py-5">
            <div class="spinner-border text-success" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-2">Obteniendo datos del proveedor...</p>
        </div>
    `;

    modal.show();

    // Petición para obtener los datos del proveedor
    $.ajax({
        url: 'proveedor_detalle',
        method: 'GET',
        data: { id_proveedor: id },
        dataType: 'json',
        success: function (data) {
            if (!data) {
                document.getElementById('modalContenido').innerHTML = '<div class="alert alert-danger m-3">No se pudieron cargar los datos del proveedor.</div>';
                return;
            }

            // Lógica para separar el teléfono (asumiendo formato 04121234567)
            const telCompleto = data.telefono || "";
            const prefijoData = telCompleto.substring(0, 4); // Toma los primeros 4 dígitos
            const numSoloData = telCompleto.substring(4);   // Toma el resto

            document.getElementById('modalContenido').innerHTML = `
                <form id="formEditarProveedor" novalidate>
                    <input type="hidden" name="id_proveedor" id="id_proveedor" value="${data.id_proveedor}">
                    
                    <div class="modal-body">
                        <div class="row">
                            <div id="tipoDocPR" class="col-md-3 mb-3">
                                <label for="tipo_documento" class="form-label font-weight-bold">Tipo</label>
                                <select name="tipo_documento" id="tipo_documento" class="form-control">
                                    <option value="V" ${data.tipo_documento === 'V' ? 'selected' : ''}>V - Venezolano</option>
                                    <option value="E" ${data.tipo_documento === 'E' ? 'selected' : ''}>E - Extranjero</option>
                                    <option value="J" ${data.tipo_documento === 'J' ? 'selected' : ''}>J - Jurídico</option>
                                    <option value="G" ${data.tipo_documento === 'G' ? 'selected' : ''}>G - Gubernamental</option>
                                </select>
                                <div id="tipo_documentoError" class="invalid-feedback"></div>
                            </div>

                            <div id="numDocPR" class="col-md-3 mb-3">
                                <label for="num_documento" class="form-label font-weight-bold">Documento</label>
                                <input type="text" name="num_documento" id="num_documento" class="form-control" 
                                    placeholder="Ej: 12345678" maxlength="20" value="${data.num_documento || ''}">
                                <div id="num_documentoError" class="invalid-feedback"></div>
                            </div>

                            <div id="nombrePR" class="col-md-6 mb-3">
                                <label for="nombre" class="form-label font-weight-bold">Nombre o Razón Social</label>
                                <input type="text" name="nombre" id="nombre" class="form-control" 
                                    placeholder="Ej: Inversiones XYZ C.A." maxlength="100" value="${data.nombre || ''}">
                                <div id="nombreError" class="invalid-feedback"></div>
                            </div>
                        </div>

                        <div class="row mt-2">
                            <div id="prefijoPR" class="col-md-3 mb-3">
                                <label for="prefijo" class="form-label font-weight-bold">Prefijo</label>
                                <select name="prefijo" id="prefijo" class="form-control">
                                    <option value="0412" ${prefijoData === '0412' ? 'selected' : ''}>0412</option>
                                    <option value="0424" ${prefijoData === '0424' ? 'selected' : ''}>0424</option>
                                    <option value="0416" ${prefijoData === '0416' ? 'selected' : ''}>0416</option>
                                    <option value="0426" ${prefijoData === '0426' ? 'selected' : ''}>0426</option>
                                    <option value="0414" ${prefijoData === '0414' ? 'selected' : ''}>0414</option>
                                    <option value="0251" ${prefijoData === '0251' ? 'selected' : ''}>0251</option>
                                    <option value="0422" ${prefijoData === '0422' ? 'selected' : ''}>0422</option>
                                </select>
                            </div>

                            <div id="telefonoPR" class="col-md-3 mb-3">
                                <label for="numero_telefono" class="form-label font-weight-bold">Teléfono</label>
                                <input type="tel" name="numero_telefono" id="numero_telefono" class="form-control" 
                                    placeholder="7 dígitos" maxlength="7" value="${numSoloData || ''}">
                                <div id="numero_telefonoError" class="invalid-feedback"></div>
                            </div>
                            
                            <input type="hidden" name="telefono" id="telefono" value="${telCompleto}">

                            <div id="correoPR" class="col-md-6 mb-3">
                                <label for="correo" class="form-label font-weight-bold">Correo Electrónico</label>
                                <input type="email" name="correo" id="correo" class="form-control" 
                                    placeholder="proveedor@empresa.com" value="${data.correo || ''}">
                                <div id="correoError" class="invalid-feedback"></div>
                            </div>
                        </div>

                        <div class="row mt-2">
                            <div id="direccionPR" class="col-md-8 mb-3">
                                <label for="direccion" class="form-label font-weight-bold">Dirección Fiscal / Comercial</label>
                                <textarea name="direccion" id="direccion" class="form-control" rows="2" 
                                        placeholder="Av. Principal, Edificio XYZ..." maxlength="100">${data.direccion || ''}</textarea>
                                <div id="direccionError" class="invalid-feedback"></div>
                            </div>

                            <div id="estatusPR" class="col-md-4 mb-3">
                                <label for="estatus" class="form-label font-weight-bold">Estatus</label>
                                <select name="estatus" id="estatus" class="form-control">
                                    <option value="Activo" ${data.estatus === 'Activo' ? 'selected' : ''}>Activo</option>
                                    <option value="Inactivo" ${data.estatus === 'Inactivo' ? 'selected' : ''}>Inactivo</option>
                                </select>
                                <div id="estatusError" class="invalid-feedback"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-footer border-top-0 d-flex justify-content-end">
                        <button type="button" class="btn btn-secondary shadow-sm" data-bs-dismiss="modal">
                            <i class="fas fa-times me-1"></i> Cerrar
                        </button>
                        <button type="submit" class="btn btn-success shadow-sm">
                            <i class="fas fa-save me-1"></i> Guardar Cambios
                        </button>
                    </div>
                </form>
            `;

            // Re-vincular validaciones
            if (typeof inicializarValidacionesEditarProveedor === 'function') {
                inicializarValidacionesEditarProveedor();
            }
        },
        error: function () {
            document.getElementById('modalContenido').innerHTML = '<div class="alert alert-danger m-3">Error al conectar con el servidor.</div>';
        }
    });
}