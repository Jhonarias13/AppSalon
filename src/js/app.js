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

    //funcion para almacenar el numero del telefono
    numeroTelefono();

    // almacena la fecha en la cita del objeto
    fechaCita();

    // deshabilita dias pasados
    deshabilitarFechaAnterior();

    // almacena la hora de la cita en el objecto
    horaCita();
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


        mostrarResumen(); //estamos en la pagina 3, carga el resumen de la cita
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');

    }

    mostrarSeccion();
}

function mostrarResumen() {
    // destructuring
    const { nombre, celular, fecha, hora, servicios } = cita;

    // seleccionar resumen 
    // document.querySelector('#paso-3').classList.add('contenido-resumen');
    const resumenDiv = document.querySelector('.contenido-resumen');


    //limpia el HTML previo
    while (resumenDiv.firstChild) {
        resumenDiv.removeChild(resumenDiv.firstChild);
    }
    // validacion del objeto
    if (Object.values(cita).includes('')) {
        const noServicios = document.createElement('P');
        noServicios.textContent = '¡Faltan datos para agendar tu cita!';
        noServicios.classList.add('invalidar-cita');
        //agregar a resumenDiv
        resumenDiv.appendChild(noServicios);
        return;
    }
    // crear elementos para el resumen
    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen Cita';

    const nombreCita = document.createElement('P');
    nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;

    const celularCita = document.createElement('P');
    celularCita.innerHTML = `<span>Celular:</span> ${celular}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>fecha:</span> ${fecha}`;

    const servicioList = document.createElement('DIV');
    servicioList.classList.add('resumen-servicios');

    const resumenServicios = document.createElement('H3');
    resumenServicios.textContent = 'resumen servicios';
    servicioList.appendChild(resumenServicios);

    const divPagar = document.createElement('DIV');
    divPagar.classList.add('seccion-pagar');

    let precio = 0;
    // itera cada elemento del objeto para extraer el nombre del servicio y el pr
    for (i = 0; i < servicios.length; i++) {

        const nombreServicio = document.createElement('P');
        nombreServicio.innerHTML = `${servicios[i].nombre} <span>${servicios[i].precio}</span>`;
        servicioList.appendChild(nombreServicio);
        // console.log(nombreLi);
        let precioServicio = servicios[i].precio.split('$')
        precio += parseInt(precioServicio[1].trim());
    }




    // agregar los elementos al DOM

    resumenDiv.appendChild(headingCita);
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);
    resumenDiv.appendChild(celularCita);


    resumenDiv.appendChild(servicioList);

    const cantidadPagar = document.createElement('P');
    cantidadPagar.classList.add('total-pagar');
    cantidadPagar.innerHTML = `<span>Total a pagar:</span> $${precio}`;

    const botonPagar = document.createElement('BUTTON');
    botonPagar.classList.add('btn-pagar');
    botonPagar.setAttribute('id', "pagar"); // agrego atributo de id al boton
    botonPagar.textContent = 'Pagar';

    divPagar.appendChild(cantidadPagar);
    divPagar.appendChild(botonPagar);

    resumenDiv.appendChild(divPagar);

}
// funcion pra obtener el nombre del input del formulario
function nombreCita() {
    const nombreInput = document.querySelector('#nombre');

    nombreInput.addEventListener('input', (e) => {
        nombreTexto = e.target.value.trim(); // trim() elimina espacio en blanco al final y al comienzo del input

        // validacion para que nombretexto tenga algo

        if (nombreTexto === '' || nombreTexto.length <= 3) {
            mostrarAlerta('¡Nombre NO Válido!', 'error');

        } else {
            const alerta = document.querySelector('.alerta');
            if (alerta) {
                alerta.remove();
            }
            cita.nombre = nombreTexto;
            // console.log('nombre valido');
            console.log(cita);
        }
    });
}

function numeroTelefono() {
    const numero = document.querySelector('#celular');

    numero.addEventListener('input', (e) => {
        const telefono = e.target.value.trim();

        if (telefono.length < 10) {
            mostrarAlerta('numero invalido', 'error');

        } else {
            const alerta = document.querySelector('.alerta');
            if (alerta) {
                alerta.remove();
            }
            // console.log('numero valido');
            cita.celular = telefono;
            console.log(cita);
        }
    })
}

function mostrarAlerta(mensaje, tipo) {

    // si hay una alerta previa, no mostrar otra
    const alertaPrevia = document.querySelector('.alerta');
    if (alertaPrevia) {
        return;
    }
    // console.log('el mensaje es', mensaje);

    // crear alerta en html 
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    // si la alerta es de tipo error, entonces, agrega una segunda clase llamada error
    if (tipo === 'error') {
        alerta.classList.add('error');
    }
    console.log(alerta);

    //. insertar en el html 

    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta);

    // eliminar la alerta despues de 3sg

    setTimeout(() => {
        alerta.remove();
    }, 3000);


}


function fechaCita() {
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', e => {
        // console.log(e.target.value);

        const dia = new Date(e.target.value).getUTCDay(); // getUTCDay retorna los dias de la semana como numero del 0 - 6
        // console.log(dia);

        // if para deshabilitar los domingos 
        if ([0].includes(dia)) {
            e.preventDefault();
            fechaInput.value = '';
            mostrarAlerta('No tenemos servicios los domingos :( ', 'error');
        } else {
            cita.fecha = fechaInput.value;
            console.log(cita);
        }
    })
}

function deshabilitarFechaAnterior() {
    const inputFecha = document.querySelector('#fecha');

    const fechaAhora = new Date();
    const year = fechaAhora.getFullYear();
    const mes = fechaAhora.getMonth() + 1;
    const dia = fechaAhora.getDate();

    // agrega un cero si el mes es menor al mes 10
    if (mes < 10) {
        mesMenor = `0${mes}`;
        const fechaDeshabilitar = `${year}-${mesMenor}-${dia}`;
        inputFecha.min = fechaDeshabilitar;
    } else {
        fechaDeshabilitar = `${year}-${mes}-${dia}`;
        inputFecha.min = fechaDeshabilitar;
    }
}

function horaCita() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', e => {


        const horaCita = e.target.value
        const hora = horaCita.split(':');

        if (hora[0] >= 8 && hora[0] <= 19) {
            cita.hora = horaCita;
            console.log(cita);

        } else {
            // vaciar la casilla de la hora
            inputHora.classList.add('hora-invalida');
            inputHora.focus();
            setTimeout(() => {
                inputHora.value = '';
            }, 1000)

            //agregar texto debajo dej input de hora
            const campoHora = document.querySelector('.formulario');
            horatexto = document.createElement('P');
            horatexto.textContent = "hora invalida, intente entre las 8:00 AM y las 7:00 PM";
            campoHora.appendChild(horatexto);

            setTimeout(() => {
                horatexto.remove();
                inputHora.classList.remove('hora-invalida');
            }, 4000)

        }

    })

}