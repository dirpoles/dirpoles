<?php 
$titulo = "Login";
include "app/views/template/head.php"; ?>
<body class="bg-light">

<div class="login-page">
    <div class="container-fluid vh-100">
        <div class="row h-100 g-0">

        <!-- PANEL IZQUIERDO (30%) -->
        <div class="col-12 col-md-4 login-left d-flex align-items-center justify-content-center">
            <div class="login-card w-100 px-4 px-md-5 py-4">

            <!-- Logo opcional arriba centrado -->
            <div class="text-center mb-3">
                <img src="<?= BASE_URL ?>dist/img/dirpoles.ico" alt="DIRPOLES" class="login-logo mb-2" />
                <h3 class="fw-bold text-dirpoles mb-1">DIRPOLES 4</h3>
                <p class="text-muted small mb-3">Sistema de Gestión Administrativa</p>
            </div>

            <form action="<?= BASE_URL ?>iniciar_sesion" method="POST" id="formulario-login" novalidate>
                <!-- Campo Usuario -->
                <div class="mb-3">
                <label class="form-label fw-semibold">Correo electrónico</label>
                <div class="input-group shadow-sm">
                    <span class="input-group-text input-icon">
                    <i class="fa-solid fa-circle-user"></i>
                    </span>
                    <input type="text" name="correo" id="correo" autocomplete="email" class="form-control form-control-lg"
                    placeholder="Correo Electrónico">
                </div>
                    <small id="correoError" class="text-danger mt-1 d-block"></small>
                </div>

                <!-- Campo Contraseña -->
                <div class="mb-3">
                <label for="password" class="form-label fw-semibold">Contraseña</label>
                <div class="input-group shadow-sm">
                    <span class="input-group-text input-icon">
                    <i class="fa-solid fa-lock"></i>
                    </span>
                    <input type="password" name="password" id="password" class="form-control form-control-lg"
                    placeholder="Contraseña" maxlength="8" autocomplete="current-password">
                </div>
                    <small id="passwordError" class="text-danger mt-1 d-block"></small>
                </div>

                <button type="submit" class="btn btn-dirpoles btn-lg w-100 mt-3 fw-semibold">
                Iniciar sesión
                </button>
            </form>

            <p class="mt-4 text-center small text-muted mb-0">
                Dirección de Políticas Estudiantiles - UPTAEB
            </p>
            </div>
        </div>

        <!-- PANEL DERECHO (70%) -->
        <div class="col-12 col-md-8 login-right d-none d-md-block">
            <div class="bg-image"></div>
        </div>

        </div>
    </div>
</div>

<?php include 'template/script.php'; ?>
<link rel="stylesheet" href="<?= BASE_URL ?>dist/css/etc/login.css">
<script src="<?= BASE_URL ?>dist/js/login/login.js"></script>

    <?php if (!empty($_SESSION['mensaje_redireccion'])):
        // Decodificar y limpiar para evitar que se muestre de nuevo
        $msg = json_decode($_SESSION['mensaje_redireccion'], true);
        unset($_SESSION['mensaje_redireccion']);
        // Asegurarnos de escapar bien la cadena JSON
        $jsMsg = json_encode($msg, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT);
    ?>
    <script>
        // objeto global, usado por login.js
        window.REDIRECT_MESSAGE = <?= $jsMsg ?>;
    </script>
    <?php endif; ?>

</body>
</html>


