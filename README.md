# 📂 DIRPOLES 4 | Sistema de Gestión Integral

Este repositorio contiene el **Backend (PHP)** y la lógica de integración para el sistema **DIRPOLES 4**, diseñado con una arquitectura modular y conexión a microservicios de Inteligencia Artificial.

---

## ⚠️ NOTA CRÍTICA DE INSTALACIÓN
Para que el enrutamiento y los estilos carguen correctamente, **la carpeta del proyecto en tu servidor local (htdocs) DEBE llamarse exactamente `DIRPOLES_4`**.

> **¿Por qué?** El sistema utiliza la constante `const BASE_URL = '/DIRPOLES_4/';` para gestionar las rutas internas y la carga de assets. Si clonaste el repositorio con el nombre por defecto (`dirpoles`), **renómbralo** antes de continuar.

---

## 🚀 Pasos para la Puesta en Marcha

### 1. Requisitos Previos
* **Servidor:** PHP 8.1+ y MySQL (XAMPP o Laragon recomendado).
* **Gestores:** [Composer](https://getcomposer.org/) y [Node.js/NPM](https://nodejs.org/) instalados globalmente.
* **Entorno Python:** Python 3.11+ para el soporte del microservicio de IA.

### 2. Configuración del Entorno
Sigue este orden estrictamente para preparar el sistema:

1.  **Clonación:** Clona el proyecto y renombra la carpeta a `DIRPOLES_4` dentro de tu directorio de servidor local.
2.  **Dependencias PHP:** Ejecuta el siguiente comando en la raíz para generar la carpeta `vendor`:
    ```bash
    composer install
    ```
3.  **Dependencias JS:** Ejecuta el siguiente comando para instalar herramientas de soporte como **Driver.js**:
    ```bash
    npm install
    ```
4.  **Variables de Entorno:** Copia la plantilla de configuración:
    ```bash
    cp .env.example .env
    ```

### 3. Configuración de Seguridad (Obligatorio)
Abre tu archivo `.env` y genera claves únicas para garantizar una seguridad de nivel profesional en la gestión de tokens y comunicación entre servicios.

| Variable | Descripción | Comando de Generación (Terminal) |
| :--- | :--- | :--- |
| **`JWT_SECRET`** | Firma los tokens de acceso para el login. | `php -r "echo bin2hex(random_bytes(32));"` |
| **`IA_API_KEY`** | Autentica la conexión con el microservicio Python. | `php -r "echo bin2hex(random_bytes(16));"` |

> **Importante:** La `IA_API_KEY` debe ser idéntica en el `.env` de PHP y en el del microservicio FastAPI para que la sincronización sea exitosa.

---

### 4. Base de Datos
El sistema utiliza un esquema de bases de datos separadas para optimizar la seguridad y el rendimiento:

1.  Crea dos bases de datos en tu gestor (phpMyAdmin/MySQL):
    * `dirpoles_business`
    * `dirpoles_security`
2.  Importa los archivos `.sql` correspondientes ubicados en la carpeta `/bd/`.

---

### 5. Microservicio de IA
El sistema requiere que el microservicio de Python esté ejecutándose (usualmente en el **puerto 8000**) para habilitar las funciones de análisis estadístico y lógica predictiva.
* El microservicio aun esta en fase de implementacion.

---

## 🛠️ Arquitectura y Core
Este proyecto implementa un **patrón MVC Personalizado** con una arquitectura orientada a microservicios para los procesos de IA. 

Para documentación técnica avanzada sobre:
* Funcionamiento del **Router** personalizado.
* Seguridad mediante **JWT HttpOnly**.
* Estructura del **Core** del sistema.

📖 Lee la [Guía de Arquitectura de DIRPOLES](guia_arquitectura_dirpoles.md).