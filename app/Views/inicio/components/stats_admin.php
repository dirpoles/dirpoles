<!-- Primera Fila: Estadísticas Globales -->
<div class="col-xl-3 col-md-6 mb-4">
    <div class="card border-left-primary shadow h-100 py-2">
        <div class="card-body">
            <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                    <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">Empleados</div>
                    <div class="h5 mb-0 font-weight-bold text-gray-800"><?= $total_empleados ?? 0; ?></div>
                </div>
                <div class="col-auto"><i class="fas fa-users fa-2x text-primary"></i></div>
            </div>
        </div>
    </div>
</div>

<div class="col-xl-3 col-md-6 mb-4">
    <div class="card border-left-success shadow h-100 py-2">
        <div class="card-body">
            <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                    <div class="text-xs font-weight-bold text-success text-uppercase mb-1">Beneficiarios</div>
                    <div class="h5 mb-0 font-weight-bold text-gray-800"><?= $total_beneficiarios ?? 0; ?></div>
                </div>
                <div class="col-auto"><i class="fas fa-person fa-2x text-success"></i></div>
            </div>
        </div>
    </div>
</div>

<div class="col-xl-3 col-md-6 mb-4">
    <div class="card border-left-info shadow h-100 py-2">
        <div class="card-body">
            <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                    <div class="text-xs font-weight-bold text-info text-uppercase mb-1">Citas Hoy</div>
                    <div class="h5 mb-0 font-weight-bold text-gray-800"><?= $citas_hoy ?? 0; ?></div>
                </div>
                <div class="col-auto"><i class="fas fa-calendar-day fa-2x text-info"></i></div>
            </div>
        </div>
    </div>
</div>

<div class="col-xl-3 col-md-6 mb-4">
    <div class="card border-left-warning shadow h-100 py-2">
        <div class="card-body">
            <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                    <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">Notificaciones</div>
                    <div class="h5 mb-0 font-weight-bold text-gray-800"><?= $notificaciones ?? 0; ?></div>
                </div>
                <div class="col-auto"><i class="fas fa-bell fa-2x text-warning"></i></div>
            </div>
        </div>
    </div>
</div>

<!-- Separador para indicar secciones de módulos (Opcional, pero ayuda visualmente) -->
<div class="col-12 mb-2">
    <h6 class="font-weight-bold text-secondary text-uppercase small">Resumen por Módulos</h6>
</div>

<!-- Segunda Fila: Resumen de Módulos (Mini-cards o cards simplificadas) -->
<div class="col-xl-2 col-md-4 mb-4">
    <div class="card border-bottom-primary shadow h-100 py-2">
        <div class="card-body">
            <div class="text-center">
                <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">Psicología</div>
                <div class="h6 mb-0 font-weight-bold text-gray-800" id="stat-total-conteo"></div>
            </div>
        </div>
    </div>
</div>

<div class="col-xl-2 col-md-4 mb-4">
    <div class="card border-bottom-success shadow h-100 py-2">
        <div class="card-body">
            <div class="text-center">
                <div class="text-xs font-weight-bold text-success text-uppercase mb-1">Medicina</div>
                <div class="h6 mb-0 font-weight-bold text-gray-800" id="stat-medicina-total"><?= $total_consultas_med ?? 0; ?> Cons.</div>
            </div>
        </div>
    </div>
</div>

<div class="col-xl-2 col-md-4 mb-4">
    <div class="card border-bottom-info shadow h-100 py-2">
        <div class="card-body">
            <div class="text-center">
                <div class="text-xs font-weight-bold text-info text-uppercase mb-1">Orientación</div>
                <div class="h6 mb-0 font-weight-bold text-gray-800" id="stat-orientacion-total"></div>
            </div>
        </div>
    </div>
</div>

<div class="col-xl-2 col-md-4 mb-4">
    <div class="card border-bottom-warning shadow h-100 py-2">
        <div class="card-body">
            <div class="text-center">
                <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">T. Social</div>
                <div class="h6 mb-0 font-weight-bold text-gray-800" id="stat-trabajo-social-total"></div>
            </div>
        </div>
    </div>
</div>

<div class="col-xl-2 col-md-4 mb-4">
    <div class="card border-bottom-danger shadow h-100 py-2">
        <div class="card-body">
            <div class="text-center">
                <div class="text-xs font-weight-bold text-danger text-uppercase mb-1">Discapacidad</div>
                <div class="h6 mb-0 font-weight-bold text-gray-800" id="stat-discapacidad-total"></div>
            </div>
        </div>
    </div>
</div>

<div class="col-xl-2 col-md-4 mb-4">
    <div class="card border-bottom-secondary shadow h-100 py-2">
        <div class="card-body">
            <div class="text-center">
                <div class="text-xs font-weight-bold text-secondary text-uppercase mb-1">Referidos</div>
                <div class="h6 mb-0 font-weight-bold text-gray-800"><?= $total_referidos ?? 0; ?> Pac.</div>
            </div>
        </div>
    </div>
</div>
