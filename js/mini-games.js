// mini-games.js - Mini-Games System

class MiniGamesSystem {
    constructor(game) {
        this.game = game;
        this.activeGame = null;
        this.unlockedGames = new Set();
        
        this.miniGames = {
            cookieClicker: {
                name: "Speed Clicking Challenge",
                unlockCost: 10000,
                description: "Click as many cookies as possible in 30 seconds!",
                icon: "⚡",
                start: () => this.startSpeedClickingChallenge()
            },
            
            cookieMatch: {
                name: "Cookie Match-3",
                unlockCost: 50000,
                description: "Match 3 or more similar cookies",
                icon: "🎯",
                start: () => this.startCookieMatch()
            },
            
            cookieDefense: {
                name: "Cookie Defense",
                unlockCost: 100000,
                description: "Defend your cookies from hungry creatures!",
                icon: "🛡️",
                start: () => this.startCookieDefense()
            },
            
            cookieFarm: {
                name: "Cookie Farm",
                unlockCost: 200000,
                description: "Grow and harvest special cookies",
                icon: "🌱",
                start: () => this.startCookieFarm()
            }
        };

        this.initializeUI();
    }

    initializeUI() {
        const container = document.getElementById('mini-games-container');
        if (!container) return;

        container.innerHTML = `
            <h3>Mini-Games</h3>
            <div class="mini-games-grid"></div>
        `;

        this.updateUI();
    }

    updateUI() {
        const grid = document.querySelector('.mini-games-grid');
        if (!grid) return;

        grid.innerHTML = '';

        Object.entries(this.miniGames).forEach(([gameId, game]) => {
            const isUnlocked = this.unlockedGames.has(gameId);
            const gameElement = document.createElement('div');
            gameElement.className = `mini-game-tile ${isUnlocked ? 'unlocked' : 'locked'}`;
            
            gameElement.innerHTML = `
                <div class="mini-game-icon">${game.icon}</div>
                <h4>${game.name}</h4>
                <p>${game.description}</p>
                ${isUnlocked ? 
                    '<button class="play-button">Play</button>' : 
                    `<button class="unlock-button">Unlock (${Utils.formatNumber(game.unlockCost)} cookies)</button>`
                }
            `;

            if (isUnlocked) {
                gameElement.querySelector('.play-button').onclick = () => game.start();
            } else {
                gameElement.querySelector('.unlock-button').onclick = () => this.unlockGame(gameId);
            }

            grid.appendChild(gameElement);
        });
    }

    unlockGame(gameId) {
        const game = this.miniGames[gameId];
        if (!game || this.unlockedGames.has(gameId)) return;

        if (this.game.cookies >= game.unlockCost) {
            this.game.cookies -= game.unlockCost;
            this.unlockedGames.add(gameId);
            Utils.showNotification(`Unlocked ${game.name}!`);
            this.updateUI();
        } else {
            Utils.showNotification("Not enough cookies!");
        }
    }

    startSpeedClickingChallenge() {
        let timeLeft = 30;
        let clicks = 0;
        
        const gameUI = this.createGameUI("Speed Clicking Challenge");
        const clickArea = document.createElement('div');
        clickArea.className = 'speed-click-area';
        
        const timer = document.createElement('div');
        timer.className = 'game-timer';
        timer.textContent = `Time: ${timeLeft}s`;
        
        const score = document.createElement('div');
        score.className = 'game-score';
        score.textContent = `Clicks: ${clicks}`;
        
        clickArea.onclick = () => {
            clicks++;
            score.textContent = `Clicks: ${clicks}`;
            this.createClickEffect(clickArea);
        };
        
        gameUI.appendChild(timer);
        gameUI.appendChild(clickArea);
        gameUI.appendChild(score);
        
        const countdown = setInterval(() => {
            timeLeft--;
            timer.textContent = `Time: ${timeLeft}s`;
            
            if (timeLeft <= 0) {
                clearInterval(countdown);
                this.endSpeedClickingChallenge(clicks);
                gameUI.remove();
            }
        }, 1000);
    }

    startCookieMatch() {
        const gameUI = this.createGameUI("Cookie Match-3");
        const gridSize = 8;
        const cookieTypes = ['🍪', '🥠', '🥮', '🍘', '🥯'];
        const grid = [];
        
        // Create game grid
        const gameGrid = document.createElement('div');
        gameGrid.className = 'match-grid';
        
        for (let i = 0; i < gridSize; i++) {
            grid[i] = [];
            for (let j = 0; j < gridSize; j++) {
                const cell = document.createElement('div');
                cell.className = 'match-cell';
                const cookieType = cookieTypes[Math.floor(Math.random() * cookieTypes.length)];
                cell.textContent = cookieType;
                grid[i][j] = cookieType;
                
                cell.onclick = () => this.handleMatch(i, j, grid, gameGrid);
                gameGrid.appendChild(cell);
            }
        }
        
        gameUI.appendChild(gameGrid);
    }

    startCookieDefense() {
        const gameUI = this.createGameUI("Cookie Defense");
        const gameArea = document.createElement('div');
        gameArea.className = 'defense-game-area';
        
        let cookies = 100;
        let wave = 1;
        let score = 0;
        
        const scoreDisplay = document.createElement('div');
        scoreDisplay.className = 'defense-score';
        scoreDisplay.textContent = `Cookies: ${cookies} | Wave: ${wave} | Score: ${score}`;
        
        const spawnEnemy = () => {
            const enemy = document.createElement('div');
            enemy.className = 'defense-enemy';
            enemy.style.left = `${Math.random() * 90}%`;
            enemy.style.top = '0';
            gameArea.appendChild(enemy);
            
            let position = 0;
            const movement = setInterval(() => {
                position += 1;
                enemy.style.top = `${position}%`;
                
                if (position >= 90) {
                    cookies -= 10;
                    scoreDisplay.textContent = `Cookies: ${cookies} | Wave: ${wave} | Score: ${score}`;
                    enemy.remove();
                    clearInterval(movement);
                    
                    if (cookies <= 0) {
                        this.endCookieDefense(score);
                        gameUI.remove();
                    }
                }
            }, 50);
            
            enemy.onclick = () => {
                score += wave * 10;
                scoreDisplay.textContent = `Cookies: ${cookies} | Wave: ${wave} | Score: ${score}`;
                enemy.remove();
                clearInterval(movement);
            };
        };
        
        gameUI.appendChild(scoreDisplay);
        gameUI.appendChild(gameArea);
        
        let enemyCount = 0;
        const maxEnemies = 10;
        
        const waveInterval = setInterval(() => {
            if (enemyCount < maxEnemies) {
                spawnEnemy();
                enemyCount++;
            } else {
                wave++;
                enemyCount = 0;
                scoreDisplay.textContent = `Cookies: ${cookies} | Wave: ${wave} | Score: ${score}`;
            }
        }, 2000);
        
        gameUI.dataset.interval = waveInterval;
    }

    startCookieFarm() {
        const gameUI = this.createGameUI("Cookie Farm");
        const farmGrid = document.createElement('div');
        farmGrid.className = 'farm-grid';
        
        const gridSize = 6;
        const plots = [];
        
        for (let i = 0; i < gridSize * gridSize; i++) {
            const plot = document.createElement('div');
            plot.className = 'farm-plot';
            plot.onclick = () => this.handlePlot(plot, i);
            farmGrid.appendChild(plot);
            plots.push({
                element: plot,
                planted: false,
                growth: 0,
                type: null
            });
        }
        
        const controls = document.createElement('div');
        controls.className = 'farm-controls';
        controls.innerHTML = `
            <button class="seed-button" data-seed="basic">Plant Basic Cookie (10s) 🍪</button>
            <button class="seed-button" data-seed="golden">Plant Golden Cookie (30s) 🌟</button>
            <button class="seed-button" data-seed="special">Plant Special Cookie (60s) ✨</button>
        `;
        
        controls.addEventListener('click', (e) => {
            if (e.target.classList.contains('seed-button')) {
                this.selectedSeed = e.target.dataset.seed;
            }
        });
        
        gameUI.appendChild(controls);
        gameUI.appendChild(farmGrid);
    }

    handlePlot(plot, index) {
        if (!this.selectedSeed) return;
        
        const plotData = this.plots[index];
        if (plotData.planted) return;
        
        plotData.planted = true;
        plotData.type = this.selectedSeed;
        plotData.growth = 0;
        
        const growthTime = {
            basic: 10,
            golden: 30,
            special: 60
        }[this.selectedSeed];
        
        plot.innerHTML = `<div class="growth-indicator">0%</div>`;
        
        const growthInterval = setInterval(() => {
            plotData.growth++;
            const percentage = Math.floor((plotData.growth / growthTime) * 100);
            plot.querySelector('.growth-indicator').textContent = `${percentage}%`;
            
            if (plotData.growth >= growthTime) {
                clearInterval(growthInterval);
                this.harvestPlot(plot, index);
            }
        }, 1000);
    }

    harvestPlot(plot, index) {
        const plotData = this.plots[index];
        const rewards = {
            basic: 1000,
            golden: 5000,
            special: 20000
        };
        
        const reward = rewards[plotData.type];
        this.game.cookies += reward;
        Utils.createFloatingText(plot, `+${Utils.formatNumber(reward)}`);
        
        plotData.planted = false;
        plotData.type = null;
        plotData.growth = 0;
        plot.innerHTML = '';
    }

    createGameUI(title) {
        const container = document.createElement('div');
        container.className = 'mini-game-container';
        
        const header = document.createElement('div');
        header.className = 'mini-game-header';
        header.innerHTML = `
            <h3>${title}</h3>
            <button class="close-button">✖</button>
        `;
        
        header.querySelector('.close-button').onclick = () => {
            if (container.dataset.interval) {
                clearInterval(parseInt(container.dataset.interval));
            }
            container.remove();
        };
        
        container.appendChild(header);
        document.body.appendChild(container);
        
        return container;
    }

    createClickEffect(element) {
        const effect = document.createElement('div');
        effect.className = 'click-effect';
        effect.style.left = `${Math.random() * 100}%`;
        effect.style.top = `${Math.random() * 100}%`;
        
        element.appendChild(effect);
        setTimeout(() => effect.remove(), 1000);
    }

    save() {
        return {
            unlockedGames: Array.from(this.unlockedGames)
        };
    }

    load(saveData) {
        if (saveData && saveData.unlockedGames) {
            this.unlockedGames = new Set(saveData.unlockedGames);
            this.updateUI();
        }
    }
}

// Export the MiniGamesSystem
window.MiniGamesSystem = MiniGamesSystem;
