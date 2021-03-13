//variables globales.. disponible a todas las funciones
let pagina = 1;

const cita = {
    nombre: '',
    celular: '',
    fecha: '',
    hora: '',
    servicios: []
}


document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
    mostrarServicios();

});
// funcion que inicia la App
function iniciarApp() {
    // console.log('iniciando App...');

    // resalta el div actual segun el div que se presiona
    mostrarSeccion();

    // oculta o muestra una seccion segun el tab alq ue se presiona  
    cambiarSeccion();

    paginaSiguiente();

    paginaAnterior();

    //comprueba la pagina actual para ocultar o mostrar
    botonesPaginador();

    // muestra el resumen de la cita o mensaje de error en caso de no pasar la validacion
    mostrarResumen();


    // funcion para almacenar el nombre de la cita en el objeto
    nombreCita();
}


function mostrarSeccion() {

    // eliminar mostrar-seccion de la seccion antetior
    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if (seccionAnterior) {
        seccionAnterior.classList.remove('mostrar-seccion');
    }

    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    //elimina la clase de actual en el tab anterior
    const tabAnterior = document.querySelector('.tabs .actual');
    if (tabAnterior) {
        tabAnterior.classList.remove('actual');
    }

    //resalta el tab actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');

}
//funcion para seleccionar un tabs 
function cambiarSeccion() {
    const enlaces = document.querySelectorAll('.tabs button');

    //itera cada elemento de enlaces
    enlaces.forEach(enlace => {
        enlace.addEventListener('click', e => {
            e.preventDefault();
            pagina = parseInt(e.target.dataset.paso);

            //llamar la funcion de llamar seccion
            mostrarSeccion();
            botonesPaginador();
        })
    })


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

            // leer el dataset id y agregarlo en el servicioDiv
            servicioDiv.dataset.idServicios = id;

            //funcion para seleccionar el div con onclick
            servicioDiv.onclick = seleccionarServicio;

            // Inyectar precio  y nombre junto al div de servicio
            servicioDiv.appendChild(nombreServicio); // se le pone como higjo nombreServicio
            servicioDiv.appendChild(precioServicio);




            // Inyectarlo en el HTML
            document.querySelector('#servicios').appendChild(servicioDiv); // appendchild para inyectar al HTML


            //debugging
            // console.log(nombreServicio);
            // console.log(precioServicio);


        });


    } catch (error) {
        console.log('error..');

    }
}

// seleccionar servicios
function seleccionarServicio(e) {
    let elemento;

    // forzar a el elemento seleccionado para que tenga como tagName el div
    if (e.target.tagName === "P") {
        elemento = e.target.parentElement;
    } else {
        elemento = e.target;
    }

    //agregar la clase seleccionado

    if (elemento.classList.contains('seleccionado')) {
        elemento.classList.remove('seleccionado');


        const id = parseInt(elemento.dataset.idServicios);
        // console.log(id);


        eliminarServicio(id);
    } else {
        elemento.classList.add('seleccionado');

        const servicioObj = {
                id: parseInt(elemento.dataset.idServicios),
                nombre: elemento.firstElementChild.textContent,
                precio: elemento.firstElementChild.nextElementSibling.textContent
            }
            // console.log(servicioObj);

        agregarServicio(servicioObj);
    }
}
// funcion para eliminar servicios del objeto
function eliminarServicio(id) {
    const { servicios } = cita;
    //con la funcion .filter() se trae los id que no estan
    cita.servicios = servicios.filter(servicio => servicio.id != id);
    // console.log(cita);
}
// funcion para agregar los servicios al objeto
function agregarServicio(servicioObj) {
    // console.log('agregando...');
    const { servicios } = cita;
    cita.servicios = [...servicios, servicioObj]; //forma de copiar un arreglo
    console.log(cita);


}


// paginadores
function paginaSiguiente() {

    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () => {
        pagina++;


        botonesPaginador();
        // console.log(pagina);

    })

}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => {
        pagina--;

        botonesPaginador();
        // console.log(pagina);

    })

}

//comprobador de pagina actual
function botonesPaginador() {
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if (pagina === 1) {
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    } else if (pagina === 3) {
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');

    }

    mostrarSeccion();
}

function mostrarResumen() {
    // destructuring
    const { nombre, fecha, hora, servicios } = cita;


    // seleccionar resumen 

    document.querySelector('#paso-3').classList.add('contenido-resumen');

    const resumenDiv = document.querySelector('.contenido-resumen');


    // validacion del objeto
    if (Object.values(cita).includes('')) {
        const noServicios = document.createElement('P');
        noServicios.textContent = '¡Faltan datos para agendar tu cita!';

        noServicios.classList.add('invalidar-cita');

        //agregar a resumenDiv


        resumenDiv.appendChild(noServicios);
    }
}
// funcion pra obtener el nombre del input del formulario
function nombreCita() {
    const nombreInput = document.querySelector('#nombre');
    nombreInput.addEventListener('input', () => {
        console.log(nombreInput.value);

    })

}