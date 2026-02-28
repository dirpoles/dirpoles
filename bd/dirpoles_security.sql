-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 28-02-2026 a las 14:43:45
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `dirpoles_security`
--
CREATE DATABASE IF NOT EXISTS `dirpoles_security` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish2_ci;
USE `dirpoles_security`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bitacora`
--

CREATE TABLE `bitacora` (
  `id_bitacora` int(11) NOT NULL,
  `id_empleado` int(11) NOT NULL,
  `modulo` varchar(50) NOT NULL,
  `accion` enum('Registro','Lectura','Actualización','Eliminación','Inicio de sesión','Cierre de sesión') NOT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `bitacora`
--

INSERT INTO `bitacora` (`id_bitacora`, `id_empleado`, `modulo`, `accion`, `descripcion`, `fecha`) VALUES
(1, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2025-12-24 14:22:31'),
(2, 1, 'Citas', 'Registro', 'El Administrador Roberth registro una cita al empleado:  con el beneficiario:  - ', '2025-12-24 14:23:28'),
(3, 1, 'Citas', 'Registro', 'El Administrador Roberth registro una cita al empleado: Francisco Perez con el beneficiario: V-12999292 - Prueba Prueba', '2025-12-24 14:34:10'),
(4, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2025-12-24 14:34:28'),
(5, 3, 'Login', 'Inicio de sesión', 'El empleado Juan ha iniciado sesión.', '2025-12-24 14:34:35'),
(6, 3, 'Citas', 'Registro', 'El Empleado Juan registro una cita con el beneficiario V-12023051 - Eustaquio Ramirez', '2025-12-24 14:34:55'),
(7, 3, 'Login', 'Cierre de sesión', 'El empleado Juan ha cerrado sesión.', '2025-12-24 14:35:07'),
(8, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2025-12-24 14:35:15'),
(9, 1, 'Citas', 'Actualización', 'El empleado Roberth actualizó la cita 4 del beneficiario  -  con el empleado Francisco Perez', '2025-12-24 14:41:14'),
(10, 1, 'Citas', 'Actualización', 'El empleado Roberth actualizó la cita de la fecha 2025-12-24 del empleado Francisco Perez con el beneficiario:  - ', '2025-12-24 14:43:44'),
(11, 1, 'Citas', 'Actualización', 'El empleado Roberth actualizó la cita de la fecha 2025-12-24 del empleado Francisco Perez con el beneficiario: V-12999292 - Prueba Prueba', '2025-12-24 14:48:41'),
(12, 1, 'Citas', 'Actualización', 'El empleado Roberth actualizó el estado de la cita 6 a 3', '2025-12-24 15:42:13'),
(13, 3, 'Login', 'Inicio de sesión', 'El empleado Juan ha iniciado sesión.', '2025-12-24 21:01:10'),
(14, 3, 'Citas', 'Actualización', 'El empleado Juan actualizó el estado de la cita ID: 3 a Pendiente', '2025-12-24 21:08:07'),
(15, 3, 'Login', 'Cierre de sesión', 'El empleado Juan ha cerrado sesión.', '2025-12-24 21:08:21'),
(16, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2025-12-24 21:08:28'),
(17, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2025-12-25 01:09:08'),
(18, 3, 'Login', 'Inicio de sesión', 'El empleado Juan ha iniciado sesión.', '2025-12-26 12:51:37'),
(19, 3, 'Login', 'Inicio de sesión', 'El empleado Juan ha iniciado sesión.', '2025-12-26 20:54:46'),
(20, 3, 'Login', 'Cierre de sesión', 'El empleado Juan ha cerrado sesión.', '2025-12-26 23:26:19'),
(21, 3, 'Login', 'Inicio de sesión', 'El empleado Juan ha iniciado sesión.', '2025-12-27 12:51:37'),
(22, 3, 'Psicologia', 'Registro', 'El Empleado Juan registro un diagnóstico psicológico con el beneficiario Eustaquio Ramirez (V - 12023051)', '2025-12-27 15:28:11'),
(23, 3, 'Login', 'Cierre de sesión', 'El empleado Juan ha cerrado sesión.', '2025-12-27 16:55:12'),
(24, 3, 'Login', 'Inicio de sesión', 'El empleado Juan ha iniciado sesión.', '2025-12-27 23:14:53'),
(25, 3, 'Psicologia', 'Registro', 'El Empleado Juan registro un retiro temporal al beneficiario Eustaquio Ramirez (V - 12023051)', '2025-12-27 23:56:34'),
(26, 3, 'Login', 'Cierre de sesión', 'El empleado Juan ha cerrado sesión.', '2025-12-27 23:57:17'),
(27, 3, 'Login', 'Inicio de sesión', 'El empleado Juan ha iniciado sesión.', '2025-12-28 21:37:13'),
(28, 3, 'Psicologia', 'Registro', 'El Empleado Juan registro un retiro temporal al beneficiario Prueba Prueba (V - 12999292)', '2025-12-28 22:02:52'),
(29, 3, 'Psicologia', 'Registro', 'El Empleado Juan registro un retiro temporal al beneficiario Eustaquio Ramirez (V - 12023051)', '2025-12-28 22:08:30'),
(30, 3, 'Beneficiarios', 'Actualización', 'Se actualizó el beneficiario: Iris Alvarez (V-12023052)', '2025-12-28 22:08:44'),
(31, 3, 'Beneficiarios', 'Actualización', 'Se actualizó el beneficiario: Eustaquio Ramirez (V-12023051)', '2025-12-28 22:08:51'),
(32, 3, 'Citas', 'Actualización', 'El empleado Juan actualizó el estado de la cita ID: 3 a Confirmada', '2025-12-28 22:09:08'),
(33, 3, 'Psicologia', 'Registro', 'El Empleado Juan registro un cambio de carrera al beneficiario Iris Alvarez (V - 12023052)', '2025-12-28 23:05:05'),
(34, 3, 'Psicologia', 'Registro', 'El Empleado Juan registro un diagnóstico psicológico con el beneficiario Iris Alvarez (V - 12023052)', '2025-12-29 00:49:21'),
(35, 3, 'Login', 'Cierre de sesión', 'El empleado Juan ha cerrado sesión.', '2025-12-29 01:06:57'),
(36, 24, 'Login', 'Inicio de sesión', 'El empleado Francisco ha iniciado sesión.', '2025-12-29 01:07:06'),
(37, 24, 'Login', 'Cierre de sesión', 'El empleado Francisco ha cerrado sesión.', '2025-12-29 01:07:20'),
(38, 3, 'Login', 'Inicio de sesión', 'El empleado Juan ha iniciado sesión.', '2025-12-29 13:12:26'),
(39, 3, 'Psicologia', 'Actualización', 'El Empleado Juan actualizó un diagnóstico de tipo Diagnóstico', '2025-12-29 15:29:48'),
(40, 3, 'Psicologia', 'Actualización', 'El Empleado Juan actualizó un diagnóstico de tipo Diagnóstico', '2025-12-29 15:30:41'),
(41, 3, 'Psicologia', 'Actualización', 'El Empleado Juan actualizó un diagnóstico de tipo Cambio de carrera', '2025-12-29 15:33:02'),
(42, 3, 'Psicologia', 'Actualización', 'El Empleado Juan actualizó un diagnóstico de tipo Retiro temporal', '2025-12-29 15:33:18'),
(43, 3, 'Psicologia', 'Actualización', 'El Empleado Juan actualizó un diagnóstico de tipo Diagnóstico', '2025-12-29 15:37:00'),
(44, 3, 'Psicologia', 'Actualización', 'El Empleado Juan actualizó un diagnóstico de tipo Retiro temporal', '2025-12-29 15:37:09'),
(45, 3, 'Psicologia', 'Actualización', 'El Empleado Juan actualizó un diagnóstico de tipo Cambio de carrera', '2025-12-29 15:37:24'),
(46, 3, 'Psicologia', 'Eliminación', 'El Empleado Juan eliminó un diagnóstico', '2025-12-29 15:52:25'),
(47, 3, 'Login', 'Cierre de sesión', 'El empleado Juan ha cerrado sesión.', '2025-12-29 15:54:14'),
(48, 3, 'Login', 'Inicio de sesión', 'El empleado Juan ha iniciado sesión.', '2025-12-30 13:19:05'),
(49, 3, 'Login', 'Cierre de sesión', 'El empleado Juan ha cerrado sesión.', '2025-12-30 13:44:43'),
(50, 3, 'Login', 'Inicio de sesión', 'El empleado Juan ha iniciado sesión.', '2025-12-30 13:44:58'),
(51, 3, 'Login', 'Cierre de sesión', 'El empleado Juan ha cerrado sesión.', '2025-12-30 13:45:16'),
(52, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2025-12-30 13:45:26'),
(53, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2025-12-30 13:45:37'),
(54, 5, 'Login', 'Inicio de sesión', 'El empleado Blairismar ha iniciado sesión.', '2025-12-30 13:45:45'),
(55, 5, 'Login', 'Cierre de sesión', 'El empleado Blairismar ha cerrado sesión.', '2025-12-30 13:46:15'),
(56, 6, 'Login', 'Inicio de sesión', 'El empleado Francisco ha iniciado sesión.', '2025-12-30 13:46:31'),
(57, 6, 'Login', 'Cierre de sesión', 'El empleado Francisco ha cerrado sesión.', '2025-12-30 13:46:45'),
(58, 8, 'Login', 'Inicio de sesión', 'El empleado Alejandra ha iniciado sesión.', '2025-12-30 13:46:53'),
(59, 8, 'Login', 'Cierre de sesión', 'El empleado Alejandra ha cerrado sesión.', '2025-12-30 13:47:10'),
(60, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2025-12-30 13:51:28'),
(61, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2025-12-30 13:53:09'),
(62, 8, 'Login', 'Inicio de sesión', 'El empleado Alejandra ha iniciado sesión.', '2025-12-30 13:53:16'),
(63, 8, 'Login', 'Cierre de sesión', 'El empleado Alejandra ha cerrado sesión.', '2025-12-30 13:53:29'),
(64, 3, 'Login', 'Inicio de sesión', 'El empleado Juan ha iniciado sesión.', '2025-12-30 13:56:21'),
(65, 3, 'Psicologia', 'Registro', 'El Empleado Juan registro un cambio de carrera al beneficiario Iris Alvarez (V - 12023052)', '2025-12-30 16:24:25'),
(66, 3, 'Citas', 'Actualización', 'El empleado Juan actualizó el estado de la cita ID: 3 a Cancelada', '2025-12-30 16:24:57'),
(67, 3, 'Login', 'Cierre de sesión', 'El empleado Juan ha cerrado sesión.', '2025-12-30 16:27:43'),
(68, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2025-12-30 23:50:02'),
(69, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2025-12-30 23:50:34'),
(70, 3, 'Login', 'Inicio de sesión', 'El empleado Juan ha iniciado sesión.', '2026-01-02 18:10:14'),
(71, 3, 'Citas', 'Actualización', 'El empleado Juan actualizó la cita de la fecha 2026-01-28 del empleado Juan Hernandez con el beneficiario: V-12023051 - Eustaquio Ramirez', '2026-01-02 19:27:53'),
(72, 3, 'Login', 'Cierre de sesión', 'El empleado Juan ha cerrado sesión.', '2026-01-02 19:28:18'),
(73, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-02 19:28:26'),
(74, 1, 'Psicologia', 'Registro', 'El Empleado Roberth registro un cambio de carrera al beneficiario Iris Alvarez (V - 12023052)', '2026-01-02 19:30:44'),
(75, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-01-02 19:31:01'),
(76, 3, 'Login', 'Inicio de sesión', 'El empleado Juan ha iniciado sesión.', '2026-01-02 19:31:09'),
(77, 3, 'Login', 'Cierre de sesión', 'El empleado Juan ha cerrado sesión.', '2026-01-02 19:38:47'),
(78, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-02 19:38:55'),
(79, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-01-02 19:39:21'),
(80, 3, 'Login', 'Inicio de sesión', 'El empleado Juan ha iniciado sesión.', '2026-01-02 19:39:29'),
(81, 3, 'Login', 'Cierre de sesión', 'El empleado Juan ha cerrado sesión.', '2026-01-02 19:39:58'),
(82, 5, 'Login', 'Inicio de sesión', 'El empleado Blairismar ha iniciado sesión.', '2026-01-02 19:40:07'),
(83, 5, 'Login', 'Cierre de sesión', 'El empleado Blairismar ha cerrado sesión.', '2026-01-02 20:06:47'),
(84, 5, 'Login', 'Inicio de sesión', 'El empleado Blairismar ha iniciado sesión.', '2026-01-02 20:07:00'),
(85, 5, 'Medicina', 'Registro', 'El Empleado Blairismar registro un diagnóstico médico con el beneficiario Iris Alvarez (V - 12023052)', '2026-01-02 21:50:30'),
(86, 5, 'Login', 'Cierre de sesión', 'El empleado Blairismar ha cerrado sesión.', '2026-01-02 22:34:33'),
(87, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-02 22:34:40'),
(88, 1, 'Inventario Medico', 'Registro', 'El Empleado Roberth registro el insumo \'Loratadina\' en el inventario médico.', '2026-01-02 23:54:30'),
(89, 1, 'Inventario Medico', 'Registro', 'El Empleado Roberth registro el insumo \'Acetaminofén\' en el inventario médico.', '2026-01-02 23:55:28'),
(90, 1, 'Inventario Medico', 'Registro', 'El Empleado Roberth registro el insumo \'Formol\' en el inventario médico.', '2026-01-03 00:37:47'),
(91, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-01-03 01:12:25'),
(92, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-03 19:37:50'),
(93, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-04 22:51:07'),
(94, 1, 'Inventario Medico', 'Registro', 'El Empleado Roberth registro la entrada del insumo Acetaminofen en el inventario médico.', '2026-01-04 23:39:08'),
(95, 1, 'Inventario Medico', 'Registro', 'El Empleado Roberth registro la entrada del insumo Acetaminofen en el inventario médico.', '2026-01-04 23:40:24'),
(96, 1, 'Inventario Medico', 'Registro', 'El Empleado Roberth registró salida (Uso Interno) del insumo Acetaminofen en el inventario médico.', '2026-01-05 00:00:22'),
(97, 1, 'Inventario Medico', 'Registro', 'El Empleado Roberth registró salida (Daño) del insumo Acetaminofen en el inventario médico.', '2026-01-05 00:01:10'),
(98, 1, 'Inventario Medico', 'Registro', 'El Empleado Roberth registro la entrada del insumo Acetaminofen en el inventario médico.', '2026-01-05 00:02:56'),
(99, 1, 'Inventario Medico', 'Registro', 'El Empleado Roberth registró salida (Donación) del insumo Acetaminofen en el inventario médico.', '2026-01-05 00:03:10'),
(100, 1, 'Inventario Medico', 'Registro', 'El Empleado Roberth registro el insumo \'Acetaminofén 500MG\' en el inventario médico.', '2026-01-05 00:04:59'),
(101, 1, 'Inventario Medico', 'Registro', 'El Empleado Roberth registro la entrada del insumo Acetaminofén 500MG en el inventario médico.', '2026-01-05 00:16:49'),
(102, 1, 'Inventario Medico', 'Registro', 'El Empleado Roberth registró salida (Pérdida) del insumo Acetaminofén 500MG en el inventario médico.', '2026-01-05 00:18:41'),
(103, 1, 'Medicina', 'Registro', 'El Empleado Roberth registro un diagnóstico médico con el beneficiario Iris Alvarez (V - 12023052)', '2026-01-05 01:44:35'),
(104, 1, 'Medicina', 'Registro', 'El Empleado Roberth registro un diagnóstico médico con el beneficiario Eustaquio Ramirez (V - 12023051)', '2026-01-05 01:47:19'),
(105, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-01-05 02:08:10'),
(106, 5, 'Login', 'Inicio de sesión', 'El empleado Blairismar ha iniciado sesión.', '2026-01-05 19:58:49'),
(107, 5, 'Login', 'Cierre de sesión', 'El empleado Blairismar ha cerrado sesión.', '2026-01-05 20:00:23'),
(108, 3, 'Login', 'Inicio de sesión', 'El empleado Juan ha iniciado sesión.', '2026-01-05 20:00:30'),
(109, 3, 'Login', 'Cierre de sesión', 'El empleado Juan ha cerrado sesión.', '2026-01-05 20:08:04'),
(110, 5, 'Login', 'Inicio de sesión', 'El empleado Blairismar ha iniciado sesión.', '2026-01-05 20:10:13'),
(111, 5, 'Login', 'Cierre de sesión', 'El empleado Blairismar ha cerrado sesión.', '2026-01-05 21:54:47'),
(112, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-06 15:52:46'),
(113, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-06 18:16:21'),
(114, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-01-06 19:20:37'),
(115, 5, 'Login', 'Inicio de sesión', 'El empleado Blairismar ha iniciado sesión.', '2026-01-07 14:11:46'),
(116, 5, 'Medicina', 'Registro', 'El Empleado Blairismar registro un diagnóstico médico con el beneficiario Eustaquio Ramirez (V - 12023051)', '2026-01-07 14:13:30'),
(117, 5, 'Medicina', 'Registro', 'El Empleado Blairismar actualizo el diagnóstico médico del beneficiario Eustaquio Ramirez (V - 12023051)', '2026-01-07 14:46:30'),
(118, 5, 'Medicina', 'Registro', 'El Empleado Blairismar actualizo el diagnóstico médico del beneficiario Eustaquio Ramirez (V - 12023051)', '2026-01-07 14:50:57'),
(119, 5, 'Medicina', 'Eliminación', 'El Empleado Blairismar eliminó un diagnóstico médico del beneficiario ', '2026-01-07 16:21:55'),
(120, 5, 'Medicina', 'Eliminación', 'El Empleado Blairismar eliminó un diagnóstico médico del beneficiario ', '2026-01-07 16:22:25'),
(121, 5, 'Login', 'Cierre de sesión', 'El empleado Blairismar ha cerrado sesión.', '2026-01-07 16:42:39'),
(122, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-07 16:43:36'),
(123, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-01-07 18:12:07'),
(124, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-08 17:19:15'),
(125, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-01-08 17:34:54'),
(126, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-08 17:35:09'),
(127, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-01-08 21:10:06'),
(128, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-09 00:18:10'),
(129, 1, 'Orientacion', 'Registro', 'El Empleado Roberth registro un diagnóstico médico con el beneficiario Iris Alvarez (V - 12023052)', '2026-01-09 01:17:58'),
(130, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-01-09 01:25:43'),
(131, 3, 'Login', 'Inicio de sesión', 'El empleado Juan ha iniciado sesión.', '2026-01-09 01:25:51'),
(132, 3, 'Login', 'Cierre de sesión', 'El empleado Juan ha cerrado sesión.', '2026-01-09 01:26:35'),
(133, 7, 'Login', 'Inicio de sesión', 'El empleado Victor ha iniciado sesión.', '2026-01-09 16:15:21'),
(134, 7, 'Orientacion', 'Registro', 'El Empleado Victor registro un diagnóstico de orientación con el beneficiario Eustaquio Ramirez (V - 12023051)', '2026-01-09 16:24:31'),
(135, 7, 'Login', 'Cierre de sesión', 'El empleado Victor ha cerrado sesión.', '2026-01-09 17:01:48'),
(136, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-09 17:01:57'),
(137, 1, 'Orientacion', 'Actualización', 'El Empleado Roberth actualizó el diagnóstico de orientación con el beneficiario Iris Alvarez (V - 12023052)', '2026-01-09 17:59:10'),
(138, 1, 'Orientacion', 'Actualización', 'El Empleado Roberth actualizó el diagnóstico de orientación con el beneficiario Iris Alvarez (V - 12023052)', '2026-01-09 19:06:08'),
(139, 1, 'Orientacion', 'Eliminación', 'El Empleado Roberth eliminó el diagnóstico de orientación con el beneficiario Iris Alvarez (V - 12023052)', '2026-01-09 19:29:54'),
(140, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-01-09 19:35:00'),
(141, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-10 17:36:42'),
(142, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-01-10 19:17:38'),
(143, 3, 'Login', 'Inicio de sesión', 'El empleado Juan ha iniciado sesión.', '2026-01-10 19:17:46'),
(144, 3, 'Login', 'Inicio de sesión', 'El empleado Juan ha iniciado sesión.', '2026-01-10 19:40:35'),
(145, 3, 'Login', 'Cierre de sesión', 'El empleado Juan ha cerrado sesión.', '2026-01-10 19:49:44'),
(146, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-10 19:50:02'),
(147, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-01-10 19:52:49'),
(148, 3, 'Login', 'Inicio de sesión', 'El empleado Juan ha iniciado sesión.', '2026-01-10 19:53:04'),
(149, 3, 'Login', 'Cierre de sesión', 'El empleado Juan ha cerrado sesión.', '2026-01-10 22:49:53'),
(150, 7, 'Login', 'Inicio de sesión', 'El empleado Victor ha iniciado sesión.', '2026-01-10 22:50:06'),
(151, 7, 'Orientacion', 'Actualización', 'El Empleado Victor actualizó el diagnóstico de orientación con el beneficiario Eustaquio Ramirez (V - 12023051)', '2026-01-10 22:50:39'),
(152, 7, 'Login', 'Cierre de sesión', 'El empleado Victor ha cerrado sesión.', '2026-01-10 22:50:46'),
(153, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-10 22:52:36'),
(154, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-01-11 02:43:15'),
(155, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-13 14:57:58'),
(156, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-01-13 15:16:09'),
(157, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-13 15:21:16'),
(158, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-01-13 23:06:25'),
(159, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-15 16:20:43'),
(160, 1, 'Trabajador Social', 'Registro', 'El Empleado Roberth registro una beca para el beneficiario Iris Alvarez (V - 12023052)', '2026-01-15 17:55:38'),
(161, 1, 'Trabajador Social', 'Registro', 'El Empleado Roberth registro una beca para el beneficiario Prueba Prueba (V - 12999292)', '2026-01-15 17:59:58'),
(162, 1, 'Trabajador Social', 'Registro', 'El Empleado Roberth registro una exoneracion para el beneficiario Iris Alvarez (V - 12023052)', '2026-01-15 19:59:03'),
(163, 1, 'Trabajador Social', 'Registro', 'El Empleado Roberth registro una exoneracion para el beneficiario Iris Alvarez (V - 12023052)', '2026-01-15 20:00:25'),
(164, 1, 'Trabajador Social', 'Registro', 'El Empleado Roberth registro un diagnóstico de FAMES para el beneficiario Iris Alvarez (V - 12023052)', '2026-01-16 01:48:19'),
(165, 1, 'Trabajador Social', 'Registro', 'El Empleado Roberth registro un diagnóstico de FAMES para el beneficiario Eustaquio Ramirez (V - 12023051)', '2026-01-16 01:49:38'),
(166, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-01-16 02:08:51'),
(167, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-16 14:36:26'),
(168, 1, 'Trabajador Social', 'Registro', 'El Empleado Roberth registro un caso de embarazada para la beneficiaria Iris Alvarez (V - 12023052)', '2026-01-16 15:36:50'),
(169, 1, 'Trabajador Social', 'Registro', 'El Empleado Roberth registro una exoneracion para el beneficiario Eustaquio Ramirez (V - 12023051)', '2026-01-16 16:38:16'),
(170, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-01-16 19:24:04'),
(171, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-16 20:25:33'),
(172, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-18 17:31:42'),
(173, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-01-18 17:33:27'),
(174, 6, 'Login', 'Inicio de sesión', 'El empleado Francisco ha iniciado sesión.', '2026-01-18 17:33:52'),
(175, 6, 'Login', 'Cierre de sesión', 'El empleado Francisco ha cerrado sesión.', '2026-01-18 17:38:06'),
(176, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-18 17:38:14'),
(177, 1, 'Trabajador Social', 'Registro', 'El Empleado Roberth actualizó un dato de la beca del beneficiario: ', '2026-01-18 18:36:54'),
(178, 1, 'Trabajador Social', 'Registro', 'El Empleado Roberth actualizó un dato de la beca del beneficiario: ', '2026-01-18 18:37:48'),
(179, 1, 'Trabajador Social', 'Registro', 'El Empleado Roberth actualizó un dato de la beca del beneficiario: ', '2026-01-18 18:37:56'),
(180, 1, 'Trabajador Social', 'Registro', 'El Empleado Roberth eliminó la beca del beneficiario: ', '2026-01-18 19:42:12'),
(181, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-01-18 22:05:24'),
(182, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-19 00:01:30'),
(183, 1, 'Trabajador Social', 'Registro', 'El Empleado Roberth actualizó un dato de la beca del beneficiario: ', '2026-01-19 00:12:52'),
(184, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-01-19 01:28:40'),
(185, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-19 12:36:21'),
(186, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-01-19 13:46:52'),
(187, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-19 17:30:49'),
(188, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-01-19 17:54:48'),
(189, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-19 17:55:11'),
(190, 1, 'Trabajador Social', 'Registro', 'El Empleado Roberth actualizó un dato de la exoneración del beneficiario: Iris Alvarez (V - 12023052)', '2026-01-19 18:16:23'),
(191, 1, 'Trabajador Social', 'Eliminación', 'El Empleado Roberth eliminó la exoneración del beneficiario: ', '2026-01-19 18:33:48'),
(192, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-01-19 19:43:17'),
(193, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-20 12:38:10'),
(194, 1, 'Trabajador Social', 'Registro', 'El Empleado Roberth actualizó un dato de la exoneración del beneficiario: Iris Alvarez (V - 12023052)', '2026-01-20 12:59:47'),
(195, 1, 'Trabajador Social', 'Registro', 'El Empleado Roberth actualizó un dato de la exoneración del beneficiario: Iris Alvarez (V - 12023052)', '2026-01-20 12:59:47'),
(196, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-20 13:04:48'),
(197, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-01-20 14:48:43'),
(198, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-20 22:11:16'),
(199, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-01-20 23:20:15'),
(200, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-20 23:20:43'),
(201, 1, 'Trabajador Social', 'Actualización', 'El Empleado Roberth actualizó un dato del servicio de FAMES del beneficiario: Eustaquio Ramirez (V - 12023051)', '2026-01-20 23:48:04'),
(202, 1, 'Trabajador Social', 'Actualización', 'El Empleado Roberth actualizó un dato del servicio de FAMES del beneficiario: Eustaquio Ramirez (V - 12023051)', '2026-01-20 23:49:26'),
(203, 1, 'Trabajador Social', 'Actualización', 'El Empleado Roberth actualizó un dato del servicio de FAMES del beneficiario: Eustaquio Ramirez (V - 12023051)', '2026-01-20 23:52:04'),
(204, 1, 'Trabajador Social', 'Eliminación', 'El Empleado Roberth eliminó el diagnóstico de FAMES del beneficiario: ', '2026-01-21 00:03:09'),
(205, 1, 'Trabajador Social', 'Eliminación', 'El Empleado Roberth eliminó el diagnóstico de FAMES del beneficiario: ', '2026-01-21 03:10:46'),
(206, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-01-21 03:12:26'),
(207, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-21 03:12:49'),
(208, 1, 'Trabajador Social', 'Registro', 'El Empleado Roberth registro un caso de embarazada para la beneficiaria Iris Alvarez (V - 12023052)', '2026-01-21 03:13:22'),
(209, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-01-21 03:41:07'),
(210, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-21 12:17:41'),
(211, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-21 12:57:27'),
(212, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-21 12:58:44'),
(213, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-01-21 12:59:40'),
(214, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-21 12:59:49'),
(215, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-01-21 13:00:40'),
(216, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-21 13:00:54'),
(217, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-01-21 13:01:35'),
(218, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-21 13:01:40'),
(219, 1, 'Trabajador Social', 'Registro', 'El Empleado Roberth registro una beca para el beneficiario Eustaquio Ramirez (V - 12023051)', '2026-01-21 13:04:48'),
(220, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-01-21 13:05:39'),
(221, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-21 13:06:29'),
(222, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-21 13:10:20'),
(223, 1, 'Trabajador Social', 'Actualización', 'El Empleado Roberth actualizó un dato del servicio de Embarazadas del beneficiario: Iris Alvarez (V - 12023052)', '2026-01-21 14:59:57'),
(224, 1, 'Trabajador Social', 'Actualización', 'El Empleado Roberth actualizó un dato del servicio de Embarazadas del beneficiario: Iris Alvarez (V - 12023052)', '2026-01-21 15:14:44'),
(225, 1, 'Trabajador Social', 'Actualización', 'El Empleado Roberth actualizó un dato del servicio de Embarazadas del beneficiario: Iris Alvarez (V - 12023052)', '2026-01-21 15:18:44'),
(226, 1, 'Trabajador Social', 'Actualización', 'El Empleado Roberth actualizó un dato del servicio de Embarazadas del beneficiario: Iris Alvarez (V - 12023052)', '2026-01-21 15:18:58'),
(227, 1, 'Trabajador Social', 'Actualización', 'El Empleado Roberth actualizó un dato del servicio de Embarazadas del beneficiario: Iris Alvarez (V - 12023052)', '2026-01-21 15:21:14'),
(228, 1, 'Trabajador Social', 'Actualización', 'El Empleado Roberth actualizó un dato del servicio de Embarazadas del beneficiario: Iris Alvarez (V - 12023052)', '2026-01-21 15:21:20'),
(229, 1, 'Trabajador Social', 'Actualización', 'El Empleado Roberth actualizó un dato del servicio de Embarazadas del beneficiario: Iris Alvarez (V - 12023052)', '2026-01-21 15:29:02'),
(230, 1, 'Trabajador Social', 'Actualización', 'El Empleado Roberth actualizó un dato del servicio de Embarazadas del beneficiario: Iris Alvarez (V - 12023052)', '2026-01-21 15:29:25'),
(231, 1, 'Trabajador Social', 'Actualización', 'El Empleado Roberth actualizó un dato del servicio de Embarazadas del beneficiario: Iris Alvarez (V - 12023052)', '2026-01-21 15:29:30'),
(232, 1, 'Trabajador Social', 'Actualización', 'El Empleado Roberth actualizó un dato del servicio de Embarazadas del beneficiario: Iris Alvarez (V - 12023052)', '2026-01-21 15:36:39'),
(233, 1, 'Trabajador Social', 'Actualización', 'El Empleado Roberth actualizó un dato del servicio de Embarazadas del beneficiario: Iris Alvarez (V - 12023052)', '2026-01-21 15:36:39'),
(234, 1, 'Trabajador Social', 'Actualización', 'El Empleado Roberth actualizó un dato del servicio de Embarazadas del beneficiario: Iris Alvarez (V - 12023052)', '2026-01-21 15:42:31'),
(235, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-01-21 16:21:06'),
(236, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-22 00:23:53'),
(237, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-01-22 00:24:01'),
(238, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-22 01:06:41'),
(239, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-01-22 02:13:41'),
(240, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-22 13:00:17'),
(241, 1, 'Discapacidad', 'Registro', 'El Empleado Roberth registro un diagnóstico de discapacidad con el beneficiario Eustaquio Ramirez (V - 12023051)', '2026-01-22 14:36:03'),
(242, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-01-22 17:33:46'),
(243, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-22 19:04:29'),
(244, 1, 'Discapacidad', 'Actualización', 'El Empleado Roberth actualizó un dato del diagnóstico de discapacidad del beneficiario Eustaquio Ramirez (V - 12023051)', '2026-01-22 19:24:34'),
(245, 1, 'Discapacidad', 'Eliminación', 'El Empleado Roberth eliminó el diagnóstico de discapacidad del beneficiario Eustaquio Ramirez (V - 12023051)', '2026-01-22 19:34:05'),
(246, 1, 'Trabajador Social', 'Eliminación', 'El Empleado Roberth eliminó la exoneración del beneficiario: ', '2026-01-22 19:46:29'),
(247, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-01-22 19:53:48'),
(248, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-22 19:54:14'),
(249, 1, 'Trabajador Social', 'Eliminación', 'El Empleado Roberth eliminó el diagnóstico de Embarazadas del beneficiario: Iris Alvarez (V - 12023052)', '2026-01-22 19:54:54'),
(250, 1, 'Citas', 'Eliminación', 'El empleado Roberth eliminó la cita del beneficiario Eustaquio Ramirez (V - 12023051)', '2026-01-22 20:49:16'),
(251, 1, 'Citas', 'Actualización', 'El empleado Roberth actualizó el estado de la cita del beneficiario  a Confirmada', '2026-01-22 20:52:50'),
(252, 1, 'Citas', 'Actualización', 'El empleado Roberth actualizó el estado de la cita del beneficiario  a No asistió', '2026-01-22 20:54:24'),
(253, 1, 'Citas', 'Actualización', 'El empleado Roberth actualizó el estado de la cita del beneficiario  a Pendiente', '2026-01-22 20:57:40'),
(254, 1, 'Citas', 'Actualización', 'El empleado Roberth actualizó el estado de la cita del beneficiario:  a Cancelada', '2026-01-22 20:58:10'),
(255, 1, 'Citas', 'Actualización', 'El empleado Roberth actualizó el estado de la cita del beneficiario: Prueba Prueba (V - 12999292) a No asistió', '2026-01-22 21:04:53'),
(256, 1, 'Citas', 'Registro', 'El Administrador Roberth registro una cita al empleado: Juan Hernandez con el beneficiario: Eustaquio Ramirez (V - 12023051)', '2026-01-22 21:15:20'),
(257, 1, 'Empleados', 'Actualización', 'El empleado Roberth actualizó un dato del empleado: Alberto Hernandez (V-25544455)', '2026-01-22 21:20:34'),
(258, 1, 'Inventario Medico', 'Registro', 'El Empleado Roberth registro el insumo \'Lozartan 800mg\' en el inventario médico.', '2026-01-22 21:27:32'),
(259, 1, 'Psicologia', 'Registro', 'El Empleado Roberth registro un diagnóstico psicológico con el beneficiario Eustaquio Ramirez (V - 12023051)', '2026-01-22 21:44:39'),
(260, 1, 'Medicina', 'Registro', 'El Empleado Roberth registro un diagnóstico médico con el beneficiario Eustaquio Ramirez (V - 12023051)', '2026-01-22 21:45:13'),
(261, 1, 'Orientacion', 'Registro', 'El Empleado Roberth registro un diagnóstico de orientación con el beneficiario Iris Alvarez (V - 12023052)', '2026-01-22 21:45:30'),
(262, 1, 'Trabajador Social', 'Registro', 'El Empleado Roberth registro una exoneracion para el beneficiario Prueba Prueba (V - 12999292)', '2026-01-22 21:45:46'),
(263, 1, 'Discapacidad', 'Registro', 'El Empleado Roberth registro un diagnóstico de discapacidad con el beneficiario Eustaquio Ramirez (V - 12023051)', '2026-01-22 21:46:23'),
(264, 1, 'Trabajador Social', 'Registro', 'El Empleado Roberth registro una beca para el beneficiario Prueba Prueba (V - 12999292)', '2026-01-22 22:20:34'),
(265, 1, 'Trabajador Social', 'Registro', 'El Empleado Roberth registro un diagnóstico de FAMES para el beneficiario Eustaquio Ramirez (V - 12023051)', '2026-01-22 22:20:42'),
(266, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-01-22 22:22:38'),
(267, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-23 13:37:13'),
(268, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-01-23 16:23:45'),
(269, 3, 'Login', 'Inicio de sesión', 'El empleado Juan ha iniciado sesión.', '2026-01-23 16:24:42'),
(270, 3, 'Psicologia', 'Registro', 'El Empleado Juan registro un cambio de carrera al beneficiario Prueba Prueba (V - 12999292)', '2026-01-23 16:29:51'),
(271, 3, 'Psicologia', 'Registro', 'El Empleado Juan registro un diagnóstico psicológico con el beneficiario Eustaquio Ramirez (V - 12023051)', '2026-01-23 16:30:44'),
(272, 3, 'Login', 'Cierre de sesión', 'El empleado Juan ha cerrado sesión.', '2026-01-23 16:30:52'),
(273, 5, 'Login', 'Inicio de sesión', 'El empleado Blairismar ha iniciado sesión.', '2026-01-23 16:31:12'),
(274, 5, 'Medicina', 'Registro', 'El Empleado Blairismar registro un diagnóstico médico con el beneficiario Iris Alvarez (V - 12023052)', '2026-01-23 17:49:39'),
(275, 5, 'Inventario Medico', 'Registro', 'El Empleado Blairismar registro la entrada del insumo Lozartan 800Mg en el inventario médico.', '2026-01-23 17:50:04'),
(276, 5, 'Login', 'Inicio de sesión', 'El empleado Blairismar ha iniciado sesión.', '2026-01-24 23:20:03'),
(277, 5, 'Login', 'Cierre de sesión', 'El empleado Blairismar ha cerrado sesión.', '2026-01-25 02:56:25'),
(278, 5, 'Login', 'Inicio de sesión', 'El empleado Blairismar ha iniciado sesión.', '2026-01-25 23:54:31'),
(279, 5, 'Login', 'Cierre de sesión', 'El empleado Blairismar ha cerrado sesión.', '2026-01-26 00:02:03'),
(280, 5, 'Login', 'Inicio de sesión', 'El empleado Blairismar ha iniciado sesión.', '2026-01-26 14:49:48'),
(281, 5, 'Login', 'Cierre de sesión', 'El empleado Blairismar ha cerrado sesión.', '2026-01-26 16:25:16'),
(282, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-26 16:25:24'),
(283, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-01-26 16:39:57'),
(284, 3, 'Login', 'Inicio de sesión', 'El empleado Juan ha iniciado sesión.', '2026-01-26 16:40:13'),
(285, 3, 'Login', 'Cierre de sesión', 'El empleado Juan ha cerrado sesión.', '2026-01-26 16:42:02'),
(286, 5, 'Login', 'Inicio de sesión', 'El empleado Blairismar ha iniciado sesión.', '2026-01-26 16:42:11'),
(287, 5, 'Login', 'Cierre de sesión', 'El empleado Blairismar ha cerrado sesión.', '2026-01-26 16:42:39'),
(288, 3, 'Login', 'Inicio de sesión', 'El empleado Juan ha iniciado sesión.', '2026-01-26 16:42:47'),
(289, 3, 'Login', 'Cierre de sesión', 'El empleado Juan ha cerrado sesión.', '2026-01-26 17:07:26'),
(290, 5, 'Login', 'Inicio de sesión', 'El empleado Blairismar ha iniciado sesión.', '2026-01-26 17:07:42'),
(291, 5, 'Login', 'Cierre de sesión', 'El empleado Blairismar ha cerrado sesión.', '2026-01-26 17:12:58'),
(292, 7, 'Login', 'Inicio de sesión', 'El empleado Victor ha iniciado sesión.', '2026-01-26 17:14:12'),
(293, 7, 'Login', 'Cierre de sesión', 'El empleado Victor ha cerrado sesión.', '2026-01-26 17:33:05'),
(294, 7, 'Login', 'Inicio de sesión', 'El empleado Victor ha iniciado sesión.', '2026-01-26 17:33:14'),
(295, 7, 'Orientacion', 'Registro', 'El Empleado Victor registro un diagnóstico de orientación con el beneficiario Iris Alvarez (V - 12023052)', '2026-01-26 17:34:12'),
(296, 7, 'Login', 'Cierre de sesión', 'El empleado Victor ha cerrado sesión.', '2026-01-26 17:36:20'),
(297, 6, 'Login', 'Inicio de sesión', 'El empleado Francisco ha iniciado sesión.', '2026-01-26 17:38:56'),
(298, 6, 'Trabajador Social', 'Registro', 'El Empleado Francisco registro una beca para el beneficiario Eustaquio Ramirez (V - 12023051)', '2026-01-26 17:53:46'),
(299, 6, 'Trabajador Social', 'Registro', 'El Empleado Francisco registro un diagnóstico de FAMES para el beneficiario Prueba Prueba (V - 12999292)', '2026-01-26 17:53:57'),
(300, 6, 'Trabajador Social', 'Registro', 'El Empleado Francisco registro un caso de embarazada para la beneficiaria Iris Alvarez (V - 12023052)', '2026-01-26 17:54:37'),
(301, 6, 'Login', 'Cierre de sesión', 'El empleado Francisco ha cerrado sesión.', '2026-01-26 17:56:17'),
(302, 8, 'Login', 'Inicio de sesión', 'El empleado Alejandra ha iniciado sesión.', '2026-01-26 17:56:28'),
(303, 8, 'Discapacidad', 'Registro', 'El Empleado Alejandra registro un diagnóstico de discapacidad con el beneficiario Eustaquio Ramirez (V - 12023051)', '2026-01-26 18:04:59'),
(304, 8, 'Login', 'Cierre de sesión', 'El empleado Alejandra ha cerrado sesión.', '2026-01-26 18:21:21'),
(305, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-26 18:21:30'),
(306, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-01-26 19:02:58'),
(307, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-27 03:24:15'),
(308, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-01-27 03:24:26'),
(309, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-27 12:52:53'),
(310, 5, 'Login', 'Inicio de sesión', 'El empleado Michelle ha iniciado sesión.', '2026-01-27 13:28:10'),
(311, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-01-27 13:31:31'),
(312, 5, 'Login', 'Inicio de sesión', 'El empleado Michelle ha iniciado sesión.', '2026-01-27 13:47:59'),
(313, 5, 'Inventario Medico', 'Registro', 'El Empleado Michelle registro el insumo \'Guantes de latex\' en el inventario médico.', '2026-01-27 14:51:04'),
(314, 5, 'Inventario Medico', 'Actualización', 'El Empleado Michelle actualizó un dato del insumo \'Guantes De Latexx\' en el inventario médico.', '2026-01-27 17:36:41'),
(315, 5, 'Inventario Medico', 'Actualización', 'El Empleado Michelle actualizó un dato del insumo \'Guantes De Latexx\' en el inventario médico.', '2026-01-27 17:36:52'),
(316, 5, 'Inventario Medico', 'Eliminación', 'El Empleado Michelle eliminó el insumo \'Guantes De Latexx\' del inventario médico.', '2026-01-27 17:50:43'),
(317, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-29 17:40:42'),
(318, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-01-29 19:16:15'),
(319, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-31 11:46:32'),
(320, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-31 18:33:03'),
(321, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-01-31 18:33:38'),
(322, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-01-31 18:40:58'),
(323, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-02-01 13:49:40'),
(324, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-02-01 16:04:57'),
(325, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-02-01 22:37:48'),
(326, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-02-02 03:20:38'),
(327, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-02-02 13:58:57'),
(328, 1, 'Configuracion', 'Registro', 'El Empleado Roberth registro una patología con el nombre Gripe y tipo General', '2026-02-02 14:58:29'),
(329, 1, 'Configuracion', 'Registro', 'El Empleado Roberth registro una patología con el nombre Ansiedad y tipo General', '2026-02-02 14:59:05'),
(330, 1, 'Configuracion', 'Registro', 'El Empleado Roberth registro un PNF con el nombre PNF Sistemas informáticos', '2026-02-02 16:01:53'),
(331, 1, 'Configuracion', 'Registro', 'El Empleado Roberth registro un Servicio con el nombre Mantenimiento', '2026-02-02 16:26:54'),
(332, 1, 'Configuracion', 'Registro', 'El Empleado Roberth registro un tipo de empleado con el nombre Enfermero y servicio 2', '2026-02-02 17:18:57'),
(333, 1, 'Configuracion', 'Registro', 'El Empleado Roberth registro un tipo de mobiliario con el nombre Silla giratoria', '2026-02-02 17:31:36'),
(334, 1, 'Configuracion', 'Registro', 'El Empleado Roberth registro un tipo de equipo con el nombre Video Beam HP', '2026-02-02 17:36:52'),
(335, 1, 'Configuracion', 'Registro', 'El Empleado Roberth registro una presentación de insumos con el nombre Gaseosa', '2026-02-02 17:48:18'),
(336, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-02-02 18:41:28'),
(337, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-02-03 13:11:18'),
(338, 1, 'Configuracion', 'Registro', 'El Empleado Roberth registro un tipo de empleado con el nombre Obrero y servicio 6', '2026-02-03 14:28:00'),
(339, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-02-03 15:19:15'),
(340, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-02-03 15:19:50'),
(341, 1, 'Configuracion', 'Actualización', 'El Empleado Roberth actualizo una patologia con el nombre Ansiedad', '2026-02-04 16:27:47'),
(342, 1, 'Configuracion', 'Actualización', 'El Empleado Roberth actualizo un PNF con el nombre PNF Sistemas informáticos', '2026-02-04 17:17:50'),
(343, 1, 'Configuracion', 'Actualización', 'El Empleado Roberth actualizo una presentacion de insumo con el nombre Gaseosas', '2026-02-04 18:36:47'),
(344, 1, 'Configuracion', 'Actualización', 'El Empleado Roberth actualizo un servicio con el nombre Mantenimiento', '2026-02-04 19:29:07'),
(345, 1, 'Configuracion', 'Actualización', 'El Empleado Roberth actualizo un tipo de empleado con el nombre Obreros', '2026-02-04 20:04:34'),
(346, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-02-04 20:04:40'),
(347, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-02-05 10:11:24'),
(348, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-02-05 10:42:50'),
(349, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-02-05 21:54:08'),
(350, 1, 'Configuracion', 'Actualización', 'El Empleado Roberth actualizo un tipo de mobiliario con el nombre Silla giratoria', '2026-02-05 22:00:45'),
(351, 1, 'Configuracion', 'Actualización', 'El Empleado Roberth actualizo un tipo de equipo con el nombre Video Beam HP', '2026-02-05 22:07:23'),
(352, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-02-05 23:51:06'),
(353, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-02-07 16:25:13'),
(354, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-02-07 18:09:58'),
(355, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-02-07 18:11:49'),
(356, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-02-07 18:11:56'),
(357, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-02-07 18:20:11'),
(358, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-02-07 18:20:32'),
(359, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-02-07 18:25:32'),
(360, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-02-07 18:25:41'),
(361, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-02-07 18:37:27'),
(362, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-02-07 18:37:35'),
(363, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-02-07 19:57:28'),
(364, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-02-08 21:39:38'),
(365, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-02-08 22:30:42'),
(366, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-02-09 13:06:34'),
(367, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-02-09 13:59:08'),
(368, 3, 'Login', 'Inicio de sesión', 'El empleado Juan ha iniciado sesión.', '2026-02-09 14:01:54'),
(369, 3, 'Referencias', 'Registro', 'El Empleado Juan registro una referencia con el beneficiario Eustaquio Ramirez (V - 12023051)', '2026-02-09 16:05:48'),
(370, 5, 'Login', 'Inicio de sesión', 'El empleado Michelle ha iniciado sesión.', '2026-02-09 16:06:12'),
(371, 3, 'Referencias', 'Registro', 'El Empleado Juan registro una referencia con el beneficiario Prueba Prueba (V - 12999292)', '2026-02-09 16:07:20'),
(372, 5, 'Login', 'Cierre de sesión', 'El empleado Michelle ha cerrado sesión.', '2026-02-09 16:14:06'),
(373, 3, 'Login', 'Cierre de sesión', 'El empleado Juan ha cerrado sesión.', '2026-02-09 17:06:08'),
(374, 5, 'Login', 'Inicio de sesión', 'El empleado Michelle ha iniciado sesión.', '2026-02-09 17:06:18'),
(375, 5, 'Login', 'Cierre de sesión', 'El empleado Michelle ha cerrado sesión.', '2026-02-09 19:34:00'),
(376, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-02-10 15:14:59'),
(377, 1, 'Referencias', 'Actualización', 'El Empleado Roberth aceptó la referencia 3', '2026-02-10 17:18:26'),
(378, 1, 'Referencias', 'Actualización', 'El Empleado Roberth rechazó la referencia 2', '2026-02-10 17:18:40'),
(379, 1, 'Referencias', 'Registro', 'El Empleado Roberth registro una referencia con el beneficiario Prueba Prueba (V - 12999292)', '2026-02-10 17:19:55'),
(380, 1, 'Referencias', 'Actualización', 'El Empleado Roberth aceptó la referencia 5', '2026-02-10 17:20:18'),
(381, 1, 'Referencias', 'Registro', 'El Empleado Roberth registro una referencia con el beneficiario Prueba Prueba (V - 12999292)', '2026-02-10 17:24:35'),
(382, 1, 'Referencias', 'Actualización', 'El Empleado Roberth rechazó la referencia 6', '2026-02-10 17:24:45'),
(383, 1, 'Referencias', 'Registro', 'El Empleado Roberth registro una referencia con el beneficiario Prueba Prueba (V - 12999292)', '2026-02-10 17:27:44'),
(384, 1, 'Referencias', 'Actualización', 'El Empleado Roberth rechazó la referencia 7', '2026-02-10 17:28:05'),
(385, 1, 'Referencias', 'Registro', 'El Empleado Roberth registro una referencia con el beneficiario Iris Alvarez (V - 12023052)', '2026-02-10 17:31:22'),
(386, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-02-10 17:31:27'),
(387, 5, 'Login', 'Inicio de sesión', 'El empleado Michelle ha iniciado sesión.', '2026-02-10 17:31:36'),
(388, 5, 'Referencias', 'Actualización', 'El Empleado Michelle rechazó la referencia 8', '2026-02-10 17:34:22'),
(389, 5, 'Login', 'Cierre de sesión', 'El empleado Michelle ha cerrado sesión.', '2026-02-10 17:37:26'),
(390, 3, 'Login', 'Inicio de sesión', 'El empleado Juan ha iniciado sesión.', '2026-02-10 17:37:37'),
(391, 3, 'Login', 'Cierre de sesión', 'El empleado Juan ha cerrado sesión.', '2026-02-10 17:38:26'),
(392, 24, 'Login', 'Inicio de sesión', 'El empleado Francisco ha iniciado sesión.', '2026-02-10 17:38:37'),
(393, 24, 'Login', 'Cierre de sesión', 'El empleado Francisco ha cerrado sesión.', '2026-02-10 17:39:07'),
(394, 3, 'Login', 'Inicio de sesión', 'El empleado Juan ha iniciado sesión.', '2026-02-10 17:49:34'),
(395, 3, 'Referencias', 'Registro', 'El Empleado Juan registro una referencia con el beneficiario Eustaquio Ramirez (V - 12023051)', '2026-02-10 17:50:07'),
(396, 3, 'Login', 'Cierre de sesión', 'El empleado Juan ha cerrado sesión.', '2026-02-10 17:50:30'),
(397, 5, 'Login', 'Inicio de sesión', 'El empleado Michelle ha iniciado sesión.', '2026-02-10 17:50:38'),
(398, 5, 'Referencias', 'Actualización', 'El Empleado Michelle aceptó la referencia 9', '2026-02-10 17:51:03'),
(399, 5, 'Login', 'Cierre de sesión', 'El empleado Michelle ha cerrado sesión.', '2026-02-10 17:51:09'),
(400, 3, 'Login', 'Inicio de sesión', 'El empleado Juan ha iniciado sesión.', '2026-02-10 17:51:17'),
(401, 3, 'Referencias', 'Registro', 'El Empleado Juan registro una referencia con el beneficiario Prueba Prueba (V - 12999292)', '2026-02-10 17:54:58'),
(402, 3, 'Login', 'Cierre de sesión', 'El empleado Juan ha cerrado sesión.', '2026-02-10 17:55:05'),
(403, 5, 'Login', 'Inicio de sesión', 'El empleado Michelle ha iniciado sesión.', '2026-02-10 17:55:22'),
(404, 5, 'Referencias', 'Actualización', 'El Empleado Michelle rechazó la referencia 10', '2026-02-10 18:01:02'),
(405, 5, 'Login', 'Cierre de sesión', 'El empleado Michelle ha cerrado sesión.', '2026-02-10 18:01:08'),
(406, 3, 'Login', 'Inicio de sesión', 'El empleado Juan ha iniciado sesión.', '2026-02-10 18:01:16'),
(407, 3, 'Referencias', 'Registro', 'El Empleado Juan registro una referencia con el beneficiario Prueba Prueba (V - 12999292)', '2026-02-10 18:26:07'),
(408, 3, 'Referencias', 'Actualización', 'El Empleado Juan aceptó la referencia 11', '2026-02-10 18:26:15');
INSERT INTO `bitacora` (`id_bitacora`, `id_empleado`, `modulo`, `accion`, `descripcion`, `fecha`) VALUES
(409, 3, 'Referencias', 'Registro', 'El Empleado Juan registro una referencia con el beneficiario Iris Alvarez (V - 12023052)', '2026-02-10 18:29:05'),
(410, 3, 'Login', 'Cierre de sesión', 'El empleado Juan ha cerrado sesión.', '2026-02-10 18:29:23'),
(411, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-02-10 18:29:31'),
(412, 1, 'Referencias', 'Actualización', 'El Empleado Roberth aceptó la referencia 12', '2026-02-10 18:29:40'),
(413, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-02-10 18:29:49'),
(414, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-02-11 18:48:54'),
(415, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-02-11 19:21:44'),
(416, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-02-12 12:59:02'),
(417, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-02-12 14:28:35'),
(418, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-02-13 16:08:29'),
(419, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-02-13 16:10:48'),
(420, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-02-14 02:06:09'),
(421, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-02-14 14:36:19'),
(422, 1, 'Jornadas', 'Registro', 'El Empleado Roberth registro una jornada médica con el nombre Operativo', '2026-02-14 15:25:00'),
(423, 1, 'Bitacora', 'Registro', 'El empleado Roberth ha iniciado sesión.', '2026-02-15 02:07:13'),
(424, 1, 'Jornadas', 'Actualización', 'El Empleado Roberth actualizó una jornada médica con el nombre Operativo dos', '2026-02-14 21:59:08'),
(425, 1, 'Jornadas', 'Actualización', 'El Empleado Roberth actualizó una jornada médica con el nombre Operativo dos', '2026-02-14 22:02:07'),
(426, 1, 'Jornadas', 'Actualización', 'El Empleado Roberth actualizó una jornada médica con el nombre Operativo dos', '2026-02-14 22:07:59'),
(427, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-02-14 23:03:14'),
(428, 1, 'Bitacora', 'Registro', 'El empleado Roberth ha iniciado sesión.', '2026-02-15 04:54:01'),
(429, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-02-14 23:54:06'),
(430, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-02-14 23:54:45'),
(431, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-02-16 01:15:55'),
(432, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-02-16 01:16:01'),
(433, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-02-16 12:55:01'),
(434, 1, 'Jornadas', 'Actualización', 'El Empleado Roberth actualizó una jornada médica con el nombre Operativo do', '2026-02-16 13:16:10'),
(435, 1, 'Bitacora', 'Registro', 'El empleado Roberth ha iniciado sesión.', '2026-02-16 18:33:57'),
(436, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-02-16 14:13:47'),
(437, 1, 'Jornadas', 'Registro', 'El Empleado Roberth agregó a Juan Torres (CI: V-12023052) a la jornada', '2026-02-16 16:10:10'),
(438, 1, 'Jornadas', 'Registro', 'El Empleado Roberth agregó a juan perez (CI: V-32022022) a la jornada', '2026-02-16 16:14:52'),
(439, 1, 'Jornadas', 'Registro', 'El Empleado Roberth agregó un diagnostico a una jornada médica', '2026-02-16 20:10:36'),
(440, 1, 'Jornadas', 'Registro', 'El Empleado Roberth agregó un diagnostico a una jornada médica', '2026-02-16 20:52:24'),
(441, 1, 'Jornadas', 'Registro', 'El Empleado Roberth agregó a esteban perez (CI: V-3200223) a la jornada', '2026-02-16 21:02:18'),
(442, 1, 'Jornadas', 'Registro', 'El Empleado Roberth agregó un diagnostico a una jornada médica', '2026-02-16 21:02:33'),
(443, 1, 'Jornadas', 'Registro', 'El Empleado Roberth agregó a Fernando Alvarado (CI: V-12023052) a la jornada', '2026-02-16 22:45:59'),
(444, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-02-16 22:53:23'),
(445, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-02-17 18:13:33'),
(446, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-02-18 00:18:37'),
(447, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-02-18 02:54:11'),
(448, 5, 'Login', 'Inicio de sesión', 'El empleado Michelle ha iniciado sesión.', '2026-02-18 02:57:44'),
(449, 5, 'Medicina', 'Registro', 'El Empleado Michelle registro un diagnóstico médico con el beneficiario Iris Alvarez (V - 12023052)', '2026-02-18 02:58:22'),
(450, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-02-18 03:06:58'),
(451, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-02-18 03:12:48'),
(452, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-02-18 03:14:02'),
(453, 3, 'Login', 'Inicio de sesión', 'El empleado Juan ha iniciado sesión.', '2026-02-18 03:14:18'),
(454, 5, 'Login', 'Cierre de sesión', 'El empleado Michelle ha cerrado sesión.', '2026-02-18 03:16:45'),
(455, 3, 'Login', 'Cierre de sesión', 'El empleado Juan ha cerrado sesión.', '2026-02-18 03:19:18'),
(456, 6, 'Login', 'Inicio de sesión', 'El empleado Daniel ha iniciado sesión.', '2026-02-18 03:19:29'),
(457, 6, 'Trabajador Social', 'Registro', 'El Empleado Daniel registro una exoneracion para el beneficiario Iris Alvarez (V - 12023052)', '2026-02-18 03:25:28'),
(458, 6, 'Login', 'Cierre de sesión', 'El empleado Daniel ha cerrado sesión.', '2026-02-18 03:49:08'),
(459, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-02-18 03:49:19'),
(460, 5, 'Login', 'Inicio de sesión', 'El empleado Michelle ha iniciado sesión.', '2026-02-18 03:58:47'),
(461, 5, 'Login', 'Cierre de sesión', 'El empleado Michelle ha cerrado sesión.', '2026-02-18 04:01:05'),
(462, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-02-18 04:09:06'),
(463, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-02-18 14:22:24'),
(464, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-02-18 14:44:09'),
(465, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-02-19 00:57:40'),
(466, 1, 'Citas', 'Registro', 'El Administrador Roberth registro una cita al empleado: Juan Hernandez con el beneficiario: Iris Alvarez (V - 12023052)', '2026-02-19 01:01:01'),
(467, 1, 'Trabajador Social', 'Registro', 'El Empleado Roberth registro una exoneracion para el beneficiario Iris Alvarez (V - 12023052)', '2026-02-19 01:02:00'),
(468, 5, 'Login', 'Inicio de sesión', 'El empleado Michelle ha iniciado sesión.', '2026-02-19 01:08:45'),
(469, 5, 'Medicina', 'Registro', 'El Empleado Michelle registro un diagnóstico médico con el beneficiario Iris Alvarez (V - 12023052)', '2026-02-19 01:10:47'),
(470, 5, 'Login', 'Cierre de sesión', 'El empleado Michelle ha cerrado sesión.', '2026-02-19 01:17:57'),
(471, 5, 'Login', 'Inicio de sesión', 'El empleado Michelle ha iniciado sesión.', '2026-02-19 01:30:32'),
(472, 1, 'Bitacora', 'Registro', 'El empleado Roberth ha iniciado sesión.', '2026-02-19 06:38:28'),
(473, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-02-19 01:50:05'),
(474, 5, 'Login', 'Cierre de sesión', 'El empleado Michelle ha cerrado sesión.', '2026-02-19 01:50:25'),
(475, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-02-19 02:08:22'),
(476, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-02-19 14:19:42'),
(477, 1, 'Jornadas', 'Actualización', 'El Empleado Roberth actualizó un diagnóstico de jornada', '2026-02-19 14:43:14'),
(478, 1, 'Jornadas', 'Actualización', 'El Empleado Roberth actualizó un diagnóstico de jornada', '2026-02-19 14:44:05'),
(479, 1, 'Bitacora', 'Registro', 'El empleado Roberth ha iniciado sesión.', '2026-02-19 21:19:42'),
(480, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-02-19 18:35:59'),
(481, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-02-20 13:20:36'),
(482, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-02-20 17:20:12'),
(483, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-02-21 20:45:58'),
(484, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-02-21 23:01:22'),
(485, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-02-24 12:57:04'),
(486, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-02-24 21:02:23'),
(487, 1, 'Mobiliario', 'Registro', 'El empleado Roberth registró 1 items de mobiliario', '2026-02-24 21:30:03'),
(488, 1, 'Mobiliario', 'Registro', 'El empleado Roberth registró 2 items de mobiliario', '2026-02-24 21:50:39'),
(489, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-02-24 23:56:14'),
(490, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-02-25 13:24:29'),
(491, 1, 'Mobiliario', 'Registro', 'El empleado Roberth registró 1 items de equipos', '2026-02-25 15:15:59'),
(492, 1, 'Mobiliario', 'Registro', 'El empleado Roberth registró 2 items de equipos', '2026-02-25 15:58:21'),
(493, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-02-25 16:34:17'),
(494, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-02-26 14:48:16'),
(495, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-02-26 17:27:21'),
(496, 1, 'Login', 'Inicio de sesión', 'El empleado Roberth ha iniciado sesión.', '2026-02-26 22:39:53'),
(497, 1, 'Login', 'Cierre de sesión', 'El empleado Roberth ha cerrado sesión.', '2026-02-26 23:02:59');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empleado`
--

CREATE TABLE `empleado` (
  `id_empleado` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) DEFAULT NULL,
  `tipo_cedula` varchar(1) DEFAULT NULL,
  `cedula` varchar(10) DEFAULT NULL,
  `correo` varchar(50) DEFAULT NULL,
  `telefono` varchar(12) DEFAULT NULL,
  `id_tipo_empleado` int(1) NOT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `direccion` mediumtext DEFAULT NULL,
  `clave` varchar(65) DEFAULT NULL,
  `estatus` tinyint(1) DEFAULT NULL,
  `fecha_creacion` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `empleado`
--

INSERT INTO `empleado` (`id_empleado`, `nombre`, `apellido`, `tipo_cedula`, `cedula`, `correo`, `telefono`, `id_tipo_empleado`, `fecha_nacimiento`, `direccion`, `clave`, `estatus`, `fecha_creacion`) VALUES
(1, 'Roberth', 'Matos', 'V', '28281433', 'admin@gmail.com', '04129298008', 6, '2002-04-05', 'Calle 53 y 54 con avenida 13', '$2y$10$I7kpYQ.Cju5KWqNkz.VdQ.Pg3PXIKmG./kuCiqMv78c516KPUd7Lq', 1, '2025-04-17'),
(2, 'Roberth', 'Matos', 'V', '00000000', 'superusuario@gmail.com', '04120000000', 10, '2000-01-01', 'Barquisimeto', '$2y$10$tGVkt2cNpsT6TzaoKeFQWOlI72P/EjuFWHc3bvWUNtUbdKi2etQKK', 1, '2025-11-11'),
(3, 'Juan', 'Hernandez', 'V', '10999854', 'psicologo@gmail.com', '04161233211', 1, '1994-12-12', 'Barquisimeto', '$2y$10$0WPRA3Y2y.J7OeRAyjrSf.DJwDxo89bkJ21W13svn4FrBxt1ZtkJe', 1, '2025-11-12'),
(4, 'Fernando', 'Batipsta', 'V', '9625664', 'chofer@gmail.com', '04169421243', 8, '1990-08-05', 'Calle 10 de pueblo nuevo', '$2y$10$ef0sexMYOmmRFhu0I0382.p60XRMargX3ggkdH1l179D9HgIkzDtG', 1, '2025-11-13'),
(5, 'Michelle', 'Sánchez', 'V', '9654655', 'medicina@gmail.com', '04141233215', 2, '2004-07-18', 'Av. Carabobo, barquisimeto', '$2y$10$CurHsm.5B.ANIAaYZ9cfhuptVlI41EUJJZb0PO9nt1nEjiex0mzdi', 1, '2025-11-15'),
(6, 'Daniel', 'Zabala', 'V', '12335445', 'trabajadorsocial@gmail.com', '04261234443', 3, '2000-01-12', 'calle 1 barquisimeto', '$2y$10$87sRL2TdIOWJFiRcw0k36OnW2BBidkz2XELskxB8lsObSLPZ4DN42', 1, '2025-11-15'),
(7, 'Victor', 'Reyes', 'V', '6545885', 'orientador@gmail.com', '04244993431', 4, '2000-01-01', 'Calle 2 de pueblo nuevo', '$2y$10$6rEs0Ie8GIe2pv.RKXAFyuykXAuMwLikoYZImp3IceOlCBx6ZM.Fi', 1, '2025-11-15'),
(8, 'Alejandra', 'Andara', 'V', '15442225', 'discapacidad@gmail.com', '04160002155', 5, '2002-02-02', 'Calle 55 con carrera 14', '$2y$10$zSqXRFp9l1wVUkLXYh/O.O94fiE98cxprc1zrHPODyrm0Y9.HBb0W', 1, '2025-11-15'),
(9, 'Empleado', 'Prueba', 'E', '90854856', 'empleado@gmail.com', '04169994433', 11, '2000-01-01', 'Calle 10 de pueblo nuevo', '$2y$10$T4.UVJCxh3DNxI0pJoB/juf9JqDnOb1ZfSlZUj0ihJ4BJ/7kwqh/q', 1, '2025-12-07'),
(10, 'Gustavo', 'Suarez', 'V', '12935654', 'gustavo@gmail.com', '04264342222', 11, '2000-01-01', 'Calle 1', '$2y$10$gKK/WsfwOHSdFm155jZc3unpdvaK/0HTXJVLjFyDMJ8c58AasmBWS', 1, '2025-12-07'),
(11, 'Ricardo', 'Torrealba', 'V', '32445998', 'torrealba@gmail.es', '04262134888', 5, '2000-12-12', 'Calle 1', '$2y$10$fjx0NpjMuNVGkx31Rt0wEOW9xQmlkE46ZQlnxMGgmmVPYKgCVTBj.', 1, '2025-12-08'),
(12, 'Juan', 'Torrealba', 'V', '35445666', 'juan@gmail.com', '04169943888', 4, '2000-12-12', 'Calle 1', '$2y$10$MKvMGrSGTBmON7vadUcvRenlChu0GKLThsrVWGyCH1W06kw8jlF3K', 1, '2025-12-08'),
(13, 'Mariaalejandra', 'Tovar', 'V', '23495999', 'alejandra@gmail.com', '04169948378', 3, '2000-12-12', 'Calle', '$2y$10$tZgyaI00qw988gjXaQwPTe8c7nkMK5PSwZXmWaM8ZbfO9rwT6fyAW', 1, '2025-12-08'),
(14, 'Rafael', 'Caldera', 'E', '80441225', 'caldera@gmail.com', '04169293842', 4, '2000-12-12', 'Calle 1', '$2y$10$6qva/2HoSqIg7c/n1OzBbu1iJkAAr3TrSHOQcMWeIZBc4bX7i6jfC', 1, '2025-12-08'),
(15, 'Juan', 'Ramirez', 'V', '1244555', 'ramirez@gmail.com', '04169239282', 4, '2000-12-12', 'Calle 10', '$2y$10$qkQh7Z8ytKFAbSdRE/ipWOTVxviSDu9VYRjMkFelVoxolxAXpdCN2', 1, '2025-12-08'),
(16, 'Alberto', 'Hernandez', 'V', '25544455', 'alberto@gmail.com', '04169292444', 4, '2001-12-12', 'Calle 10 de pueblo nuevo', '$2y$10$l5T/xBhyBPzSvlArVq.vzO8zsJBUDosQskDUb2mnz68V20VX1wRIu', 1, '2025-12-08'),
(17, 'Jesus', 'Torres', 'V', '19113555', 'jesus@gmail.es', '04169422233', 4, '2000-04-01', 'Calle 1', '$2y$10$Wcx5fAvGGIj07FsiveRM2eOEcrgou8Tmwyte.dXUZAB3Y84b488Hi', 1, '2025-12-08'),
(18, 'Daniela', 'Zabala', 'V', '21412555', 'danielzab@gmail.com', '04169239247', 11, '2000-05-08', 'Calle 10', '$2y$10$iIkI7WwJ0rl3sKGbjeuPGuA7Rmx4KrpbOowE/lhI4fQ4wOmhf00F6', 1, '2025-12-08'),
(19, 'Jose', 'Rodriguez', 'V', '12344399', 'jose@gmail.com', '04169239213', 5, '2000-12-12', 'Calle 10', '$2y$10$OrFvSRta0fRqmxyqU97/iOddBH73anbYeSvwzQHd6/Jd.DsYGpZi.', 1, '2025-12-08'),
(20, 'Empleado', 'Prueba', 'V', '34445445', 'prueba@gmail.com', '04169290912', 5, '2000-12-12', 'Calle 10', '$2y$10$V60jJVv4VuqDBy9RwFiKTuZqMwqS2O0J3E8763kQnf6GTw7xB5nmW', 1, '2025-12-09'),
(21, 'Prueba', 'Prueba', 'V', '45745141', 'pruebas@gmail.com', '04141232412', 5, '2000-12-12', 'Calle', '$2y$10$uzyTGkIPUsUlxlEJHZBcJOtDdt0O2LIqxtXFppQdEJAoNNK3P8RMC', 1, '2025-12-09'),
(24, 'Francisco', 'Perez', 'V', '30991992', 'psicologo_2@gmail.com', '04169998811', 1, '1994-01-01', 'Barquisimeto', '$2y$10$.6UvSI5s/8kmRw8eKv7QNeEQ7nX.ZlGB.paOHWOmcJX2no.i2alz2', 1, '2025-12-14');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `modulo`
--

CREATE TABLE `modulo` (
  `id_modulo` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `modulo`
--

INSERT INTO `modulo` (`id_modulo`, `nombre`, `descripcion`) VALUES
(1, 'Empleados', 'Gestionar Empleados'),
(2, 'Beneficiarios', 'Gestionar Beneficiarios'),
(3, 'Citas', 'Gestionar Citas'),
(4, 'Psicologia', 'Diagnosticos de Psicologia'),
(5, 'Medicina', 'Diagnosticos de Medicina'),
(6, 'Orientacion', 'Diagnosticos de Orientacion'),
(7, 'Trabajador Social', 'Diagnosticos de Trabajador Social'),
(8, 'Discapacidad', 'Diagnosticos de Discapacidad'),
(9, 'Inventario Medico', 'Gestionar Inventario Medico'),
(10, 'Referencias', 'Gestionar Referencias'),
(11, 'Jornadas', 'Gestionar Jornadas'),
(12, 'Mobiliario', 'Gestionar Mobiliario'),
(13, 'Transporte', 'Gestionar Transporte'),
(14, 'Configuracion', 'Gestionar Configuracion'),
(15, 'Reportes', 'Gestionar Reportes'),
(16, 'Bitacora', 'Gestionar Bitacora'),
(17, 'Permisos', 'Gestionar Permisos de Usuario'),
(18, 'Horarios', 'Gestionar Horarios para empleados de Psicología');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificaciones`
--

CREATE TABLE `notificaciones` (
  `id_notificaciones` int(11) NOT NULL,
  `titulo` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `tipo` varchar(50) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `notificaciones`
--

INSERT INTO `notificaciones` (`id_notificaciones`, `titulo`, `url`, `tipo`, `fecha_creacion`) VALUES
(1, 'Registro de diagnóstico', 'consultar_medicina', 'diagnostico', '2026-01-07 14:13:30'),
(2, 'Actualización de diagnóstico', 'consultar_medicina', 'diagnostico', '2026-01-07 14:46:30'),
(3, 'Actualización de diagnóstico', 'consultar_medicina', 'diagnostico', '2026-01-07 14:50:57'),
(4, 'Eliminación de diagnóstico', 'consultar_medicina', 'diagnostico', '2026-01-07 16:21:55'),
(5, 'Eliminación de diagnóstico', 'consultar_medicina', 'diagnostico', '2026-01-07 16:22:25'),
(6, 'Registro de diagnóstico', 'consultar_orientacion', 'diagnostico', '2026-01-09 01:17:58'),
(7, 'Registro de diagnóstico', 'diagnostico_orientacion_consultar', 'diagnostico', '2026-01-09 16:24:31'),
(8, 'Actualización de diagnóstico', 'diagnostico_orientacion_consultar', 'diagnostico', '2026-01-09 17:59:10'),
(9, 'Actualización de diagnóstico', 'diagnostico_orientacion_consultar', 'diagnostico', '2026-01-09 19:06:08'),
(10, 'Eliminación de diagnóstico', 'diagnostico_orientacion_consultar', 'diagnostico', '2026-01-09 19:29:54'),
(11, 'Actualización de diagnóstico', 'diagnostico_orientacion_consultar', 'diagnostico', '2026-01-10 22:50:39'),
(12, 'Registro de beca', 'consultar_ts', 'diagnostico', '2026-01-15 17:55:38'),
(13, 'Registro de beca', 'consultar_ts', 'diagnostico', '2026-01-15 17:59:58'),
(14, 'Registro de exoneracion', 'consultar_ts', 'diagnostico', '2026-01-15 19:59:03'),
(15, 'Registro de exoneracion', 'consultar_ts', 'diagnostico', '2026-01-15 20:00:25'),
(16, 'Registro de fames', 'consultar_ts', 'diagnostico', '2026-01-16 01:48:19'),
(17, 'Registro de fames', 'consultar_ts', 'diagnostico', '2026-01-16 01:49:38'),
(18, 'Registro de embarazada', 'consultar_ts', 'diagnostico', '2026-01-16 15:36:50'),
(19, 'Registro de exoneracion', 'consultar_ts', 'diagnostico', '2026-01-16 16:38:16'),
(20, 'Actualización de beca', 'trabajo_social_consultar', 'diagnostico', '2026-01-18 18:36:54'),
(21, 'Actualización de beca', 'trabajo_social_consultar', 'diagnostico', '2026-01-18 18:37:48'),
(22, 'Actualización de beca', 'trabajo_social_consultar', 'diagnostico', '2026-01-18 18:37:56'),
(23, 'Eliminación de beca', 'trabajo_social_consultar', 'diagnostico', '2026-01-18 19:42:12'),
(24, 'Actualización de beca', 'trabajo_social_consultar', 'diagnostico', '2026-01-19 00:12:52'),
(25, 'Actualización de exoneración', 'trabajo_social_consultar', 'diagnostico', '2026-01-19 18:16:23'),
(26, 'Eliminación de exoneración', 'trabajo_social_consultar', 'diagnostico', '2026-01-19 18:33:48'),
(27, 'Actualización de exoneración', 'trabajo_social_consultar', 'diagnostico', '2026-01-20 12:59:47'),
(28, 'Actualización de exoneración', 'trabajo_social_consultar', 'diagnostico', '2026-01-20 12:59:47'),
(29, 'Actualización de fames', 'trabajo_social_consultar', 'diagnostico', '2026-01-20 23:48:04'),
(30, 'Actualización de fames', 'trabajo_social_consultar', 'diagnostico', '2026-01-20 23:49:26'),
(31, 'Actualización de fames', 'trabajo_social_consultar', 'diagnostico', '2026-01-20 23:52:04'),
(32, 'Eliminación de fames', 'trabajo_social_consultar', 'diagnostico', '2026-01-21 00:03:09'),
(33, 'Eliminación de fames', 'trabajo_social_consultar', 'diagnostico', '2026-01-21 03:10:46'),
(34, 'Registro de embarazada', 'consultar_ts', 'diagnostico', '2026-01-21 03:13:22'),
(35, 'Registro de beca', 'consultar_ts', 'diagnostico', '2026-01-21 13:04:48'),
(36, 'Actualización de embarazadas', 'trabajo_social_consultar', 'diagnostico', '2026-01-21 14:59:57'),
(37, 'Actualización de embarazadas', 'trabajo_social_consultar', 'diagnostico', '2026-01-21 15:14:44'),
(38, 'Actualización de embarazadas', 'trabajo_social_consultar', 'diagnostico', '2026-01-21 15:18:44'),
(39, 'Actualización de embarazadas', 'trabajo_social_consultar', 'diagnostico', '2026-01-21 15:18:58'),
(40, 'Actualización de embarazadas', 'trabajo_social_consultar', 'diagnostico', '2026-01-21 15:21:14'),
(41, 'Actualización de embarazadas', 'trabajo_social_consultar', 'diagnostico', '2026-01-21 15:21:20'),
(42, 'Actualización de embarazadas', 'trabajo_social_consultar', 'diagnostico', '2026-01-21 15:29:02'),
(43, 'Actualización de embarazadas', 'trabajo_social_consultar', 'diagnostico', '2026-01-21 15:29:25'),
(44, 'Actualización de embarazadas', 'trabajo_social_consultar', 'diagnostico', '2026-01-21 15:29:30'),
(45, 'Actualización de embarazadas', 'trabajo_social_consultar', 'diagnostico', '2026-01-21 15:36:39'),
(46, 'Actualización de embarazadas', 'trabajo_social_consultar', 'diagnostico', '2026-01-21 15:36:39'),
(47, 'Actualización de embarazadas', 'trabajo_social_consultar', 'diagnostico', '2026-01-21 15:42:31'),
(48, 'Registro de diagnóstico', 'diagnostico_discapacidad_consultar', 'diagnostico', '2026-01-22 14:36:03'),
(49, 'Actualización de diagnóstico', 'diagnostico_discapacidad_consultar', 'diagnostico', '2026-01-22 19:24:34'),
(50, 'Eliminación de diagnóstico', 'diagnostico_discapacidad_consultar', 'diagnostico', '2026-01-22 19:34:05'),
(51, 'Eliminación de beca', 'trabajo_social_consultar', 'diagnostico', '2026-01-22 19:46:29'),
(52, 'Eliminación de embarazadas', 'trabajo_social_consultar', 'diagnostico', '2026-01-22 19:54:54'),
(53, 'Eliminación de cita', 'consultar_citas', 'cita', '2026-01-22 20:49:16'),
(54, 'Registro de cita', 'consultar_citas', 'cita', '2026-01-22 21:15:20'),
(55, 'Actualización de empleado', 'consultar_empleados', 'empleado', '2026-01-22 21:20:34'),
(56, 'Registro de insumo', 'consultar_inventario_medico', 'inventario', '2026-01-22 21:27:32'),
(57, 'Registro de diagnóstico', 'consultar_citas', 'diagnostico', '2026-01-22 21:44:39'),
(58, 'Registro de diagnóstico', 'consultar_medicina', 'diagnostico', '2026-01-22 21:45:13'),
(59, 'Registro de diagnóstico', 'diagnostico_orientacion_consultar', 'diagnostico', '2026-01-22 21:45:30'),
(60, 'Registro de exoneracion', 'consultar_ts', 'diagnostico', '2026-01-22 21:45:46'),
(61, 'Registro de diagnóstico', 'diagnostico_discapacidad_consultar', 'diagnostico', '2026-01-22 21:46:23'),
(62, 'Registro de beca', 'consultar_ts', 'diagnostico', '2026-01-22 22:20:34'),
(63, 'Registro de fames', 'consultar_ts', 'diagnostico', '2026-01-22 22:20:42'),
(64, 'Registro de cambio de carrera', 'consultar_citas', 'diagnostico', '2026-01-23 16:29:51'),
(65, 'Registro de diagnóstico', 'consultar_citas', 'diagnostico', '2026-01-23 16:30:44'),
(66, 'Registro de diagnóstico', 'consultar_medicina', 'diagnostico', '2026-01-23 17:49:39'),
(67, 'Registro de entrada', 'consultar_inventario_medico', 'sistema', '2026-01-23 17:50:04'),
(68, 'Registro de diagnóstico', 'diagnostico_orientacion_consultar', 'diagnostico', '2026-01-26 17:34:12'),
(69, 'Registro de beca', 'consultar_ts', 'diagnostico', '2026-01-26 17:53:46'),
(70, 'Registro de fames', 'consultar_ts', 'diagnostico', '2026-01-26 17:53:57'),
(71, 'Registro de embarazada', 'consultar_ts', 'diagnostico', '2026-01-26 17:54:37'),
(72, 'Registro de diagnóstico', 'diagnostico_discapacidad_consultar', 'diagnostico', '2026-01-26 18:04:59'),
(73, 'Registro de insumo', 'consultar_inventario_medico', 'inventario', '2026-01-27 14:51:04'),
(74, 'Actualización de insumo', 'consultar_inventario_medico', 'inventario', '2026-01-27 17:36:41'),
(75, 'Actualización de insumo', 'consultar_inventario_medico', 'inventario', '2026-01-27 17:36:52'),
(76, 'Eliminación de insumo', 'consultar_inventario_medico', 'inventario', '2026-01-27 17:50:43'),
(77, 'Nueva referencia', 'consultar_referencias', 'referencia', '2026-02-09 16:05:48'),
(78, 'Nueva referencia', 'consultar_referencias', 'referencia', '2026-02-09 16:07:20'),
(79, 'Nueva referencia', 'consultar_referencias', 'referencia', '2026-02-10 17:19:55'),
(80, 'Nueva referencia', 'consultar_referencias', 'referencia', '2026-02-10 17:24:35'),
(81, 'Nueva referencia', 'consultar_referencias', 'referencia', '2026-02-10 17:27:44'),
(82, 'Nueva referencia', 'consultar_referencias', 'referencia', '2026-02-10 17:31:22'),
(83, 'Nueva referencia', 'consultar_referencias', 'referencia', '2026-02-10 17:50:07'),
(85, 'Nueva referencia', 'consultar_referencias', 'referencia', '2026-02-10 17:54:58'),
(86, 'Nueva referencia', 'consultar_referencias', 'referencia', '2026-02-10 18:01:02'),
(87, 'Nueva referencia', 'consultar_referencias', 'referencia', '2026-02-10 18:26:07'),
(89, 'Nueva referencia', 'consultar_referencias', 'referencia', '2026-02-10 18:29:05'),
(91, 'Registro de jornada', 'consultar_jornadas', 'jornada', '2026-02-14 15:25:00'),
(92, 'Actualización de jornada', 'consultar_jornadas', 'jornada', '2026-02-14 21:59:08'),
(93, 'Actualización de jornada', 'consultar_jornadas', 'jornada', '2026-02-14 22:02:07'),
(94, 'Actualización de jornada', 'consultar_jornadas', 'jornada', '2026-02-14 22:07:59'),
(95, 'Actualización de jornada', 'consultar_jornadas', 'jornada', '2026-02-16 13:16:10'),
(96, 'Registro de diagnóstico', 'consultar_medicina', 'diagnostico', '2026-02-18 02:58:22'),
(97, 'Registro de exoneracion', 'consultar_ts', 'diagnostico', '2026-02-18 03:25:28'),
(98, 'Registro de cita', 'consultar_citas', 'cita', '2026-02-19 01:01:01'),
(99, 'Registro de exoneracion', 'consultar_ts', 'diagnostico', '2026-02-19 01:02:00'),
(100, 'Registro de diagnóstico', 'consultar_medicina', 'diagnostico', '2026-02-19 01:10:47');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificaciones_empleados`
--

CREATE TABLE `notificaciones_empleados` (
  `id_notificaciones_empleados` int(11) NOT NULL,
  `id_notificaciones` int(11) NOT NULL,
  `id_emisor` int(11) NOT NULL,
  `id_receptor` int(11) NOT NULL,
  `leido` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `notificaciones_empleados`
--

INSERT INTO `notificaciones_empleados` (`id_notificaciones_empleados`, `id_notificaciones`, `id_emisor`, `id_receptor`, `leido`) VALUES
(77, 77, 3, 5, 1),
(78, 78, 3, 5, 1),
(79, 79, 24, 14, 0),
(80, 80, 17, 5, 1),
(81, 81, 15, 6, 0),
(82, 82, 24, 5, 1),
(83, 83, 3, 5, 1),
(85, 85, 3, 5, 1),
(86, 86, 5, 3, 1),
(87, 87, 3, 5, 1),
(88, 89, 3, 19, 0),
(89, 91, 1, 1, 1),
(90, 92, 1, 1, 1),
(92, 94, 1, 1, 1),
(93, 95, 1, 1, 1),
(94, 96, 5, 1, 1),
(95, 97, 6, 1, 1),
(96, 98, 1, 1, 1),
(97, 99, 1, 1, 1),
(98, 100, 5, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permiso`
--

CREATE TABLE `permiso` (
  `id_permiso` int(11) NOT NULL,
  `clave` varchar(20) NOT NULL,
  `descripcion` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `permiso`
--

INSERT INTO `permiso` (`id_permiso`, `clave`, `descripcion`) VALUES
(1, 'Crear', 'Crear registros'),
(2, 'Leer', 'Leer registros'),
(3, 'Editar', 'Editar registros'),
(4, 'Eliminar', 'Eliminar registros');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol_modulo_permiso`
--

CREATE TABLE `rol_modulo_permiso` (
  `id_rmp` int(11) NOT NULL,
  `id_tipo_emp` int(11) NOT NULL,
  `id_modulo` int(11) NOT NULL,
  `id_permiso` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `rol_modulo_permiso`
--

INSERT INTO `rol_modulo_permiso` (`id_rmp`, `id_tipo_emp`, `id_modulo`, `id_permiso`) VALUES
(1, 6, 1, 1),
(2, 6, 1, 2),
(3, 6, 1, 3),
(4, 6, 1, 4),
(5, 6, 2, 1),
(6, 6, 2, 2),
(7, 6, 2, 3),
(8, 6, 2, 4),
(9, 6, 3, 1),
(10, 6, 3, 2),
(11, 6, 3, 3),
(12, 6, 3, 4),
(13, 6, 4, 1),
(14, 6, 4, 2),
(15, 6, 4, 3),
(16, 6, 4, 4),
(17, 6, 5, 1),
(18, 6, 5, 2),
(19, 6, 5, 3),
(20, 6, 5, 4),
(21, 6, 6, 1),
(22, 6, 6, 2),
(23, 6, 6, 3),
(24, 6, 6, 4),
(25, 6, 7, 1),
(26, 6, 7, 2),
(27, 6, 7, 3),
(28, 6, 7, 4),
(29, 6, 8, 1),
(30, 6, 8, 2),
(31, 6, 8, 3),
(32, 6, 8, 4),
(33, 6, 9, 1),
(34, 6, 9, 2),
(35, 6, 9, 3),
(36, 6, 9, 4),
(37, 6, 10, 1),
(38, 6, 10, 2),
(39, 6, 10, 3),
(40, 6, 10, 4),
(41, 6, 11, 1),
(42, 6, 11, 2),
(43, 6, 11, 3),
(44, 6, 11, 4),
(45, 6, 12, 1),
(46, 6, 12, 2),
(47, 6, 12, 3),
(48, 6, 12, 4),
(49, 6, 13, 1),
(50, 6, 13, 2),
(51, 6, 13, 3),
(52, 6, 13, 4),
(57, 6, 15, 1),
(58, 6, 15, 2),
(59, 6, 15, 3),
(60, 6, 15, 4),
(61, 6, 16, 1),
(62, 6, 16, 2),
(63, 6, 16, 3),
(64, 6, 16, 4),
(65, 6, 17, 1),
(66, 6, 17, 2),
(67, 6, 17, 3),
(68, 6, 17, 4),
(69, 10, 1, 1),
(70, 10, 1, 2),
(71, 10, 1, 3),
(72, 10, 1, 4),
(73, 10, 2, 1),
(74, 10, 2, 2),
(75, 10, 2, 3),
(76, 10, 2, 4),
(77, 10, 3, 1),
(78, 10, 3, 2),
(79, 10, 3, 3),
(80, 10, 3, 4),
(81, 10, 4, 1),
(82, 10, 4, 2),
(83, 10, 4, 3),
(84, 10, 4, 4),
(85, 10, 5, 1),
(86, 10, 5, 2),
(87, 10, 5, 3),
(88, 10, 5, 4),
(89, 10, 6, 1),
(90, 10, 6, 2),
(91, 10, 6, 3),
(92, 10, 6, 4),
(93, 10, 7, 1),
(94, 10, 7, 2),
(95, 10, 7, 3),
(96, 10, 7, 4),
(97, 10, 8, 1),
(98, 10, 8, 2),
(99, 10, 8, 3),
(100, 10, 8, 4),
(101, 10, 9, 1),
(102, 10, 9, 2),
(103, 10, 9, 3),
(104, 10, 9, 4),
(105, 10, 10, 1),
(106, 10, 10, 2),
(107, 10, 10, 3),
(108, 10, 10, 4),
(109, 10, 11, 1),
(110, 10, 11, 2),
(111, 10, 11, 3),
(112, 10, 11, 4),
(113, 10, 12, 1),
(114, 10, 12, 2),
(115, 10, 12, 3),
(116, 10, 12, 4),
(117, 10, 13, 1),
(118, 10, 13, 2),
(119, 10, 13, 3),
(120, 10, 13, 4),
(121, 10, 14, 1),
(122, 10, 14, 2),
(123, 10, 14, 3),
(124, 10, 14, 4),
(125, 10, 15, 1),
(126, 10, 15, 2),
(127, 10, 15, 3),
(128, 10, 15, 4),
(129, 10, 16, 1),
(130, 10, 16, 2),
(131, 10, 16, 3),
(132, 10, 16, 4),
(133, 10, 17, 1),
(134, 10, 17, 2),
(135, 10, 17, 3),
(136, 10, 17, 4),
(137, 1, 2, 1),
(138, 1, 2, 2),
(139, 1, 2, 3),
(140, 1, 2, 4),
(141, 1, 3, 1),
(142, 1, 3, 2),
(143, 1, 3, 3),
(144, 1, 3, 4),
(145, 1, 4, 1),
(146, 1, 4, 2),
(147, 1, 4, 3),
(148, 1, 4, 4),
(149, 1, 10, 1),
(150, 1, 10, 2),
(151, 1, 10, 3),
(152, 1, 10, 4),
(153, 1, 15, 1),
(154, 1, 15, 2),
(155, 1, 15, 3),
(156, 1, 15, 4),
(157, 2, 2, 1),
(158, 2, 2, 2),
(159, 2, 2, 3),
(160, 2, 2, 4),
(161, 2, 5, 1),
(162, 2, 5, 2),
(163, 2, 5, 3),
(164, 2, 5, 4),
(165, 2, 9, 1),
(166, 2, 9, 2),
(167, 2, 9, 3),
(168, 2, 9, 4),
(169, 2, 10, 1),
(170, 2, 10, 2),
(171, 2, 10, 3),
(172, 2, 10, 4),
(177, 2, 15, 1),
(178, 2, 15, 2),
(179, 2, 15, 3),
(180, 2, 15, 4),
(181, 3, 2, 1),
(182, 3, 2, 2),
(183, 3, 2, 3),
(184, 3, 2, 4),
(185, 3, 7, 1),
(186, 3, 7, 2),
(187, 3, 7, 3),
(188, 3, 7, 4),
(189, 3, 10, 1),
(190, 3, 10, 2),
(191, 3, 10, 3),
(192, 3, 10, 4),
(193, 3, 15, 1),
(194, 3, 15, 2),
(195, 3, 15, 3),
(196, 3, 15, 4),
(197, 4, 2, 1),
(198, 4, 2, 2),
(199, 4, 2, 3),
(200, 4, 2, 4),
(201, 4, 6, 1),
(202, 4, 6, 2),
(203, 4, 6, 3),
(204, 4, 6, 4),
(205, 4, 10, 1),
(206, 4, 10, 2),
(207, 4, 10, 3),
(208, 4, 10, 4),
(209, 4, 15, 1),
(210, 4, 15, 2),
(211, 4, 15, 3),
(212, 4, 15, 4),
(213, 5, 2, 1),
(214, 5, 2, 2),
(215, 5, 2, 3),
(216, 5, 2, 4),
(217, 5, 8, 1),
(218, 5, 8, 2),
(219, 5, 8, 3),
(220, 5, 8, 4),
(221, 5, 10, 1),
(222, 5, 10, 2),
(223, 5, 10, 3),
(224, 5, 10, 4),
(225, 5, 15, 1),
(226, 5, 15, 2),
(227, 5, 15, 3),
(228, 5, 15, 4),
(229, 11, 15, 1),
(230, 11, 15, 2),
(231, 11, 15, 3),
(232, 11, 15, 4),
(241, 6, 18, 1),
(242, 6, 18, 2),
(243, 6, 18, 3),
(244, 6, 18, 4),
(245, 6, 14, 1),
(246, 6, 14, 2),
(247, 6, 14, 3),
(248, 6, 14, 4),
(259, 2, 11, 1),
(260, 2, 11, 2),
(261, 2, 11, 3),
(262, 2, 11, 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_empleado`
--

CREATE TABLE `tipo_empleado` (
  `id_tipo_emp` int(11) NOT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `id_servicios` int(11) NOT NULL,
  `estatus` tinyint(1) DEFAULT NULL,
  `fecha_creacion` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `tipo_empleado`
--

INSERT INTO `tipo_empleado` (`id_tipo_emp`, `tipo`, `id_servicios`, `estatus`, `fecha_creacion`) VALUES
(1, 'Psicologo', 1, 1, '2024-11-12'),
(2, 'Medico', 2, 1, '2024-11-12'),
(3, 'Trabajador Social', 4, 1, '2024-11-12'),
(4, 'Orientador', 3, 1, '2024-11-12'),
(5, 'Discapacidad', 5, 1, '2024-11-12'),
(6, 'Administrador', 8, 1, '2024-11-12'),
(7, 'Secretaria', 6, 1, '2024-11-14'),
(8, 'Chofer', 9, 1, '2025-04-19'),
(9, 'Mecánico', 9, 1, '2025-04-19'),
(10, 'Superusuario', 8, 1, '2025-05-30'),
(11, 'Administrativo', 6, 1, '2025-06-10'),
(12, 'Enfermero', 2, 1, '2026-02-02'),
(13, 'Obreros', 6, 1, '2026-02-03');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `bitacora`
--
ALTER TABLE `bitacora`
  ADD PRIMARY KEY (`id_bitacora`),
  ADD KEY `id_empleado` (`id_empleado`);

--
-- Indices de la tabla `empleado`
--
ALTER TABLE `empleado`
  ADD PRIMARY KEY (`id_empleado`),
  ADD KEY `id_tipo_empleado` (`id_tipo_empleado`);

--
-- Indices de la tabla `modulo`
--
ALTER TABLE `modulo`
  ADD PRIMARY KEY (`id_modulo`);

--
-- Indices de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD PRIMARY KEY (`id_notificaciones`);

--
-- Indices de la tabla `notificaciones_empleados`
--
ALTER TABLE `notificaciones_empleados`
  ADD PRIMARY KEY (`id_notificaciones_empleados`),
  ADD KEY `id_notificaciones` (`id_notificaciones`),
  ADD KEY `id_emisor` (`id_emisor`),
  ADD KEY `id_receptor` (`id_receptor`);

--
-- Indices de la tabla `permiso`
--
ALTER TABLE `permiso`
  ADD PRIMARY KEY (`id_permiso`);

--
-- Indices de la tabla `rol_modulo_permiso`
--
ALTER TABLE `rol_modulo_permiso`
  ADD PRIMARY KEY (`id_rmp`),
  ADD KEY `id_tipo_emp` (`id_tipo_emp`),
  ADD KEY `id_modulo` (`id_modulo`),
  ADD KEY `id_permiso` (`id_permiso`);

--
-- Indices de la tabla `tipo_empleado`
--
ALTER TABLE `tipo_empleado`
  ADD PRIMARY KEY (`id_tipo_emp`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `bitacora`
--
ALTER TABLE `bitacora`
  MODIFY `id_bitacora` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=498;

--
-- AUTO_INCREMENT de la tabla `empleado`
--
ALTER TABLE `empleado`
  MODIFY `id_empleado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `modulo`
--
ALTER TABLE `modulo`
  MODIFY `id_modulo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `id_notificaciones` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT de la tabla `notificaciones_empleados`
--
ALTER TABLE `notificaciones_empleados`
  MODIFY `id_notificaciones_empleados` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=99;

--
-- AUTO_INCREMENT de la tabla `permiso`
--
ALTER TABLE `permiso`
  MODIFY `id_permiso` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `rol_modulo_permiso`
--
ALTER TABLE `rol_modulo_permiso`
  MODIFY `id_rmp` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=263;

--
-- AUTO_INCREMENT de la tabla `tipo_empleado`
--
ALTER TABLE `tipo_empleado`
  MODIFY `id_tipo_emp` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `bitacora`
--
ALTER TABLE `bitacora`
  ADD CONSTRAINT `bitacora_ibfk_1` FOREIGN KEY (`id_empleado`) REFERENCES `empleado` (`id_empleado`);

--
-- Filtros para la tabla `empleado`
--
ALTER TABLE `empleado`
  ADD CONSTRAINT `empleado_ibfk_1` FOREIGN KEY (`id_tipo_empleado`) REFERENCES `tipo_empleado` (`id_tipo_emp`);

--
-- Filtros para la tabla `notificaciones_empleados`
--
ALTER TABLE `notificaciones_empleados`
  ADD CONSTRAINT `notificaciones_empleados_ibfk_1` FOREIGN KEY (`id_notificaciones`) REFERENCES `notificaciones` (`id_notificaciones`),
  ADD CONSTRAINT `notificaciones_empleados_ibfk_2` FOREIGN KEY (`id_emisor`) REFERENCES `empleado` (`id_empleado`),
  ADD CONSTRAINT `notificaciones_empleados_ibfk_3` FOREIGN KEY (`id_receptor`) REFERENCES `empleado` (`id_empleado`);

--
-- Filtros para la tabla `rol_modulo_permiso`
--
ALTER TABLE `rol_modulo_permiso`
  ADD CONSTRAINT `rol_modulo_permiso_ibfk_1` FOREIGN KEY (`id_modulo`) REFERENCES `modulo` (`id_modulo`),
  ADD CONSTRAINT `rol_modulo_permiso_ibfk_2` FOREIGN KEY (`id_permiso`) REFERENCES `permiso` (`id_permiso`),
  ADD CONSTRAINT `rol_modulo_permiso_ibfk_3` FOREIGN KEY (`id_tipo_emp`) REFERENCES `tipo_empleado` (`id_tipo_emp`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
