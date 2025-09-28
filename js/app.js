// Global variables
let slokas = [];
let currentSloka = null;
let currentLang = 'gujarati'; // 'gujarati' or 'english'

// DOM elements
const listScreen = document.getElementById('list-screen');
const detailScreen = document.getElementById('detail-screen');
const slokasList = document.getElementById('slokas-list');
const slokaImage = document.getElementById('sloka-image');
const slokaSanskrit = document.getElementById('sloka-sanskrit');
const slokaText = document.getElementById('sloka-text');
const slokaTranslation = document.getElementById('sloka-translation');
const gujaratiPill = document.getElementById('gujarati-pill');
const englishPill = document.getElementById('english-pill');
const prevSlokaBtn = document.getElementById('prev-sloka-btn');
const nextSlokaBtn = document.getElementById('next-sloka-btn');
const slokaSlider = document.getElementById('sloka-slider');
const slokaCounter = document.getElementById('sloka-counter');
const backBtn = document.getElementById('back-btn');

// Initialize app
async function init() {
    try {
        // Load data
        slokas = await fetch('assets/data.json').then(r => r.json());

        // Set slider max
        slokaSlider.max = slokas.length;

        // Load language preference
        currentLang = localStorage.getItem('shikshapatri-lang') || 'gujarati';
        updateLanguagePills();

        // Render slokas list
        renderSlokas();

        // Setup navigation
        setupNavigation();
    } catch (error) {
        console.error('Error loading data:', error);
        slokasList.innerHTML = '<p>Error loading slokas. Please try again.</p>';
    }
}

// Render slokas list
function renderSlokas() {
    slokasList.innerHTML = '';
    slokas.forEach(sloka => {
        const card = document.createElement('div');
        card.className = 'sloka-card';
        card.onclick = () => showSloka(sloka.id);
        card.innerHTML = `
            <div class="sloka-header">
                <div class="sloka-number-bubble">${sloka.id}</div>
                <div class="sloka-content-preview">${sloka.sanskrit.replace(/\n/g, '<br>')}</div>
            </div>
        `;
        slokasList.appendChild(card);
    });
}

// Show sloka detail
function showSloka(id) {
    currentSloka = slokas.find(s => s.id === id);
    if (!currentSloka) return;

    slokaImage.src = `assets/pictorial/${id}.png`;
    slokaSanskrit.innerHTML = currentSloka.sanskrit.replace(/\n/g, '<br>');
    if (currentLang === 'gujarati') {
        slokaText.textContent = currentSloka.gujarati;
        slokaTranslation.style.display = 'none';
    } else {
        slokaText.textContent = currentSloka.english;
        slokaTranslation.style.display = 'none';
    }

    slokaSlider.value = id;
    slokaCounter.textContent = `${id}/${slokas.length}`;

    listScreen.classList.remove('active');
    detailScreen.classList.add('active');
    backBtn.style.display = 'block';

    updateNavButtons();
}

// Update navigation buttons
function updateNavButtons() {
    const currentId = currentSloka.id;
    prevSlokaBtn.disabled = currentId === 1;
    nextSlokaBtn.disabled = currentId === slokas.length;
}

// Update language pills
function updateLanguagePills() {
    gujaratiPill.classList.toggle('active', currentLang === 'gujarati');
    englishPill.classList.toggle('active', currentLang === 'english');
}

// Setup navigation
function setupNavigation() {
    backBtn.onclick = () => {
        detailScreen.classList.remove('active');
        listScreen.classList.add('active');
        backBtn.style.display = 'none';
        currentSloka = null;
    };

    prevSlokaBtn.onclick = () => {
        if (currentSloka.id > 1) {
            showSloka(currentSloka.id - 1);
        }
    };

    nextSlokaBtn.onclick = () => {
        if (currentSloka.id < slokas.length) {
            showSloka(currentSloka.id + 1);
        }
    };

    slokaSlider.oninput = () => {
        const id = parseInt(slokaSlider.value);
        showSloka(id);
    };

    gujaratiPill.onclick = () => {
        currentLang = 'gujarati';
        localStorage.setItem('shikshapatri-lang', currentLang);
        updateLanguagePills();
        if (currentSloka) showSloka(currentSloka.id);
    };

    englishPill.onclick = () => {
        currentLang = 'english';
        localStorage.setItem('shikshapatri-lang', currentLang);
        updateLanguagePills();
        if (currentSloka) showSloka(currentSloka.id);
    };
}

// Register service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('SW registered'))
        .catch(err => console.log('SW registration failed'));
}

// Start app
init();