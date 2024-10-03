document.addEventListener('DOMContentLoaded', () => {
    const characterContainer = document.getElementById('character-container');
    const dialog = document.getElementById('character-dialog');
    const dialogContent = document.getElementById('dialog-content');
    const closeDialogButton = document.getElementById('close-dialog');

    // Función para mostrar las tarjetas de los personajes
    function displayCharacters(characters) {
        characters.forEach(character => {
            const card = document.createElement('div');
            card.classList.add('character-card');

            card.innerHTML = `
                <img src="${character.imagen}" alt="${character.nombrePersonaje}">
                <h3>${character.nombrePersonaje}</h3>
                <p>${character.casaProductora}</p>
            `;

            // Evento para mostrar los detalles al hacer clic en la tarjeta
            card.addEventListener('click', () => {
                dialogContent.innerHTML = `
                    <h2>${character.nombrePersonaje}</h2>
                    <img src="${character.imagen}" alt="${character.nombrePersonaje}">
                    <p><strong>Nombre Real:</strong> ${character.nombreReal}</p>
                    <p><strong>Biografía:</strong> ${character.biografia}</p>
                    <p><strong>Resistencia:</strong> ${character.resistencia}</p>
                    <p><strong>Fuerza de Ataque:</strong> ${character.fuerzaAtaque}</p>
                `;
                dialog.showModal();
            });

            characterContainer.appendChild(card);
        });
    }

    //Funcion para obtener los personajes del archivo json
    async function fetchCharacters(){
        try{
            const response = await fetch('character.json');
            if(!response.ok){
                throw new Error('Error al cargar el archivo JSON');
            }
            const characters = await response.json();
            displayCharacters(characters);
        }catch (error){
            console.error(error);
        }
    }

    //cerrar el código
    closeDialogButton.addEventListener('click', ()=>{
        dialog.close();
    });

    //Cargar los personajes desde el archivo JSON
    fetchCharacters();
})