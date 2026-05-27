const storesContainer = document.getElementById('stores-container');
const addStoreBtn = document.getElementById('add-store-btn');
const conclusionBox = document.getElementById('conclusion-box');
const conclusionText = document.getElementById('conclusion-text');
const productNameInput = document.getElementById('product-name');

let storeCount = 0;
const maxStores = 4;

const storeOptions = ["Albert Heijn", "Kruidvat", "Colruyt", "Bol", "Plein", "Andere"];

function createStoreCard() {
    if (storeCount >= maxStores) return;
    storeCount++;

    const card = document.createElement('div');
    card.className = 'card store-card';
    card.id = `store-${storeCount}`;

    let optionsHtml = storeOptions.map(opt => `<option value="${opt}">${opt}</option>`).join('');

    card.innerHTML = `
        ${storeCount > 1 ? `<button class="remove-btn" onclick="removeStore('${card.id}')">✖ Verwijder</button>` : ''}
        
        <label>Winkel</label>
        <select class="store-name" onchange="calculate()">
            ${optionsHtml}
        </select>

        <label>Totale prijs in €</label>
        <input type="number" step="0.01" class="store-price" placeholder="Bijv. 15.99" oninput="calculate()">

        <label>Aantal eenheden</label>
        <input type="number" class="store-units" placeholder="Bijv. 52" oninput="calculate()">

        <label>Korting in %</label>
        <input type="number" step="0.1" class="store-discount" placeholder="Bijv. 10" value="0" oninput="calculate()">

        <div class="unit-price-result">Prijs per stuk: <span class="unit-price-display">€0.00</span></div>
    `;

    storesContainer.appendChild(card);
    updateAddButton();
}

function removeStore(id) {
    const card = document.getElementById(id);
    card.remove();
    storeCount--;
    updateAddButton();
    calculate();
}

function updateAddButton() {
    if (storeCount >= maxStores) {
        addStoreBtn.style.display = 'none';
    } else {
        addStoreBtn.style.display = 'block';
    }
}

function calculate() {
    const cards = document.querySelectorAll('.store-card');
    let results = [];

    cards.forEach(card => {
        const name = card.querySelector('.store-name').value;
        const price = parseFloat(card.querySelector('.store-price').value) || 0;
        const units = parseFloat(card.querySelector('.store-units').value) || 0;
        const discountPercent = parseFloat(card.querySelector('.store-discount').value) || 0;
        const display = card.querySelector('.unit-price-display');

        if (price > 0 && units > 0) {
            // Berekening met procentuele korting
            const discountAmount = price * (discountPercent / 100);
            const finalPrice = price - discountAmount;
            const unitPrice = finalPrice / units;
            
            display.innerText = `€${unitPrice.toFixed(4)}`;
            
            results.push({ name, unitPrice });
        } else {
            display.innerText = "€0.00";
        }
    });

    generateConclusion(results);
}

function generateConclusion(results) {
    if (results.length < 2) {
        conclusionBox.classList.add('hidden');
        return;
    }

    results.sort((a, b) => a.unitPrice - b.unitPrice);

    const cheapest = results[0];
    const secondCheapest = results[1];
    const diff = secondCheapest.unitPrice - cheapest.unitPrice;
    
    let product = productNameInput.value.trim() || "dit product";

    if (diff > 0) {
        const diffCents = (diff * 100).toFixed(1);
        conclusionText.innerHTML = `Koop ${product} bij <strong>${cheapest.name}</strong>!<br><br>Dat is <strong>${diffCents} cent per stuk goedkoper</strong> dan bij ${secondCheapest.name}.`;
    } else {
        conclusionText.innerHTML = `De prijs voor ${product} is exact hetzelfde bij ${cheapest.name} en ${secondCheapest.name}.`;
    }

    conclusionBox.classList.remove('hidden');
}

// Start direct met 2 winkelvelden om vlot te vergelijken
createStoreCard();
createStoreCard();
