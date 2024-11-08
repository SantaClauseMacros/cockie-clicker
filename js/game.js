// game.js - Main Game Logic
class CookieGame {
    constructor() {
        // Core game state
        this.cookies = 0;
        this.totalCookiesBaked = 0;
        this.clickPower = 1;
        this.cookiesPerSecond = 0;
        this.globalMultiplier = 1;
        this.clickMultiplier = 1;
        this.criticalClickChance = 0.1;
        this.criticalClickMultiplier = 7;
        this.goldenCookieFrequency = 1;
        this.goldenCookieDuration = 13;
        this.totalClicks = 0;
        this.goldenCookiesClicked = 0;
        this.startTime = Date.now();

        // Initialize game systems
        this.initializeSystems();
        
        // Initialize UI
        this.initializeUI();
        
        // Start game loops
        this.startGameLoops();
        
        // Load saved game or start tutorial
        this.loadGame() || this.startTutorial();
        
        // Add event listeners
        this.addEventListeners();
    }

    initializeSystems() {
        // Initialize all game systems in the correct order
        this.buildings = new BuildingManager(this);
        this.upgrades = new UpgradeManager(this);
        this.research = new ResearchSystem(this);
        this.achievements = new AchievementSystem(this);
        this.prestige = new PrestigeSystem(this);
        this.events = new EventSystem(this);
    }

    initializeUI() {
        // Get UI elements
        this.elements = {
            cookie: document.getElementById('cookie'),
            cookieCount: document.getElementById('cookie-count'),
            cps: document.getElementById('cps'),
            multiplier: document.getElementById('multiplier')
        };

        // Initial UI update
        this.updateUI();
    }

    startGameLoops() {
        // Production loop - updates every 50ms for smooth counting
        setInterval(() => {
            this.addCookies(this.cookiesPerSecond / 20);
        }, 50);

        // Save game every 30 seconds
        setInterval(() => {
            this.saveGame();
        }, 30000);

        // Update UI every 100ms
        setInterval(() => {
            this.updateUI();
        }, 100);
    }

    addEventListeners() {
        // Cookie click handler
        this.elements.cookie.addEventListener('click', (e) => {
            this.clickCookie(e);
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e);
        });

        // Save before closing
        window.addEventListener('beforeunload', () => {
            this.saveGame();
        });
    }

    clickCookie(event) {
        // Calculate click value
        let clickValue = this.clickPower * this.clickMultiplier * this.globalMultiplier;

        // Check for critical click
        if (Math.random() < this.criticalClickChance) {
            clickValue *= this.criticalClickMultiplier;
            this.createCriticalEffect(event);
        }

        // Add cookies
        this.addCookies(clickValue);
        this.totalClicks++;

        // Create click effects
        this.createClickEffects(event, clickValue);

        // Check achievements
        this.achievements.checkAchievements();
    }

    createClickEffects(event, amount) {
        // Create particles
        Utils.createParticles(
            event.clientX, 
            event.clientY,
            amount >= this.clickPower * this.criticalClickMultiplier ? 'critical' : 'click'
        );

        // Create floating text
        Utils.createFloatingText(
            event.clientX,
            event.clientY,
            `+${Utils.formatNumber(amount)}`,
            amount >= this.clickPower * this.criticalClickMultiplier ? '#ff0' : '#fff'
        );

        // Cookie bounce animation
        this.elements.cookie.classList.add('clicked');
        setTimeout(() => {
            this.elements.cookie.classList.remove('clicked');
        }, 100);
    }

    createCriticalEffect(event) {
        // Screen flash
        Utils.screenFlash('#ff0', 100);

        // Critical text
        const critText = document.createElement('div');
        critText.className = 'critical-text';
        critText.textContent = 'CRITICAL!';
        critText.style.left = `${event.clientX}px`;
        critText.style.top = `${event.clientY}px`;
        document.body.appendChild(critText);
        setTimeout(() => critText.remove(), 1000);
    }

    addCookies(amount) {
        this.cookies += amount;
        this.totalCookiesBaked += amount;
        this.updateUI();
    }

    updateUI() {
        // Update cookie display
        this.elements.cookieCount.textContent = `${Utils.formatNumber(this.cookies)} cookies`;
        this.elements.cps.textContent = `per second: ${Utils.formatNumber(this.cookiesPerSecond)}`;
        this.elements.multiplier.textContent = `multiplier: x${Utils.formatNumber(this.globalMultiplier)}`;

        // Update prestige button
        this.prestige.checkPrestigeButton();

        // Update other UI elements
        this.buildings.renderBuildings();
        this.upgrades.renderUpgrades();
        this.research.renderResearch();
        this.achievements.renderAchievements();
    }

    handleKeyPress(event) {
        switch(event.key) {
            case ' ': // Space clicks cookie
                this.clickCookie({
                    clientX: this.elements.cookie.offsetLeft + this.elements.cookie.offsetWidth / 2,
                    clientY: this.elements.cookie.offsetTop + this.elements.cookie.offsetHeight / 2
                });
                break;
            case 's': // S saves game
                this.saveGame();
                break;
            case 'p': // P prestiges if possible
                if (this.prestige.canPrestige()) {
                    this.prestige.prestige();
                }
                break;
        }
    }

    startTutorial() {
        const steps = [
            {
                text: "Welcome to Cookie Clicker! Click the cookie to start baking!",
                element: this.elements.cookie
            },
            {
                text: "Buy buildings to produce cookies automatically!",
                element: document.querySelector('.buildings-container')
            },
            {
                text: "Unlock upgrades to boost your production!",
                element: document.querySelector('.upgrades-container')
            }
        ];

        let currentStep = 0;
        const showStep = () => {
            if (currentStep >= steps.length) return;
            
            Utils.showNotification(steps[currentStep].text, 'tutorial');
            steps[currentStep].element.classList.add('tutorial-highlight');
            
            setTimeout(() => {
                steps[currentStep].element.classList.remove('tutorial-highlight');
                currentStep++;
                showStep();
            }, 5000);
        };

        showStep();
    }

    saveGame() {
        const saveData = {
            cookies: this.cookies,
            totalCookiesBaked: this.totalCookiesBaked,
            clickPower: this.clickPower,
            cookiesPerSecond: this.cookiesPerSecond,
            globalMultiplier: this.globalMultiplier,
            clickMultiplier: this.clickMultiplier,
            totalClicks: this.totalClicks,
            goldenCookiesClicked: this.goldenCookiesClicked,
            startTime: this.startTime,
            buildings: this.buildings.save(),
            upgrades: this.upgrades.save(),
            research: this.research.save(),
            achievements: this.achievements.save(),
            prestige: this.prestige.save(),
            events: this.events.save(),
            lastSave: Date.now()
        };

        localStorage.setItem('cookieGameSave', JSON.stringify(saveData));
        Utils.showNotification('Game saved!', 'success');
    }

    loadGame() {
        const saveData = localStorage.getItem('cookieGameSave');
        if (!saveData) return false;

        try {
            const data = JSON.parse(saveData);
            
            // Load core data
            this.cookies = data.cookies || 0;
            this.totalCookiesBaked = data.totalCookiesBaked || 0;
            this.clickPower = data.clickPower || 1;
            this.globalMultiplier = data.globalMultiplier || 1;
            this.clickMultiplier = data.clickMultiplier || 1;
            this.totalClicks = data.totalClicks || 0;
            this.goldenCookiesClicked = data.goldenCookiesClicked || 0;
            this.startTime = data.startTime || Date.now();

            // Load systems
            this.buildings.load(data.buildings);
            this.upgrades.load(data.upgrades);
            this.research.load(data.research);
            this.achievements.load(data.achievements);
            this.prestige.load(data.prestige);
            this.events.load(data.events);

            // Calculate offline progress
            if (data.lastSave) {
                this.calculateOfflineProgress(data.lastSave);
            }

            this.updateUI();
            Utils.showNotification('Game loaded!', 'success');
            return true;
        } catch (error) {
            console.error('Error loading save:', error);
            Utils.showNotification('Error loading save!', 'error');
            return false;
        }
    }

    calculateOfflineProgress(lastSave) {
        const offlineTime = (Date.now() - lastSave) / 1000; // in seconds
        const offlineProduction = this.cookiesPerSecond * offlineTime * 0.5; // 50% efficiency
        
        if (offlineProduction > 0) {
            this.addCookies(offlineProduction);
            Utils.showNotification(
                `Welcome back! You earned ${Utils.formatNumber(offlineProduction)} cookies while away!`,
                'success'
            );
        }
    }

    resetGame() {
        // Reset core values
        this.cookies = 0;
        this.clickPower = 1;
        this.cookiesPerSecond = 0;
        this.globalMultiplier = 1;
        this.clickMultiplier = 1;

        // Reset systems
        this.buildings = new BuildingManager(this);
        this.upgrades = new UpgradeManager(this);
        this.research = new ResearchSystem(this);
        
        // Keep achievements and prestige data
        
        // Update UI
        this.updateUI();
    }

    formatNumber(num) {
        return Utils.formatNumber(num);
    }
}

// Start game when page loads
window.onload = () => {
    window.game = new CookieGame();
};
