// utils.js - Utility Functions

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

    // Particle Effects
    createParticles: function(x, y, amount = 5) {
        for (let i = 0; i < amount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random size between 5-15px
            const size = Math.random() * 10 + 5;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            // Random direction
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 3 + 2;
            const dx = Math.cos(angle) * velocity * 50;
            const dy = Math.sin(angle) * velocity * 50;
            
            particle.style.setProperty('--dx', dx + 'px');
            particle.style.setProperty('--dy', dy + 'px');
            
            // Position at click
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            
            document.body.appendChild(particle);
            
            // Remove particle after animation
            setTimeout(() => particle.remove(), 1000);
        }
    },

    // Save/Load System
    saveGame: function(gameState) {
        try {
            const saveData = JSON.stringify(gameState);
            localStorage.setItem(CONFIG.SAVE_KEY, saveData);
            return true;
        } catch (error) {
            console.error('Save failed:', error);
            return false;
        }
    },

    loadGame: function() {
        try {
            const saveData = localStorage.getItem(CONFIG.SAVE_KEY);
            return saveData ? JSON.parse(saveData) : null;
        } catch (error) {
            console.error('Load failed:', error);
            return null;
        }
    },

    // Random Number Generation
    random: function(min, max) {
        return Math.random() * (max - min) + min;
    },

    randomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Notifications
    showNotification: function(message, duration = 3000) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 500);
        }, duration);
    },

    // Achievement Popup
    showAchievement: function(title, description) {
        const achievement = document.createElement('div');
        achievement.className = 'achievement-popup';
        achievement.innerHTML = `
            <h3>🏆 Achievement Unlocked!</h3>
            <h4>${title}</h4>
            <p>${description}</p>
        `;
        
        document.body.appendChild(achievement);
        
        setTimeout(() => {
            achievement.style.opacity = '0';
            setTimeout(() => achievement.remove(), 500);
        }, 5000);
    },

    // Cost Calculation
    calculateCost: function(baseCost, owned) {
        return Math.floor(baseCost * Math.pow(1.15, owned));
    },

    // Check if player can afford something
    canAfford: function(cost, currentCookies) {
        return currentCookies >= cost;
    },

    // Calculate CPS
    calculateCPS: function(buildings, upgrades, multiplier) {
        let cps = 0;
        for (const building of buildings) {
            cps += building.cps * building.count;
        }
        return cps * multiplier;
    },

    // Calculate prestige gain
    calculatePrestigeGain: function(cookies) {
        return Math.floor(Math.pow(cookies / CONFIG.PRESTIGE_REQUIREMENT, CONFIG.PRESTIGE_SCALING));
    },

    // Create floating text
    createFloatingText: function(x, y, text, color = '#ffd700') {
        const floatingText = document.createElement('div');
        floatingText.className = 'floating-text';
        floatingText.textContent = text;
        floatingText.style.color = color;
        floatingText.style.left = x + 'px';
        floatingText.style.top = y + 'px';
        
        document.body.appendChild(floatingText);
        
        setTimeout(() => floatingText.remove(), 1000);
    },

    // Debug logging
    debug: function(...args) {
        if (CONFIG.DEBUG.ENABLED) {
            console.log('[Debug]', ...args);
        }
    },

    // Check if an element is in viewport
    isInViewport: function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// Export utils
window.Utils = Utils;
