// achievements.js - Achievement System
class AchievementSystem {
    constructor(game) {
        this.game = game;
        this.achievements = this.initializeAchievements();
        this.unlockedAchievements = new Set();
        this.checkInterval = setInterval(() => this.checkAchievements(), 1000);
        this.renderAchievements();
    }

    initializeAchievements() {
        return {
            // Cookie Production Achievements
            production: [
                {
                    id: 'humble_beginnings',
                    name: 'Humble Beginnings',
                    description: 'Bake 100 cookies',
                    icon: '🍪',
                    requirement: () => this.game.totalCookiesBaked >= 100,
                    reward: () => { 
                        this.game.globalMultiplier *= 1.1;
                        return "Cookie production +10%";
                    }
                },
                {
                    id: 'cookie_factory',
                    name: 'Cookie Factory',
                    description: 'Bake 1,000 cookies',
                    icon: '🏭',
                    requirement: () => this.game.totalCookiesBaked >= 1000,
                    reward: () => {
                        this.game.globalMultiplier *= 1.2;
                        return "Cookie production +20%";
                    }
                },
                {
                    id: 'cookie_empire',
                    name: 'Cookie Empire',
                    description: 'Bake 1,000,000 cookies',
                    icon: '👑',
                    requirement: () => this.game.totalCookiesBaked >= 1000000,
                    reward: () => {
                        this.game.globalMultiplier *= 1.5;
                        return "Cookie production +50%";
                    }
                }
            ],

            // Click Achievements
            clicking: [
                {
                    id: 'click_rookie',
                    name: 'Click Rookie',
                    description: 'Click the cookie 100 times',
                    icon: '👆',
                    requirement: () => this.game.totalClicks >= 100,
                    reward: () => {
                        this.game.clickPower *= 1.1;
                        return "Click power +10%";
                    }
                },
                {
                    id: 'click_master',
                    name: 'Click Master',
                    description: 'Click the cookie 1,000 times',
                    icon: '✨👆',
                    requirement: () => this.game.totalClicks >= 1000,
                    reward: () => {
                        this.game.clickPower *= 1.5;
                        return "Click power +50%";
                    }
                },
                {
                    id: 'click_god',
                    name: 'Click God',
                    description: 'Click the cookie 10,000 times',
                    icon: '🌟👆',
                    requirement: () => this.game.totalClicks >= 10000,
                    reward: () => {
                        this.game.clickPower *= 2;
                        return "Click power x2";
                    }
                }
            ],

            // Building Achievements
            buildings: [
                {
                    id: 'automation_beginner',
                    name: 'Automation Beginner',
                    description: 'Own 10 Auto Clickers',
                    icon: '🤖',
                    requirement: () => this.game.buildings.buildings.find(b => b.id === 'autoClicker')?.count >= 10,
                    reward: () => {
                        const building = this.game.buildings.buildings.find(b => b.id === 'autoClicker');
                        if (building) building.multiplier *= 1.5;
                        return "Auto Clickers are 50% more efficient";
                    }
                },
                {
                    id: 'robot_army',
                    name: 'Robot Army',
                    description: 'Own 10 Robot Arms',
                    icon: '🦾',
                    requirement: () => this.game.buildings.buildings.find(b => b.id === 'robotArm')?.count >= 10,
                    reward: () => {
                        const building = this.game.buildings.buildings.find(b => b.id === 'robotArm');
                        if (building) building.multiplier *= 1.5;
                        return "Robot Arms are 50% more efficient";
                    }
                }
            ],

            // Golden Cookie Achievements
            goldenCookies: [
                {
                    id: 'golden_hunter',
                    name: 'Golden Hunter',
                    description: 'Click 10 golden cookies',
                    icon: '🌟',
                    requirement: () => this.game.goldenCookiesClicked >= 10,
                    reward: () => {
                        this.game.goldenCookieFrequency *= 1.1;
                        return "Golden cookies appear 10% more frequently";
                    }
                },
                {
                    id: 'golden_master',
                    name: 'Golden Master',
                    description: 'Click 50 golden cookies',
                    icon: '✨🌟',
                    requirement: () => this.game.goldenCookiesClicked >= 50,
                    reward: () => {
                        this.game.goldenCookieDuration *= 1.5;
                        return "Golden cookie effects last 50% longer";
                    }
                }
            ],

            // Research Achievements
            research: [
                {
                    id: 'scientist',
                    name: 'Cookie Scientist',
                    description: 'Complete your first research',
                    icon: '🔬',
                    requirement: () => this.game.research.completedResearch.size >= 1,
                    reward: () => {
                        this.game.researchPointMultiplier *= 1.5;
                        return "Research points generation +50%";
                    }
                },
                {
                    id: 'mad_scientist',
                    name: 'Mad Scientist',
                    description: 'Complete 5 researches',
                    icon: '🧪',
                    requirement: () => this.game.research.completedResearch.size >= 5,
                    reward: () => {
                        this.game.researchPointMultiplier *= 2;
                        return "Research points generation x2";
                    }
                }
            ],

            // Special Achievements
            special: [
                {
                    id: 'speed_demon',
                    name: 'Speed Demon',
                    description: 'Make 100 cookies per second',
                    icon: '⚡',
                    requirement: () => this.game.cookiesPerSecond >= 100,
                    reward: () => {
                        this.game.globalMultiplier *= 1.1;
                        return "Cookie production +10%";
                    }
                },
                {
                    id: 'cookie_god',
                    name: 'Cookie God',
                    description: 'Make 1,000 cookies per second',
                    icon: '🏆',
                    requirement: () => this.game.cookiesPerSecond >= 1000,
                    reward: () => {
                        this.game.globalMultiplier *= 1.5;
                        return "Cookie production +50%";
                    }
                },
                {
                    id: 'ascended',
                    name: 'Ascended',
                    description: 'Reach 1 trillion cookies baked all time',
                    icon: '👼',
                    requirement: () => this.game.totalCookiesBaked >= 1e12,
                    reward: () => {
                        this.game.globalMultiplier *= 2;
                        return "Cookie production x2";
                    }
                }
            ]
        };
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
        
        // Apply reward
        const rewardText = achievement.reward();
        
        // Show notification
        this.showAchievementNotification(achievement, rewardText);
        
        // Update UI
        this.renderAchievements();
        
        // Play sound effect
        // this.game.playSound('achievement');
        
        // Create visual effect
        Utils.screenFlash('#FFD700', 500);
        
        // Update stats
        this.game.updateUI();
    }

    showAchievementNotification(achievement, rewardText) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-info">
                <h3>Achievement Unlocked!</h3>
                <h4>${achievement.name}</h4>
                <p>${achievement.description}</p>
                <p class="reward-text">${rewardText}</p>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    }

    renderAchievements() {
        const container = document.getElementById('achievements-grid');
        if (!container) return;

        container.innerHTML = '';
        
        // Add achievement statistics
        const statsDiv = document.createElement('div');
        statsDiv.className = 'achievement-stats';
        const totalAchievements = Object.values(this.achievements).flat().length;
        const unlockedCount = this.unlockedAchievements.size;
        const percentage = ((unlockedCount / totalAchievements) * 100).toFixed(1);
        
        statsDiv.innerHTML = `
            <h3>Achievements: ${unlockedCount}/${totalAchievements} (${percentage}%)</h3>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${percentage}%"></div>
            </div>
        `;
        container.appendChild(statsDiv);

        // Render achievements by category
        Object.entries(this.achievements).forEach(([category, achievements]) => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'achievement-category';
            categoryDiv.innerHTML = `<h3>${this.formatCategoryName(category)}</h3>`;
            
            const achievementsGrid = document.createElement('div');
            achievementsGrid.className = 'achievements-grid';
            
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
                
                achievementsGrid.appendChild(element);
            });
            
            categoryDiv.appendChild(achievementsGrid);
            container.appendChild(categoryDiv);
        });
    }

    formatCategoryName(category) {
        return category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1');
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
            
            // Reapply achievement rewards
            this.unlockedAchievements.forEach(id => {
                const achievement = Object.values(this.achievements)
                    .flat()
                    .find(a => a.id === id);
                if (achievement) {
                    achievement.reward();
                }
            });
            
            this.renderAchievements();
        }
    }
}

// Export AchievementSystem
window.AchievementSystem = AchievementSystem;
