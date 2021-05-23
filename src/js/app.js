let pagina = 1;

const cita = {
    nombre: '',
    fecha:'',
    hora:'',
    servicios:[]
}


document.addEventListener('DOMContentLoaded', function(){
    iniciarApp();
});
function iniciarApp(){
    mostrarServicios();
    
    //Resalta el DIV actual según cual se presione

    mostrarSeccion();

    //Oculta o muestra una sección según el tab que se presione
    cambiarSeccion();
    
    //Paginación SIGUIENTE y ANTERIOR

    paginaSiguiente();

    paginaAnterior();
    
    //Comprueba la página actual para ocultar o mostrar la paginación

    botonesPaginador();

    // Muestra el resumen de la cita  (o mensaje de error en caso de no pasar la validación)
    mostrarResumen();

    // Alamacena el nombre de la cita en el objeto
    nombreCita();

    // Alamacena la fecha de la cita
    fechaCita();

    // Deshabilita los días pasados
    deshabilitarFechaAnterior();

    // Almacena la hora de la cita en el objeto
    horaCita();

}


function mostrarSeccion(){

    // Elimina mostrar-seccion de la seccion anterior

    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if (seccionAnterior) {
        seccionAnterior.classList.remove('mostrar-seccion');
    }

    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    // Eliminar la clase de tab anterior
    const tabAnterior = document.querySelector('.tabs .actual');
    if (tabAnterior) {
        tabAnterior.classList.remove('actual');
    }

    //Resalta el Tab Actual
    const tab = document.querySelector(`[value="${pagina}"]`);
    tab.classList.add('actual');

}

function cambiarSeccion(){
    const enlaces = document.querySelectorAll('.tabs button');

    enlaces.forEach( enlace =>{
        enlace.addEventListener ('click', e => {
            e.preventDefault();

            pagina = parseInt( enlace.value);
            
        

            // Llamar la función de mostrar sección
            mostrarSeccion();

            botonesPaginador();
        })
    })
}



async function mostrarServicios() {
    try {
        const resultado = await fetch('./servicios.json');
        const db = await resultado.json();

        const {servicios} = db;

    // Generar el Html
    servicios.forEach(servicio => {
        const{id, nombre, precio} = servicio;

        //DOM Scripting
        const nombreServicio = document.createElement('P');
        nombreServicio.textContent = nombre;
        nombreServicio.classList.add('nombre-servicio');

        //Generar PrecioServicio
        const precioServicio = document.createElement('P');
        precioServicio.textContent = `$ ${precio}`;
        precioServicio.classList.add('precio-servicio');
        

        //Generar div Contenedor de servicio
        const servicioDiv = document.createElement('DIV');
        servicioDiv.classList.add('servicio');
        servicioDiv.dataset.idServicio = id;

        // Selecciona un servicio para la cita

        servicioDiv.onclick = seleccionarServicio;


        // Inyectar Precio y nombre al DIV de servicio
        servicioDiv.appendChild(nombreServicio);
        servicioDiv.appendChild(precioServicio);

        // Inyectar todo el div con el contenido en el HTML
        document.querySelector('#servicios').appendChild(servicioDiv);

        
    })
    } catch (error) {
        console.log(error);
    }
}

function seleccionarServicio(e) {
    let elemento;
    //Forzar que el elemento al cual le damos click sea el DIV
    if(e.target.tagName === 'P') {
        elemento = e.target.parentElement;
    } else {
        elemento = e.target;
        
    }


    if(elemento.classList.contains('seleccionado')) {
        elemento.classList.remove('seleccionado');

        console.log(elemento.dataset.idServicio);
        const id = parseInt(elemento.dataset.idServicio);
        // Eliminiar Servicio
        eliminarServicio(id);



    }else {
        elemento.classList.add('seleccionado');
        
        // console.log(elemento.dataset.idServicio);
        
        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent
        }
        agregarServicio(servicioObj);
        //console.log(servicioObj);
    }
}
function eliminarServicio(id) {
    //console.log('eliminando...', id);

    const { servicios } = cita;
    cita.servicios = servicios.filter( servicio => servicio.id !== id ); 
    console.log(cita);

}
function agregarServicio(servicioObj){
    console.log(servicioObj)
    // Destructuring
    const { servicios } = cita;
    cita.servicios = [...servicios, servicioObj];
    console.log(cita);
}
function paginaSiguiente(){
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () => {
        pagina++;
        
        botonesPaginador();

        console.log(pagina);
    });
}

function paginaAnterior (){
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => {
        pagina--;
        
        botonesPaginador();
        
        console.log(pagina);
    });
}

function botonesPaginador() {
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if(pagina === 1) {
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    
    
    } else if (pagina ===3){
        paginaSiguiente.classList.add ('ocultar');
        paginaAnterior.classList.remove ('ocultar');

        mostrarResumen(); // estamos en la página 3 carga el resumen de la cita
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion();
}

function mostrarResumen(){
    // Destructuring
    const {nombre, fecha, hora, servicios} = cita;
    console.log(cita);
    // Seleccionar Resumen
    const resumenDiv = document.querySelector('.contenido-resumen');

    // Limpiar el Html previo
    // resumenDiv.innerHTML = '';

    while (resumenDiv.firstChild) {
        resumenDiv.removeChild( resumenDiv.firstChild);
    }

    //Validación de objeto
    if(Object.values(cita).includes('')){
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Algunos datos no han sido correctamente completados';
        noServicios.classList.add('invalidar-cita');

        // Agregar resumenDiv
        resumenDiv.appendChild(noServicios);
    
        return;
    }
    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de Cita';

    // Mostrar el Resumen
    const nombreCita = document.createElement('P');
    nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;
    
    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`;
    
    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

    const serviciosCita = document.createElement('DIV');
    serviciosCita.classList.add('resumen-servicios');

    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';

    serviciosCita.appendChild(headingServicios);


    let cantidad = 0;
    // Iterar sobre el arreglo de Servicios
    console.log(servicios)
    servicios.forEach(servicio => {

        const { nombre, precio } = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;
        
        const precioServicio = document.createElement('P');
        precioServicio.textContent = precio;
        precioServicio.classList.add('precio');

        const totalServicio = precio.split('$');
        cantidad += parseInt(totalServicio[1].trim());

        // Colocar texto y precio en el DIv
        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);
        
        serviciosCita.appendChild(contenedorServicio);


        
    });
    // console.log(cantidad)

    resumenDiv.appendChild(headingCita);
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);

    resumenDiv.appendChild(serviciosCita);
    
    const cantidadPagar = document.createElement('P')
    cantidadPagar.classList.add('total')
    cantidadPagar.innerHTML = `<span>Total a Pagar: </span>$ ${cantidad}`;


    resumenDiv.appendChild(cantidadPagar);
}

function nombreCita(){
    const nombreInput = document.querySelector('#nombre');

    nombreInput.addEventListener('input', e => {
        const nombreTexto = e.target.value.trim();

        //console.log('e.target.value');

        //Validación de que el nombreTexto Tenga algo
        if (nombreTexto === '' || nombreTexto.legth < 3) {
            mostrarAlerta('Nombre no válido', 'error')
            //console.log('Nombre no válido', );
        }else {
            const alerta = document.querySelector('.alerta')
            if (alerta) {
                alerta.remove();
            }
            //console.log('perfecto ñeri');
            cita.nombre = nombreTexto;

        //    console.log(cita);
        }

    });
}

function mostrarAlerta (mensaje, tipo){
    // Si hay una alerta previa, no crear otra

    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia){
        return;
    }

    //console.log('el mensaje es', mensaje);
    const alerta = document.createElement('Div');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if(tipo === 'error') {
        alerta.classList.add('error');
    
    }

    //console.log(alerta);
    // Insertar en el HTML
    const formulario = document.querySelector('.formulario');
    formulario.appendChild( alerta );
    //Eliminar alerta después de 3 seg
    setTimeout(() => {
        alerta.remove();
    }, 3000);
}

function fechaCita() {
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', e => {
        const dia = new Date(e.target.value).getUTCDay();
        
        
        if([0,6].includes(dia)) {
        e.preventDefault();
        fechaInput.value = '';
        mostrarAlerta('Fines de semana cerrado, por favor elija una fecha válida', 'error');
            
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
    // const mes = fechaAhora.getMonth() + 1;
    const dia = fechaAhora.getDate() + 1;


    if (fechaAhora.getMonth() + 1 > 9){
        mes = fechaAhora.getMonth() + 1;
    } else {
        mes = `0${fechaAhora.getMonth() + 1}`;
    }
    //_Formato deseado AAAA-MM-DD

    const fechaDeshabilitar = `${year}-${mes}-${dia}`;
    inputFecha.min = fechaDeshabilitar;
    
}
function horaCita() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', e => {


        const horaCita = e.target.value;
        const hora = horaCita.split(':');

        if (hora[0] < 10 || hora > 19) {

            mostrarAlerta('El local está abierto de 10  a 19', 'error');
            setTimeout(() => {
                inputHora.value = '';
            }, 2000);
        } else {
            cita.hora = horaCita;
        }

        console.log(cita);

        console.log(servicios);
    })
}