// events.js - Special Events and Golden Cookies
class EventSystem {
    constructor(game) {
        this.game = game;
        this.activeEffects = new Set();
        this.goldenCookieTimer = null;
        this.eventQueue = [];
        this.goldenCookiesClicked = 0;
        this.activeEvents = new Map();
        
        // Start event systems
        this.startGoldenCookieSpawner();
        this.startRandomEvents();
    }

    // Golden Cookie System
    startGoldenCookieSpawner() {
        const spawnGolden = () => {
            const minTime = CONFIG.GOLDEN_COOKIE.MIN_TIME;
            const maxTime = CONFIG.GOLDEN_COOKIE.MAX_TIME;
            const nextSpawn = Math.random() * (maxTime - minTime) + minTime;
            
            this.goldenCookieTimer = setTimeout(() => {
                this.spawnGoldenCookie();
                spawnGolden(); // Schedule next spawn
            }, nextSpawn);
        };

        spawnGolden();
    }

    spawnGoldenCookie() {
        const goldenCookie = document.createElement('div');
        goldenCookie.className = 'golden-cookie';
        
        // Random position on screen
        const x = Math.random() * (window.innerWidth - 100);
        const y = Math.random() * (window.innerHeight - 100);
        
        goldenCookie.style.left = `${x}px`;
        goldenCookie.style.top = `${y}px`;
        
        // Add shine effect
        goldenCookie.innerHTML = '<div class="shine"></div>';
        
        // Click handler
        goldenCookie.onclick = () => {
            this.clickGoldenCookie();
            goldenCookie.remove();
            
            // Create click effect
            Utils.createParticles(x + 50, y + 50, 'golden');
        };
        
        document.body.appendChild(goldenCookie);
        
        // Remove after duration
        setTimeout(() => goldenCookie.remove(), CONFIG.GOLDEN_COOKIE.DURATION);
    }

    clickGoldenCookie() {
        this.goldenCookiesClicked++;
        
        // Choose random effect
        const effects = CONFIG.GOLDEN_COOKIE.EFFECTS;
        const roll = Math.random();
        let currentProb = 0;
        
        for (const [effect, data] of Object.entries(effects)) {
            currentProb += data.chance;
            if (roll <= currentProb) {
                this.triggerGoldenCookieEffect(effect, data);
                break;
            }
        }
    }

    triggerGoldenCookieEffect(effect, data) {
        switch(effect) {
            case 'frenzy':
                this.startEffect('frenzy', data.duration, () => {
                    this.game.globalMultiplier *= data.multiplier;
                    Utils.showNotification(`Frenzy! Cookie production x${data.multiplier} for ${data.duration} seconds!`);
                }, () => {
                    this.game.globalMultiplier /= data.multiplier;
                });
                break;

            case 'clickFrenzy':
                this.startEffect('clickFrenzy', data.duration, () => {
                    this.game.clickMultiplier *= data.multiplier;
                    Utils.showNotification(`Click Frenzy! Clicking power x${data.multiplier} for ${data.duration} seconds!`);
                }, () => {
                    this.game.clickMultiplier /= data.multiplier;
                });
                break;

            case 'cookieStorm':
                this.startCookieStorm(data.duration);
                break;

            case 'dragonHarvest':
                this.startEffect('dragonHarvest', data.duration, () => {
                    this.game.globalMultiplier *= data.multiplier;
                    Utils.showNotification(`Dragon Harvest! Cookie production x${data.multiplier} for ${data.duration} seconds!`);
                }, () => {
                    this.game.globalMultiplier /= data.multiplier;
                });
                break;
        }
    }

    startCookieStorm(duration) {
        Utils.showNotification("Cookie Storm!", 'special');
        
        const stormInterval = setInterval(() => {
            for (let i = 0; i < 10; i++) {
                this.spawnStormCookie();
            }
        }, 500);

        setTimeout(() => clearInterval(stormInterval), duration * 1000);
    }

    spawnStormCookie() {
        const cookie = document.createElement('div');
        cookie.className = 'storm-cookie';
        
        // Random position at top of screen
        const x = Math.random() * window.innerWidth;
        cookie.style.left = `${x}px`;
        cookie.style.top = '-50px';
        
        document.body.appendChild(cookie);
        
        // Click handler
        cookie.onclick = () => {
            const gain = this.game.cookiesPerSecond * 10;
            this.game.cookies += gain;
            Utils.createFloatingText(x, cookie.offsetTop, `+${Utils.formatNumber(gain)}`);
            cookie.remove();
        };
        
        // Animation
        const animation = cookie.animate([
            { top: '-50px' },
            { top: '120vh' }
        ], {
            duration: 3000,
            easing: 'linear'
        });
        
        animation.onfinish = () => cookie.remove();
    }

    // Random Events System
    startRandomEvents() {
        setInterval(() => {
            if (Math.random() < 0.01) { // 1% chance every 10 seconds
                this.triggerRandomEvent();
            }
        }, 10000);
    }

    triggerRandomEvent() {
        const events = [
            {
                name: "Cookie Baking Contest",
                chance: 0.3,
                effect: () => this.startBakingContest()
            },
            {
                name: "Cookie Market Crash",
                chance: 0.2,
                effect: () => this.startMarketCrash()
            },
            {
                name: "Cookie Revolution",
                chance: 0.2,
                effect: () => this.startCookieRevolution()
            },
            {
                name: "Cookie Time Warp",
                chance: 0.15,
                effect: () => this.startTimeWarp()
            },
            {
                name: "Cookie Dimension Rift",
                chance: 0.15,
                effect: () => this.startDimensionRift()
            }
        ];

        // Choose random event
        const roll = Math.random();
        let currentProb = 0;
        
        for (const event of events) {
            currentProb += event.chance;
            if (roll <= currentProb) {
                event.effect();
                break;
            }
        }
    }

    startBakingContest() {
        Utils.showNotification("Cookie Baking Contest has started! Click faster for bonus rewards!", 'event');
        
        let clicks = 0;
        const duration = 30; // 30 seconds
        let timeLeft = duration;
        
        // Create UI
        const contestUI = document.createElement('div');
        contestUI.className = 'event-ui baking-contest';
        contestUI.innerHTML = `
            <h3>Cookie Baking Contest</h3>
            <p>Time Left: <span id="contest-timer">${timeLeft}</span>s</p>
            <p>Clicks: <span id="contest-clicks">0</span></p>
        `;
        
        document.body.appendChild(contestUI);
        
        // Track clicks
        const clickHandler = () => {
            clicks++;
            document.getElementById('contest-clicks').textContent = clicks;
        };
        
        this.game.cookie.addEventListener('click', clickHandler);
        
        // Timer
        const timer = setInterval(() => {
            timeLeft--;
            document.getElementById('contest-timer').textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                this.game.cookie.removeEventListener('click', clickHandler);
                
                // Award prizes
                const reward = Math.pow(clicks, 1.5) * this.game.cookiesPerSecond;
                this.game.cookies += reward;
                
                Utils.showNotification(
                    `Contest ended! You clicked ${clicks} times and won ${Utils.formatNumber(reward)} cookies!`,
                    'success'
                );
                
                contestUI.remove();
            }
        }, 1000);
    }

    startMarketCrash() {
        Utils.showNotification("Cookie Market Crash! Building prices temporarily reduced!", 'event');
        
        const originalCosts = this.game.buildings.buildings.map(b => b.baseCost);
        
        // Reduce costs by 50%
        this.game.buildings.buildings.forEach(building => {
            building.baseCost *= 0.5;
        });
        
        // Create crash effect
        Utils.screenFlash('#ff0000', 500);
        
        // Reset after 5 minutes
        setTimeout(() => {
            this.game.buildings.buildings.forEach((building, index) => {
                building.baseCost = originalCosts[index];
            });
            Utils.showNotification("Cookie Market has stabilized!", 'info');
        }, 300000);
    }

    startCookieRevolution() {
        Utils.showNotification("Cookie Revolution! All production is doubled, but clicking is disabled!", 'event');
        
        const originalMultiplier = this.game.globalMultiplier;
        this.game.globalMultiplier *= 2;
        
        // Disable clicking
        const cookie = document.getElementById('cookie');
        cookie.style.pointerEvents = 'none';
        cookie.classList.add('revolution');
        
        // End after 2 minutes
        setTimeout(() => {
            this.game.globalMultiplier = originalMultiplier;
            cookie.style.pointerEvents = 'auto';
            cookie.classList.remove('revolution');
            Utils.showNotification("Cookie Revolution has ended!", 'info');
        }, 120000);
    }

    startTimeWarp() {
        Utils.showNotification("Time Warp activated! Production speed increased!", 'event');
        
        const duration = 30; // 30 seconds
        const speedup = 5; // 5x speed
        
        // Create warp effect
        document.body.classList.add('time-warp');
        
        // Speed up production
        const interval = setInterval(() => {
            this.game.addCookies(this.game.cookiesPerSecond * (speedup - 1) / 20);
        }, 50);
        
        // End time warp
        setTimeout(() => {
            clearInterval(interval);
            document.body.classList.remove('time-warp');
            Utils.showNotification("Time Warp ended!", 'info');
        }, duration * 1000);
    }

    startDimensionRift() {
        Utils.showNotification("Dimensional Rift opened! Random effects incoming!", 'event');
        
        // Create rift effect
        const rift = document.createElement('div');
        rift.className = 'dimension-rift';
        document.body.appendChild(rift);
        
        // Random effects every second for 30 seconds
        let timeLeft = 30;
        const riftInterval = setInterval(() => {
            const effect = Math.random();
            
            if (effect < 0.3) {
                // Production boost
                this.game.cookies += this.game.cookiesPerSecond * 10;
                Utils.createFloatingText(
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerHeight,
                    "Dimensional Cookies!"
                );
            } else if (effect < 0.6) {
                // Building bonus
                const building = this.game.buildings.buildings[
                    Math.floor(Math.random() * this.game.buildings.buildings.length)
                ];
                building.count++;
                Utils.showNotification(`Dimensional ${building.name} appeared!`);
            } else {
                // Click power boost
                const bonus = Math.random() * 100 + 50;
                Utils.createFloatingText(
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerHeight,
                    `+${Math.floor(bonus)}% Click Power!`
                );
                this.game.clickPower *= (1 + bonus/100);
            }
            
            timeLeft--;
            if (timeLeft <= 0) {
                clearInterval(riftInterval);
                rift.remove();
                Utils.showNotification("Dimensional Rift closed!", 'info');
            }
        }, 1000);
    }

    startEffect(id, duration, startCallback, endCallback) {
        // Remove existing effect of same type
        if (this.activeEffects.has(id)) {
            clearTimeout(this.activeEffects.get(id).timeout);
        }
        
        startCallback();
        
        const timeout = setTimeout(() => {
            endCallback();
            this.activeEffects.delete(id);
        }, duration * 1000);
        
        this.activeEffects.set(id, {
            timeout,
            endCallback
        });
    }

    save() {
        return {
            goldenCookiesClicked: this.goldenCookiesClicked,
            activeEffects: Array.from(this.activeEffects.keys())
        };
    }

    load(saveData) {
        if (!saveData) return;
        
        this.goldenCookiesClicked = saveData.goldenCookiesClicked || 0;
        
        // Clear any existing timers
        clearTimeout(this.goldenCookieTimer);
        this.activeEffects.forEach(effect => clearTimeout(effect.timeout));
        
        // Restart systems
        this.startGoldenCookieSpawner();
        this.startRandomEvents();
    }

    cleanup() {
        // Clear all timers when game is closed/refreshed
        clearTimeout(this.goldenCookieTimer);
        this.activeEffects.forEach(effect => {
            clearTimeout(effect.timeout);
            effect.endCallback();
        });
    }
}

// Export EventSystem
window.EventSystem = EventSystem;
