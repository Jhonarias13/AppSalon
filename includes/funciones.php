<?php

function obtenerServicios() : array{
    try{ 
        // importar una conexion 

        require 'databases.php';
        // var_dump($db);

        // escribir un codigo sql
        $sql = "SELECT * FROM servicios;";
        $consulta = mysqli_query($db, $sql);

        // Arreglo vacio 
        $servicios = [];
        $i = 0;
        // obtener los resultados
        
        while($row = mysqli_fetch_assoc($consulta) ){
            $servicios[$i]['id'] = $row['id'];
            $servicios[$i]['nombre'] = $row['nombre'];
            $servicios[$i]['precio'] = $row['precio'];

            $i++;
        }
        // echo "<pre>";
        // var_dump(($servicios));
        // echo "</pre>";

        return $servicios;

    } catch(\Throwable $th){
        // throw $th;

        var_dump($th);
    
    }
}

obtenerServicios();