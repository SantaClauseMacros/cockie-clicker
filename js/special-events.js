// special-events.js - Special Events and Golden Cookies System

class SpecialEvents {
    constructor(game) {
        this.game = game;
        this.activeEffects = new Set();
        this.goldenCookieTimer = null;
        this.activeEvents = new Map();
        
        // Initialize special event timers
        this.initializeEventTimers();
        
        // Start golden cookie spawning
        this.scheduleNextGoldenCookie();
    }

    initializeEventTimers() {
        this.eventTypes = {
            goldenCookie: {
                name: 'Golden Cookie',
                minTime: 60000, // 1 minute
                maxTime: 180000, // 3 minutes
                spawn: () => this.spawnGoldenCookie(),
                effects: {
                    frenzy: {
                        name: 'Frenzy',
                        chance: 0.4,
                        multiplier: 7,
                        duration: 77,
                        description: 'Cookie production x7 for 77 seconds!'
                    },
                    clickFrenzy: {
                        name: 'Click Frenzy',
                        chance: 0.3,
                        multiplier: 777,
                        duration: 13,
                        description: 'Clicking power x777 for 13 seconds!'
                    },
                    cookieStorm: {
                        name: 'Cookie Storm',
                        chance: 0.15,
                        duration: 7,
                        description: 'It\'s raining cookies!'
                    },
                    dragonHarvest: {
                        name: 'Dragon Harvest',
                        chance: 0.15,
                        multiplier: 15,
                        duration: 60,
                        description: 'Cookie production x15 for 60 seconds!'
                    }
                }
            },
            
            dimensionalRift: {
                name: 'Dimensional Rift',
                minTime: 300000, // 5 minutes
                maxTime: 600000, // 10 minutes
                requirements: () => this.game.research.isResearchCompleted('dimensional_studies'),
                spawn: () => this.spawnDimensionalRift(),
                effects: {
                    multiplier: 3,
                    duration: 30
                }
            },
            
            cookieStorm: {
                name: 'Cookie Storm',
                minTime: 900000, // 15 minutes
                maxTime: 1800000, // 30 minutes
                spawn: () => this.startCookieStorm(),
                duration: 20
            },
            
            timeWarp: {
                name: 'Time Warp',
                minTime: 1800000, // 30 minutes
                maxTime: 3600000, // 1 hour
                requirements: () => this.game.research.isResearchCompleted('time_manipulation'),
                spawn: () => this.startTimeWarp(),
                duration: 30,
                speedMultiplier: 3
            }
        };
    }

    spawnGoldenCookie() {
        const goldenCookie = document.createElement('div');
        goldenCookie.className = 'golden-cookie';
        
        // Random position on screen
        const x = Math.random() * (window.innerWidth - 100);
        const y = Math.random() * (window.innerHeight - 100);
        
        goldenCookie.style.left = `${x}px`;
        goldenCookie.style.top = `${y}px`;
        
        // Click handler
        goldenCookie.onclick = () => {
            this.handleGoldenCookieClick();
            goldenCookie.remove();
        };
        
        document.body.appendChild(goldenCookie);
        
        // Remove after 13 seconds if not clicked
        setTimeout(() => goldenCookie.remove(), 13000);
    }

    handleGoldenCookieClick() {
        this.game.stats.goldenCookiesClicked++;
        
        // Choose random effect
        const effects = this.eventTypes.goldenCookie.effects;
        const totalChance = Object.values(effects).reduce((sum, effect) => sum + effect.chance, 0);
        let random = Math.random() * totalChance;
        
        for (const [effectId, effect] of Object.entries(effects)) {
            random -= effect.chance;
            if (random <= 0) {
                this.activateGoldenCookieEffect(effectId, effect);
                break;
            }
        }
    }

    activateGoldenCookieEffect(effectId, effect) {
        switch(effectId) {
            case 'frenzy':
                this.startEffect('frenzy', effect.duration, () => {
                    this.game.globalMultiplier *= effect.multiplier;
                }, () => {
                    this.game.globalMultiplier /= effect.multiplier;
                });
                break;
                
            case 'clickFrenzy':
                this.startEffect('clickFrenzy', effect.duration, () => {
                    this.game.clickMultiplier *= effect.multiplier;
                }, () => {
                    this.game.clickMultiplier /= effect.multiplier;
                });
                break;
                
            case 'cookieStorm':
                this.startCookieStorm(effect.duration);
                break;
                
            case 'dragonHarvest':
                this.startEffect('dragonHarvest', effect.duration, () => {
                    this.game.globalMultiplier *= effect.multiplier;
                }, () => {
                    this.game.globalMultiplier /= effect.multiplier;
                });
                break;
        }
        
        Utils.showNotification(effect.description);
    }

    startEffect(id, duration, startCallback, endCallback) {
        // Remove existing effect of same type
        if (this.activeEffects.has(id)) {
            clearTimeout(this.activeEffects.get(id).timeout);
        }
        
        // Start new effect
        startCallback();
        
        const timeout = setTimeout(() => {
            endCallback();
            this.activeEffects.delete(id);
            this.updateEffectsDisplay();
        }, duration * 1000);
        
        this.activeEffects.set(id, {
            timeout,
            duration,
            startTime: Date.now(),
            description: this.eventTypes.goldenCookie.effects[id].description
        });
        
        this.updateEffectsDisplay();
    }

    startCookieStorm(duration) {
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
        
        // Random starting position at top of screen
        const x = Math.random() * window.innerWidth;
        cookie.style.left = `${x}px`;
        cookie.style.top = '0px';
        
        document.body.appendChild(cookie);
        
        // Click handler
        cookie.onclick = () => {
            const gain = this.game.calculateClickValue() * 10;
            this.game.addCookies(gain);
            Utils.createFloatingText(cookie, `+${Utils.formatNumber(gain)}`);
            cookie.remove();
        };
        
        // Animate falling
        const animation = cookie.animate([
            { top: '0px' },
            { top: '100vh' }
        ], {
            duration: 3000,
            easing: 'linear'
        });
        
        animation.onfinish = () => cookie.remove();
    }

    spawnDimensionalRift() {
        const rift = document.createElement('div');
        rift.className = 'dimensional-rift';
        document.body.appendChild(rift);
        
        const effect = this.eventTypes.dimensionalRift.effects;
        
        this.startEffect('dimensionalRift', effect.duration, () => {
            this.game.globalMultiplier *= effect.multiplier;
        }, () => {
            this.game.globalMultiplier /= effect.multiplier;
            rift.remove();
        });
    }

    startTimeWarp() {
        const effect = this.eventTypes.timeWarp;
        const originalTickRate = this.game.tickRate;
        
        this.startEffect('timeWarp', effect.duration, () => {
            this.game.tickRate /= effect.speedMultiplier;
            document.body.classList.add('time-warp');
        }, () => {
            this.game.tickRate = originalTickRate;
            document.body.classList.remove('time-warp');
        });
    }

    scheduleNextGoldenCookie() {
        const {minTime, maxTime} = this.eventTypes.goldenCookie;
        const delay = minTime + Math.random() * (maxTime - minTime);
        
        this.goldenCookieTimer = setTimeout(() => {
            this.spawnGoldenCookie();
            this.scheduleNextGoldenCookie();
        }, delay);
    }

    updateEffectsDisplay() {
        const container = document.getElementById('active-effects');
        if (!container) return;
        
        container.innerHTML = '';
        
        for (const [id, effect] of this.activeEffects) {
            const timeLeft = Math.ceil((effect.duration * 1000 - (Date.now() - effect.startTime)) / 1000);
            
            const effectElement = document.createElement('div');
            effectElement.className = 'active-effect';
            effectElement.innerHTML = `
                <div class="effect-name">${this.eventTypes.goldenCookie.effects[id].name}</div>
                <div class="effect-timer">${timeLeft}s</div>
                <div class="effect-progress">
                    <div class="progress-fill" style="width: ${(timeLeft / effect.duration) * 100}%"></div>
                </div>
            `;
            
            container.appendChild(effectElement);
        }
    }

    save() {
        const activeEffectsData = Array.from(this.activeEffects.entries()).map(([id, effect]) => ({
            id,
            timeLeft: Math.ceil((effect.duration * 1000 - (Date.now() - effect.startTime)) / 1000)
        }));

        return {
            activeEffects: activeEffectsData
        };
    }

    load(saveData) {
        if (!saveData) return;

        if (saveData.activeEffects) {
            saveData.activeEffects.forEach(effectData => {
                const effect = this.eventTypes.goldenCookie.effects[effectData.id];
                if (effect) {
                    this.activateGoldenCookieEffect(effectData.id, effect);
                }
            });
        }
    }

    cleanup() {
        // Clear all timers when game is closed/refreshed
        clearTimeout(this.goldenCookieTimer);
        this.activeEffects.forEach(effect => clearTimeout(effect.timeout));
    }
}

// Export the SpecialEvents system
window.SpecialEvents = SpecialEvents;
