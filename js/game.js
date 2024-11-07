// game.js - Main Game Logic (Fixed Version)
class CookieGame {
    constructor() {
        // Core game state
        this.cookies = 0;
        this.totalCookiesBaked = 0;
        this.cookiesPerClick = 1;
        this.cookiesPerSecond = 0;
        this.globalMultiplier = 1;
        this.clickMultiplier = 1;
        this.totalClicks = 0;

        // Initialize upgrades system
        this.upgrades = new UpgradeManager(this);

        // Initialize UI elements
        this.initializeUI();
        this.initializeEventListeners();
        
        // Load saved game or start new
        this.loadGame();
        
        // Start game loops
        this.startGameLoop();
        this.startAutoSave();
    }

    initializeUI() {
        this.elements = {
            cookie: document.getElementById('cookie'),
            cookieCount: document.getElementById('cookie-count'),
            cps: document.getElementById('cps'),
            multiplier: document.getElementById('multiplier')
        };
        
        this.updateUI();
    }

    initializeEventListeners() {
        // Cookie click handler
        this.elements.cookie.addEventListener('click', (e) => {
            this.clickCookie(e);
        });

        // Save game before window closes
        window.addEventListener('beforeunload', () => {
            this.saveGame();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === ' ') { // Spacebar clicks cookie
                this.clickCookie({
                    clientX: this.elements.cookie.offsetLeft + this.elements.cookie.offsetWidth / 2,
                    clientY: this.elements.cookie.offsetTop + this.elements.cookie.offsetHeight / 2
                });
            }
        });
    }

    clickCookie(event) {
        // Calculate click value
        let clickValue = this.cookiesPerClick * this.clickMultiplier * this.globalMultiplier;

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
    }

    addCookies(amount) {
        this.cookies += amount;
        this.totalCookiesBaked += amount;
        this.updateUI();
    }

    createClickEffects(event, amount) {
        // Particle effects
        this.createParticles(event.clientX, event.clientY);

        // Floating number
        this.createFloatingText(
            event.clientX,
            event.clientY,
            `+${this.formatNumber(amount)}`
        );

        // Cookie bounce animation
        this.elements.cookie.classList.add('clicked');
        setTimeout(() => {
            this.elements.cookie.classList.remove('clicked');
        }, 100);
    }

    createParticles(x, y) {
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 10 + 5;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 3 + 2;
            const dx = Math.cos(angle) * velocity * 50;
            const dy = Math.sin(angle) * velocity * 50;
            
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.setProperty('--dx', dx + 'px');
            particle.style.setProperty('--dy', dy + 'px');
            
            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 1000);
        }
    }

    createFloatingText(x, y, text) {
        const floatingText = document.createElement('div');
        floatingText.className = 'floating-text';
        floatingText.textContent = text;
        floatingText.style.left = x + 'px';
        floatingText.style.top = y + 'px';
        
        document.body.appendChild(floatingText);
        setTimeout(() => floatingText.remove(), 1000);
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
        // Update cookie count display
        this.elements.cookieCount.textContent = `${this.formatNumber(this.cookies)} cookies`;
        this.elements.cps.textContent = `per second: ${this.formatNumber(this.cookiesPerSecond)}`;
        this.elements.multiplier.textContent = `multiplier: x${this.formatNumber(this.globalMultiplier)}`;
    }

    startGameLoop() {
        setInterval(() => {
            // Add CPS (divide by 20 for smoother counting - 50ms intervals)
            this.addCookies(this.cookiesPerSecond / 20);
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
            totalClicks: this.totalClicks,
            upgrades: this.upgrades.save(),
            lastSave: Date.now()
        };

        localStorage.setItem('cookieGameSave', JSON.stringify(saveData));
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
            this.globalMultiplier = data.globalMultiplier || 1;
            this.clickMultiplier = data.clickMultiplier || 1;
            this.totalClicks = data.totalClicks || 0;

            // Load upgrades
            if (data.upgrades) {
                this.upgrades.load(data.upgrades);
            }

            // Calculate offline progress
            if (data.lastSave) {
                this.calculateOfflineProgress(data.lastSave);
            }

            this.updateUI();
        } catch (error) {
            console.error('Error loading save:', error);
            alert('Error loading save file!');
        }
    }

    calculateOfflineProgress(lastSave) {
        const offlineTime = (Date.now() - lastSave) / 1000; // in seconds
        const offlineProduction = this.cookiesPerSecond * offlineTime * 0.5; // 50% of normal production
        
        if (offlineProduction > 0) {
            this.addCookies(offlineProduction);
            this.createFloatingText(
                window.innerWidth / 2,
                window.innerHeight / 2,
                `Welcome back! +${this.formatNumber(offlineProduction)} cookies!`
            );
        }
    }

    formatNumber(num) {
        const suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc'];
        let suffixIndex = 0;
        
        while (num >= 1000 && suffixIndex < suffixes.length - 1) {
            num /= 1000;
            suffixIndex++;
        }
        
        return num.toFixed(3) + suffixes[suffixIndex];
    }
}

// Start the game when the page loads
window.onload = () => {
    window.game = new CookieGame();
};
