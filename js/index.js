// cantidad de noticias que se cargarán cada vez que se presione siguiente (5 + 1)
let cantidadNoticias = 5; //se mostrarán 6
let pageFinal = cantidadNoticias;
let pageInicial = 0;
let temaActual = 'Tecnología'

let noticias = {
    fetchNoticias: function(categoria){
        
        // Usa la función serverless de Vercel (sin CORS)
        // En localhost: http://localhost:3000/api/noticias?categoria=X
        // En Vercel: https://tu-dominio.vercel.app/api/noticias?categoria=X
        const apiUrl = `/api/noticias?categoria=${encodeURIComponent(categoria)}`;
        
        fetch(apiUrl)
        .then((response)=> {
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then((data)=>this.displayNoticias(data))
        .catch((error) => {
            console.error('Error al obtener noticias:', error);
            document.querySelector(".container-noticias").innerHTML = '<p style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #ff0000;">Error al cargar noticias. Intenta más tarde.</p>';
        });
    },
    displayNoticias: function(data){
        // elimino todo si se ha seleccionado un tema nuevo
        if( pageInicial == 0 ){
            document.querySelector(".container-noticias").textContent = "";
        }
        
        // verificar si hay artículos
        if(!data.articles || data.articles.length === 0) {
            document.querySelector(".container-noticias").innerHTML = '<p style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #666;">No se encontraron noticias. Intenta con otra búsqueda.</p>';
            return;
        }
        
        // cargo la cantidad de noticias indicada en cantidadNoticias
        for( i = pageInicial; i <= pageFinal; i++ ){

            if( i >= data.articles.length ) {
                break;
            }

            const { title } = data.articles[i];
            let h2 = document.createElement("h2");
            h2.textContent = title;

            const { urlToImage } = data.articles[i];
            let img = document.createElement("img");
            img.setAttribute("src", urlToImage || 'https://via.placeholder.com/400x200?text=Sin+imagen');
            img.setAttribute("alt", title);

            let info_item = document.createElement("div");
            info_item.className = "info_item"
            const { publishedAt } = data.articles[i];
            let fecha = document.createElement("span")
            let date = publishedAt;
            date = date.split("T")[0].split("-").reverse().join("-");
            fecha.className = "fecha";
            fecha.textContent = date;

            const { name } = data.articles[i].source;
            let fuente = document.createElement("span");
            fuente.className = "fuente";
            fuente.textContent = name;

            info_item.appendChild(fecha);
            info_item.appendChild(fuente);

            const { url } = data.articles[i];

            let item = document.createElement("div")
            item.className = "item";
            item.setAttribute("role", "article");
            item.appendChild(h2)
            item.appendChild(img)
            item.appendChild(info_item)
            item.setAttribute("onclick","window.open('" + url + "', '_blank')")
            
            // Agregar animación de entrada
            setTimeout(() => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                document.querySelector(".container-noticias").appendChild(item);
                setTimeout(() => {
                    item.style.transition = 'all 0.5s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 10);
            }, 0);
        }

        // agregamos el boton Ver más solo si hay más noticias
        // eliminar botón existente si lo hay
        const btnExistente = document.querySelector("#btnSiguiente");
        if (btnExistente) {
            btnExistente.remove();
        }
        
        // solo agregar el botón si hay más artículos disponibles
        if (pageFinal < data.articles.length - 1) {
            let btnSiguiente = document.createElement("span");
            btnSiguiente.id = "btnSiguiente";
            btnSiguiente.textContent = "Ver más";
            btnSiguiente.setAttribute("onclick", "siguiente()");
            btnSiguiente.setAttribute("role", "button");
            btnSiguiente.setAttribute("tabindex", "0");
            document.querySelector(".container-noticias").appendChild(btnSiguiente);
        }
    }
}

function buscar(cat){
    //definamos los valores
    pageInicial = 0;
    pageFinal = cantidadNoticias;
    temaActual = cat;
    noticias.fetchNoticias(cat);
}

function buscarTema(){
    pageInicial = 0;
    pageFinal = cantidadNoticias;

    let tema = document.querySelector("#busqueda").value;
    temaActual = tema;
    noticias.fetchNoticias(temaActual);
}

function siguiente(){
    pageInicial = pageFinal + 1;
    pageFinal = pageFinal + cantidadNoticias + 1;
    noticias.fetchNoticias(temaActual);
}

// Agregar event listener al input para buscar con Enter
document.addEventListener('DOMContentLoaded', function() {
    const inputBusqueda = document.querySelector("#busqueda");
    inputBusqueda.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            buscarTema();
        }
    });
});

noticias.fetchNoticias(temaActual);