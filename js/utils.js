// utils.js - Helper Functions
const Utils = {
    // Number Formatting
    formatNumber: function(num) {
        const suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];
        let suffixIndex = 0;
        
        while (num >= 1000 && suffixIndex < suffixes.length - 1) {
            num /= 1000;
            suffixIndex++;
        }
        
        return num.toFixed(3) + suffixes[suffixIndex];
    },

    // Time Formatting
    formatTime: function(seconds) {
        if (seconds < 60) return `${Math.floor(seconds)}s`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${Math.floor(seconds % 60)}s`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
        return `${Math.floor(seconds / 86400)}d ${Math.floor((seconds % 86400) / 3600)}h`;
    },

    // Visual Effects
    createParticles: function(x, y, type = 'click') {
        const settings = CONFIG.PARTICLES[type.toUpperCase()];
        for (let i = 0; i < settings.COUNT; i++) {
            const particle = document.createElement('div');
            particle.className = `particle ${type}-particle`;
            
            // Random size
            const size = Math.random() * (settings.MAX_SIZE - settings.MIN_SIZE) + settings.MIN_SIZE;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            // Random direction
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * settings.SPEED + 2;
            const dx = Math.cos(angle) * velocity * 50;
            const dy = Math.sin(angle) * velocity * 50;
            
            particle.style.setProperty('--dx', dx + 'px');
            particle.style.setProperty('--dy', dy + 'px');
            
            // Position at click/spawn point
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            
            document.body.appendChild(particle);
            
            setTimeout(() => particle.remove(), settings.LIFETIME);
        }
    },

    // Notifications
    showNotification: function(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = message;
        
        document.body.appendChild(notification);
        
        // Animate and remove
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 500);
        }, duration);
    },

    // Achievement Popup
    showAchievement: function(achievement) {
        const popup = document.createElement('div');
        popup.className = 'achievement-popup';
        popup.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-info">
                <h3>Achievement Unlocked!</h3>
                <h4>${achievement.name}</h4>
                <p>${achievement.description}</p>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        setTimeout(() => {
            popup.style.opacity = '0';
            setTimeout(() => popup.remove(), 500);
        }, 5000);
    },

    // Screen Effects
    screenFlash: function(color = '#FFF', duration = 300) {
        const flash = document.createElement('div');
        flash.className = 'screen-flash';
        flash.style.background = color;
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), duration);
    },

    // Random Effects
    createFloatingText: function(x, y, text, color = '#FFF') {
        const floatingText = document.createElement('div');
        floatingText.className = 'floating-text';
        floatingText.textContent = text;
        floatingText.style.color = color;
        floatingText.style.left = x + 'px';
        floatingText.style.top = y + 'px';
        
        document.body.appendChild(floatingText);
        setTimeout(() => floatingText.remove(), 1000);
    },

    // Save/Load System
    saveGame: function(gameState) {
        try {
            const saveData = JSON.stringify(gameState);
            localStorage.setItem(CONFIG.SAVE_KEY, saveData);
            this.showNotification('Game saved!', 'success');
            return true;
        } catch (error) {
            console.error('Save failed:', error);
            this.showNotification('Failed to save game!', 'error');
            return false;
        }
    },

    loadGame: function() {
        try {
            const saveData = localStorage.getItem(CONFIG.SAVE_KEY);
            return saveData ? JSON.parse(saveData) : null;
        } catch (error) {
            console.error('Load failed:', error);
            this.showNotification('Failed to load save!', 'error');
            return null;
        }
    },

    // Random Number Utilities
    random: function(min, max) {
        return Math.random() * (max - min) + min;
    },

    randomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Cookie Production Calculations
    calculateCPS: function(buildings, multiplier) {
        let cps = 0;
        for (const building of buildings) {
            cps += building.cps * building.count;
        }
        return cps * multiplier;
    },

    // Research Point Calculations
    calculateResearchPoints: function(buildings) {
        let points = 0;
        for (const building of buildings) {
            points += building.count * CONFIG.RESEARCH.POINTS_PER_BUILDING;
        }
        return points;
    },

    // Prestige Calculations
    calculatePrestigeGain: function(cookies) {
        return CONFIG.PRESTIGE.CHIPS_FORMULA(cookies);
    },

    // Building Cost Calculation
    calculateBuildingCost: function(baseCost, owned) {
        return Math.floor(baseCost * Math.pow(1.15, owned));
    },

    // Event System
    scheduleEvent: function(callback, minTime, maxTime) {
        const delay = this.random(minTime, maxTime);
        return setTimeout(callback, delay);
    }
};

// Export Utils
window.Utils = Utils;
