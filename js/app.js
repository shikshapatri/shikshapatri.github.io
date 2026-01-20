// Global variables
let slokas = [];
let currentSloka = null;
let currentLang = 'gujarati'; // 'gujarati', 'english', or 'hindi'
let isLoading = false;

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
const hindiPill = document.getElementById('hindi-pill');
const prevSlokaBtn = document.getElementById('prev-sloka-btn');
const nextSlokaBtn = document.getElementById('next-sloka-btn');
const slokaSlider = document.getElementById('sloka-slider');
const slokaCounter = document.getElementById('sloka-counter');
const backBtn = document.getElementById('back-btn');
const bookmarkBtn = document.getElementById('bookmark-btn');
const bookmarkBubble = document.getElementById('bookmark-bubble');
const searchBtn = document.getElementById('search-btn');
const searchModal = document.getElementById('search-modal');
const closeSearchBtn = document.getElementById('close-search-btn');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

// Initialize app
async function init() {
    showLoadingState();

    try {
        // Load data
        const response = await fetch('assets/data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        slokas = await response.json();

        // Set slider max
        slokaSlider.max = slokas.length;
        slokaSlider.setAttribute('aria-valuemax', slokas.length);

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

        // Setup keyboard navigation
        setupKeyboardNavigation();

        // Setup Search
        setupSearch();

    } catch (error) {
        console.error('Error loading data:', error);
        showErrorState();
    }
}

// Show loading state
function showLoadingState() {
    isLoading = true;
    slokasList.innerHTML = '';
    for (let i = 0; i < 6; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = 'sloka-card skeleton';
        skeleton.style.height = '80px';
        skeleton.setAttribute('aria-hidden', 'true');
        slokasList.appendChild(skeleton);
    }
}

// Show error state
function showErrorState() {
    isLoading = false;
    slokasList.innerHTML = `
        <div class="error-message" role="alert">
            <p>Error loading slokas. Please check your connection and try again.</p>
            <button onclick="init()" aria-label="Retry loading slokas">Retry</button>
        </div>
    `;
}

// Render slokas list
function renderSlokas() {
    isLoading = false;
    slokasList.innerHTML = '';
    const bookmarkedSloka = localStorage.getItem('shikshapatri-bookmark');

    slokas.forEach(sloka => {
        const card = document.createElement('div');
        card.className = 'sloka-card';
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `Sloka ${sloka.id}: ${sloka.sanskrit.substring(0, 50)}...`);

        if (bookmarkedSloka == sloka.id) {
            card.classList.add('bookmarked');
            card.setAttribute('aria-label', `Sloka ${sloka.id} (bookmarked): ${sloka.sanskrit.substring(0, 50)}...`);
        }
        card.setAttribute('data-sloka-id', sloka.id);

        // Click handler
        card.onclick = () => showSloka(sloka.id);

        // Keyboard handler
        card.onkeydown = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showSloka(sloka.id);
            }
        };

        card.innerHTML = `
            <div class="sloka-header">
                <div class="sloka-number-bubble" aria-hidden="true">${sloka.id}</div>
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

    // Set image with lazy loading
    slokaImage.src = `assets/pictorial/${id}.png`;
    slokaImage.alt = `Pictorial illustration for Sloka ${id}`;
    slokaImage.loading = 'lazy';

    slokaSanskrit.innerHTML = currentSloka.sanskrit.replace(/\n/g, '<br>');

    if (currentLang === 'gujarati') {
        slokaText.textContent = currentSloka.gujarati;
        slokaText.classList.add('gujarati');
        slokaText.classList.remove('hindi');
        slokaTranslation.style.display = 'none';
    } else if (currentLang === 'hindi') {
        slokaText.textContent = currentSloka.hindi || currentSloka.english;
        slokaText.classList.add('hindi');
        slokaText.classList.remove('gujarati');
        slokaTranslation.style.display = 'none';
    } else {
        slokaText.textContent = currentSloka.english;
        slokaText.classList.remove('gujarati');
        slokaText.classList.remove('hindi');
        slokaTranslation.style.display = 'none';
    }

    slokaSlider.value = id;
    slokaSlider.setAttribute('aria-valuenow', id);
    slokaSlider.setAttribute('aria-valuetext', `Sloka ${id} of ${slokas.length}`);
    slokaCounter.textContent = `${id}/${slokas.length}`;

    listScreen.classList.remove('active');
    detailScreen.classList.add('active');
    backBtn.style.display = 'block';
    bookmarkBtn.style.display = 'block';
    searchBtn.style.display = 'none';

    // Update bookmark button state
    updateBookmarkButtonState();

    // Reset scroll position when entering detail view
    document.getElementById('main-content').scrollTop = 0;

    updateNavButtons();

    // Focus on the content for screen readers
    slokaImage.focus();
}

// Update navigation buttons
function updateNavButtons() {
    const currentId = currentSloka.id;

    prevSlokaBtn.disabled = currentId === 1;
    prevSlokaBtn.setAttribute('aria-label', currentId === 1 ? 'No previous sloka' : `Go to sloka ${currentId - 1}`);

    nextSlokaBtn.disabled = currentId === slokas.length;
    nextSlokaBtn.setAttribute('aria-label', currentId === slokas.length ? 'No next sloka' : `Go to sloka ${currentId + 1}`);
}

// Update language pills
function updateLanguagePills() {
    gujaratiPill.classList.toggle('active', currentLang === 'gujarati');
    englishPill.classList.toggle('active', currentLang === 'english');
    hindiPill.classList.toggle('active', currentLang === 'hindi');

    gujaratiPill.setAttribute('aria-pressed', currentLang === 'gujarati');
    englishPill.setAttribute('aria-pressed', currentLang === 'english');
    hindiPill.setAttribute('aria-pressed', currentLang === 'hindi');
}

// Setup navigation
function setupNavigation() {
    backBtn.onclick = () => {
        detailScreen.classList.remove('active');
        listScreen.classList.add('active');
        backBtn.style.display = 'none';
        bookmarkBtn.style.display = 'none';
        searchBtn.style.display = 'flex';
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

    hindiPill.onclick = () => {
        currentLang = 'hindi';
        localStorage.setItem('shikshapatri-lang', currentLang);
        updateLanguagePills();
        if (currentSloka) showSloka(currentSloka.id);
    };
}

// Setup keyboard navigation
function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Only handle if detail screen is active
        if (!detailScreen.classList.contains('active')) return;

        switch (e.key) {
            case 'ArrowLeft':
                if (currentSloka && currentSloka.id > 1) {
                    e.preventDefault();
                    showSloka(currentSloka.id - 1);
                }
                break;
            case 'ArrowRight':
                if (currentSloka && currentSloka.id < slokas.length) {
                    e.preventDefault();
                    showSloka(currentSloka.id + 1);
                }
                break;
            case 'Escape':
                e.preventDefault();
                backBtn.click();
                break;
            case 'b':
            case 'B':
                if (!e.ctrlKey && !e.metaKey) {
                    e.preventDefault();
                    toggleBookmark();
                }
                break;
        }
    });
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

// Add touch event listeners with passive option for performance
document.addEventListener('touchstart', handleTouchStart, { passive: true });
document.addEventListener('touchend', handleTouchEnd, { passive: true });

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
    const isBookmarked = bookmarkedSloka == currentSloka.id;

    if (isBookmarked) {
        bookmarkBtn.classList.add('bookmarked');
        bookmarkBtn.setAttribute('aria-label', 'Remove bookmark from this sloka');
        bookmarkBtn.setAttribute('aria-pressed', 'true');
    } else {
        bookmarkBtn.classList.remove('bookmarked');
        bookmarkBtn.setAttribute('aria-label', 'Bookmark this sloka');
        bookmarkBtn.setAttribute('aria-pressed', 'false');
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
            const scrollTop = mainContent.scrollTop + elementRect.top - mainRect.top - 80; // 80px offset

            mainContent.scrollTo({
                top: scrollTop,
                behavior: 'smooth'
            });
        }
    }
}

// Search Functionality
function setupSearch() {
    // Open Modal
    searchBtn.addEventListener('click', () => {
        searchModal.setAttribute('aria-hidden', 'false');
        searchInput.focus();
    });

    // Close Modal
    function closeSearch() {
        searchModal.setAttribute('aria-hidden', 'true');
        searchInput.value = '';
        searchResults.innerHTML = '';
    }

    closeSearchBtn.addEventListener('click', closeSearch);

    // Close on backdrop click
    searchModal.addEventListener('click', (e) => {
        if (e.target === searchModal) {
            closeSearch();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchModal.getAttribute('aria-hidden') === 'false') {
            closeSearch();
        }
    });

    // Search Input Logic
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        const query = e.target.value.toLowerCase().trim();

        if (query.length < 2) {
            searchResults.innerHTML = '';
            return;
        }

        debounceTimer = setTimeout(() => {
            performSearch(query);
        }, 300);
    });

    // Perform Search
    function performSearch(query) {
        const results = slokas.filter(sloka => {
            const sanskrit = (sloka.sanskrit || '').toLowerCase();
            const gujarati = (sloka.gujarati || '').toLowerCase();
            const hindi = (sloka.hindi || '').toLowerCase();
            const english = (sloka.english || '').toLowerCase();
            const id = sloka.id.toString();

            return id.includes(query) ||
                sanskrit.includes(query) ||
                gujarati.includes(query) ||
                hindi.includes(query) ||
                english.includes(query);
        });

        displaySearchResults(results, query);
    }

    // Display Results
    function displaySearchResults(results, query) {
        searchResults.innerHTML = '';

        if (results.length === 0) {
            searchResults.innerHTML = '<div class="no-results">No slokas found matching your query.</div>';
            return;
        }

        results.forEach(sloka => {
            const item = document.createElement('div');
            item.className = 'search-result-item';
            item.setAttribute('role', 'button');
            item.setAttribute('tabindex', '0');

            // Highlight text based on current language or default to English/Hindi if query matches there
            // Simple snippet generation
            let snippet = sloka.english;
            if (currentLang === 'gujarati') snippet = sloka.gujarati;
            if (currentLang === 'hindi') snippet = sloka.hindi;

            item.innerHTML = `
                <div class="result-header">
                    <span>Sloka ${sloka.id}</span>
                </div>
                <div class="result-snippet">${snippet}</div>
            `;

            item.addEventListener('click', () => {
                showSloka(sloka.id);
                closeSearch();
            });

            // Enter key support
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    showSloka(sloka.id);
                    closeSearch();
                }
            });

            searchResults.appendChild(item);
        });
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