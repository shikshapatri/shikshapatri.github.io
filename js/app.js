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
const bookmarkBtn = document.getElementById('bookmark-btn');
const bookmarkBubble = document.getElementById('bookmark-bubble');

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

        // Update bookmark bubble
        updateBookmarkBubble();

        // Render slokas list
        renderSlokas();

        // Auto-scroll to bookmarked sloka after rendering
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                scrollToBookmarkedSloka();
            });
        });

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
    const bookmarkedSloka = localStorage.getItem('shikshapatri-bookmark');
    
    slokas.forEach(sloka => {
        const card = document.createElement('div');
        card.className = 'sloka-card';
        if (bookmarkedSloka == sloka.id) {
            card.classList.add('bookmarked');
        }
        card.setAttribute('data-sloka-id', sloka.id);
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
    bookmarkBtn.style.display = 'block';

    // Update bookmark button state
    updateBookmarkButtonState();

    // Reset scroll position when entering detail view
    document.getElementById('main-content').scrollTop = 0;

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
        bookmarkBtn.style.display = 'none';
        currentSloka = null;
        // Scroll to bookmarked sloka when returning to list view
        setTimeout(scrollToBookmarkedSloka, 100);
    };

    bookmarkBtn.onclick = toggleBookmark;

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

// Swipe gesture handling
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}

function handleSwipe() {
    // Only handle swipes on detail screen
    if (!detailScreen.classList.contains('active')) return;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // Check if it's a horizontal swipe (not vertical)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
            // Swipe right - previous sloka
            if (currentSloka && currentSloka.id > 1) {
                showSloka(currentSloka.id - 1);
            }
        } else {
            // Swipe left - next sloka
            if (currentSloka && currentSloka.id < slokas.length) {
                showSloka(currentSloka.id + 1);
            }
        }
    }
}

// Add touch event listeners
document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchend', handleTouchEnd, false);

// Bookmark functionality
function toggleBookmark() {
    if (!currentSloka) return;
    
    const bookmarkedSloka = localStorage.getItem('shikshapatri-bookmark');
    if (bookmarkedSloka == currentSloka.id) {
        // Remove bookmark
        localStorage.removeItem('shikshapatri-bookmark');
        updateBookmarkBubble();
    } else {
        // Set bookmark
        localStorage.setItem('shikshapatri-bookmark', currentSloka.id);
        updateBookmarkBubble();
    }
    
    // Update button state and re-render slokas
    updateBookmarkButtonState();
    renderSlokas();
}

function updateBookmarkButtonState() {
    if (!currentSloka) return;
    
    const bookmarkedSloka = localStorage.getItem('shikshapatri-bookmark');
    if (bookmarkedSloka == currentSloka.id) {
        bookmarkBtn.classList.add('bookmarked');
    } else {
        bookmarkBtn.classList.remove('bookmarked');
    }
}

function updateBookmarkBubble() {
    const bookmarkedSloka = localStorage.getItem('shikshapatri-bookmark');
    if (bookmarkedSloka) {
        bookmarkBubble.textContent = bookmarkedSloka;
        bookmarkBubble.style.display = 'flex';
    } else {
        bookmarkBubble.style.display = 'none';
    }
}

function scrollToBookmarkedSloka() {
    const bookmarkedSloka = localStorage.getItem('shikshapatri-bookmark');
    if (bookmarkedSloka) {
        const slokaElement = document.querySelector(`[data-sloka-id="${bookmarkedSloka}"]`);
        if (slokaElement) {
            // Get the main content element and scroll it
            const mainContent = document.getElementById('main-content');
            const elementRect = slokaElement.getBoundingClientRect();
            const mainRect = mainContent.getBoundingClientRect();
            
            // Calculate the scroll position relative to the main content
            const scrollTop = mainContent.scrollTop + elementRect.top - mainRect.top - 100; // 100px offset
            
            mainContent.scrollTo({
                top: scrollTop,
                behavior: 'smooth'
            });
        }
    }
}

// Register service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('SW registered'))
        .catch(err => console.log('SW registration failed'));
}

// Start app
init();