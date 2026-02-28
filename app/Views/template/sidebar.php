<?php
// app/Views/template/sidebar.php

// Cargar configuración
$modulosConfig = require BASE_PATH . '/app/Config/modulos_sidebar.php';
$modulosPermitidos ??= ($_SESSION['modulosPermitidos'] ?? []);
?>

<ul class="navbar-nav bg-sidebar-custom sidebar sidebar-light accordion" id="accordionSidebar">
    <!-- Brand -->
    <a class="sidebar-brand sidebar-brand-custom d-flex align-items-center justify-content-center" href="<?= BASE_URL ?>inicio">
        <!-- Icono opcional, si desean mantenerlo o solo texto -->
        <!-- <div class="sidebar-brand-icon rotate-n-15">
            <i class="fas fa-laugh-wink"></i>
        </div> -->
        <div class="sidebar-brand-text mx-3">DIRPOLES 4</div>
    </a>

    <hr class="sidebar-divider my-0">

    <!-- Inicio - Siempre visible -->
    <li class="nav-item active">
        <a class="nav-link" href="<?= BASE_URL ?>inicio">
            <i class="fa-solid fa-house"></i>
            <span>Inicio</span>
        </a>
    </li>


    <!-- Módulos dinámicos -->
    <?php 
    if (!empty($modulosConfig)): 
        foreach ($modulosConfig as $key => $config): 
            // Filtrar subitems permitidos
            $visibleSubitems = [];
            if (isset($config['subitems']) && is_array($config['subitems'])) {
                foreach ($config['subitems'] as $subitem) {
                    // Determinar ID del módulo: si el subitem tiene 'id_modulo', usarlo.
                    // Si no, y la clave principal es numérica (es el ID), usar esa.
                    $targetModuleId = $subitem['id_modulo'] ?? (is_int($key) ? $key : null);

                    if ($targetModuleId && isset($modulosPermitidos[$targetModuleId])) {
                        $visibleSubitems[] = $subitem;
                    }
                }
            }

            // Si no hay subitems visibles, saltar este grupo
            if (empty($visibleSubitems)) continue;

            $collapseId = 'collapse' . ucfirst($config['key']);
    ?>
        <li class="nav-item">
            <a class="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#<?= $collapseId ?>">
                <i class="fa-solid <?= $config['icon'] ?>"></i>
                <span><?= htmlspecialchars($config['titulo']) ?></span>
            </a>
            <div id="<?= $collapseId ?>" class="collapse">
                <div class="bg-white py-2 collapse-inner rounded">
                    <?php foreach ($visibleSubitems as $subitem): ?>
                        <a class="collapse-item" href="<?= BASE_URL . $subitem['url'] ?>">
                            <?= htmlspecialchars($subitem['texto']) ?>
                        </a>
                    <?php endforeach; ?>
                </div>
            </div>
        </li>

    <?php 
        endforeach; 
    endif; 
    ?>

    <!-- Divider -->
    <hr class="sidebar-divider">

    <!-- Cerrar sesión -->
    <li class="nav-item">
        <a class="nav-link js-logout" href="<?= BASE_URL ?>logout" data-logout>
            <i class="fa-solid fa-arrow-right-from-bracket"></i>
            <span>Cerrar Sesión</span>
        </a>
    </li>
</ul>