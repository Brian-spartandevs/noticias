// cantidad de noticias que se cargarán cada vez que se presione siguiente
let cantidadNoticias = 6;
let pageFinal = cantidadNoticias + 3; // 4 para hero + 6 para grid regular
let pageInicial = 0;
let temaActual = 'Tecnología'

// Mostrar fecha actual
function updateDate() {
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const currentDate = new Date().toLocaleDateString('es-ES', options);
        dateElement.textContent = currentDate;
    }
}

let noticias = {
    fetchNoticias: function(categoria){
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
            document.querySelector("#hero-section").textContent = "";
        }
        
        // verificar si hay artículos
        if(!data.articles || data.articles.length === 0) {
            document.querySelector(".container-noticias").innerHTML = '<p style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #666;">No se encontraron noticias. Intenta con otra búsqueda.</p>';
            return;
        }
        
        // eliminar botón existente si lo hay
        const btnExistente = document.querySelector("#btnSiguiente");
        if (btnExistente) {
            btnExistente.remove();
        }
        
        const container = document.querySelector(".container-noticias");
        const heroContainer = document.querySelector("#hero-section");
        
        // Si es la primera carga, crear el hero grid con las primeras 4 noticias
        if (pageInicial === 0 && data.articles.length >= 4) {
            for (let i = 0; i < 4; i++) {
                const article = data.articles[i];
                const heroItem = this.createHeroItem(article, i === 0);
                heroContainer.appendChild(heroItem);
            }
            // Actualizar trending text con el título de la primera noticia
            const trendingText = document.getElementById('trending-text');
            if (trendingText && data.articles[0]) {
                trendingText.textContent = data.articles[0].title;
            }
        }
        
        // Determinar desde qué índice empezar (después del hero si es primera carga)
        const startIndex = pageInicial === 0 ? 4 : pageInicial;
        const endIndex = pageInicial === 0 ? pageFinal : pageFinal;
        
        // cargo la cantidad de noticias indicada en cantidadNoticias
        for( let i = startIndex; i <= endIndex; i++ ){
            if( i >= data.articles.length ) {
                break;
            }
            
            const article = data.articles[i];
            const item = this.createNewsItem(article);
            container.appendChild(item);
        }

        // Agregar el botón después de que todas las noticias estén en el DOM
        // solo agregar el botón si hay más artículos disponibles
        if (pageFinal < data.articles.length - 1) {
            let btnSiguiente = document.createElement("span");
            btnSiguiente.id = "btnSiguiente";
            btnSiguiente.textContent = "Ver más";
            btnSiguiente.setAttribute("onclick", "siguiente()");
            btnSiguiente.setAttribute("role", "button");
            btnSiguiente.setAttribute("tabindex", "0");
            container.appendChild(btnSiguiente);
        }
    },
    
    createHeroItem: function(article, isMain) {
        const { title, urlToImage, publishedAt, url, source } = article;
        
        let heroItem = document.createElement("div");
        heroItem.className = isMain ? "hero-main" : "hero-secondary";
        heroItem.setAttribute("onclick", `window.open('${url}', '_blank')`);
        heroItem.style.cursor = "pointer";
        
        let img = document.createElement("img");
        img.setAttribute("src", urlToImage || 'https://via.placeholder.com/600x400?text=Sin+imagen');
        img.setAttribute("alt", title);
        
        let overlay = document.createElement("div");
        overlay.className = "hero-overlay";
        
        let category = document.createElement("span");
        category.className = "hero-category";
        category.textContent = temaActual.toUpperCase();
        
        let titleElem = document.createElement("h2");
        titleElem.className = "hero-title";
        titleElem.textContent = title;
        
        let meta = document.createElement("div");
        meta.className = "hero-meta";
        
        let date = publishedAt.split("T")[0].split("-").reverse().join("-");
        meta.innerHTML = `<span>${source.name}</span><span>${date}</span>`;
        
        overlay.appendChild(category);
        overlay.appendChild(titleElem);
        overlay.appendChild(meta);
        
        heroItem.appendChild(img);
        heroItem.appendChild(overlay);
        
        return heroItem;
    },
    
    createNewsItem: function(article) {
        const { title, urlToImage, publishedAt, url, source } = article;
        
        let item = document.createElement("div");
        item.className = "item";
        item.setAttribute("role", "article");
        item.setAttribute("onclick", `window.open('${url}', '_blank')`);
        
        let img = document.createElement("img");
        img.setAttribute("src", urlToImage || 'https://via.placeholder.com/400x200?text=Sin+imagen');
        img.setAttribute("alt", title);
        
        let h2 = document.createElement("h2");
        h2.textContent = title;
        
        let info_item = document.createElement("div");
        info_item.className = "info_item";
        
        let fecha = document.createElement("span");
        let date = publishedAt.split("T")[0].split("-").reverse().join("-");
        fecha.className = "fecha";
        fecha.textContent = date;
        
        let fuente = document.createElement("span");
        fuente.className = "fuente";
        fuente.textContent = source.name;
        
        info_item.appendChild(fecha);
        info_item.appendChild(fuente);
        
        item.appendChild(img);
        item.appendChild(h2);
        item.appendChild(info_item);
        
        return item;
    }
}

function buscar(cat){
    // Actualizar nav activo
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.classList.add('active');
    
    //definamos los valores
    pageInicial = 0;
    pageFinal = cantidadNoticias + 3; // 4 hero + 6 regulares
    temaActual = cat;
    noticias.fetchNoticias(cat);
}

function buscarTema(){
    pageInicial = 0;
    pageFinal = cantidadNoticias + 3;

    let tema = document.querySelector("#busqueda").value;
    if (!tema) return;
    
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
    updateDate();
    
    const inputBusqueda = document.querySelector("#busqueda");
    inputBusqueda.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            buscarTema();
        }
    });
});

noticias.fetchNoticias(temaActual);