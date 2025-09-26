let slokas = [];

async function loadSlokas() {
    try {
        const response = await fetch('assets/data.json');
        slokas = await response.json();
        displayAllSlokas();
    } catch (error) {
        console.error('Error loading slokas:', error);
        const container = document.getElementById('slokas-list');
        if (container) {
            container.innerHTML = '<p>Error loading content. Please try again later.</p>';
        }
    }
}

function displayAllSlokas() {
    const container = document.getElementById('slokas-list');
    if (!container) return;

    const lastRead = localStorage.getItem('lastReadSloka');
    const bookmarkedIndex = lastRead ? parseInt(lastRead) : -1;

    container.innerHTML = '';

    slokas.forEach((sloka, index) => {
        const isBookmarked = index === bookmarkedIndex;
        const slokaElement = document.createElement('div');
        slokaElement.className = `sloka-item${isBookmarked ? ' bookmarked' : ''}`;
        slokaElement.onclick = () => goToSloka(index + 1);

        slokaElement.innerHTML = `
            <div class="sloka-number">
                ${index + 1}
                ${isBookmarked ? '<span class="bookmark-indicator">🔖</span>' : ''}
            </div>
            <div class="sloka-text">${sloka.sanskrit.replace(/\n/g, '<br>')}</div>
        `;

        container.appendChild(slokaElement);
    });

    // Scroll to bookmarked sloka
    if (bookmarkedIndex >= 0 && bookmarkedIndex < slokas.length) {
        setTimeout(() => {
            const slokaElement = document.querySelector(`.sloka-item:nth-child(${bookmarkedIndex + 1})`);
            if (slokaElement) {
                slokaElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    }
}

function goToSloka(slokaNumber) {
    window.location.href = `index.html?sloka=${slokaNumber}`;
}

// Load slokas on page load
loadSlokas();

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('js/sw.js')
            .then(registration => {
                console.log('[SW] Service Worker registered successfully:', registration.scope);
            })
            .catch(error => {
                console.log('[SW] Service Worker registration failed:', error);
            });
    });
}