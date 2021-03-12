document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
    mostrarServicios();
});

function iniciarApp() {
    console.log('inciando App');

}

//funcion asincrona para consultas de datos de un archivo JSON
async function mostrarServicios() {
    try {
        const resultado = await fetch('./servicios.json');
        const db = await resultado.json();
        const { servicios } = db; // ==> Destructuring

        //generar el HTML
        servicios.forEach(servicio => {
            const { id, nombre, precio } = servicio;

            //DOM Scripting

            // generar nombre de servicio
            const nombreServicio = document.createElement('P'); // crea un parrafo para cada id
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');

            // Generar el precio del servicio
            precioServicio = document.createElement('P'); // crea un parrafo para cada precio de los id
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add('precio-servicio');

            // Generar Div contenedor de servicios
            const servicioDiv = document.createElement('DIV'); // se crea un DIV
            servicioDiv.classList.add('servicio'); // se le agrega la clase servicio

            // Inyectar precio  y nombre junto al div de servicio
            servicioDiv.appendChild(nombreServicio); // se le pone como higjo nombreServicio
            servicioDiv.appendChild(precioServicio);

            // selecionar un servicio para la cita 
            servicioDiv.onclick = selecionarServicio;




            // Inyectarlo en el HTML
            document.querySelector('#servicios').appendChild(servicioDiv); // appendchild para inyectar al HTML


            //debugging
            // console.log(nombreServicio);
            // console.log(precioServicio);


        });


    } catch (error) {
        console.log('error..');

    }


    function selecionarServicio(e) {

        let elemento;

        //forzar que el elemento al cual le damos click sea el DIV
        if (e.target.tagName === 'P') {
            elemento = e.target.parentElement;
        } else {
            elemento = e.target;
        }

        if (elemento.classList.contains('seleccionado')) {
            elemento.classList.remove('seleccionado');
        } else {
            elemento.classList.add('seleccionado');
        }
    }
}