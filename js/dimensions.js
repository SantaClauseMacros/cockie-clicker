// dimensions.js - Dimensional Travel and Alternate Realities System
class DimensionManager {
    constructor(game) {
        this.game = game;
        this.currentDimension = 'normal';
        this.unlockedDimensions = new Set(['normal']);
        this.dimensionalEnergy = 0;
        this.maxEnergy = 100;
        
        this.dimensions = {
            normal: {
                name: "Normal Reality",
                icon: "🌍",
                multiplier: 1,
                description: "Your home dimension",
                color: "#4CAF50",
                unlocked: true
            },
            quantum: {
                name: "Quantum Realm",
                icon: "⚛️",
                multiplier: 2,
                description: "Cookies exist in multiple states",
                cost: 1000000,
                color: "#2196F3",
                unlocked: false
            },
            celestial: {
                name: "Celestial Dimension",
                icon: "✨",
                multiplier: 5,
                description: "Harness cosmic cookie energy",
                cost: 10000000,
                color: "#9C27B0",
                unlocked: false
            },
            void: {
                name: "Cookie Void",
                icon: "🌌",
                multiplier: 10,
                description: "The source of all cookies",
                cost: 100000000,
                color: "#000000",
                unlocked: false
            },
            mirror: {
                name: "Mirror Universe",
                icon: "🪞",
                multiplier: 25,
                description: "Everything is deliciously backwards",
                cost: 1000000000,
                color: "#E91E63",
                unlocked: false
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
        
        document.getElementById('dimensions-container').appendChild(container);
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
                    ${dim.cost ? `<p class="cost">Cost: ${this.game.formatNumber(dim.cost)} cookies</p>` : ''}
                    ${dim.energyCost ? `<p class="energy-cost">Energy: ${dim.energyCost}</p>` : ''}
                    <p class="multiplier">×${dim.multiplier} production</p>
                </div>
            `;

            if (!isUnlocked) {
                dimElement.onclick = () => this.unlockDimension(dimId);
            } else if (!isCurrent && hasEnoughEnergy) {
                dimElement.onclick = () => this.travelToDimension(dimId);
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

        if (this.game.cookies >= dimension.cost) {
            this.game.cookies -= dimension.cost;
            this.unlockedDimensions.add(dimId);
            
            Utils.screenFlash(dimension.color);
            Utils.showNotification(`Unlocked ${dimension.name}!`, 'dimension');
            
            this.updateUI();
            this.game.updateUI();
        } else {
            Utils.showNotification('Not enough cookies!', 'error');
        }
    }

    travelToDimension(dimId) {
        const dimension = this.dimensions[dimId];
        if (!dimension || !this.unlockedDimensions.has(dimId)) return;

        this.createPortalEffect(() => {
            const oldDimension = this.dimensions[this.currentDimension];
            this.currentDimension = dimId;
            
            // Update game multiplier
            this.game.globalMultiplier *= (dimension.multiplier / oldDimension.multiplier);
            
            // Apply dimension effects
            this.applyDimensionEffects(dimension);
            
            this.updateUI();
        });
    }

    createPortalEffect(callback) {
        const portal = document.createElement('div');
        portal.className = 'dimensional-portal';
        portal.style.backgroundColor = this.dimensions[this.currentDimension].color;
        document.body.appendChild(portal);

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
                this.dimensionalEnergy += 0.1;
                this.dimensionalEnergy = Math.min(this.dimensionalEnergy, this.maxEnergy);
                this.updateUI();
            }
        }, 1000);
    }

    applyDimensionEffects(dimension) {
        switch (dimension.name) {
            case "Quantum Realm":
                this.startQuantumEffects();
                break;
            case "Celestial Dimension":
                this.startCelestialEffects();
                break;
            case "Cookie Void":
                this.startVoidEffects();
                break;
            case "Mirror Universe":
                this.startMirrorEffects();
                break;
        }
    }

    startQuantumEffects() {
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% chance per second
                const bonus = this.game.cookiesPerSecond * 10;
                this.game.addCookies(bonus);
                Utils.createFloatingText(
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerHeight,
                    "Quantum Surge!",
                    '#2196F3'
                );
            }
        }, 1000);
    }

    startCelestialEffects() {
        setInterval(() => {
            if (Math.random() < 0.05) { // 5% chance per second
                const multiplier = Math.random() * 4 + 1; // 1x to 5x
                this.game.globalMultiplier *= multiplier;
                setTimeout(() => {
                    this.game.globalMultiplier /= multiplier;
                }, 10000);
                Utils.showNotification(`Celestial blessing: ×${multiplier.toFixed(1)} production!`, 'dimension');
            }
        }, 1000);
    }

    startVoidEffects() {
        setInterval(() => {
            if (Math.random() < 0.01) { // 1% chance per second
                this.game.cookies *= 1.1;
                Utils.showNotification('Void energy surges through your cookies!', 'dimension');
            }
        }, 1000);
    }

    startMirrorEffects() {
        // In mirror universe, clicking gives CPS bonus and idle gives click bonus
        const originalClickPower = this.game.clickPower;
        const originalCPS = this.game.cookiesPerSecond;
        
        this.game.clickPower = originalCPS;
        this.game.cookiesPerSecond = originalClickPower;
        
        Utils.showNotification('Everything is reversed in the mirror universe!', 'dimension');
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

// Export DimensionManager
window.DimensionManager = DimensionManager;
