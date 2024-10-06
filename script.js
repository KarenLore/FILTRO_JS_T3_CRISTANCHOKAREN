class PrincipalElement extends HTMLElement {
    constructor(){
        super();
        this.innerHTML = `
        <h1>Superhéroes DC y Marvel</h1>
        <div id="buttonsContainer">
            <button id="dcButton">Mostrar DC</button>
            <button id="marvelButton">Mostrar Marvel</button>
            <button id="vsButton">VS Aleatorio</button>
        </div>

        <!-- Contenedor donde se mostrarán los personajes -->
        <div id="charactersContainer"></div>
        
        <!-- Contenedor para la paginación -->
        <div id="paginationContainer"></div>

        <!-- Contenedor para la batalla VS -->
        <div id="vsContainer"></div>
        `
    }
}
customElements.define('principal-element', PrincipalElement);


document.querySelectorAll('#buttonsContainer button').forEach(button => {
    button.addEventListener('click', () => {
        document.body.classList.remove('main-background');
        document.body.classList.add('no-background');
    });
});

let filteredCharacters = []; // Array para almacenar personajes filtrados
const charactersPerPage = 4; // Número de personajes a mostrar
let currentPage = 0; // Página actual

// Función para cargar el JSON de personajes
async function loadCharacters() {
    const response = await fetch('character.json');
    const characters = await response.json();
    return characters;
}

// Función para mostrar los personajes según la casa productora
async function showCharacters(casa) {
    const characters = await loadCharacters();
    filteredCharacters = characters.filter(character => character.casaProductora === casa);
    currentPage = 0; // Reiniciar la página actual
    displayCharacters(); // Mostrar personajes
}

// Función para mostrar los personajes
function displayCharacters() {
    const container = document.getElementById('charactersContainer');
    container.innerHTML = ''; // Limpiar contenedor antes de mostrar
    const paginationContainer = document.getElementById('paginationContainer');
    paginationContainer.innerHTML = ''; // Limpiar contenedor de paginación

    // Obtener los personajes a mostrar para la página actual
    const startIndex = currentPage * charactersPerPage;
    const charactersToDisplay = filteredCharacters.slice(startIndex, startIndex + charactersPerPage);
    
    charactersToDisplay.forEach(character => {
        const card = document.createElement('div');
        card.className = 'character-card';
        card.innerHTML = `
            <img src="${character.imagen}" alt="${character.nombrePersonaje}" width="100">
            <h3>${character.nombrePersonaje}</h3>
            <p>${character.biografia}</p>
            <p><strong>Fuerza:</strong> ${character.fuerzaAtaque}</p>
            <p><strong>Resistencia:</strong> ${character.resistencia}</p>
            <p><strong>Velocidad:</strong> ${character.velocidad}</p>
        `;
        container.appendChild(card);
    });

    // Mostrar botones de paginación si hay personajes filtrados
    if (filteredCharacters.length > charactersPerPage) {
        const totalPages = Math.ceil(filteredCharacters.length / charactersPerPage);
        for (let i = 0; i < totalPages; i++) {
            const button = document.createElement('button');
            button.innerText = i + 1; // Número de página
            button.addEventListener('click', () => {
                currentPage = i; // Actualizar página actual
                displayCharacters(); // Mostrar personajes de la nueva página
            });
            paginationContainer.appendChild(button);
        }
    }
}

// Función para mostrar un VS aleatorio entre personajes de DC y Marvel
async function showRandomVS() {
    const characters = await loadCharacters();
    const randomDC = characters.filter(c => c.casaProductora === 'DC')[Math.floor(Math.random() * characters.filter(c => c.casaProductora === 'DC').length)];
    const randomMarvel = characters.filter(c => c.casaProductora === 'Marvel')[Math.floor(Math.random() * characters.filter(c => c.casaProductora === 'Marvel').length)];

    const vsContainer = document.getElementById('vsContainer');
    const container = document.getElementById('charactersContainer');
    const paginationContainer = document.getElementById('paginationContainer');

    // Limpiar contenedor de personajes y paginación antes de mostrar VS
    container.innerHTML = '';
    paginationContainer.innerHTML = '';

    // Calcular la fuerza total de cada personaje
    const totalDC = parseInt(randomDC.fuerzaAtaque) + parseInt(randomDC.resistencia) + parseInt(randomDC.velocidad);
    const totalMarvel = parseInt(randomMarvel.fuerzaAtaque) + parseInt(randomMarvel.resistencia) + parseInt(randomMarvel.velocidad);
    
    // Determinar quién gana
    let ganador;
    if (totalDC > totalMarvel) {
        ganador = `${randomDC.nombrePersonaje} gana!`;
    } else if (totalDC < totalMarvel) {
        ganador = `${randomMarvel.nombrePersonaje} gana!`;
    } else {
        ganador = '¡Es un empate!';
    }
    
    vsContainer.innerHTML = `
        <h2>VS Aleatorio</h2>
        <div class="vs-card">
            <h3>${randomDC.nombrePersonaje}</h3>
            <p>Fuerza: ${randomDC.fuerzaAtaque}</p>
            <p>Resistencia: ${randomDC.resistencia}</p>
            <p>Velocidad: ${randomDC.velocidad}</p>
            <img src="${randomDC.imagen}" alt="${randomDC.nombrePersonaje}" width="100">
        </div>
        <div class="vs-card">
            <h3>${randomMarvel.nombrePersonaje}</h3>
            <p>Fuerza: ${randomMarvel.fuerzaAtaque}</p>
            <p>Resistencia: ${randomMarvel.resistencia}</p>
            <p>Velocidad: ${randomMarvel.velocidad}</p>
            <img src="${randomMarvel.imagen}" alt="${randomMarvel.nombrePersonaje}" width="100">
        </div>
        <h3>${ganador}</h3>
    `;
}

// Event listeners para los botones
document.getElementById('dcButton').addEventListener('click', () => {
    showCharacters('DC');
    document.getElementById('vsContainer').innerHTML = ''; // Limpiar el contenedor de VS
});
document.getElementById('marvelButton').addEventListener('click', () => {
    showCharacters('Marvel');
    document.getElementById('vsContainer').innerHTML = ''; // Limpiar el contenedor de VS
});
document.getElementById('vsButton').addEventListener('click', showRandomVS);
