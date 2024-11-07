// upgrades.js - Fixed version
class UpgradeManager {
    constructor(game) {
        this.game = game;
        this.buildings = this.initializeBuildings();
        this.upgrades = this.initializeUpgrades();
        this.purchased = new Set();
        
        this.renderUpgrades();
    }

    initializeBuildings() {
        return [
            {
                id: 'cursor',
                name: 'Cosmic Cursor',
                baseCost: 15,
                count: 0,
                cps: 0.1,
                description: 'Auto-clicks the cookie',
                icon: '👆',
                unlocked: true
            },
            {
                id: 'grandma',
                name: 'Quantum Grandma',
                baseCost: 100,
                count: 0,
                cps: 1,
                description: 'A nice quantum grandma to bake more cookies',
                icon: '👵',
                unlocked: true
            },
            {
                id: 'farm',
                name: 'Cookie Farm',
                baseCost: 1100,
                count: 0,
                cps: 8,
                description: 'Grows cookie plants',
                icon: '🌾',
                unlocked: true
            },
            {
                id: 'mine',
                name: 'Cookie Mine',
                baseCost: 12000,
                count: 0,
                cps: 47,
                description: 'Mines cookie dough',
                icon: '⛏️',
                unlocked: true
            },
            {
                id: 'factory',
                name: 'Cookie Factory',
                baseCost: 130000,
                count: 0,
                cps: 260,
                description: 'Mass produces cookies',
                icon: '🏭',
                unlocked: true
            }
        ];
    }

    initializeUpgrades() {
        return [
            {
                id: 'reinforced_clicking',
                name: 'Reinforced Clicking',
                cost: 100,
                type: 'cursor',
                description: 'Cursors are twice as efficient',
                multiplier: 2,
                requirement: { building: 'cursor', count: 1 },
                purchased: false,
                icon: '✨'
            },
            {
                id: 'quantum_cookies',
                name: 'Quantum Cookies',
                cost: 500,
                type: 'global',
                description: 'All production increased by 100%',
                multiplier: 2,
                requirement: { cookies: 1000 },
                purchased: false,
                icon: '⚡'
            }
        ];
    }

    purchaseBuilding(buildingId) {
        const building = this.buildings.find(b => b.id === buildingId);
        if (!building) return false;

        const cost = this.calculateBuildingCost(building);
        if (this.game.cookies >= cost) {
            this.game.cookies -= cost;
            building.count++;
            this.updateCPS();
            this.checkUnlocks();
            this.renderUpgrades();
            this.game.saveGame(); // Save after purchase
            return true;
        }
        return false;
    }

    calculateBuildingCost(building) {
        return Math.floor(building.baseCost * Math.pow(1.15, building.count));
    }

    updateCPS() {
        let totalCPS = 0;
        for (const building of this.buildings) {
            totalCPS += building.cps * building.count;
        }
        this.game.cookiesPerSecond = totalCPS * this.game.globalMultiplier;
        this.game.updateUI();
    }

    renderUpgrades() {
        const container = document.getElementById('upgrades-grid');
        if (!container) return;

        container.innerHTML = '';
        
        // Render buildings
        for (const building of this.buildings) {
            if (!building.unlocked) continue;

            const cost = this.calculateBuildingCost(building);
            const canAfford = this.game.cookies >= cost;

            const buildingElement = document.createElement('div');
            buildingElement.className = `upgrade-tile ${canAfford ? '' : 'locked'}`;
            buildingElement.innerHTML = `
                <div class="upgrade-icon">${building.icon}</div>
                <div class="upgrade-name">${building.name}</div>
                <div class="upgrade-count">Owned: ${building.count}</div>
                <div class="upgrade-cost">Cost: ${this.game.formatNumber(cost)}</div>
                <div class="upgrade-cps">CPS: ${this.game.formatNumber(building.cps)}</div>
            `;

            buildingElement.onclick = () => {
                if (this.purchaseBuilding(building.id)) {
                    this.game.updateUI();
                }
            };
            container.appendChild(buildingElement);
        }
    }

    save() {
        return {
            buildings: this.buildings.map(b => ({
                id: b.id,
                count: b.count,
                unlocked: b.unlocked
            })),
            purchased: Array.from(this.purchased)
        };
    }

    load(saveData) {
        if (saveData.buildings) {
            for (const savedBuilding of saveData.buildings) {
                const building = this.buildings.find(b => b.id === savedBuilding.id);
                if (building) {
                    building.count = savedBuilding.count;
                    building.unlocked = savedBuilding.unlocked;
                }
            }
        }
        if (saveData.purchased) {
            this.purchased = new Set(saveData.purchased);
        }
        this.updateCPS();
        this.renderUpgrades();
    }
}

// Export the UpgradeManager
window.UpgradeManager = UpgradeManager;
