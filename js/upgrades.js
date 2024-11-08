// upgrades.js - Special Upgrades System
class UpgradeManager {
    constructor(game) {
        this.game = game;
        this.upgrades = this.initializeUpgrades();
        this.purchased = new Set();
        this.renderUpgrades();
    }

    initializeUpgrades() {
        return {
            // Cursor/Clicking Upgrades
            clicking: [
                {
                    id: 'reinforcedClicking',
                    name: 'Reinforced Clicking',
                    description: 'Clicking power is twice as strong',
                    cost: 100,
                    icon: '💪',
                    multiplier: 2,
                    type: 'click',
                    requirement: { cookies: 100 }
                },
                {
                    id: 'doubleClick',
                    name: 'Double Click',
                    description: 'Each click counts as two clicks',
                    cost: 1000,
                    icon: '👆👆',
                    multiplier: 2,
                    type: 'click',
                    requirement: { cookies: 1000 }
                },
                {
                    id: 'megaClick',
                    name: 'Mega Click',
                    description: 'Clicking power is 5 times stronger',
                    cost: 10000,
                    icon: '✨👆',
                    multiplier: 5,
                    type: 'click',
                    requirement: { cookies: 10000 }
                }
            ],

            // Auto Clicker Upgrades
            autoClicker: [
                {
                    id: 'fasterAutoClicker',
                    name: 'Faster Auto Clickers',
                    description: 'Auto Clickers are twice as efficient',
                    cost: 500,
                    icon: '⚡',
                    buildingId: 'autoClicker',
                    multiplier: 2,
                    requirement: { building: 'autoClicker', count: 10 }
                },
                {
                    id: 'quantumAutoClicker',
                    name: 'Quantum Auto Clickers',
                    description: 'Auto Clickers are 5 times as efficient',
                    cost: 5000,
                    icon: '⚛️',
                    buildingId: 'autoClicker',
                    multiplier: 5,
                    requirement: { building: 'autoClicker', count: 25 }
                }
            ],

            // Robot Arm Upgrades
            robotArm: [
                {
                    id: 'titaniumArms',
                    name: 'Titanium Arms',
                    description: 'Robot Arms are twice as efficient',
                    cost: 1000,
                    icon: '🦾',
                    buildingId: 'robotArm',
                    multiplier: 2,
                    requirement: { building: 'robotArm', count: 10 }
                },
                {
                    id: 'aiControlled',
                    name: 'AI-Controlled Arms',
                    description: 'Robot Arms are 5 times as efficient',
                    cost: 10000,
                    icon: '🤖',
                    buildingId: 'robotArm',
                    multiplier: 5,
                    requirement: { building: 'robotArm', count: 25 }
                }
            ],

            // Factory Upgrades
            cookieFactory: [
                {
                    id: 'automatedFactories',
                    name: 'Automated Factories',
                    description: 'Factories are twice as efficient',
                    cost: 5000,
                    icon: '🏭',
                    buildingId: 'cookieFactory',
                    multiplier: 2,
                    requirement: { building: 'cookieFactory', count: 10 }
                },
                {
                    id: 'industrialRevolution',
                    name: 'Industrial Revolution',
                    description: 'Factories are 5 times as efficient',
                    cost: 50000,
                    icon: '⚙️',
                    buildingId: 'cookieFactory',
                    multiplier: 5,
                    requirement: { building: 'cookieFactory', count: 25 }
                }
            ],

            // Global Production Upgrades
            global: [
                {
                    id: 'betterRecipe',
                    name: 'Better Recipe',
                    description: 'All cookie production is doubled',
                    cost: 10000,
                    icon: '📖',
                    multiplier: 2,
                    type: 'global',
                    requirement: { cookies: 5000 }
                },
                {
                    id: 'secretIngredient',
                    name: 'Secret Ingredient',
                    description: 'All cookie production is tripled',
                    cost: 100000,
                    icon: '🔮',
                    multiplier: 3,
                    type: 'global',
                    requirement: { cookies: 50000 }
                },
                {
                    id: 'cookieGods',
                    name: 'Cookie Gods',
                    description: 'All cookie production is multiplied by 10',
                    cost: 1000000,
                    icon: '👑',
                    multiplier: 10,
                    type: 'global',
                    requirement: { cookies: 500000 }
                }
            ],

            // Special Golden Cookie Upgrades
            goldenCookie: [
                {
                    id: 'luckyGolden',
                    name: 'Lucky Golden Cookies',
                    description: 'Golden cookies appear 5% more often',
                    cost: 50000,
                    icon: '🍀',
                    effect: 'goldenFrequency',
                    multiplier: 1.05,
                    requirement: { goldenClicks: 10 }
                },
                {
                    id: 'goldenRain',
                    name: 'Golden Rain',
                    description: 'Golden cookie effects last 20% longer',
                    cost: 500000,
                    icon: '⭐',
                    effect: 'goldenDuration',
                    multiplier: 1.2,
                    requirement: { goldenClicks: 50 }
                }
            ],

            // Critical Click Upgrades
            critical: [
                {
                    id: 'criticalMass',
                    name: 'Critical Mass',
                    description: 'Critical clicks happen 5% more often',
                    cost: 100000,
                    icon: '💥',
                    effect: 'criticalChance',
                    multiplier: 1.05,
                    requirement: { clicks: 1000 }
                },
                {
                    id: 'megaCritical',
                    name: 'Mega Critical',
                    description: 'Critical clicks are twice as powerful',
                    cost: 1000000,
                    icon: '🌟',
                    effect: 'criticalPower',
                    multiplier: 2,
                    requirement: { clicks: 10000 }
                }
            ]
        };
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

        if (this.game.cookies >= upgrade.cost) {
            this.game.cookies -= upgrade.cost;
            this.purchased.add(upgradeId);
            
            // Apply upgrade effects
            this.applyUpgrade(upgrade);
            
            // Show purchase effect
            this.showPurchaseEffect(upgrade);
            
            // Update UI
            this.renderUpgrades();
            this.game.updateUI();
            
            return true;
        }
        return false;
    }

    applyUpgrade(upgrade) {
        switch(upgrade.type) {
            case 'click':
                this.game.clickPower *= upgrade.multiplier;
                break;
            case 'global':
                this.game.globalMultiplier *= upgrade.multiplier;
                break;
            default:
                if (upgrade.buildingId) {
                    const building = this.game.buildings.buildings.find(b => b.id === upgrade.buildingId);
                    if (building) {
                        building.multiplier *= upgrade.multiplier;
                    }
                }
                if (upgrade.effect) {
                    switch(upgrade.effect) {
                        case 'goldenFrequency':
                            this.game.goldenCookieFrequency *= upgrade.multiplier;
                            break;
                        case 'goldenDuration':
                            this.game.goldenCookieDuration *= upgrade.multiplier;
                            break;
                        case 'criticalChance':
                            this.game.criticalClickChance *= upgrade.multiplier;
                            break;
                        case 'criticalPower':
                            this.game.criticalClickMultiplier *= upgrade.multiplier;
                            break;
                    }
                }
        }
    }

    showPurchaseEffect(upgrade) {
        // Visual effect
        Utils.screenFlash('#FFD700', 300);
        
        // Sound effect (if implemented)
        // this.game.playSound('upgrade');
        
        // Notification
        Utils.showNotification(
            `Upgrade purchased: ${upgrade.name}!<br>${upgrade.description}`,
            'upgrade'
        );
    }

    checkRequirements(upgrade) {
        if (upgrade.requirement.cookies && this.game.cookies < upgrade.requirement.cookies) {
            return false;
        }
        if (upgrade.requirement.building) {
            const building = this.game.buildings.buildings.find(b => b.id === upgrade.requirement.building);
            if (!building || building.count < upgrade.requirement.count) {
                return false;
            }
        }
        if (upgrade.requirement.goldenClicks && this.game.goldenCookiesClicked < upgrade.requirement.goldenClicks) {
            return false;
        }
        if (upgrade.requirement.clicks && this.game.totalClicks < upgrade.requirement.clicks) {
            return false;
        }
        return true;
    }

    renderUpgrades() {
        const container = document.getElementById('upgrades-grid');
        if (!container) return;

        container.innerHTML = '';
        
        // Render all unpurchased upgrades that meet requirements
        for (const category in this.upgrades) {
            this.upgrades[category].forEach(upgrade => {
                if (this.purchased.has(upgrade.id) || !this.checkRequirements(upgrade)) return;

                const canAfford = this.game.cookies >= upgrade.cost;
                const upgradeElement = document.createElement('div');
                upgradeElement.className = `grid-tile upgrade-tile ${canAfford ? '' : 'locked'}`;
                upgradeElement.innerHTML = `
                    <div class="upgrade-icon">${upgrade.icon}</div>
                    <div class="upgrade-info">
                        <h4>${upgrade.name}</h4>
                        <p>${upgrade.description}</p>
                        <div class="upgrade-cost">Cost: ${Utils.formatNumber(upgrade.cost)}</div>
                    </div>
                `;

                upgradeElement.onclick = () => this.purchaseUpgrade(upgrade.id);
                container.appendChild(upgradeElement);
            });
        }
    }

    save() {
        return {
            purchased: Array.from(this.purchased)
        };
    }

    load(saveData) {
        if (!saveData) return;
        
        this.purchased = new Set(saveData.purchased || []);
        
        // Reapply all purchased upgrades
        this.purchased.forEach(upgradeId => {
            for (const category in this.upgrades) {
                const upgrade = this.upgrades[category].find(u => u.id === upgradeId);
                if (upgrade) {
                    this.applyUpgrade(upgrade);
                }
            }
        });
        
        this.renderUpgrades();
    }
}

// Export UpgradeManager
window.UpgradeManager = UpgradeManager;
