<?php
session_start();
include 'conexion.php';

if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(['exito' => false, 'mensaje' => 'No autenticado']);
    exit;
}

$usuario_id = $_SESSION['usuario_id'];

$stmt = $conexion->prepare("SELECT saldo FROM usuarios WHERE id = ?");
$stmt->bind_param("i", $usuario_id);
$stmt->execute();
$resultado = $stmt->get_result();

if ($resultado->num_rows === 1) {
    $fila = $resultado->fetch_assoc();
    echo json_encode(['exito' => true, 'saldo' => $fila['saldo']]);
} else {
    echo json_encode(['exito' => false, 'mensaje' => 'Error al obtener saldo']);
}

$stmt->close();
$conexion->close();
?>