// upgrades.js - Upgrade System and Definitions

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
                baseCost: CONFIG.BUILDING_BASE_COSTS.cursor,
                count: 0,
                cps: 0.1,
                description: 'Clicks the cookie automatically',
                icon: '👆',
                unlocked: true
            },
            {
                id: 'grandma',
                name: 'Quantum Grandma',
                baseCost: CONFIG.BUILDING_BASE_COSTS.grandma,
                count: 0,
                cps: 1,
                description: 'A nice quantum grandma to bake more cookies',
                icon: '👵',
                unlocked: true
            },
            {
                id: 'farm',
                name: 'Cookie Farm',
                baseCost: CONFIG.BUILDING_BASE_COSTS.farm,
                count: 0,
                cps: 8,
                description: 'Grows cookie plants from quantum soil',
                icon: '🌾',
                unlocked: true
            },
            {
                id: 'mine',
                name: 'Cookie Mine',
                baseCost: CONFIG.BUILDING_BASE_COSTS.mine,
                count: 0,
                cps: 47,
                description: 'Mines cookie dough from the quantum realm',
                icon: '⛏️',
                unlocked: false,
                requirement: { building: 'farm', count: 5 }
            },
            {
                id: 'factory',
                name: 'Cookie Factory',
                baseCost: CONFIG.BUILDING_BASE_COSTS.factory,
                count: 0,
                cps: 260,
                description: 'Mass produces cookies through quantum tunneling',
                icon: '🏭',
                unlocked: false,
                requirement: { building: 'mine', count: 5 }
            },
            {
                id: 'bank',
                name: 'Cookie Bank',
                baseCost: CONFIG.BUILDING_BASE_COSTS.bank,
                count: 0,
                cps: 1400,
                description: 'Generates cookies from quantum fluctuations',
                icon: '🏦',
                unlocked: false,
                requirement: { building: 'factory', count: 5 }
            },
            {
                id: 'temple',
                name: 'Cookie Temple',
                baseCost: CONFIG.BUILDING_BASE_COSTS.temple,
                count: 0,
                cps: 7800,
                description: 'Worship the ancient cookie gods',
                icon: '🏛️',
                unlocked: false,
                requirement: { building: 'bank', count: 5 }
            },
            {
                id: 'wizard_tower',
                name: 'Cookie Wizard Tower',
                baseCost: CONFIG.BUILDING_BASE_COSTS.wizard_tower,
                count: 0,
                cps: 44000,
                description: 'Summons cookies using ancient magic',
                icon: '🗼',
                unlocked: false,
                requirement: { building: 'temple', count: 5 }
            },
            {
                id: 'shipment',
                name: 'Cookie Shipment',
                baseCost: CONFIG.BUILDING_BASE_COSTS.shipment,
                count: 0,
                cps: 260000,
                description: 'Import cookies from the cookie dimension',
                icon: '🚀',
                unlocked: false,
                requirement: { building: 'wizard_tower', count: 5 }
            },
            {
                id: 'alchemy_lab',
                name: 'Cookie Alchemy Lab',
                baseCost: CONFIG.BUILDING_BASE_COSTS.alchemy_lab,
                count: 0,
                cps: 1600000,
                description: 'Transmute ordinary matter into cookies',
                icon: '⚗️',
                unlocked: false,
                requirement: { building: 'shipment', count: 5 }
            }
        ];
    }

    initializeUpgrades() {
        return [
            // Cursor Upgrades
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
                id: 'quantum_clicking',
                name: 'Quantum Clicking',
                cost: 500,
                type: 'cursor',
                description: 'Cursors exist in multiple states, tripling their efficiency',
                multiplier: 3,
                requirement: { building: 'cursor', count: 10 },
                purchased: false,
                icon: '🌟'
            },
            
            // Grandma Upgrades
            {
                id: 'quantum_baking',
                name: 'Quantum Baking',
                cost: 1000,
                type: 'grandma',
                description: 'Grandmas harness quantum mechanics to bake more cookies',
                multiplier: 2,
                requirement: { building: 'grandma', count: 5 },
                purchased: false,
                icon: '👵'
            },
            
            // Global Upgrades
            {
                id: 'cookie_fusion',
                name: 'Cookie Fusion',
                cost: 10000,
                type: 'global',
                description: 'All production increased by 50%',
                multiplier: 1.5,
                requirement: { cookies: 5000 },
                purchased: false,
                icon: '☢️'
            },
            {
                id: 'time_bending',
                name: 'Time Bending',
                cost: 50000,
                type: 'global',
                description: 'Cookie production travels through time, doubling output',
                multiplier: 2,
                requirement: { cookies: 25000 },
                purchased: false,
                icon: '⌛'
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
            this.game.updateCPS();
            this.checkUnlocks();
            this.renderUpgrades();
            return true;
        }
        return false;
    }

    purchaseUpgrade(upgradeId) {
        const upgrade = this.upgrades.find(u => u.id === upgradeId);
        if (!upgrade || upgrade.purchased) return false;

        if (this.game.cookies >= upgrade.cost) {
            this.game.cookies -= upgrade.cost;
            upgrade.purchased = true;
            this.purchased.add(upgradeId);
            this.applyUpgrade(upgrade);
            this.renderUpgrades();
            Utils.showNotification(`Purchased ${upgrade.name}!`);
            return true;
        }
        return false;
    }

    calculateBuildingCost(building) {
        return Math.floor(building.baseCost * Math.pow(1.15, building.count));
    }

    applyUpgrade(upgrade) {
        switch(upgrade.type) {
            case 'cursor':
                this.buildings.find(b => b.id === 'cursor').cps *= upgrade.multiplier;
                break;
            case 'grandma':
                this.buildings.find(b => b.id === 'grandma').cps *= upgrade.multiplier;
                break;
            case 'global':
                this.game.globalMultiplier *= upgrade.multiplier;
                break;
            // Add more types as needed
        }
        this.game.updateCPS();
    }

    checkUnlocks() {
        for (const building of this.buildings) {
            if (!building.unlocked && building.requirement) {
                const reqBuilding = this.buildings.find(b => b.id === building.requirement.building);
                if (reqBuilding && reqBuilding.count >= building.requirement.count) {
                    building.unlocked = true;
                    Utils.showNotification(`New building unlocked: ${building.name}!`);
                }
            }
        }

        for (const upgrade of this.upgrades) {
            if (!upgrade.purchased && upgrade.requirement) {
                if (upgrade.requirement.building) {
                    const reqBuilding = this.buildings.find(b => b.id === upgrade.requirement.building);
                    if (reqBuilding && reqBuilding.count >= upgrade.requirement.count) {
                        upgrade.available = true;
                    }
                } else if (upgrade.requirement.cookies && this.game.cookies >= upgrade.requirement.cookies) {
                    upgrade.available = true;
                }
            }
        }
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
                <div class="upgrade-cost">Cost: ${Utils.formatNumber(cost)}</div>
                <div class="upgrade-cps">CPS: ${Utils.formatNumber(building.cps)}</div>
            `;

            buildingElement.onclick = () => this.purchaseBuilding(building.id);
            container.appendChild(buildingElement);
        }

        // Render upgrades
        const availableUpgrades = this.upgrades.filter(u => !u.purchased && u.available);
        for (const upgrade of availableUpgrades) {
            const upgradeElement = document.createElement('div');
            upgradeElement.className = `upgrade-tile ${this.game.cookies >= upgrade.cost ? '' : 'locked'}`;
            upgradeElement.innerHTML = `
                <div class="upgrade-icon">${upgrade.icon}</div>
                <div class="upgrade-name">${upgrade.name}</div>
                <div class="upgrade-description">${upgrade.description}</div>
                <div class="upgrade-cost">Cost: ${Utils.formatNumber(upgrade.cost)}</div>
            `;

            upgradeElement.onclick = () => this.purchaseUpgrade(upgrade.id);
            container.appendChild(upgradeElement);
        }
    }

    // Save/Load methods
    save() {
        return {
            buildings: this.buildings,
            purchased: Array.from(this.purchased),
            upgrades: this.upgrades
        };
    }

    load(saveData) {
        if (saveData.buildings) {
            this.buildings = saveData.buildings;
        }
        if (saveData.purchased) {
            this.purchased = new Set(saveData.purchased);
        }
        if (saveData.upgrades) {
            this.upgrades = saveData.upgrades;
        }
        this.renderUpgrades();
    }
}

// Export the UpgradeManager
window.UpgradeManager = UpgradeManager;
