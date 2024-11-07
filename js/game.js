// game.js - Main Game Logic

class CookieGame {
    constructor() {
        // Core game state
        this.cookies = 0;
        this.totalCookiesBaked = 0;
        this.cookiesPerClick = 1;
        this.cookiesPerSecond = 0;
        this.globalMultiplier = 1;
        this.clickMultiplier = 1;
        this.prestigePoints = 0;
        this.totalPrestiges = 0;
        this.totalClicks = 0;
        this.goldenCookiesClicked = 0;
        
        // Game systems initialization
        this.upgrades = new UpgradeManager(this);
        this.achievements = new AchievementSystem(this);
        this.research = new ResearchSystem(this);
        this.events = new SpecialEvents(this);
        this.miniGames = new MiniGamesSystem(this);
        this.dimensions = new DimensionalSystem(this);

        // Initialize UI and event listeners
        this.initializeUI();
        this.initializeEventListeners();
        
        // Load saved game or start new game
        this.loadGame();
        
        // Start game loops
        this.startGameLoop();
        this.startAutoSave();
    }

    initializeUI() {
        // Get UI elements
        this.elements = {
            cookie: document.getElementById('cookie'),
            cookieCount: document.getElementById('cookie-count'),
            cps: document.getElementById('cps'),
            multiplier: document.getElementById('multiplier'),
            prestigeButton: document.getElementById('prestige-button')
        };
        
        // Initialize tooltips
        this.initializeTooltips();
        
        // Initial UI update
        this.updateUI();
    }

    initializeEventListeners() {
        // Cookie click handler
        this.elements.cookie.addEventListener('click', (e) => {
            this.clickCookie(e);
        });

        // Prestige button handler
        this.elements.prestigeButton.addEventListener('click', () => {
            this.prestige();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e);
        });

        // Save game before window closes
        window.addEventListener('beforeunload', () => {
            this.saveGame();
        });
    }

    clickCookie(event) {
        // Calculate click value
        const baseClick = this.cookiesPerClick * this.clickMultiplier * this.globalMultiplier;
        let clickValue = baseClick;

        // Critical click chance (10%)
        if (Math.random() < 0.1) {
            clickValue *= 10;
            this.createCriticalClickEffect(event);
        }

        // Add cookies
        this.addCookies(clickValue);
        this.totalClicks++;

        // Create click effects
        this.createClickEffects(event, clickValue);
        
        // Check achievements
        this.achievements.checkAchievements();
    }

    addCookies(amount) {
        this.cookies += amount;
        this.totalCookiesBaked += amount;
        this.updateUI();
    }

    createClickEffects(event, amount) {
        // Particle effects
        Utils.createParticles(event.clientX, event.clientY);

        // Floating number
        Utils.createFloatingText(
            event.clientX,
            event.clientY,
            `+${Utils.formatNumber(amount)}`
        );

        // Cookie bounce animation
        this.elements.cookie.classList.add('clicked');
        setTimeout(() => {
            this.elements.cookie.classList.remove('clicked');
        }, 100);
    }

    createCriticalClickEffect(event) {
        const critText = document.createElement('div');
        critText.className = 'critical-click';
        critText.textContent = 'CRITICAL!';
        critText.style.left = `${event.clientX}px`;
        critText.style.top = `${event.clientY}px`;
        document.body.appendChild(critText);

        setTimeout(() => critText.remove(), 1000);
    }

    updateUI() {
        // Update cookie display
        this.elements.cookieCount.textContent = `${Utils.formatNumber(this.cookies)} cookies`;
        this.elements.cps.textContent = `per second: ${Utils.formatNumber(this.cookiesPerSecond)}`;
        this.elements.multiplier.textContent = `multiplier: x${Utils.formatNumber(this.globalMultiplier)}`;

        // Update prestige button
        const possiblePrestige = this.calculatePrestigeGain();
        if (possiblePrestige > 0) {
            this.elements.prestigeButton.style.display = 'block';
            this.elements.prestigeButton.textContent = 
                `Prestige (Gain ${Utils.formatNumber(possiblePrestige)} heavenly chips)`;
        }
    }

    calculatePrestigeGain() {
        return Math.floor(Math.pow(this.totalCookiesBaked / 1e12, 0.5));
    }

    prestige() {
        const gain = this.calculatePrestigeGain();
        if (gain > 0) {
            this.prestigePoints += gain;
            this.totalPrestiges++;
            
            // Reset game but keep prestige upgrades
            this.softReset();
            
            // Show prestige effect
            this.createPrestigeEffect();
            
            Utils.showNotification(`Prestiged! Gained ${Utils.formatNumber(gain)} heavenly chips!`);
        }
    }

    softReset() {
        // Reset cookies and production
        this.cookies = 0;
        this.cookiesPerClick = 1;
        this.cookiesPerSecond = 0;
        this.globalMultiplier = 1 + (this.prestigePoints * 0.02); // 2% bonus per prestige point

        // Reset upgrades but keep prestige upgrades
        this.upgrades = new UpgradeManager(this);

        // Update UI
        this.updateUI();
    }

    createPrestigeEffect() {
        const effect = document.createElement('div');
        effect.className = 'prestige-effect';
        document.body.appendChild(effect);

        setTimeout(() => effect.remove(), 2000);
    }

    startGameLoop() {
        this.gameLoop = setInterval(() => {
            // Add CPS
            this.addCookies(this.cookiesPerSecond / 20); // Update every 50ms for smooth counting

            // Update systems
            this.research.update(0.05);
            this.events.update(0.05);
            this.dimensions.update(0.05);

            // Update UI
            this.updateUI();
        }, 50);
    }

    startAutoSave() {
        setInterval(() => {
            this.saveGame();
        }, 30000); // Save every 30 seconds
    }

    saveGame() {
        const saveData = {
            cookies: this.cookies,
            totalCookiesBaked: this.totalCookiesBaked,
            cookiesPerClick: this.cookiesPerClick,
            cookiesPerSecond: this.cookiesPerSecond,
            globalMultiplier: this.globalMultiplier,
            clickMultiplier: this.clickMultiplier,
            prestigePoints: this.prestigePoints,
            totalPrestiges: this.totalPrestiges,
            totalClicks: this.totalClicks,
            goldenCookiesClicked: this.goldenCookiesClicked,
            lastSave: Date.now(),
            
            // System saves
            upgrades: this.upgrades.save(),
            achievements: this.achievements.save(),
            research: this.research.save(),
            events: this.events.save(),
            miniGames: this.miniGames.save(),
            dimensions: this.dimensions.save()
        };

        localStorage.setItem('cookieGameSave', JSON.stringify(saveData));
        Utils.showNotification('Game saved!');
    }

    loadGame() {
        const saveData = localStorage.getItem('cookieGameSave');
        if (!saveData) return;

        try {
            const data = JSON.parse(saveData);
            
            // Load core data
            this.cookies = data.cookies || 0;
            this.totalCookiesBaked = data.totalCookiesBaked || 0;
            this.cookiesPerClick = data.cookiesPerClick || 1;
            this.cookiesPerSecond = data.cookiesPerSecond || 0;
            this.globalMultiplier = data.globalMultiplier || 1;
            this.clickMultiplier = data.clickMultiplier || 1;
            this.prestigePoints = data.prestigePoints || 0;
            this.totalPrestiges = data.totalPrestiges || 0;
            this.totalClicks = data.totalClicks || 0;
            this.goldenCookiesClicked = data.goldenCookiesClicked || 0;

            // Load systems
            if (data.upgrades) this.upgrades.load(data.upgrades);
            if (data.achievements) this.achievements.load(data.achievements);
            if (data.research) this.research.load(data.research);
            if (data.events) this.events.load(data.events);
            if (data.miniGames) this.miniGames.load(data.miniGames);
            if (data.dimensions) this.dimensions.load(data.dimensions);

            // Calculate offline progress
            if (data.lastSave) {
                this.calculateOfflineProgress(data.lastSave);
            }

            this.updateUI();
            Utils.showNotification('Game loaded!');
        } catch (error) {
            console.error('Error loading save:', error);
            Utils.showNotification('Error loading save file!', 'error');
        }
    }

    calculateOfflineProgress(lastSave) {
        const offlineTime = (Date.now() - lastSave) / 1000; // in seconds
        const offlineProduction = this.cookiesPerSecond * offlineTime * 0.5; // 50% of normal production
        
        if (offlineProduction > 0) {
            this.addCookies(offlineProduction);
            Utils.showNotification(
                `Welcome back! You earned ${Utils.formatNumber(offlineProduction)} cookies while away!`
            );
        }
    }

    handleKeyPress(event) {
        // Keyboard shortcuts
        switch(event.key) {
            case ' ':
                this.clickCookie({
                    clientX: this.elements.cookie.offsetLeft + this.elements.cookie.offsetWidth / 2,
                    clientY: this.elements.cookie.offsetTop + this.elements.cookie.offsetHeight / 2
                });
                break;
            case 's':
                this.saveGame();
                break;
            case 'p':
                if (this.calculatePrestigeGain() > 0) this.prestige();
                break;
        }
    }

    initializeTooltips() {
        // Add tooltips to various elements
        new Tooltip(this.elements.cookie, 'Click to earn cookies!');
        new Tooltip(this.elements.prestigeButton, 'Reset your progress for permanent bonuses');
    }
}

// Start the game when the page loads
window.onload = () => {
    window.game = new CookieGame();
};

// Tooltip class
class Tooltip {
    constructor(element, text) {
        this.element = element;
        this.text = text;
        this.tooltip = null;
        
        this.element.addEventListener('mouseenter', () => this.show());
        this.element.addEventListener('mouseleave', () => this.hide());
    }

    show() {
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'tooltip';
        this.tooltip.textContent = this.text;
        document.body.appendChild(this.tooltip);

        const rect = this.element.getBoundingClientRect();
        this.tooltip.style.left = `${rect.left + rect.width / 2}px`;
        this.tooltip.style.top = `${rect.top - 30}px`;
    }

    hide() {
        if (this.tooltip) {
            this.tooltip.remove();
            this.tooltip = null;
        }
    }
}
