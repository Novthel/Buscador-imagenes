const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacionDiv = document.querySelector('#paginacion');

const registrosPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;


window.onload = () => {
    formulario.addEventListener('submit', validarFormulario);
}

/*
    La funcion ValidarFormulario verifica q el campo de entrada de datos no este vacio. Si no esta vacio invocara 
    la consulta a la API, de lo contrario invocara la funcion mostrarAlerta para mostrar un mensaje de error.
*/
function validarFormulario(e) {
    e.preventDefault();
    
    const terminoBusqueda = document.querySelector('#termino').value;
    if(terminoBusqueda === '' ) {
        mostrarAlerta('Agrega un término de búsqueda');
        return;
    }
    buscarImagenes();
}

/*
    La funcion mostrarAlerta es invocada cuando se solicita la busqueda de imagen y no hay dato
    de entrada en el selector de la pagina.
    la funcion mostrar un mensaje de error al usuario por un lapso de tres segundos.
*/

function mostrarAlerta(mensaje) {

    const existeAlerta = document.querySelector('.bg-red-100');

    if(!existeAlerta) {
        const alerta = document.createElement('p');
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center');
    
        alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block sm:inline">${mensaje}</span>
        `;
        formulario.appendChild(alerta);
    
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

/*
    funcion buscarImagenes: realiza una consulta a la API y devuelve la invocacion de la
    funcion mostrarImagenes pasando como argumento la Data obtenida en la consulta.
*/
async function buscarImagenes() {

    const termino = document.querySelector('#termino').value;

    const key = '25743075-2754b29919d30a30647621867';
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;

        try {
            const respuesta = await fetch(url);
            const resultado = await respuesta.json();
            totalPaginas = calcularPaginas(resultado.totalHits);
            mostrarImagenes(resultado.hits);
        } catch (error) {
            console.log(error)
        }
       
}

// Generador  va a registrar la cantidad de elementos de acuerdo a las paginas
function *crearPaginador(total) {
    for (let i = 1; i <= total; i++ ) {
        yield i;
    }
}


function calcularPaginas(total) {
    return parseInt( Math.ceil( total / registrosPorPagina ));
}


/*
    mostrarImagenesL: recibe un Json como argumento. procesa la informacion y se encarga de mostrar por pantalla 
    la informacion consultada por el usuario.
*/
function mostrarImagenes(imagenes) {
    
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }

    // Iterar sobre el arreglo de imagenes y construir el HTML
    imagenes.forEach( imagen => {
        const { previewURL, likes, views, largeImageURL } = imagen;

        resultado.innerHTML += `
            <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                <div class="bg-white">
                    <img class="w-full h-24" src="${previewURL}" >

                    <div class="p-4">
                        <p class="font-bold"> ${likes} <span class="font-light"> Me Gusta </span> </p>
                        <p class="font-bold"> ${views} <span class="font-light"> Veces Vista </span> </p>

                        <a 
                            class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1"
                            href="${largeImageURL}" target="_blank" rel="noopener noreferrer" 
                        >
                            Ver Imagen
                        </a>
                    </div>
                </div>
            </div>
        `;

    });

    // Limpia el paginador previo
    while(paginacionDiv.firstChild) {
        paginacionDiv.removeChild(paginacionDiv.firstChild)
    }

    // Genera el nuevo HTML
    imprimirPaginador();

}

/*
    funcion imprimirPaginador: Se encarga de mostrar por pantalla la paginacion de cada pagina 
*/
function imprimirPaginador() {
    iterador = crearPaginador(totalPaginas);

    while(true) {
        const { value, done} = iterador.next();
        if(done) return;

        // Caso contrario, genera un botón por cada elemento en el generador
        const boton = document.createElement('a');
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-4', 'rounded');

        boton.onclick = () => {
            paginaActual = value;

            buscarImagenes();
        }

        paginacionDiv.appendChild(boton);
    }
}