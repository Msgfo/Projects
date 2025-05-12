const DOG_API = 'https://dog.ceo/api';
const BREEDS_API = 'https://api.thedogapi.com/v1/breeds';

// Load 10 random dog pictures for the carousel
async function loadRandomDogs() {
    try {
        const response = await fetch(`${DOG_API}/breeds/image/random/10`);
        const data = await response.json();
        const carousel = document.getElementById('dog-carousel');
        carousel.innerHTML = '';

        data.message.forEach(image => {
            const imgElement = document.createElement('img');
            imgElement.src = image;
            imgElement.alt = 'Random Dog';
            imgElement.style.width = '100%'; // Ensure images span the width
            imgElement.style.height = '100%'; // Ensure images fit the height
            imgElement.style.objectFit = 'cover'; // Maintain aspect ratio
            carousel.appendChild(imgElement);
        });

        // Initialize Simple Slider
        SimpleSlider.create(carousel, { delay: 3000, transition: 0.5 });
    } catch (error) {
        console.error('Error loading random dogs:', error);
    }
}

// Load dog breeds and limit to 10
async function loadDogBreeds() {
    try {
        const response = await fetch(BREEDS_API);
        const breeds = await response.json();
        const buttonsContainer = document.getElementById('breed-buttons');
        buttonsContainer.innerHTML = '';

        // Limit breeds to the first 10
        breeds.slice(0, 10).forEach(breed => {
            const button = document.createElement('button');
            button.textContent = breed.name;
            button.className = 'custom-button';
            button.onclick = () => displayDogBreedInfo(breed);
            buttonsContainer.appendChild(button);
        });
    } catch (error) {
        console.error('Error loading dog breeds:', error);
    }
}

// Display dog breed information
function displayDogBreedInfo(breed) {
    document.getElementById('breed-name').textContent = breed.name;
    document.getElementById('breed-description').textContent = breed.temperament || 'No description available.';
    document.getElementById('breed-min-life').textContent = breed.life_span.split(' - ')[0];
    document.getElementById('breed-max-life').textContent = breed.life_span.split(' - ')[1];
    document.getElementById('breed-info').classList.remove('hidden');
}

// Set up voice commands
function setupVoiceCommands() {
    if (annyang) {
        const commands = {
            'hello': () => alert('Hello from the Dogs page!'),
            'change the color to *color': (color) => {
                document.body.style.backgroundColor = color;
            },
            'navigate to *page': (page) => {
                const targetPage = page.toLowerCase();
                if (targetPage === 'home') {
                    window.location.href = 'index.html';
                } else if (targetPage === 'stocks') {
                    window.location.href = 'stocks.html';
                } else if (targetPage === 'dogs') {
                    window.location.href = 'dogs.html';
                } else {
                    alert("Page not recognized. Try 'home', 'stocks', or 'dogs'.");
                }
            },
            'load dog breed *breedName': (breedName) => {
                fetch(BREEDS_API)
                    .then(response => response.json())
                    .then(breeds => {
                        const breed = breeds.find(b => b.name.toLowerCase() === breedName.toLowerCase());
                        if (breed) {
                            displayDogBreedInfo(breed);
                        } else {
                            alert('Breed not found.');
                        }
                    })
                    .catch(error => console.error('Error loading breed by voice:', error));
            }
        };

        annyang.addCommands(commands);
        console.log('Voice commands enabled for Dogs page.');
    } else {
        console.error("Annyang is not supported in this browser.");
    }
}

// Start and stop voice commands
function startAudio() {
    annyang.start();
    alert('Voice commands are now enabled!');
}

function stopAudio() {
    annyang.abort();
    alert('Voice commands have been disabled.');
}

// Initialize everything on page load
document.addEventListener('DOMContentLoaded', () => {
    loadRandomDogs();
    loadDogBreeds();
    setupVoiceCommands();
});