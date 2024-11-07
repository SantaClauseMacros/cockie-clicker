// upgrades.js - Enhanced version with more content
class UpgradeManager {
    constructor(game) {
        this.game = game;
        this.buildings = this.initializeBuildings();
        this.upgrades = this.initializeUpgrades();
        this.purchased = new Set();
        this.achievements = this.initializeAchievements();
        
        this.renderUpgrades();
    }

    initializeBuildings() {
        return [
            {
                id: 'cursor',
                name: 'Cursor',
                baseCost: 15,
                count: 0,
                cps: 0.1,
                description: 'Autoclicks once every 10 seconds.',
                icon: '👆',
                unlocked: true
            },
            {
                id: 'grandma',
                name: 'Grandma',
                baseCost: 100,
                count: 0,
                cps: 1,
                description: 'A nice grandma to bake more cookies.',
                icon: '👵',
                unlocked: true
            },
            {
                id: 'farm',
                name: 'Cookie Farm',
                baseCost: 1100,
                count: 0,
                cps: 8,
                description: 'Grows cookie plants from cookie seeds.',
                icon: '🌾',
                unlocked: true
            },
            {
                id: 'mine',
                name: 'Cookie Mine',
                baseCost: 12000,
                count: 0,
                cps: 47,
                description: 'Mines cookie dough from the depths.',
                icon: '⛏️',
                unlocked: true
            },
            {
                id: 'factory',
                name: 'Cookie Factory',
                baseCost: 130000,
                count: 0,
                cps: 260,
                description: 'Mass produces cookies.',
                icon: '🏭',
                unlocked: true
            },
            {
                id: 'bank',
                name: 'Cookie Bank',
                baseCost: 1400000,
                count: 0,
                cps: 1400,
                description: 'Generates cookies from interest.',
                icon: '🏦',
                unlocked: true
            },
            {
                id: 'temple',
                name: 'Cookie Temple',
                baseCost: 20000000,
                count: 0,
                cps: 7800,
                description: 'Full of ancient cookie wisdom.',
                icon: '🏛️',
                unlocked: true
            },
            {
                id: 'wizardTower',
                name: 'Wizard Tower',
                baseCost: 330000000,
                count: 0,
                cps: 44000,
                description: 'Summons cookies by magic.',
                icon: '🗼',
                unlocked: true
            },
            {
                id: 'shipment',
                name: 'Cookie Shipment',
                baseCost: 5100000000,
                count: 0,
                cps: 260000,
                description: 'Brings cookies from cookie planet.',
                icon: '🚀',
                unlocked: true
            },
            {
                id: 'alchemyLab',
                name: 'Alchemy Lab',
                baseCost: 75000000000,
                count: 0,
                cps: 1600000,
                description: 'Turns gold into cookies!',
                icon: '⚗️',
                unlocked: true
            },
            {
                id: 'portal',
                name: 'Cookie Portal',
                baseCost: 1000000000000,
                count: 0,
                cps: 10000000,
                description: 'Opens door to cookie dimension.',
                icon: '🌀',
                unlocked: true
            },
            {
                id: 'timeMachine',
                name: 'Time Machine',
                baseCost: 14000000000000,
                count: 0,
                cps: 65000000,
                description: 'Brings cookies from the past.',
                icon: '⏰',
                unlocked: true
            },
            {
                id: 'antimatterCondenser',
                name: 'Antimatter Condenser',
                baseCost: 170000000000000,
                count: 0,
                cps: 430000000,
                description: 'Condenses the antimatter universe into cookies.',
                icon: '🌌',
                unlocked: true
            },
            {
                id: 'prism',
                name: 'Prism',
                baseCost: 2100000000000000,
                count: 0,
                cps: 2900000000,
                description: 'Converts light into cookies.',
                icon: '🔮',
                unlocked: true
            },
            {
                id: 'chancemaker',
                name: 'Chancemaker',
                baseCost: 26000000000000000,
                count: 0,
                cps: 21000000000,
                description: 'Generates cookies out of pure luck.',
                icon: '🎲',
                unlocked: true
            }
        ];
    }

initializeUpgrades() {
        return {
            // Cursor Upgrades
            cursorUpgrades: [
                {
                    id: 'reinforcedClicking',
                    name: 'Reinforced Clicking',
                    cost: 100,
                    description: 'Cursors are twice as efficient',
                    icon: '✨',
                    multiplier: 2,
                    type: 'cursor',
                    requirement: { building: 'cursor', count: 1 },
                    purchased: false
                },
                {
                    id: 'carpalTunnel',
                    name: 'Carpal Tunnel Prevention Cream',
                    cost: 500,
                    description: 'Cursors are twice as efficient',
                    icon: '🖐️',
                    multiplier: 2,
                    type: 'cursor',
                    requirement: { building: 'cursor', count: 10 },
                    purchased: false
                },
                {
                    id: 'ambidextrous',
                    name: 'Ambidextrous',
                    cost: 10000,
                    description: 'Cursors are twice as efficient',
                    icon: '👐',
                    multiplier: 2,
                    type: 'cursor',
                    requirement: { building: 'cursor', count: 25 },
                    purchased: false
                },
            ],

            // Grandma Upgrades
            grandmaUpgrades: [
                {
                    id: 'forwardsFromGrandma',
                    name: 'Forwards from Grandma',
                    cost: 1000,
                    description: 'Grandmas are twice as efficient',
                    icon: '📱',
                    multiplier: 2,
                    type: 'grandma',
                    requirement: { building: 'grandma', count: 5 },
                    purchased: false
                },
                {
                    id: 'steelPlatedRollingPins',
                    name: 'Steel-plated Rolling Pins',
                    cost: 5000,
                    description: 'Grandmas are twice as efficient',
                    icon: '🎳',
                    multiplier: 2,
                    type: 'grandma',
                    requirement: { building: 'grandma', count: 15 },
                    purchased: false
                },
                {
                    id: 'lubricated Dentures',
                    name: 'Lubricated Dentures',
                    cost: 50000,
                    description: 'Grandmas are twice as efficient',
                    icon: '😬',
                    multiplier: 2,
                    type: 'grandma',
                    requirement: { building: 'grandma', count: 25 },
                    purchased: false
                },
            ],

            // Farm Upgrades
            farmUpgrades: [
                {
                    id: 'cheaperHoes',
                    name: 'Cheap Hoes',
                    cost: 11000,
                    description: 'Farms are twice as efficient',
                    icon: '🌱',
                    multiplier: 2,
                    type: 'farm',
                    requirement: { building: 'farm', count: 5 },
                    purchased: false
                },
                {
                    id: 'cookieTrees',
                    name: 'Cookie Trees',
                    cost: 55000,
                    description: 'Farms are twice as efficient',
                    icon: '🌳',
                    multiplier: 2,
                    type: 'farm',
                    requirement: { building: 'farm', count: 15 },
                    purchased: false
                },
                {
                    id: 'geneticallyModifiedCookies',
                    name: 'GMO Cookies',
                    cost: 550000,
                    description: 'Farms are twice as efficient',
                    icon: '🧬',
                    multiplier: 2,
                    type: 'farm',
                    requirement: { building: 'farm', count: 25 },
                    purchased: false
                },
            ],

            // Mouse and Global Upgrades
            mouseUpgrades: [
                {
                    id: 'plasticMouse',
                    name: 'Plastic Mouse',
                    cost: 50000,
                    description: 'Clicking is twice as efficient',
                    icon: '🖱️',
                    clickMultiplier: 2,
                    type: 'mouse',
                    requirement: { cookies: 10000 },
                    purchased: false
                },
                {
                    id: 'ironMouse',
                    name: 'Iron Mouse',
                    cost: 500000,
                    description: 'Clicking is twice as efficient',
                    icon: '⚙️',
                    clickMultiplier: 2,
                    type: 'mouse',
                    requirement: { cookies: 100000 },
                    purchased: false
                },
                {
                    id: 'titaniumMouse',
                    name: 'Titanium Mouse',
                    cost: 5000000,
                    description: 'Clicking is twice as efficient',
                    icon: '🔧',
                    clickMultiplier: 2,
                    type: 'mouse',
                    requirement: { cookies: 1000000 },
                    purchased: false
                },
            ],

            // Global Production Upgrades
            globalUpgrades: [
                {
                    id: 'overdrive',
                    name: 'Production Overdrive',
                    cost: 1000000,
                    description: 'All production is increased by 100%',
                    icon: '⚡',
                    globalMultiplier: 2,
                    type: 'global',
                    requirement: { cookies: 500000 },
                    purchased: false
                },
                {
                    id: 'ultimateOverdrive',
                    name: 'Ultimate Overdrive',
                    cost: 10000000,
                    description: 'All production is increased by 200%',
                    icon: '💥',
                    globalMultiplier: 3,
                    type: 'global',
                    requirement: { cookies: 5000000 },
                    purchased: false
                },
                {
                    id: 'quantumOverdrive',
                    name: 'Quantum Overdrive',
                    cost: 100000000,
                    description: 'All production is increased by 400%',
                    icon: '⚛️',
                    globalMultiplier: 5,
                    type: 'global',
                    requirement: { cookies: 50000000 },
                    purchased: false
                },
            ],

            // Special Combination Upgrades
            combinationUpgrades: [
                {
                    id: 'grandmaMine',
                    name: 'Grandmas Mine Operation',
                    cost: 500000,
                    description: 'Grandmas and Mines are 50% more efficient',
                    icon: '👵⛏️',
                    buildingTypes: ['grandma', 'mine'],
                    multiplier: 1.5,
                    requirement: { 
                        buildings: {
                            grandma: 10,
                            mine: 10
                        }
                    },
                    purchased: false
                },
                // Add more combination upgrades here
            ]
        };
    }

    // Purchase handling method
    purchaseUpgrade(upgradeId) {
        let upgrade = null;
        // Search through all upgrade categories
        for (const category in this.upgrades) {
            const found = this.upgrades[category].find(u => u.id === upgradeId);
            if (found) {
                upgrade = found;
                break;
            }
        }

        if (!upgrade || upgrade.purchased) return false;

        if (this.game.cookies >= upgrade.cost) {
            this.game.cookies -= upgrade.cost;
            upgrade.purchased = true;
            this.purchased.add(upgradeId);
            
            // Apply upgrade effects
            this.applyUpgrade(upgrade);
            
            // Update UI
            this.renderUpgrades();
            this.game.updateUI();
            
            // Show notification
            Utils.showNotification(`Purchased ${upgrade.name}!`);
            
            return true;
        }
        return false;
    }

initializeAchievements() {
        return {
            // Cookie Production Achievements
            production: [
                {
                    id: 'wakingUp',
                    name: 'Wake and Bake',
                    description: 'Bake 1,000 cookies',
                    icon: '🌅',
                    requirement: () => this.game.totalCookiesBaked >= 1000,
                    reward: () => this.game.globalMultiplier *= 1.1,
                    unlocked: false
                },
                {
                    id: 'cookieFactory',
                    name: 'Cookie Factory',
                    description: 'Bake 100,000 cookies',
                    icon: '🏭',
                    requirement: () => this.game.totalCookiesBaked >= 100000,
                    reward: () => this.game.globalMultiplier *= 1.1,
                    unlocked: false
                },
                {
                    id: 'cookieEmpire',
                    name: 'Cookie Empire',
                    description: 'Bake 1,000,000 cookies',
                    icon: '👑',
                    requirement: () => this.game.totalCookiesBaked >= 1000000,
                    reward: () => this.game.globalMultiplier *= 1.1,
                    unlocked: false
                }
            ],

            // Building Achievements
            buildings: [
                {
                    id: 'grandmaSquad',
                    name: 'Grandma Squad',
                    description: 'Have 10 Grandmas',
                    icon: '👵',
                    requirement: () => this.getBuildingCount('grandma') >= 10,
                    reward: () => this.boostBuilding('grandma', 1.1),
                    unlocked: false
                },
                {
                    id: 'farmEmpire',
                    name: 'Farm Empire',
                    description: 'Have 10 Farms',
                    icon: '🌾',
                    requirement: () => this.getBuildingCount('farm') >= 10,
                    reward: () => this.boostBuilding('farm', 1.1),
                    unlocked: false
                }
            ],

            // Click Achievements
            clicking: [
                {
                    id: 'clickAddict',
                    name: 'Click Addict',
                    description: 'Click 1,000 times',
                    icon: '👆',
                    requirement: () => this.game.totalClicks >= 1000,
                    reward: () => this.game.clickMultiplier *= 1.1,
                    unlocked: false
                },
                {
                    id: 'clickMaster',
                    name: 'Click Master',
                    description: 'Click 10,000 times',
                    icon: '👆✨',
                    requirement: () => this.game.totalClicks >= 10000,
                    reward: () => this.game.clickMultiplier *= 1.2,
                    unlocked: false
                }
            ]
        };
    }

    applyUpgrade(upgrade) {
        if (upgrade.type === 'global') {
            this.game.globalMultiplier *= upgrade.globalMultiplier;
        }
        else if (upgrade.type === 'mouse') {
            this.game.clickMultiplier *= upgrade.clickMultiplier;
        }
        else if (upgrade.buildingTypes) {
            // Combination upgrade
            upgrade.buildingTypes.forEach(buildingType => {
                this.boostBuilding(buildingType, upgrade.multiplier);
            });
        }
        else {
            // Single building type upgrade
            this.boostBuilding(upgrade.type, upgrade.multiplier);
        }

        this.updateCPS();
        this.game.saveGame();
    }

    boostBuilding(buildingType, multiplier) {
        const building = this.buildings.find(b => b.id === buildingType);
        if (building) {
            building.cps *= multiplier;
        }
    }

    renderUpgrades() {
        const container = document.getElementById('upgrades-grid');
        if (!container) return;

        container.innerHTML = '';

        // Render buildings
        this.buildings.forEach(building => {
            if (!building.unlocked) return;

            const cost = this.calculateBuildingCost(building);
            const canAfford = this.game.cookies >= cost;

            const buildingElement = document.createElement('div');
            buildingElement.className = `upgrade-tile ${canAfford ? '' : 'locked'}`;
            buildingElement.innerHTML = `
                <div class="upgrade-icon">${building.icon}</div>
                <div class="upgrade-info">
                    <h4>${building.name}</h4>
                    <p>${building.description}</p>
                    <div class="upgrade-stats">
                        <span>Owned: ${building.count}</span>
                        <span>CPS: ${this.game.formatNumber(building.cps)}</span>
                        <span>Cost: ${this.game.formatNumber(cost)}</span>
                    </div>
                </div>
            `;

            buildingElement.onclick = () => this.purchaseBuilding(building.id);
            container.appendChild(buildingElement);
        });

        // Render available upgrades
        Object.values(this.upgrades).flat().forEach(upgrade => {
            if (upgrade.purchased || !this.checkRequirements(upgrade)) return;

            const canAfford = this.game.cookies >= upgrade.cost;
            const upgradeElement = document.createElement('div');
            upgradeElement.className = `upgrade-tile upgrade ${canAfford ? '' : 'locked'}`;
            upgradeElement.innerHTML = `
                <div class="upgrade-icon">${upgrade.icon}</div>
                <div class="upgrade-info">
                    <h4>${upgrade.name}</h4>
                    <p>${upgrade.description}</p>
                    <div class="upgrade-cost">Cost: ${this.game.formatNumber(upgrade.cost)}</div>
                </div>
            `;

            upgradeElement.onclick = () => this.purchaseUpgrade(upgrade.id);
            container.appendChild(upgradeElement);
        });
    }

    checkRequirements(upgrade) {
        if (upgrade.requirement.cookies && this.game.cookies < upgrade.requirement.cookies) {
            return false;
        }
        
        if (upgrade.requirement.building) {
            const building = this.buildings.find(b => b.id === upgrade.requirement.building);
            if (!building || building.count < upgrade.requirement.count) {
                return false;
            }
        }

        if (upgrade.requirement.buildings) {
            for (const [buildingId, count] of Object.entries(upgrade.requirement.buildings)) {
                const building = this.buildings.find(b => b.id === buildingId);
                if (!building || building.count < count) {
                    return false;
                }
            }
        }

        return true;
    }

    checkAchievements() {
        Object.values(this.achievements).flat().forEach(achievement => {
            if (!achievement.unlocked && achievement.requirement()) {
                this.unlockAchievement(achievement);
            }
        });
    }

    unlockAchievement(achievement) {
        achievement.unlocked = true;
        achievement.reward();
        
        // Show achievement notification
        this.showAchievementNotification(achievement);
        
        // Update UI
        this.updateCPS();
        this.game.updateUI();
        this.game.saveGame();
    }

    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-info">
                <h3>Achievement Unlocked!</h3>
                <h4>${achievement.name}</h4>
                <p>${achievement.description}</p>
            </div>
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    }

    // Save/Load and Remaining Methods
    save() {
        return {
            buildings: this.buildings.map(b => ({
                id: b.id,
                count: b.count,
                cps: b.cps,
                unlocked: b.unlocked
            })),
            purchased: Array.from(this.purchased),
            achievements: Object.entries(this.achievements).reduce((acc, [category, achievs]) => {
                acc[category] = achievs.map(a => ({
                    id: a.id,
                    unlocked: a.unlocked
                }));
                return acc;
            }, {}),
            upgrades: Object.entries(this.upgrades).reduce((acc, [category, upgrades]) => {
                acc[category] = upgrades.map(u => ({
                    id: u.id,
                    purchased: u.purchased
                }));
                return acc;
            }, {})
        };
    }

    load(saveData) {
        if (saveData.buildings) {
            saveData.buildings.forEach(savedBuilding => {
                const building = this.buildings.find(b => b.id === savedBuilding.id);
                if (building) {
                    building.count = savedBuilding.count;
                    building.cps = savedBuilding.cps;
                    building.unlocked = savedBuilding.unlocked;
                }
            });
        }

        if (saveData.purchased) {
            this.purchased = new Set(saveData.purchased);
        }

        if (saveData.achievements) {
            Object.entries(saveData.achievements).forEach(([category, achievs]) => {
                achievs.forEach(savedAchiev => {
                    const achievement = this.achievements[category]?.find(a => a.id === savedAchiev.id);
                    if (achievement) {
                        achievement.unlocked = savedAchiev.unlocked;
                    }
                });
            });
        }

        if (saveData.upgrades) {
            Object.entries(saveData.upgrades).forEach(([category, upgrades]) => {
                upgrades.forEach(savedUpgrade => {
                    const upgrade = this.upgrades[category]?.find(u => u.id === savedUpgrade.id);
                    if (upgrade) {
                        upgrade.purchased = savedUpgrade.purchased;
                        if (upgrade.purchased) {
                            this.applyUpgrade(upgrade);
                        }
                    }
                });
            });
        }

        this.updateCPS();
        this.renderUpgrades();
    }

    purchaseBuilding(buildingId) {
        const building = this.buildings.find(b => b.id === buildingId);
        if (!building) return false;

        const cost = this.calculateBuildingCost(building);
        if (this.game.cookies >= cost) {
            this.game.cookies -= cost;
            building.count++;
            
            // Check for new unlocks
            this.checkBuildingUnlocks(building);
            
            // Update CPS
            this.updateCPS();
            
            // Check achievements
            this.checkAchievements();
            
            // Update UI
            this.renderUpgrades();
            
            // Play purchase sound
            this.playPurchaseSound();
            
            // Create visual effect
            this.createPurchaseEffect(building);
            
            // Save game
            this.game.saveGame();
            
            return true;
        }
        return false;
    }

    calculateBuildingCost(building) {
        return Math.floor(building.baseCost * Math.pow(1.15, building.count));
    }

    updateCPS() {
        let totalCPS = 0;
        this.buildings.forEach(building => {
            totalCPS += building.cps * building.count;
        });
        this.game.cookiesPerSecond = totalCPS * this.game.globalMultiplier;
        this.game.updateUI();
    }

    checkBuildingUnlocks(building) {
        // Check for new upgrade unlocks
        Object.values(this.upgrades).flat().forEach(upgrade => {
            if (!upgrade.purchased && !upgrade.unlocked) {
                if (this.checkRequirements(upgrade)) {
                    upgrade.unlocked = true;
                    this.showNewUpgradeNotification(upgrade);
                }
            }
        });

        // Check for new building unlocks
        this.buildings.forEach(b => {
            if (!b.unlocked && b.requirement) {
                const req = b.requirement;
                if (this.buildings.find(rb => rb.id === req.building)?.count >= req.count) {
                    b.unlocked = true;
                    this.showNewBuildingNotification(b);
                }
            }
        });
    }

    showNewUpgradeNotification(upgrade) {
        const notification = document.createElement('div');
        notification.className = 'new-upgrade-notification';
        notification.innerHTML = `
            <div class="upgrade-icon">${upgrade.icon}</div>
            <div class="upgrade-info">
                <h4>New Upgrade Available!</h4>
                <p>${upgrade.name}</p>
            </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    showNewBuildingNotification(building) {
        const notification = document.createElement('div');
        notification.className = 'new-building-notification';
        notification.innerHTML = `
            <div class="building-icon">${building.icon}</div>
            <div class="building-info">
                <h4>New Building Unlocked!</h4>
                <p>${building.name}</p>
            </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    playPurchaseSound() {
        // Add sound effects if you want them
        // const sound = new Audio('path/to/purchase-sound.mp3');
        // sound.play();
    }

    createPurchaseEffect(building) {
        const effect = document.createElement('div');
        effect.className = 'purchase-effect';
        effect.innerHTML = building.icon;
        
        const upgradesTile = document.querySelector('.upgrade-tile');
        if (upgradesTile) {
            const rect = upgradesTile.getBoundingClientRect();
            effect.style.left = `${rect.left}px`;
            effect.style.top = `${rect.top}px`;
            document.body.appendChild(effect);
            
            setTimeout(() => effect.remove(), 1000);
        }
    }

    formatNumber(num) {
        return this.game.formatNumber(num);
    }
}

// Export the UpgradeManager
window.UpgradeManager = UpgradeManager;
