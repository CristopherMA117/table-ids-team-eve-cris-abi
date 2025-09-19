<?php
session_start();
include 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $usuario = $_POST['usuario'];
    $contrasena = $_POST['contrasena'];
    
    $stmt = $conexion->prepare("SELECT id, usuario, contrasena, saldo FROM usuarios WHERE usuario = ?");
    $stmt->bind_param("s", $usuario);
    $stmt->execute();
    $resultado = $stmt->get_result();
    
    if ($resultado->num_rows === 1) {
        $fila = $resultado->fetch_assoc();
        if (password_verify($contrasena, $fila['contrasena'])) {
            $_SESSION['usuario_id'] = $fila['id'];
            $_SESSION['usuario'] = $fila['usuario'];
            $_SESSION['saldo'] = $fila['saldo'];
            echo json_encode(['exito' => true, 'mensaje' => 'Login exitoso']);
        } else {
            echo json_encode(['exito' => false, 'mensaje' => 'Contraseña incorrecta']);
        }
    } else {
        echo json_encode(['exito' => false, 'mensaje' => 'Usuario no encontrado']);
    }
    
    $stmt->close();
    $conexion->close();
}
?>