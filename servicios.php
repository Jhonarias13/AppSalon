<?php


require 'includes/funciones.php';

$servicios = obtenerServicios();

// echo <pre> se usa para formatear el codigo obtenido 
echo json_encode($servicios);