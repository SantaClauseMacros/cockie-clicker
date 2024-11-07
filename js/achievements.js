// achievements.js - Achievement System

class AchievementSystem {
    constructor(game) {
        this.game = game;
        this.achievements = this.initializeAchievements();
        this.unlockedAchievements = new Set();
        this.initializeUI();
        
        // Check achievements every second
        setInterval(() => this.checkAchievements(), 1000);
    }

    initializeAchievements() {
        return {
            // Cookie Production Achievements
            cookieProduction: [
                {
                    id: 'cookie_rookie',
                    name: 'Cookie Rookie',
                    description: 'Bake 100 cookies',
                    icon: '🍪',
                    requirement: () => this.game.totalCookiesBaked >= 100,
                    reward: () => this.game.globalMultiplier *= 1.01
                },
                {
                    id: 'cookie_professional',
                    name: 'Cookie Professional',
                    description: 'Bake 10,000 cookies',
                    icon: '🍪🍪',
                    requirement: () => this.game.totalCookiesBaked >= 10000,
                    reward: () => this.game.globalMultiplier *= 1.02
                },
                {
                    id: 'cookie_master',
                    name: 'Cookie Master',
                    description: 'Bake 1 million cookies',
                    icon: '🍪👑',
                    requirement: () => this.game.totalCookiesBaked >= 1000000,
                    reward: () => this.game.globalMultiplier *= 1.05
                },
                {
                    id: 'cookie_grandmaster',
                    name: 'Cookie Grandmaster',
                    description: 'Bake 1 billion cookies',
                    icon: '🍪⭐',
                    requirement: () => this.game.totalCookiesBaked >= 1000000000,
                    reward: () => this.game.globalMultiplier *= 1.10
                }
            ],

            // Click Achievements
            clicking: [
                {
                    id: 'click_beginner',
                    name: 'Click Beginner',
                    description: 'Click the cookie 100 times',
                    icon: '👆',
                    requirement: () => this.game.totalClicks >= 100,
                    reward: () => this.game.clickPower *= 1.1
                },
                {
                    id: 'click_enthusiast',
                    name: 'Click Enthusiast',
                    description: 'Click the cookie 1,000 times',
                    icon: '👆✨',
                    requirement: () => this.game.totalClicks >= 1000,
                    reward: () => this.game.clickPower *= 1.2
                },
                {
                    id: 'click_master',
                    name: 'Click Master',
                    description: 'Click the cookie 10,000 times',
                    icon: '👆💫',
                    requirement: () => this.game.totalClicks >= 10000,
                    reward: () => this.game.clickPower *= 1.5
                }
            ],

            // Building Achievements
            buildings: [
                {
                    id: 'cursor_collector',
                    name: 'Cursor Collector',
                    description: 'Own 10 cursors',
                    icon: '👆🌟',
                    requirement: () => this.game.buildings.find(b => b.id === 'cursor')?.count >= 10,
                    reward: () => this.boostBuilding('cursor', 1.5)
                },
                {
                    id: 'grandma_gang',
                    name: 'Grandma Gang',
                    description: 'Own 10 grandmas',
                    icon: '👵🌟',
                    requirement: () => this.game.buildings.find(b => b.id === 'grandma')?.count >= 10,
                    reward: () => this.boostBuilding('grandma', 1.5)
                },
                {
                    id: 'farm_fanatic',
                    name: 'Farm Fanatic',
                    description: 'Own 10 farms',
                    icon: '🌾🌟',
                    requirement: () => this.game.buildings.find(b => b.id === 'farm')?.count >= 10,
                    reward: () => this.boostBuilding('farm', 1.5)
                }
            ],

            // Special Achievements
            special: [
                {
                    id: 'golden_cookie_hunter',
                    name: 'Golden Cookie Hunter',
                    description: 'Click 10 golden cookies',
                    icon: '🌟',
                    requirement: () => this.game.goldenCookiesClicked >= 10,
                    reward: () => this.game.goldenCookieMultiplier *= 1.1
                },
                {
                    id: 'speed_baker',
                    name: 'Speed Baker',
                    description: 'Reach 100 cookies per second',
                    icon: '⚡',
                    requirement: () => this.game.cookiesPerSecond >= 100,
                    reward: () => this.game.globalMultiplier *= 1.05
                },
                {
                    id: 'quantum_baker',
                    name: 'Quantum Baker',
                    description: 'Complete all quantum research',
                    icon: '⚛️',
                    requirement: () => this.checkQuantumResearch(),
                    reward: () => this.unlockQuantumFeatures()
                }
            ],

            // Prestige Achievements
            prestige: [
                {
                    id: 'ascended',
                    name: 'Ascended',
                    description: 'Prestige for the first time',
                    icon: '🌈',
                    requirement: () => this.game.totalPrestiges >= 1,
                    reward: () => this.game.prestigeMultiplier *= 1.1
                },
                {
                    id: 'transcended',
                    name: 'Transcended',
                    description: 'Prestige 10 times',
                    icon: '🌈✨',
                    requirement: () => this.game.totalPrestiges >= 10,
                    reward: () => this.game.prestigeMultiplier *= 1.2
                }
            ]
        };
    }

    initializeUI() {
        const container = document.getElementById('achievements');
        if (!container) return;

        // Create sections for each achievement category
        Object.entries(this.achievements).forEach(([category, achievements]) => {
            const section = document.createElement('div');
            section.className = 'achievement-section';
            section.innerHTML = `
                <h3>${this.formatCategoryName(category)}</h3>
                <div class="achievement-grid" id="${category}-achievements"></div>
            `;
            container.appendChild(section);
        });

        this.updateUI();
    }

    formatCategoryName(category) {
        return category.split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    checkAchievements() {
        Object.values(this.achievements).flat().forEach(achievement => {
            if (!this.unlockedAchievements.has(achievement.id) && achievement.requirement()) {
                this.unlockAchievement(achievement);
            }
        });
    }

    unlockAchievement(achievement) {
        if (this.unlockedAchievements.has(achievement.id)) return;

        this.unlockedAchievements.add(achievement.id);
        achievement.reward();
        
        // Show notification
        Utils.showNotification(`
            <div class="achievement-unlock">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-info">
                    <h3>Achievement Unlocked!</h3>
                    <h4>${achievement.name}</h4>
                    <p>${achievement.description}</p>
                </div>
            </div>
        `, 5000);

        this.updateUI();
        this.game.save();
    }

    updateUI() {
        Object.entries(this.achievements).forEach(([category, achievements]) => {
            const container = document.getElementById(`${category}-achievements`);
            if (!container) return;

            container.innerHTML = '';
            
            achievements.forEach(achievement => {
                const isUnlocked = this.unlockedAchievements.has(achievement.id);
                const element = document.createElement('div');
                element.className = `achievement ${isUnlocked ? 'unlocked' : 'locked'}`;
                element.innerHTML = `
                    <div class="achievement-icon">${achievement.icon}</div>
                    <div class="achievement-content">
                        <h4>${isUnlocked ? achievement.name : '???'}</h4>
                        <p>${isUnlocked ? achievement.description : 'Achievement locked'}</p>
                    </div>
                `;
                container.appendChild(element);
            });
        });
    }

    boostBuilding(buildingId, multiplier) {
        const building = this.game.buildings.find(b => b.id === buildingId);
        if (building) {
            building.cps *= multiplier;
            this.game.updateCPS();
        }
    }

    checkQuantumResearch() {
        return this.game.research && 
               this.game.research.isTreeCompleted('quantumPhysics');
    }

    unlockQuantumFeatures() {
        if (this.game.unlockQuantumFeatures) {
            this.game.unlockQuantumFeatures();
        }
    }

    getProgress() {
        const total = Object.values(this.achievements).flat().length;
        const unlocked = this.unlockedAchievements.size;
        return {
            total,
            unlocked,
            percentage: (unlocked / total) * 100
        };
    }

    save() {
        return {
            unlockedAchievements: Array.from(this.unlockedAchievements)
        };
    }

    load(saveData) {
        if (saveData && saveData.unlockedAchievements) {
            this.unlockedAchievements = new Set(saveData.unlockedAchievements);
            this.updateUI();
        }
    }
}

// Export the AchievementSystem
window.AchievementSystem = AchievementSystem;
