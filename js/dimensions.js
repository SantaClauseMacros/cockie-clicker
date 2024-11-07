// dimensions.js - Dimensional Travel and Alternate Realities System

class DimensionalSystem {
    constructor(game) {
        this.game = game;
        this.currentDimension = 'normal';
        this.unlockedDimensions = new Set(['normal']);
        this.dimensionalEnergy = 0;
        this.maxEnergy = CONFIG.DIMENSIONS.MAX_ENERGY;
        
        this.dimensions = {
            normal: {
                name: "Normal Reality",
                icon: "🌍",
                multiplier: 1,
                description: "Your home dimension",
                unlocked: true,
                color: "#4CAF50"
            },
            quantum: {
                name: "Quantum Realm",
                icon: "⚛️",
                multiplier: 2,
                energyCost: 10,
                description: "Cookies exist in multiple states simultaneously",
                unlockCost: 1000000,
                color: "#2196F3",
                effect: () => this.enableQuantumEffects()
            },
            celestial: {
                name: "Celestial Plane",
                icon: "✨",
                multiplier: 5,
                energyCost: 25,
                description: "Harness the power of cosmic cookies",
                unlockCost: 10000000,
                color: "#9C27B0",
                effect: () => this.enableCelestialEffects()
            },
            void: {
                name: "Cookie Void",
                icon: "🌌",
                multiplier: 10,
                energyCost: 50,
                description: "The mysterious source of all cookies",
                unlockCost: 100000000,
                color: "#000000",
                effect: () => this.enableVoidEffects()
            },
            fractal: {
                name: "Fractal Dimension",
                icon: "💠",
                multiplier: 20,
                energyCost: 100,
                description: "Infinite recursive cookies",
                unlockCost: 1000000000,
                color: "#E91E63",
                effect: () => this.enableFractalEffects()
            }
        };

        this.initializeUI();
        this.startEnergyGeneration();
    }

    initializeUI() {
        const container = document.createElement('div');
        container.id = 'dimension-panel';
        container.className = 'dimension-panel';
        
        container.innerHTML = `
            <h3>Dimensional Travel</h3>
            <div class="dimensional-energy">
                <div class="energy-bar">
                    <div class="energy-fill"></div>
                </div>
                <span class="energy-text">0/${this.maxEnergy} Energy</span>
            </div>
            <div class="dimensions-grid"></div>
        `;
        
        document.getElementById('upgrades-panel').appendChild(container);
        this.updateUI();
    }

    updateUI() {
        const grid = document.querySelector('.dimensions-grid');
        if (!grid) return;

        grid.innerHTML = '';

        Object.entries(this.dimensions).forEach(([dimId, dim]) => {
            const isUnlocked = this.unlockedDimensions.has(dimId);
            const isCurrent = this.currentDimension === dimId;
            const hasEnoughEnergy = this.dimensionalEnergy >= (dim.energyCost || 0);

            const dimElement = document.createElement('div');
            dimElement.className = `dimension-tile ${isUnlocked ? 'unlocked' : 'locked'} ${isCurrent ? 'active' : ''}`;
            dimElement.style.borderColor = dim.color;

            dimElement.innerHTML = `
                <div class="dimension-icon">${dim.icon}</div>
                <div class="dimension-info">
                    <h4>${dim.name}</h4>
                    <p>${dim.description}</p>
                    ${dim.energyCost ? `<p class="energy-cost">Energy Cost: ${dim.energyCost}</p>` : ''}
                    ${dim.multiplier ? `<p>Multiplier: x${dim.multiplier}</p>` : ''}
                </div>
                ${!isUnlocked ? 
                    `<button class="unlock-button">Unlock (${Utils.formatNumber(dim.unlockCost)} cookies)</button>` :
                    `<button class="travel-button" ${(!hasEnoughEnergy || isCurrent) ? 'disabled' : ''}>
                        ${isCurrent ? 'Current' : 'Travel'}
                    </button>`
                }
            `;

            if (!isUnlocked) {
                dimElement.querySelector('.unlock-button').onclick = () => this.unlockDimension(dimId);
            } else if (!isCurrent && hasEnoughEnergy) {
                dimElement.querySelector('.travel-button').onclick = () => this.travelToDimension(dimId);
            }

            grid.appendChild(dimElement);
        });

        // Update energy display
        const energyFill = document.querySelector('.energy-fill');
        const energyText = document.querySelector('.energy-text');
        if (energyFill && energyText) {
            const percentage = (this.dimensionalEnergy / this.maxEnergy) * 100;
            energyFill.style.width = `${percentage}%`;
            energyText.textContent = `${Math.floor(this.dimensionalEnergy)}/${this.maxEnergy} Energy`;
        }
    }

    unlockDimension(dimId) {
        const dimension = this.dimensions[dimId];
        if (!dimension || this.unlockedDimensions.has(dimId)) return;

        if (this.game.cookies >= dimension.unlockCost) {
            this.game.cookies -= dimension.unlockCost;
            this.unlockedDimensions.add(dimId);
            Utils.showNotification(`Unlocked ${dimension.name}!`);
            this.updateUI();
        } else {
            Utils.showNotification("Not enough cookies!");
        }
    }

    travelToDimension(dimId) {
        const dimension = this.dimensions[dimId];
        if (!dimension || !this.unlockedDimensions.has(dimId)) return;
        if (this.dimensionalEnergy < dimension.energyCost) return;

        // Create portal effect
        this.createPortalEffect(() => {
            this.currentDimension = dimId;
            this.dimensionalEnergy -= dimension.energyCost;
            this.game.globalMultiplier *= dimension.multiplier / this.dimensions[this.currentDimension].multiplier;
            
            if (dimension.effect) dimension.effect();
            
            Utils.showNotification(`Traveled to ${dimension.name}!`);
            this.updateUI();
        });
    }

    createPortalEffect(callback) {
        const portal = document.createElement('div');
        portal.className = 'dimensional-portal';
        document.body.appendChild(portal);

        // Animation
        setTimeout(() => {
            portal.style.opacity = '1';
            setTimeout(() => {
                callback();
                portal.style.opacity = '0';
                setTimeout(() => portal.remove(), 500);
            }, 1000);
        }, 0);
    }

    startEnergyGeneration() {
        setInterval(() => {
            if (this.dimensionalEnergy < this.maxEnergy) {
                this.dimensionalEnergy += CONFIG.DIMENSIONS.ENERGY_GAIN_RATE;
                this.dimensionalEnergy = Math.min(this.dimensionalEnergy, this.maxEnergy);
                this.updateUI();
            }
        }, 1000);
    }

    enableQuantumEffects() {
        this.game.quantumChance = 0.1; // 10% chance for quantum events
        setInterval(() => {
            if (Math.random() < this.game.quantumChance) {
                this.triggerQuantumEvent();
            }
        }, 10000);
    }

    enableCelestialEffects() {
        this.game.celestialBlessings = true;
        setInterval(() => {
            this.triggerCelestialBlessing();
        }, 30000);
    }

    enableVoidEffects() {
        this.game.voidPower = true;
        this.game.clickPower *= 2;
    }

    enableFractalEffects() {
        this.game.fractalMultiplier = 1.5;
        setInterval(() => {
            this.generateFractalCookies();
        }, 5000);
    }

    triggerQuantumEvent() {
        const events = [
            {name: "Quantum Multiplication", effect: () => this.game.cookies *= 1.1},
            {name: "Quantum Surge", effect: () => this.game.cookiesPerSecond *= 2, duration: 10},
            {name: "Quantum Entanglement", effect: () => this.game.clickPower *= 3, duration: 5}
        ];

        const event = events[Math.floor(Math.random() * events.length)];
        event.effect();
        Utils.showNotification(`Quantum Event: ${event.name}`);
    }

    triggerCelestialBlessing() {
        const blessing = Math.random() * 100;
        this.game.cookies += blessing * this.game.cookiesPerSecond;
        Utils.showNotification("Celestial Blessing received!");
    }

    generateFractalCookies() {
        const fractalBonus = this.game.cookiesPerSecond * this.game.fractalMultiplier;
        this.game.cookies += fractalBonus;
        Utils.createFloatingText(
            document.querySelector('.cookie'),
            `+${Utils.formatNumber(fractalBonus)} fractal cookies`
        );
    }

    save() {
        return {
            currentDimension: this.currentDimension,
            unlockedDimensions: Array.from(this.unlockedDimensions),
            dimensionalEnergy: this.dimensionalEnergy
        };
    }

    load(saveData) {
        if (!saveData) return;

        this.currentDimension = saveData.currentDimension || 'normal';
        this.unlockedDimensions = new Set(saveData.unlockedDimensions || ['normal']);
        this.dimensionalEnergy = saveData.dimensionalEnergy || 0;
        
        this.updateUI();
    }
}

// Export the DimensionalSystem
window.DimensionalSystem = DimensionalSystem;
