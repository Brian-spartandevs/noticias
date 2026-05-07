// cantidad de noticias que se cargarán cada vez que se presione siguiente (5 + 1)
let cantidadNoticias = 5; //se mostrarán 6
let pageFinal = cantidadNoticias;
let pageInicial = 0;
let temaActual = 'Tecnología'

let noticias = {
    "apiKey":"95bfdd6c687842e3b88e4aa1c8410cb8",
    fetchNoticias: function(categoria){
        const newsUrl = `https://newsapi.org/v2/everything?q=${categoria}&language=es&apiKey=${this.apiKey}`;
        fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(newsUrl)}`)
        .then((response)=> response.json())
        .then((data)=>this.displayNoticias(data));
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
            document.querySelector(".container-noticias").appendChild(item);
        }

        // agregamos el boton Ver más
        let btnSiguiente = document.createElement("span");
        btnSiguiente.id = "btnSiguiente";
        btnSiguiente.textContent = "Ver más";
        btnSiguiente.setAttribute("onclick", "siguiente()");
        btnSiguiente.setAttribute("role", "button");
        btnSiguiente.setAttribute("tabindex", "0");
        document.querySelector(".container-noticias").appendChild(btnSiguiente);
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
    // elimino el boton siguiente
    document.querySelector("#btnSiguiente").remove();
    noticias.fetchNoticias(temaActual);
}

noticias.fetchNoticias(temaActual);