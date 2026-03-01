<?php
return [
    // ID_MODULO => [configuración del sidebar]
    1 => [
        'key' => 'empleados',
        'icon' => 'fa-user-plus',
        'titulo' => 'Gestionar Empleados',
        'subitems' => [
            ['url' => 'crear_empleado', 'texto' => 'Crear', 'permiso' => 2], // Crear
            ['url' => 'consultar_empleados', 'texto' => 'Consultar', 'permiso' => 2] // Leer
        ]
    ],
    2 => [
        'key' => 'beneficiarios',
        'icon' => 'fa-person-circle-plus',
        'titulo' => 'Gestionar Beneficiarios',
        'subitems' => [
            ['url' => 'crear_beneficiario', 'texto' => 'Crear', 'permiso' => 2],
            ['url' => 'consultar_beneficiarios', 'texto' => 'Consultar', 'permiso' => 2]
        ]
    ],
    3 => [
        'key' => 'citas',
        'icon' => 'fa-calendar-check',
        'titulo' => 'Gestionar Citas',
        'subitems' => [
            ['url' => 'crear_cita', 'texto' => 'Crear', 'permiso' => 2],
            ['url' => 'consultar_citas', 'texto' => 'Consultar', 'permiso' => 2]
        ]
    ],
    'group_diagnosticos' => [
        'key' => 'diagnosticos',
        'icon' => 'fa-file-medical',
        'titulo' => 'Gestionar Diagnósticos',
        'subitems' => [
            ['id_modulo' => 4, 'url' => 'diagnostico_psicologia', 'texto' => 'Psicología', 'permiso' => 2],
            ['id_modulo' => 5, 'url' => 'diagnostico_medicina', 'texto' => 'Medicina', 'permiso' => 2],
            ['id_modulo' => 6, 'url' => 'diagnostico_orientacion', 'texto' => 'Orientación', 'permiso' => 2],
            ['id_modulo' => 7, 'url' => 'diagnostico_trabajo_social', 'texto' => 'Trabajo Social', 'permiso' => 2],
            ['id_modulo' => 8, 'url' => 'diagnostico_discapacidad', 'texto' => 'Discapacidad', 'permiso' => 2],
        ]
    ],
    9 => [
        'key' => 'inventario_medico',
        'icon' => 'fas fa-boxes',
        'titulo' => 'Gestionar Inventario Médico',
        'subitems' => [
            ['url' => 'crear_insumos', 'texto' => 'Crear', 'permiso' => 2],
            ['url' => 'consultar_inventario', 'texto' => 'Consultar', 'permiso' => 2]
        ]
    ],
    10 => [
        'key' => 'referencias',
        'icon' => 'fa-users',
        'titulo' => 'Gestionar Referencias',
        'subitems' => [
            ['url' => 'crear_referencias', 'texto' => 'Crear', 'permiso' => 2],
            ['url' => 'consultar_referencias', 'texto' => 'Consultar', 'permiso' => 2]
        ]
    ],
    11 => [
        'key' => 'jornadas',
        'icon' => 'fa-book-medical',
        'titulo' => 'Gestionar Jornadas',
        'subitems' => [
            ['url' => 'crear_jornada', 'texto' => 'Crear', 'permiso' => 2],
            ['url' => 'consultar_jornadas', 'texto' => 'Consultar', 'permiso' => 2]
        ]
    ],
    12 => [
        'key' => 'inventario_mobiliario',
        'icon' => 'fa-chair',
        'titulo' => 'Gestionar Mobiliario',
        'subitems' => [
            ['url' => 'crear_inventario_mob', 'texto' => 'Crear', 'permiso' => 2],
            ['url' => 'consultar_inventario_mob', 'texto' => 'Consultar', 'permiso' => 2]
        ]
    ],
    13 => [
        'key' => 'transporte',
        'icon' => 'fa-car',
        'titulo' => 'Gestionar Transporte',
        'subitems' => [
            ['url' => 'transporte_consulta', 'texto' => 'Consultar', 'permiso' => 2]
        ]
    ],
    18 => [
        'key' => 'horario',
        'icon' => 'fa-clock',
        'titulo' => 'Gestionar Horario',
        'subitems' => [
            ['url' => 'crear_horario', 'texto' => 'Crear', 'permiso' => 2],
            ['url' => 'consultar_horarios', 'texto' => 'Consultar', 'permiso' => 2]
        ]
    ],
    14 => [
        'key' => 'configuraciones',
        'icon' => 'fa-gear',
        'titulo' => 'Configuraciones',
        'subitems' => [
            ['url' => 'configuraciones', 'texto' => 'Crear', 'permiso' => 2],
            ['url' => 'consultar_configuraciones', 'texto' => 'Consultar', 'permiso' => 2],
            ['url' => 'consultar_bitacora', 'texto' => 'Bitacora', 'permiso' => 2],
            ['url' => 'crear_permisos', 'texto' => 'Permisos Empleados', 'permiso' => 2]
        ]
    ],
    // Agrega los demás módulos...
];
