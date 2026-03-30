<?php

// Base de datos de negocio
const DB_HOST = 'localhost';
const DB_NAME = 'dirpoles_business';
const DB_USER = 'root';
const DB_PASS = '';

// Base de datos de seguridad
const DB_SECURITY_NAME = 'dirpoles_security';
const DB_SECURITY_USER = 'root'; 
const DB_SECURITY_PASS = '';

// Precarga de controladores
const PRELOAD_CONTROLLERS = false;
// Configuración de JWT
define('JWT_SECRET', $_ENV['JWT_SECRET'] ?? 'default_secret_key');
define('JWT_EXP', $_ENV['JWT_EXPIRATION'] ?? 28800); // 8 horas por defecto
