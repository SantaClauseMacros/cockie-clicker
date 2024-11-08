// buildings.js - Building System
class BuildingManager {
    constructor(game) {
        this.game = game;
        this.buildings = this.initializeBuildings();
        this.renderBuildings();
        this.startAutoProduction();
    }

    initializeBuildings() {
        return [
            {
                id: 'autoClicker',
                name: "Auto Clicker",
                baseCost: CONFIG.BUILDINGS.autoClicker.baseCost,
                count: 0,
                baseCPS: CONFIG.BUILDINGS.autoClicker.baseCPS,
                cps: CONFIG.BUILDINGS.autoClicker.baseCPS,
                multiplier: 1,
                icon: '🖱️',
                description: CONFIG.BUILDINGS.autoClicker.description,
                unlocked: true,
                efficiency: 100,
                level: 1
            },
            {
                id: 'robotArm',
                name: "Robot Arm",
                baseCost: CONFIG.BUILDINGS.robotArm.baseCost,
                count: 0,
                baseCPS: CONFIG.BUILDINGS.robotArm.baseCPS,
                cps: CONFIG.BUILDINGS.robotArm.baseCPS,
                multiplier: 1,
                icon: '🦾',
                description: CONFIG.BUILDINGS.robotArm.description,
                unlocked: true,
                efficiency: 100,
                level: 1
            },
            {
                id: 'cookieFactory',
                name: "Cookie Factory",
                baseCost: CONFIG.BUILDINGS.cookieFactory.baseCost,
                count: 0,
                baseCPS: CONFIG.BUILDINGS.cookieFactory.baseCPS,
                cps: CONFIG.BUILDINGS.cookieFactory.baseCPS,
                multiplier: 1,
                icon: '🏭',
                description: CONFIG.BUILDINGS.cookieFactory.description,
                unlocked: true,
                efficiency: 100,
                level: 1
            },
            {
                id: 'megaProcessor',
                name: "Mega Processor",
                baseCost: CONFIG.BUILDINGS.megaProcessor.baseCost,
                count: 0,
                baseCPS: CONFIG.BUILDINGS.megaProcessor.baseCPS,
                cps: CONFIG.BUILDINGS.megaProcessor.baseCPS,
                multiplier: 1,
                icon: '💻',
                description: CONFIG.BUILDINGS.megaProcessor.description,
                unlocked: true,
                efficiency: 100,
                level: 1
            },
            {
                id: 'quantumOven',
                name: "Quantum Oven",
                baseCost: CONFIG.BUILDINGS.quantumOven.baseCost,
                count: 0,
                baseCPS: CONFIG.BUILDINGS.quantumOven.baseCPS,
                cps: CONFIG.BUILDINGS.quantumOven.baseCPS,
                multiplier: 1,
                icon: '⚛️',
                description: CONFIG.BUILDINGS.quantumOven.description,
                unlocked: true,
                efficiency: 100,
                level: 1
            },
            {
                id: 'cookieCollider',
                name: "Cookie Collider",
                baseCost: CONFIG.BUILDINGS.cookieCollider.baseCost,
                count: 0,
                baseCPS: CONFIG.BUILDINGS.cookieCollider.baseCPS,
                cps: CONFIG.BUILDINGS.cookieCollider.baseCPS,
                multiplier: 1,
                icon: '🔮',
                description: CONFIG.BUILDINGS.cookieCollider.description,
                unlocked: true,
                efficiency: 100,
                level: 1
            },
            {
                id: 'timeMachine',
                name: "Time Machine",
                baseCost: CONFIG.BUILDINGS.timeMachine.baseCost,
                count: 0,
                baseCPS: CONFIG.BUILDINGS.timeMachine.baseCPS,
                cps: CONFIG.BUILDINGS.timeMachine.baseCPS,
                multiplier: 1,
                icon: '⏰',
                description: CONFIG.BUILDINGS.timeMachine.description,
                unlocked: true,
                efficiency: 100,
                level: 1
            },
            {
                id: 'aiSupercomputer',
                name: "AI Supercomputer",
                baseCost: CONFIG.BUILDINGS.aiSupercomputer.baseCost,
                count: 0,
                baseCPS: CONFIG.BUILDINGS.aiSupercomputer.baseCPS,
                cps: CONFIG.BUILDINGS.aiSupercomputer.baseCPS,
                multiplier: 1,
                icon: '🤖',
                description: CONFIG.BUILDINGS.aiSupercomputer.description,
                unlocked: true,
                efficiency: 100,
                level: 1
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
            
            // Apply special effects based on milestones
            this.checkBuildingMilestones(building);
            
            // Create visual effects
            this.createPurchaseEffects(building);
            
            // Update game state
            this.game.updateCPS();
            this.renderBuildings();
            
            // Check for achievements
            this.game.checkAchievements();
            
            return true;
        }
        return false;
    }

    calculateBuildingCost(building) {
        return Math.floor(building.baseCost * Math.pow(1.15, building.count));
    }

    calculateBuildingCPS(building) {
        return building.baseCPS * building.multiplier * (building.efficiency / 100);
    }

    checkBuildingMilestones(building) {
        const milestones = [10, 25, 50, 100, 150, 200, 250, 300];
        if (milestones.includes(building.count)) {
            // Increase efficiency
            building.efficiency += 10;
            
            // Level up building
            building.level++;
            
            // Show milestone notification
            Utils.showNotification(
                `${building.name} reached level ${building.level}! Efficiency increased!`,
                'achievement'
            );
            
            // Add special effects
            Utils.screenFlash('#FFD700', 500);
        }
    }

    createPurchaseEffects(building) {
        // Visual effect at building location
        const buildingElement = document.querySelector(`[data-building-id="${building.id}"]`);
        if (buildingElement) {
            const rect = buildingElement.getBoundingClientRect();
            Utils.createParticles(
                rect.left + rect.width / 2,
                rect.top + rect.height / 2,
                'purchase'
            );
        }

        // Show floating text
        Utils.createFloatingText(
            window.innerWidth / 2,
            window.innerHeight / 2,
            `${building.name} purchased!`,
            '#FFD700'
        );
    }

    upgradeBuilding(buildingId) {
        const building = this.buildings.find(b => b.id === buildingId);
        if (!building) return false;

        const upgradeCost = this.calculateUpgradeCost(building);
        if (this.game.cookies >= upgradeCost) {
            this.game.cookies -= upgradeCost;
            building.multiplier *= 2;
            building.level++;
            
            Utils.showNotification(
                `${building.name} upgraded to level ${building.level}!`,
                'upgrade'
            );
            
            this.game.updateCPS();
            this.renderBuildings();
            return true;
        }
        return false;
    }

    calculateUpgradeCost(building) {
        return building.baseCost * Math.pow(10, building.level);
    }

    renderBuildings() {
        const container = document.getElementById('buildings-grid');
        if (!container) return;

        container.innerHTML = '';
        
        this.buildings.forEach(building => {
            if (!building.unlocked) return;

            const cost = this.calculateBuildingCost(building);
            const canAfford = this.game.cookies >= cost;
            const upgradeCost = this.calculateUpgradeCost(building);
            const canUpgrade = this.game.cookies >= upgradeCost;

            const buildingElement = document.createElement('div');
            buildingElement.className = `grid-tile building-tile ${canAfford ? '' : 'locked'}`;
            buildingElement.dataset.buildingId = building.id;
            buildingElement.innerHTML = `
                <div class="building-icon">${building.icon}</div>
                <div class="building-info">
                    <h4>${building.name} (Level ${building.level})</h4>
                    <p>${building.description}</p>
                    <div class="building-stats">
                        <span>Owned: ${building.count}</span>
                        <span>CPS: ${Utils.formatNumber(this.calculateBuildingCPS(building))}</span>
                        <span>Efficiency: ${building.efficiency}%</span>
                    </div>
                    <div class="building-costs">
                        <button class="buy-btn ${canAfford ? '' : 'locked'}">
                            Buy: ${Utils.formatNumber(cost)} cookies
                        </button>
                        <button class="upgrade-btn ${canUpgrade ? '' : 'locked'}">
                            Upgrade: ${Utils.formatNumber(upgradeCost)} cookies
                        </button>
                    </div>
                </div>
            `;

            // Add click handlers
            buildingElement.querySelector('.buy-btn').onclick = (e) => {
                e.stopPropagation();
                this.purchaseBuilding(building.id);
            };

            buildingElement.querySelector('.upgrade-btn').onclick = (e) => {
                e.stopPropagation();
                this.upgradeBuilding(building.id);
            };

            container.appendChild(buildingElement);
        });
    }

    startAutoProduction() {
        setInterval(() => {
            this.buildings.forEach(building => {
                if (building.count > 0) {
                    const production = this.calculateBuildingCPS(building) * building.count / 20; // Divide by 20 for smooth updates
                    this.game.addCookies(production);
                    
                    // Random chance for special effects based on building level
                    if (Math.random() < 0.01 * building.level) {
                        this.triggerSpecialEffect(building);
                    }
                }
            });
        }, 50); // Update every 50ms for smooth animation
    }

    triggerSpecialEffect(building) {
        const effects = {
            autoClicker: () => this.game.clickCookie(),
            robotArm: () => building.efficiency += 1,
            cookieFactory: () => this.game.cookies *= 1.01,
            megaProcessor: () => this.game.globalMultiplier *= 1.01,
            quantumOven: () => this.spawnQuantumCookies(),
            cookieCollider: () => this.triggerColliderEffect(),
            timeMachine: () => this.timeTravelBonus(),
            aiSupercomputer: () => this.aiOptimization()
        };

        if (effects[building.id]) {
            effects[building.id]();
        }
    }

    spawnQuantumCookies() {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.game.addCookies(this.game.cookiesPerSecond * 10);
                Utils.createFloatingText(
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerHeight,
                    "Quantum Cookie!",
                    '#00ff00'
                );
            }, i * 1000);
        }
    }

    triggerColliderEffect() {
        Utils.screenFlash('#0000ff');
        this.game.globalMultiplier *= 1.1;
        setTimeout(() => this.game.globalMultiplier /= 1.1, 10000);
    }

    timeTravelBonus() {
        const bonus = this.game.cookiesPerSecond * 3600; // 1 hour of production
        this.game.addCookies(bonus);
        Utils.showNotification("Time travel brought cookies from the future!");
    }

    aiOptimization() {
        this.buildings.forEach(building => {
            building.efficiency += 0.1;
        });
        this.game.updateCPS();
    }

    save() {
        return {
            buildings: this.buildings.map(b => ({
                id: b.id,
                count: b.count,
                multiplier: b.multiplier,
                efficiency: b.efficiency,
                level: b.level
            }))
        };
    }

    load(saveData) {
        if (!saveData.buildings) return;
        
        saveData.buildings.forEach(savedBuilding => {
            const building = this.buildings.find(b => b.id === savedBuilding.id);
            if (building) {
                building.count = savedBuilding.count;
                building.multiplier = savedBuilding.multiplier;
                building.efficiency = savedBuilding.efficiency;
                building.level = savedBuilding.level;
            }
        });

        this.renderBuildings();
    }
}

// Export BuildingManager
window.BuildingManager = BuildingManager;
