<?php
// mysqli_connect: funcion que permite conectarse a la base de datos pasando como parametros la ubicacion el usuario, el password y la db a conectar 
$db = mysqli_connect('localhost', 'root', '', 'appsalon');

// la siguiente condiconal revisa si php se logró conectar a la base de datos
if(!$db){
    echo "error en la conexion";
    exit;
}
// si la php logra conectarse a la base de datos entonces, si va a mostrar el siguiente mensaje
// echo "conexion exitosa";