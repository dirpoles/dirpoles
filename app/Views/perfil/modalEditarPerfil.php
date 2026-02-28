<!-- Modal para Editar Perfil -->
<div class="modal fade" id="modalEditarPerfil" tabindex="-1" aria-labelledby="modalEditarPerfilLabel" data-bs-backdrop="static">
    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content border-0 shadow-lg">
            <!-- Header -->
            <div class="modal-header bg-gradient-primary text-white py-3">
                <div class="d-flex align-items-center">
                    <div class="modal-icon bg-white rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                        <i class="fas fa-user-edit text-primary"></i>
                    </div>
                    <div>
                        <h5 class="modal-title mb-0 fw-bold">Editar Perfil</h5>
                        <small class="opacity-75">Actualiza tu información personal</small>
                    </div>
                </div>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>

            <!-- Body -->
            <div class="modal-body p-4">
                <form id="formEditarPerfil" method="POST" action="perfil_actualizar" class="needs-validation" novalidate>
                    <input type="hidden" name="id_empleado" id="edit_id_empleado">
                    
                    <div class="row g-3">
                        <!-- Nombre -->
                        <div class="col-md-6">
                            <div class="form-floating">
                                <input type="text" class="form-control" id="edit_nombre" name="nombre" placeholder="Nombre" required>
                                <label for="edit_nombre">Nombre</label>
                                <div class="invalid-feedback" id="edit_nombreError"></div>
                            </div>
                        </div>

                        <!-- Apellido -->
                        <div class="col-md-6">
                            <div class="form-floating">
                                <input type="text" class="form-control" id="edit_apellido" name="apellido" placeholder="Apellido" required>
                                <label for="edit_apellido">Apellido</label>
                                <div class="invalid-feedback" id="edit_apellidoError"></div>
                            </div>
                        </div>

                        <!-- Tipo Cédula (Read-only) -->
                        <div class="col-md-3">
                            <div class="form-floating">
                                <select class="form-select" id="edit_tipo_cedula" name="tipo_cedula" disabled>
                                    <option value="V">V</option>
                                    <option value="E">E</option>
                                </select>
                                <label for="edit_tipo_cedula">Tipo</label>
                            </div>
                        </div>

                        <!-- Cédula (Read-only) -->
                        <div class="col-md-9">
                            <div class="form-floating">
                                <input type="text" class="form-control" id="edit_cedula" name="cedula" placeholder="Cédula" disabled>
                                <label for="edit_cedula">Cédula</label>
                                <small class="text-muted">La cédula no puede ser modificada</small>
                            </div>
                        </div>

                        <!-- Correo -->
                        <div class="col-md-6">
                            <div class="form-floating">
                                <input type="email" class="form-control" id="edit_correo" name="correo" placeholder="Correo" required>
                                <label for="edit_correo">Correo Electrónico</label>
                                <div class="invalid-feedback" id="edit_correoError"></div>
                            </div>
                        </div>

                        <!-- Teléfono -->
                        <div class="col-md-6">
                            <label class="form-label">Teléfono</label>
                            <div class="input-group">
                                <select class="form-select" id="edit_telefono_prefijo" name="telefono_prefijo" style="max-width: 100px;" autocomplete="tel-country-code" required>
                                    <option value="">Prefijo</option>
                                    <option value="0412">0412</option>
                                    <option value="0414">0414</option>
                                    <option value="0416">0416</option>
                                    <option value="0424">0424</option>
                                    <option value="0426">0426</option>
                                    <option value="0422">0422</option>
                                </select>
                                <input type="text" class="form-control" id="edit_telefono_numero" placeholder="1234567" maxlength="7" autocomplete="tel-local" required>
                                <input type="hidden" id="edit_telefono" name="telefono">
                            </div>
                            <div class="invalid-feedback d-block" id="edit_telefonoError"></div>
                            <div class="invalid-feedback d-block" id="edit_telefono_numeroError"></div>
                        </div>

                        <!-- Dirección -->
                        <div class="col-md-12">
                            <div class="form-floating">
                                <textarea class="form-control" id="edit_direccion" name="direccion" placeholder="Dirección" style="height: 80px;" required></textarea>
                                <label for="edit_direccion">Dirección</label>
                                <div class="invalid-feedback" id="edit_direccionError"></div>
                            </div>
                        </div>

                        <!-- Seguridad -->
                        <div class="col-12">
                            <hr class="my-3">
                            <h6 class="text-muted mb-3">
                                <i class="fas fa-shield-alt me-2"></i>Seguridad
                            </h6>
                        </div>

                        <!-- Contraseña Actual (Requerida) -->
                        <div class="col-md-6">
                            <div class="form-floating">
                                <input type="password" class="form-control" id="edit_clave_actual" name="clave_actual" placeholder="Contraseña Actual" autocomplete="current-password" required>
                                <label for="edit_clave_actual">Contraseña Actual *</label>
                                <div class="invalid-feedback" id="edit_clave_actualError"></div>
                            </div>
                            <small class="text-muted">Requerida para guardar cambios</small>
                        </div>

                        <!-- Nueva Contraseña (Opcional) -->
                        <div class="col-md-6">
                            <div class="form-floating">
                                <input type="password" class="form-control" id="edit_clave" name="clave" placeholder="Nueva Contraseña (opcional)" autocomplete="new-password">
                                <label for="edit_clave">Nueva Contraseña (opcional)</label>
                                <div class="invalid-feedback" id="edit_claveError"></div>
                            </div>
                            <small class="text-muted">Dejar en blanco para mantener la actual</small>
                        </div>

                        <!-- Botones -->
                        <div class="col-12">
                            <div class="d-flex justify-content-end gap-2 mt-3">
                                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancelar</button>
                                <button type="submit" class="btn btn-primary">
                                    <i class="fas fa-save me-2"></i>Guardar Cambios
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
