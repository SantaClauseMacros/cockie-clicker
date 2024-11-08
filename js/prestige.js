// prestige.js - Prestige System and Heavenly Upgrades
class PrestigeSystem {
    constructor(game) {
        this.game = game;
        this.heavenlyChips = 0;
        this.totalHeavenlyChips = 0;
        this.prestigeLevel = 0;
        this.upgrades = this.initializePrestigeUpgrades();
        this.purchased = new Set();
        
        this.renderPrestige();
        this.checkPrestigeButton();
    }

    initializePrestigeUpgrades() {
        return {
            // Production Multipliers
            multipliers: [
                {
                    id: 'heavenly_cookies',
                    name: 'Heavenly Cookies',
                    description: 'Cookie production multiplier +1% per prestige level',
                    icon: '👼',
                    cost: 1,
                    effect: () => {
                        this.game.globalMultiplier *= (1 + this.prestigeLevel * 0.01);
                    }
                },
                {
                    id: 'divine_bakery',
                    name: 'Divine Bakery',
                    description: 'Cookie production multiplier +5% per prestige level',
                    icon: '🏛️',
                    cost: 10,
                    effect: () => {
                        this.game.globalMultiplier *= (1 + this.prestigeLevel * 0.05);
                    }
                },
                {
                    id: 'cosmic_ovens',
                    name: 'Cosmic Ovens',
                    description: 'Cookie production multiplier +10% per prestige level',
                    icon: '🌌',
                    cost: 50,
                    effect: () => {
                        this.game.globalMultiplier *= (1 + this.prestigeLevel * 0.1);
                    }
                }
            ],

            // Click Power Upgrades
            clicking: [
                {
                    id: 'heavenly_fingers',
                    name: 'Heavenly Fingers',
                    description: 'Clicking power +1% per prestige level',
                    icon: '☝️',
                    cost: 2,
                    effect: () => {
                        this.game.clickPower *= (1 + this.prestigeLevel * 0.01);
                    }
                },
                {
                    id: 'angel_clicks',
                    name: 'Angel Clicks',
                    description: 'Clicking power +5% per prestige level',
                    icon: '🤘',
                    cost: 20,
                    effect: () => {
                        this.game.clickPower *= (1 + this.prestigeLevel * 0.05);
                    }
                }
            ],

            // Special Features
            special: [
                {
                    id: 'golden_wings',
                    name: 'Golden Wings',
                    description: 'Golden cookies appear 5% more often per prestige level',
                    icon: '👐',
                    cost: 5,
                    effect: () => {
                        this.game.goldenCookieFrequency *= (1 + this.prestigeLevel * 0.05);
                    }
                },
                {
                    id: 'heavenly_luck',
                    name: 'Heavenly Luck',
                    description: 'All random events are 10% more likely to be positive',
                    icon: '🍀',
                    cost: 15,
                    effect: () => {
                        this.game.luckMultiplier = 1.1;
                    }
                },
                {
                    id: 'divine_discount',
                    name: 'Divine Discount',
                    description: 'All buildings cost 1% less per prestige level',
                    icon: '💰',
                    cost: 25,
                    effect: () => {
                        this.game.costReduction = this.prestigeLevel * 0.01;
                    }
                }
            ],

            // Start Bonus Upgrades
            startBonus: [
                {
                    id: 'heavenly_inheritance',
                    name: 'Heavenly Inheritance',
                    description: 'Start with 1% of your previous cookies after prestige',
                    icon: '📜',
                    cost: 30,
                    effect: () => {
                        this.game.startingBonus = 0.01;
                    }
                },
                {
                    id: 'divine_memory',
                    name: 'Divine Memory',
                    description: 'Start with 1 of each building you had in previous run',
                    icon: '🧠',
                    cost: 40,
                    effect: () => {
                        this.game.keepBuildings = true;
                    }
                }
            ]
        };
    }

    calculatePrestigeGain() {
        return Math.floor(Math.pow(this.game.totalCookiesBaked / 1e12, 0.5));
    }

    canPrestige() {
        return this.calculatePrestigeGain() > 0;
    }

    prestige() {
        if (!this.canPrestige()) return false;

        const gain = this.calculatePrestigeGain();
        this.heavenlyChips += gain;
        this.totalHeavenlyChips += gain;
        this.prestigeLevel++;

        // Create prestige effect
        this.createPrestigeEffect();

        // Reset game but keep prestige upgrades
        this.resetGame();

        // Show prestige notification
        Utils.showNotification(
            `Ascended! Gained ${Utils.formatNumber(gain)} heavenly chips!`,
            'prestige'
        );

        return true;
    }

    createPrestigeEffect() {
        // Create visual effect
        Utils.screenFlash('#ffffff', 1000);

        // Create particle effect
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                Utils.createParticles(
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerHeight,
                    'prestige'
                );
            }, i * 50);
        }
    }

    resetGame() {
        // Save prestige data
        const prestigeData = {
            heavenlyChips: this.heavenlyChips,
            totalHeavenlyChips: this.totalHeavenlyChips,
            prestigeLevel: this.prestigeLevel,
            purchased: Array.from(this.purchased)
        };

        // Reset game
        this.game.resetGame();

        // Restore prestige data
        this.heavenlyChips = prestigeData.heavenlyChips;
        this.totalHeavenlyChips = prestigeData.totalHeavenlyChips;
        this.prestigeLevel = prestigeData.prestigeLevel;
        this.purchased = new Set(prestigeData.purchased);

        // Reapply prestige upgrades
        this.applyPrestigeUpgrades();
    }

    purchaseUpgrade(upgradeId) {
        let upgrade = null;
        for (const category in this.upgrades) {
            const found = this.upgrades[category].find(u => u.id === upgradeId);
            if (found) {
                upgrade = found;
                break;
            }
        }

        if (!upgrade || this.purchased.has(upgradeId)) return false;

        if (this.heavenlyChips >= upgrade.cost) {
            this.heavenlyChips -= upgrade.cost;
            this.purchased.add(upgradeId);
            upgrade.effect();
            
            // Show purchase effect
            Utils.showNotification(
                `Purchased ${upgrade.name}!<br>${upgrade.description}`,
                'prestige'
            );
            
            this.renderPrestige();
            return true;
        }
        return false;
    }

    applyPrestigeUpgrades() {
        this.purchased.forEach(upgradeId => {
            for (const category in this.upgrades) {
                const upgrade = this.upgrades[category].find(u => u.id === upgradeId);
                if (upgrade) {
                    upgrade.effect();
                }
            }
        });
    }

    renderPrestige() {
        const container = document.getElementById('prestige-container');
        if (!container) return;

        container.innerHTML = `
            <div class="prestige-stats">
                <h3>Prestige Level: ${this.prestigeLevel}</h3>
                <p>Heavenly Chips: ${Utils.formatNumber(this.heavenlyChips)}</p>
                <p>Total Heavenly Chips: ${Utils.formatNumber(this.totalHeavenlyChips)}</p>
                <p>Next Prestige: +${Utils.formatNumber(this.calculatePrestigeGain())} chips</p>
            </div>
            <div class="prestige-upgrades"></div>
        `;

        const upgradesContainer = container.querySelector('.prestige-upgrades');
        
        Object.entries(this.upgrades).forEach(([category, upgrades]) => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'upgrade-category';
            categoryDiv.innerHTML = `<h4>${this.formatCategoryName(category)}</h4>`;
            
            upgrades.forEach(upgrade => {
                const isPurchased = this.purchased.has(upgrade.id);
                const canAfford = this.heavenlyChips >= upgrade.cost;
                
                const upgradeElement = document.createElement('div');
                upgradeElement.className = `prestige-upgrade ${isPurchased ? 'purchased' : ''} ${canAfford ? '' : 'locked'}`;
                upgradeElement.innerHTML = `
                    <div class="upgrade-icon">${upgrade.icon}</div>
                    <div class="upgrade-info">
                        <h5>${upgrade.name}</h5>
                        <p>${upgrade.description}</p>
                        <div class="upgrade-cost">Cost: ${upgrade.cost} heavenly chips</div>
                    </div>
                `;

                if (!isPurchased) {
                    upgradeElement.onclick = () => this.purchaseUpgrade(upgrade.id);
                }

                categoryDiv.appendChild(upgradeElement);
            });

            upgradesContainer.appendChild(categoryDiv);
        });
    }

    checkPrestigeButton() {
        const button = document.getElementById('prestige-button');
        if (button) {
            const gain = this.calculatePrestigeGain();
            if (gain > 0) {
                button.style.display = 'block';
                button.textContent = `Prestige (Gain ${Utils.formatNumber(gain)} heavenly chips)`;
                button.onclick = () => this.prestige();
            } else {
                button.style.display = 'none';
            }
        }
    }

    formatCategoryName(category) {
        return category.charAt(0).toUpperCase() + category.slice(1);
    }

    save() {
        return {
            heavenlyChips: this.heavenlyChips,
            totalHeavenlyChips: this.totalHeavenlyChips,
            prestigeLevel: this.prestigeLevel,
            purchased: Array.from(this.purchased)
        };
    }

    load(saveData) {
        if (!saveData) return;

        this.heavenlyChips = saveData.heavenlyChips || 0;
        this.totalHeavenlyChips = saveData.totalHeavenlyChips || 0;
        this.prestigeLevel = saveData.prestigeLevel || 0;
        this.purchased = new Set(saveData.purchased || []);

        this.applyPrestigeUpgrades();
        this.renderPrestige();
        this.checkPrestigeButton();
    }
}

// Export PrestigeSystem
window.PrestigeSystem = PrestigeSystem;
