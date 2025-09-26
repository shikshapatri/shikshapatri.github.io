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

    container.innerHTML = '';

    slokas.forEach((sloka, index) => {
        const slokaElement = document.createElement('div');
        slokaElement.className = 'sloka-item';
        slokaElement.onclick = () => goToSloka(index + 1);

        slokaElement.innerHTML = `
            <div class="sloka-number">${index + 1}</div>
            <div class="sloka-text">${sloka.sanskrit.replace(/\n/g, '<br>')}</div>
        `;

        container.appendChild(slokaElement);
    });
}

function goToSloka(slokaNumber) {
    window.location.href = `index.html?sloka=${slokaNumber}`;
}

// Load slokas on page load
loadSlokas();