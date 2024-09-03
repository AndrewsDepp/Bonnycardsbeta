let verbsData;
let popupCounter = 0;

// Cargar el archivo JSON y almacenar los datos
fetch('set1.json')
    .then(response => response.json())
    .then(data => {
        verbsData = data.verbs;
        initializeCards();
    })
    .catch(error => console.error('Error al cargar el archivo JSON:', error));

function initializeCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            const mainVerb = verbsData[index].mainverb;
            textToSpeech(mainVerb);
            openPopup(index);
        });
    });
}

function openPopup(index) {
    closeAllPopups(); // Cerrar todas las ventanas abiertas antes de abrir una nueva

    const verbData = verbsData[index];
    const popupId = `popup-${popupCounter++}`;

    let popupHtml = `
        <div class="popup" id="${popupId}">
            <div class="popup-header">
                <button class="close-btn" onclick="closePopup('${popupId}')"></button>
                <button class="back-btn" style="display: none;" onclick="showImages(${index}, '${popupId}')"></button>
            </div>
            <div class="popup-content">
                <div id="images-container-${popupId}">
                    ${verbData.tenses.map((tense, i) => `
                        <img src="${tense.image}" alt="${tense.tense}" onclick="textToSpeech('${tense.verb}'); showExamples(${index}, ${i}, '${popupId}')">
                    `).join('')}
                </div>
                <div id="examples-container-${popupId}" style="display: none;"></div>
            </div>
        </div>`;

    document.body.insertAdjacentHTML('beforeend', popupHtml);
    document.addEventListener('keydown', (e) => closeOnEsc(e, popupId));
}

function closePopup(popupId) {
    const popup = document.getElementById(popupId);
    if (popup) {
        popup.remove();
    }
}

function closeAllPopups() {
    document.querySelectorAll('.popup').forEach(popup => popup.remove());
}

function showImages(verbIndex, popupId) {
    const imagesContainer = document.getElementById(`images-container-${popupId}`);
    const examplesContainer = document.getElementById(`examples-container-${popupId}`);
    const closeButton = document.querySelector(`#${popupId} .close-btn`);
    const backButton = document.querySelector(`#${popupId} .back-btn`);

    imagesContainer.style.display = 'block';
    examplesContainer.style.display = 'none';
    closeButton.style.display = 'inline-block';
    backButton.style.display = 'none';
}

function showExamples(verbIndex, tenseIndex, popupId) {
    const verbData = verbsData[verbIndex];
    const tenseData = verbData.tenses[tenseIndex];

    const imagesContainer = document.getElementById(`images-container-${popupId}`);
    const examplesContainer = document.getElementById(`examples-container-${popupId}`);
    const closeButton = document.querySelector(`#${popupId} .close-btn`);
    const backButton = document.querySelector(`#${popupId} .back-btn`);

    imagesContainer.style.display = 'none';
    examplesContainer.style.display = 'block';
    closeButton.style.display = 'none';
    backButton.style.display = 'inline-block';
    examplesContainer.innerHTML = `
        <img src="${tenseData.image}" alt="${tenseData.tense}" onclick="textToSpeech('${tenseData.verb}')">
        <h3>Examples:</h3>
        <ul>
            ${tenseData.examples.map((example, i) => `
                <li onclick="flipText(this, '${tenseData.translations[i]}'); textToSpeech('${example}')">${example}</li>
            `).join('')}
        </ul>`;
}

function flipText(element, translation) {
    if (!element.dataset.originalText) {
        element.dataset.originalText = element.textContent;
    }
    element.textContent = element.textContent === element.dataset.originalText ? translation : element.dataset.originalText;
}

function textToSpeech(text) {
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
}

function closeOnEsc(e, popupId) {
    if (e.key === 'Escape') {
        closePopup(popupId);
    }
}

function isMobile() {
    return window.innerWidth <= 768;
}
