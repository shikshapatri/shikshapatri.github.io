let slokas = [];
let currentIndex = 0;
let translationLanguage = 'gujarati'; // Default to Gujarati

async function loadSlokas() {
    try {
        const response = await fetch('assets/data.json');
        slokas = await response.json();
        
        // Get sloka from URL query param
        const urlParams = new URLSearchParams(window.location.search);
        const slokaParam = urlParams.get('sloka');
        if (slokaParam && !isNaN(slokaParam)) {
            currentIndex = parseInt(slokaParam) - 1;
            if (currentIndex < 0 || currentIndex >= slokas.length) {
                currentIndex = 0;
            }
        }
        
        document.getElementById('sloka-slider').max = slokas.length;
        displaySloka();
        updateControls();
        updateBookmarkDisplay();
    } catch (error) {
        console.error('Error loading slokas:', error);
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.innerHTML = '<p>Error loading content. Please try again later.</p>';
        }
    }
}

function displaySloka() {
    const sloka = slokas[currentIndex];
    if (!sloka) return;

    // Update sloka number badge
    const numberBadge = document.getElementById('sloka-number-badge');
    if (numberBadge) {
        numberBadge.textContent = currentIndex + 1;
    }

    // Clear and update Sanskrit text with line breaks
    const sanskritElement = document.getElementById('sanskrit-text');
    if (sanskritElement) {
        sanskritElement.innerHTML = '';
        sanskritElement.innerHTML = sloka.sanskrit.replace(/\n/g, '<br>');
    }

    // Clear and update translation text with line breaks
    const translationElement = document.getElementById('translation-text');
    if (translationElement) {
        translationElement.innerHTML = '';
        const translationText = translationLanguage === 'gujarati' ? sloka.gujarati : sloka.english;
        translationElement.innerHTML = translationText.replace(/\n/g, '<br>');

        // Force layout recalculation on mobile devices
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            setTimeout(() => {
                translationElement.style.display = 'block';
                translationElement.offsetHeight; // Force reflow
            }, 10);
        }
    }

    updateTranslationButtons();
}

function updateControls() {
    document.getElementById('current-sloka').textContent = currentIndex + 1;
    document.getElementById('total-slokas').textContent = slokas.length;
    document.getElementById('sloka-slider').value = currentIndex + 1;
    document.getElementById('prev-btn').disabled = currentIndex === 0;
    document.getElementById('next-btn').disabled = currentIndex === slokas.length - 1;
}

function updateTranslationButtons() {
    document.getElementById('toggle-gujarati').classList.toggle('active', translationLanguage === 'gujarati');
    document.getElementById('toggle-english').classList.toggle('active', translationLanguage === 'english');
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        displaySloka();
        updateControls();
        scrollToTop();
    }
});

document.getElementById('next-btn').addEventListener('click', () => {
    if (currentIndex < slokas.length - 1) {
        currentIndex++;
        displaySloka();
        updateControls();
        scrollToTop();
    }
});

document.getElementById('toggle-gujarati').addEventListener('click', () => {
    translationLanguage = 'gujarati';
    displaySloka();
    updateTranslationButtons();
});

document.getElementById('toggle-english').addEventListener('click', () => {
    translationLanguage = 'english';
    displaySloka();
    updateTranslationButtons();
});

document.getElementById('zoom-slider').addEventListener('input', function() {
    const scale = this.value;
    const translationText = document.querySelector('.translation-text');
    translationText.style.fontSize = `${1.1 * scale}rem`;
});

// Add event listeners for zoom icons
document.querySelector('.zoom-control .fa-search-minus').addEventListener('click', () => {
    const slider = document.getElementById('zoom-slider');
    const currentValue = parseFloat(slider.value);
    const minValue = parseFloat(slider.min);
    const step = parseFloat(slider.step);
    const newValue = Math.max(minValue, currentValue - step);
    slider.value = newValue;
    slider.dispatchEvent(new Event('input'));
});

document.querySelector('.zoom-control .fa-search-plus').addEventListener('click', () => {
    const slider = document.getElementById('zoom-slider');
    const currentValue = parseFloat(slider.value);
    const maxValue = parseFloat(slider.max);
    const step = parseFloat(slider.step);
    const newValue = Math.min(maxValue, currentValue + step);
    slider.value = newValue;
    slider.dispatchEvent(new Event('input'));
});

document.getElementById('sloka-slider').addEventListener('input', function() {
    currentIndex = this.value - 1;
    displaySloka();
    updateControls();
    scrollToTop();
});

// Register service worker with versioning support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('js/sw.js')
            .then(registration => {
                console.log('[APP] SW registered successfully:', registration);
                
                // Check for updates
                registration.addEventListener('updatefound', () => {
                    console.log('[APP] SW update found');
                    const newWorker = registration.installing;
                    
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('[APP] New SW installed, prompting user to refresh');
                            // You could show a toast/notification here to refresh
                            if (confirm('App updated! Refresh to use the latest version?')) {
                                window.location.reload();
                            }
                        }
                    });
                });
                
                // Check for waiting SW
                if (registration.waiting) {
                    console.log('[APP] SW waiting, prompting user to refresh');
                    if (confirm('App update ready! Refresh to use the latest version?')) {
                        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                        window.location.reload();
                    }
                }
            })
            .catch(error => {
                console.error('[APP] SW registration failed:', error);
            });
            
        // Listen for SW messages
        navigator.serviceWorker.addEventListener('message', event => {
            if (event.data && event.data.type === 'SW_UPDATED') {
                console.log('[APP] SW updated successfully');
            }
        });
        
        // Handle SW controller change
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('[APP] SW controller changed, reloading page');
            window.location.reload();
        });
    });
}

// Redirect to all-slokas.html if no sloka param
if (!new URLSearchParams(window.location.search).has('sloka')) {
    window.location.href = 'all-slokas.html';
}

// Load slokas on page load
loadSlokas();

// Touch gesture handling for swipe navigation
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

const slokaDisplay = document.querySelector('.sloka-display');

slokaDisplay.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
});

slokaDisplay.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // Check if horizontal swipe is dominant (not vertical)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
            // Swipe right - go to previous sloka
            if (currentIndex > 0) {
                currentIndex--;
                displaySloka();
                updateControls();
                scrollToTop();
            }
        } else {
            // Swipe left - go to next sloka
            if (currentIndex < slokas.length - 1) {
                currentIndex++;
                displaySloka();
                updateControls();
                scrollToTop();
            }
        }
    }
}

// Bookmark functionality
document.getElementById('bookmark-btn').addEventListener('click', () => {
    localStorage.setItem('lastReadSloka', currentIndex);
    updateBookmarkDisplay();
    // Visual feedback
    const btn = document.getElementById('bookmark-btn');
    btn.textContent = '✅';
    setTimeout(() => {
        btn.textContent = '🔖';
    }, 1000);
});

// Update bookmark display in header
function updateBookmarkDisplay() {
    const bookmarkBubble = document.getElementById('bookmark-bubble');
    const lastRead = localStorage.getItem('lastReadSloka');
    
    if (lastRead !== null) {
        const slokaNumber = parseInt(lastRead) + 1;
        bookmarkBubble.textContent = slokaNumber;
        bookmarkBubble.classList.add('show');
    } else {
        bookmarkBubble.textContent = '';
        bookmarkBubble.classList.remove('show');
    }
}