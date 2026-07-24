# DIRPOLES 4 — Sistema de Gestión Integral

Sistema de gestión administrativa con arquitectura MVC personalizada (PHP 8+), frontend Bootstrap 5 y microservicio de IA en Python/FastAPI.

---

## Requisitos previos

| Componente | Versión |
|------------|---------|
| PHP | 8.1+ (con `openssl`, `pdo_mysql`, `mbstring`, `curl`) |
| MySQL / MariaDB | 10.4+ |
| Apache | 2.4+ (con `mod_rewrite`) |
| Composer | 2.x |
| OpenSSL | CLI (`openssl` en terminal) |

---

## Instalación

### 1. Clonar

```bash
git clone <url-del-repo> DIRPOLES_4
cd DIRPOLES_4
```

> El nombre de la carpeta puede ser cualquiera. El sistema detecta la URL base automáticamente.

### 2. Variables de entorno

```bash
cp .env.example .env
```

Edita `.env` y cambia los valores por defecto:

| Variable | Descripción |
|----------|-------------|
| `JWT_SECRET` | Clave secreta para compatibilidad interna |
| `JWT_EXPIRATION` | Duración del token en segundos (28800 = 8 h) |
| `IA_API_KEY` | API Key para conectar con el microservicio Python |

### 3. Dependencias

```bash
composer install
```

### 4. Generar llaves RSA

El sistema usa cifrado asimétrico RSA-2048 para el login y JWT:

```bash
mkdir -p app/Config/Keys

# Llaves para login (cifrado de contraseñas)
openssl genrsa -out app/Config/Keys/login_private.pem 2048
openssl rsa -in app/Config/Keys/login_private.pem -pubout -out app/Config/Keys/login_public.pem

# Llaves para JWT (firma y validación de tokens)
openssl genrsa -out app/Config/Keys/jwt_private.pem 2048
openssl rsa -in app/Config/Keys/jwt_private.pem -pubout -out app/Config/Keys/jwt_public.pem

chmod 644 app/Config/Keys/*.pem
```

> Las llaves `*_private.pem` NO se suben al repositorio (`.gitignore`).

### 5. Base de datos

Crea las bases de datos e importa los esquemas:

```bash
mysql -u root -p < bd/dirpoles_security.sql
mysql -u root -p < bd/dirpoles_business.sql
```

O desde phpMyAdmin: crea `dirpoles_security` y `dirpoles_business`, luego importa los archivos de `/bd/`.

### 6. Permisos de directorios

```bash
mkdir -p logs uploads
chmod 777 logs
chmod -R 777 uploads
chmod 644 app/Config/Keys/*.pem
```

---

## Configuración del servidor web

### 🐧 Linux (Apache nativo)

Ejecuta el script de configuración:

```bash
chmod +x setup_linux.sh
./setup_linux.sh
```

Esto crea un `Alias` en Apache para que `http://localhost/DIRPOLES_4` apunte a la carpeta del proyecto, habilita `mod_rewrite` e importa las bases de datos automáticamente.

Si prefieres hacerlo manual:

```apache
# Crea /etc/apache2/conf-available/dirpoles.conf
Alias /DIRPOLES_4 "/ruta/a/DIRPOLES_4"

<Directory "/ruta/a/DIRPOLES_4">
    Options Indexes FollowSymLinks MultiViews
    AllowOverride All
    Require all granted
</Directory>
```

```bash
sudo a2enconf dirpoles
sudo a2enmod rewrite
sudo systemctl restart apache2
```

### 🪟 Windows (XAMPP)

Copia la carpeta `DIRPOLES_4` dentro de `C:\xampp\htdocs\`.

Accede a: `http://localhost/DIRPOLES_4`

XAMPP incluye Apache con `mod_rewrite` habilitado por defecto.

---

## Verificar instalación

Abre `http://localhost/DIRPOLES_4/login` en tu navegador. Deberías ver el formulario de inicio de sesión.

---

## Solución de problemas

| Error | Causa | Solución |
|-------|-------|----------|
| `404 Not Found` al acceder | Apache no encuentra el proyecto | Configurar Alias o copiar a htdocs |
| `500 Internal Server Error` | Permisos de archivos o BD no existe | Revisar `logs/php_errors.log` |
| `Fallo al descifrar la contraseña` | Llave privada ilegible por Apache | `chmod 644 app/Config/Keys/*.pem` |
| `Unknown database 'dirpoles_...'` | BD no creada | Importar archivos `.sql` de `/bd/` |
| Clase no encontrada | `vendor/` no existe | Ejecutar `composer install` |
| 404 en `jquery.min.js` | jQuery no está en plugins | Debería estar en el repo; si no, descargar manualmente |

---

## Arquitectura

Para documentación técnica detallada (Router, JWT, Middleware, Microservicio IA):

➡️ [Guía de Arquitectura](guia_arquitectura_dirpoles.md)
