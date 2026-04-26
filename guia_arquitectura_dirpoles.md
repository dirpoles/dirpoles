# 📚 Guía de Arquitectura y Desarrollo: Sistema DIRPOLES 4

Bienvenido a la guía técnica integral del sistema DIRPOLES 4. Este documento está diseñado para programadores que se incorporan al proyecto o desean comprender a fondo la arquitectura, decisiones de diseño y tecnologías involucradas. 

La filosofía de esta guía es **"no asumir nada"**. Entendemos que puedes saber programar, pero cada sistema tiene su propio "por qué". Aquí desglosaremos no solo *cómo* funciona el código, sino *por qué* se estructuró de esta manera, explicando conceptos clave para que domines el entorno por completo.

---

## 1. 🛠️ Stack Tecnológico y Entorno

El sistema DIRPOLES 4 está construido sobre una arquitectura robusta dividida en dos componentes principales: un "Monolito" en PHP que maneja la gestión y un "Microservicio" en Python dedicado a la Inteligencia Artificial.

### 1.1 Backend Principal (Gestión y Lógica de Negocio)
*   **Lenguaje:** PHP 8+ (Estricto, tipado y orientado a objetos).
*   **Servidor Web:** Apache (normalmente ejecutado bajo XAMPP en desarrollo local).
*   **Base de Datos:** MySQL (con bases de datos separadas: `dirpoles_business` para datos de negocio y `dirpoles_security` para usuarios y accesos).
*   **Gestor de Dependencias:** Composer (`composer.json`).
*   **Librerías Clave (PHP):**
    *   `firebase/php-jwt`: Para la generación y validación de tokens de seguridad JWT.
    *   `vlucas/phpdotenv`: Para leer variables de entorno desde el archivo `.env`.

### 1.2 Frontend (Interfaz de Usuario)
*   **Lenguaje:** JavaScript (Vanilla JS y jQuery), HTML5, CSS3.
*   **Frameworks/Librerías Visuales:** Bootstrap 5 (Diseño responsivo), FontAwesome (Iconos).
*   **Gestión de Plugins:** Se utiliza NPM (`package.json` para herramientas como `driver.js`) pero la mayoría de las librerías estables viven en la carpeta `/plugins/` (Select2, DataTables, SweetAlert2, FullCalendar). *¿Por qué?* Para evitar depender de instalaciones de Node en servidores de producción estáticos y garantizar que las versiones exactas siempre estén disponibles sin requerir conexión a internet.

### 1.3 Microservicio de IA (Análisis Estadístico)
*   **Lenguaje:** Python 3.11+. *¿Por qué Python?* Porque es el estándar de la industria para Inteligencia Artificial y Ciencia de Datos. PHP no está optimizado matemáticamente para esto.
*   **Framework:** FastAPI. *¿Por qué FastAPI?* Es moderno, extremadamente rápido, maneja asincronía de forma nativa y auto-documenta la API (Swagger).
*   **Comunicación:** Interfaz REST (Backend to Backend) usando JSON.

---

## 2. 🏗️ Arquitectura del Sistema PHP (MVC y Routing)

El sistema PHP no usa un framework comercial (como Laravel o CodeIgniter), sino que implementa un **patrón MVC (Modelo-Vista-Controlador)** personalizado y ligero, apoyado por un Router propio.

### 2.1 El Patrón MVC (Modelo-Vista-Controlador)
El MVC separa la aplicación en tres partes lógicas, lo que permite que el código sea mantenible:
*   **Modelo (Model):** Habla con la base de datos. Solo aquí hay consultas SQL (Ej: `BeneficiarioModel.php`).
*   **Vista (View):** El HTML y la interfaz que ve el usuario (Ej: `crear_beneficiario.php`).
*   **Controlador (Controller):** Es el "cerebro" o intermediario. Recibe la petición del usuario (ej: guardar datos), le pide al Modelo que guarde en la BD, y luego le dice a la Vista qué mostrar (Ej: `beneficiarioController.php`).

### 2.2 El Flujo de Ejecución y el `.htaccess`
Todo comienza cuando el usuario escribe una URL en el navegador. Aquí entra en juego un archivo crucial: el `.htaccess`.

**¿Qué es un archivo `.htaccess`?**
Es un archivo de configuración oculto para el servidor Apache. En DIRPOLES_4, su función principal es atrapar *todas* las peticiones que hace el usuario (ej: `http://localhost/DIRPOLES_4/beneficiarios`) y redirigirlas a un solo archivo: `index.php`.
*Ventaja:* Esto nos permite tener URLs limpias (sin `.php` al final) y centralizar la seguridad. El servidor no busca archivos físicos; le pasa la URL al `index.php` para que él decida qué hacer.

*Además, nuestro `.htaccess` está configurado para optimizar:*
*   **GZIP:** Comprime los archivos (HTML, CSS, JS) antes de enviarlos al navegador, haciendo que el sistema cargue mucho más rápido.
*   **Caché:** Le dice al navegador que guarde imágenes y fuentes por 1 año, reduciendo el consumo de datos.

### 2.3 El Punto de Entrada (`index.php`)
Una vez que el `.htaccess` redirige la petición a `index.php`, este archivo hace lo siguiente:
1.  Carga el *autoloader* de Composer (para usar clases de librerías).
2.  Carga el archivo `.env` (donde están las contraseñas).
3.  Incluye las configuraciones (`config.php`) y el iniciador (`bootstrap.php`).
4.  Llama al enrutador: `\App\Core\Router::ejecutar();`

### 2.4 El Router y los Controladores
El `Router.php` toma la URL, busca en `routes.php` si existe una coincidencia (Ej: `Router::get('consultar_beneficiarios', ...)`). Si la encuentra, ejecuta la función del controlador correspondiente.

Usamos **"Carga Perezosa" (Lazy Loading)** en `bootstrap.php` a través de la función `load_controller()`.
*¿Qué significa esto?* En lugar de cargar los 25 archivos de controladores en memoria en cada petición, el sistema *solo* requiere (`require_once`) el controlador específico que la ruta necesita en ese momento. Esto ahorra memoria RAM del servidor y hace que el sistema responda en milisegundos.

---

## 3. 🧩 Programación Orientada a Objetos (POO) en Acción

DIRPOLES_4 hace un uso intensivo de POO, especialmente en la capa de Modelos y en el Core. A continuación, explicamos cómo se aplican los pilares de la POO:

### 3.1 Encapsulamiento
El encapsulamiento consiste en ocultar el estado interno de un objeto y requerir que toda interacción se realice mediante métodos definidos.
*   **Ejemplo en el código:** En `BeneficiarioModel.php`, los datos no se guardan en variables públicas, sino en un array privado `$atributos = []`.
*   Para guardar datos, usamos el "método mágico" de PHP `__set($nombre, $valor)`.
*   *Ventaja:* Al usar `__set()`, el modelo *intercepta* el dato antes de guardarlo. Si intentas guardar un correo (`$modelo->__set('correo', 'A@B.COM')`), el método `__set` automáticamente lo convierte a minúsculas, valida si tiene el formato correcto (`@`) y, si no, lanza una "Excepción" (un error controlado). Protegemos la base de datos de basura.

### 3.2 Herencia
La herencia permite crear nuevas clases basadas en clases existentes, reciclando código.
*   **Ejemplo en el código:** Existe una clase abstracta principal `Database.php` que sabe cómo conectarse a MySQL mediante PDO.
*   Tenemos clases como `BusinessModel.php` y `SecurityModel.php` que *heredan* de `Database`.
*   Finalmente, `BeneficiarioModel extends BusinessModel`.
*   *Ventaja:* `BeneficiarioModel` no tiene que escribir el código para conectar a la BD; simplemente hereda la propiedad `$this->conn` lista para usarse. Si mañana cambiamos la contraseña de la BD, solo tocamos un archivo, no los 20 modelos.

### 3.3 Polimorfismo
El polimorfismo es la capacidad de diferentes objetos de responder a una misma "orden" (método) pero ejecutándola a su propia manera.
*   **Ejemplo en el código:** Todos los modelos implementan un método llamado `manejarAccion($action)`.
*   En el controlador, si quiero registrar algo, llamo a `$modelo->manejarAccion('registrar_beneficiario')`.
*   *Ventaja:* El controlador no necesita conocer la complejidad interna de las consultas SQL. Simplemente le dice al modelo "Haz esta acción", y el modelo internamente decide a qué función privada delegar esa orden a través de un bloque `switch`.

---

## 4. 🔒 Seguridad y Autenticación (JWT y Middleware)

La seguridad es uno de los aspectos más avanzados de este sistema. DIRPOLES_4 usa un sistema de "Doble Seguridad": Sesiones de PHP + Tokens JWT.

### 4.1 ¿Qué es un Middleware?
Un Middleware es como un "guardia de seguridad" en la puerta de un edificio. Es un bloque de código que se ejecuta **antes** de que la petición del usuario llegue a su destino (el controlador).
*   En `routes.php`, verás `Router::antes('ALL', '.*', function () { ... })`. Esto intercepta absolutamente *todas* las peticiones al sistema.
*   El Middleware verifica: ¿La ruta es pública (ej. login)? Si sí, lo deja pasar. Si es privada, le pide su "identificación".

### 4.2 ¿Qué es JWT y cómo se usa aquí?
**JWT (JSON Web Token)** es un estándar para crear "credenciales" seguras (una cadena larga de texto cifrado).

Cuando el usuario inicia sesión correctamente (`loginController.php`):
1.  PHP guarda en su memoria interna (`$_SESSION`) quién es el usuario. (Seguridad Capa 1).
2.  El `JwtHandler` genera un Token (JWT) usando una clave secreta (`JWT_SECRET` del `.env`). Este token adentro dice "Soy el empleado ID 5".
3.  Enviamos ese token al navegador del usuario **como una Cookie `HttpOnly`**.

**¿Por qué Cookie HttpOnly y no LocalStorage?**
Si guardas un token en `LocalStorage`, cualquier script de JavaScript (incluso uno malicioso) puede leerlo y robarlo (Ataque XSS). Al enviarlo como Cookie `HttpOnly`, el navegador guarda el token, se lo envía de vuelta al servidor automáticamente en cada petición, pero **JavaScript no puede leerlo**. Es impenetrable desde el frontend.

### 4.3 Verificación Dual
Cuando el usuario intenta entrar a `/consultar_beneficiarios`:
1.  El **Middleware** atrapa la petición.
2.  Verifica si existe la `$_SESSION` de PHP.
3.  Lee la cookie del JWT y la desencripta (usando la misma clave secreta).
4.  Comprueba que la firma digital del JWT sea válida y no haya expirado.
5.  *Paso crítico de Integridad:* Verifica que el ID del empleado que está en el JWT coincida exactamente con el ID que está en la `$_SESSION`. Si alguien intenta clonar una sesión o modificar cookies, las capas no coincidirán y el sistema cierra la sesión y bloquea la IP.

---

## 5. 🤖 El Microservicio de Inteligencia Artificial (FastAPI)

Para no sobrecargar PHP con cálculos matemáticos y poder usar las librerías líderes de Inteligencia Artificial, creamos un **Microservicio** en Python.

### 5.1 ¿Qué es un Microservicio?
Imagina que DIRPOLES_4 (PHP) es la oficina principal, y el Microservicio (Python) es un consultor externo especializado. No viven en el mismo programa, pero se comunican por internet (o por la red local).

*   PHP corre en el puerto `80`.
*   Python/FastAPI corre en el puerto `8000`.

### 5.2 Comunicación Backend to Backend
Cuando un usuario en el sistema DIRPOLES_4 pide "Analizar Reporte de Psicología con IA":
1.  El Frontend (JS) hace la petición al Controlador PHP (`reportesController.php`).
2.  El Controlador PHP usa la clase `MicroservicioIA.php` para armar un paquete de datos (JSON) con todo el reporte.
3.  PHP usa `cURL` (una herramienta para hacer peticiones HTTP desde el servidor) y llama a `http://localhost:8000/api/v1/analizar` enviando el JSON.
4.  Python recibe el JSON, usa sus algoritmos de IA, genera un resumen y hallazgos, y lo devuelve como otro JSON.
5.  PHP recibe esa respuesta y se la envía al Frontend.

*Ventaja:* El navegador del usuario nunca sabe que existe Python. Toda la comunicación es de servidor a servidor, lo cual es mucho más rápido y seguro.

### 5.3 Seguridad del Microservicio
¿Cómo evitamos que alguien ataque directamente el puerto 8000 de Python simulando ser PHP?
Mediante una **API Key**.
*   En el `.env` de PHP existe `IA_API_KEY`.
*   En el `.env` de Python existe `API_SECRET_KEY` (con el mismo valor).
*   Cuando PHP llama a Python, incluye un "Header" oculto: `X-API-Key: mi-clave...`
*   Python verifica esa clave. Si no viene, o es incorrecta, devuelve un error 403 (Acceso denegado).

---

## 6. 📁 Configuración y Despliegue (Git y Variables de Entorno)

### 6.1 Variables de Entorno (`.env`)
Un sistema profesional **NUNCA** tiene contraseñas escritas directamente en el código (`Database.php`). Si subes eso a Git (GitHub), todo el mundo vería la contraseña de tu base de datos o tu clave de encriptación JWT.

Para eso se usa el archivo `.env`. Este archivo vive en el servidor y contiene las credenciales (Base de datos, Claves secretas de JWT y de IA).
En el código PHP, en `config.php`, leerás la variable así: `$_ENV['JWT_SECRET']`.

### 6.2 Git y el `.gitignore`
El sistema usa Git para control de versiones. El archivo `.gitignore` le dice a Git qué archivos **NO** debe rastrear ni subir al repositorio central.
En DIRPOLES_4, ignoramos:
*   `.env` (Por seguridad, contiene contraseñas). Subimos un `.env.example` de plantilla.
*   `logs/` (Los errores locales de tu máquina no le interesan a los demás).
*   `vendor/` (La carpeta de librerías de PHP). ¿Por qué? Porque pesa mucho y tiene miles de archivos. En su lugar, se sube el `composer.json` y el `composer.lock`. Cuando otro programador clona el proyecto, corre `composer install` y las librerías se descargan automáticamente en su máquina.

---

## Resumen para el Programador

1.  **Si necesitas crear una nueva página:**
    *   Crea la ruta en `/app/routes/`.
    *   Crea el Controlador en `/app/Controllers/`.
    *   Crea el Modelo (heredando de `BusinessModel` o `SecurityModel`) en `/app/Models/`.
    *   Crea la Vista en `/app/Views/`.
2.  **Si vas a guardar datos:** Siempre usa `$modelo->__set('campo', $valor)` para aprovechar la validación y sanitización automática del modelo antes de ejecutar el SQL.
3.  **Si la página requiere conexión:** No tienes que preocuparte, el Middleware en `routes.php` ya está validando la sesión y el token JWT automáticamente.
4.  **Si necesitas conectar con IA:** Usa la clase helper `MicroservicioIA.php` desde tu controlador.

Este diseño garantiza un sistema escalable, seguro y fácil de mantener a largo plazo.
