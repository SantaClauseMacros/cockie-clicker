// research.js - Research Lab System
class ResearchSystem {
    constructor(game) {
        this.game = game;
        this.activeResearch = null;
        this.completedResearch = new Set();
        this.researchPoints = 0;
        this.researchProgress = 0;
        this.researchTrees = this.initializeResearchTrees();
        
        this.renderResearch();
        this.startResearchLoop();
    }

    initializeResearchTrees() {
        return {
            cookieScience: {
                name: "Cookie Science",
                icon: "🧪",
                description: "Basic cookie research",
                nodes: [
                    {
                        id: "betterDough",
                        name: "Better Dough",
                        cost: 100,
                        time: 60,
                        effect: () => {
                            this.game.globalMultiplier *= 1.5;
                            Utils.showNotification("Research complete: Cookie production improved by 50%!");
                        },
                        description: "Improves cookie production by 50%",
                        requirements: [],
                        icon: "🥟"
                    },
                    {
                        id: "cookieChemistry",
                        name: "Cookie Chemistry",
                        cost: 500,
                        time: 180,
                        effect: () => {
                            this.game.clickPower *= 2;
                            Utils.showNotification("Research complete: Click power doubled!");
                        },
                        description: "Doubles clicking power",
                        requirements: ["betterDough"],
                        icon: "⚗️"
                    }
                ]
            },

            quantumResearch: {
                name: "Quantum Research",
                icon: "⚛️",
                description: "Advanced quantum cookie technology",
                nodes: [
                    {
                        id: "quantumBaking",
                        name: "Quantum Baking",
                        cost: 1000,
                        time: 300,
                        effect: () => {
                            this.enableQuantumEffects();
                        },
                        description: "Cookies exist in multiple states simultaneously",
                        requirements: ["cookieChemistry"],
                        icon: "🌌"
                    },
                    {
                        id: "quantumTunneling",
                        name: "Quantum Tunneling",
                        cost: 5000,
                        time: 600,
                        effect: () => {
                            this.enableTunnelingEffects();
                        },
                        description: "Cookies can tunnel through space-time",
                        requirements: ["quantumBaking"],
                        icon: "🚀"
                    }
                ]
            },

            timeManipulation: {
                name: "Time Manipulation",
                icon: "⌛",
                description: "Control time itself",
                nodes: [
                    {
                        id: "timeCompression",
                        name: "Time Compression",
                        cost: 10000,
                        time: 900,
                        effect: () => {
                            this.enableTimeCompression();
                        },
                        description: "Compress time to speed up production",
                        requirements: ["quantumTunneling"],
                        icon: "⏰"
                    },
                    {
                        id: "temporalLoop",
                        name: "Temporal Loop",
                        cost: 50000,
                        time: 1800,
                        effect: () => {
                            this.enableTemporalLoop();
                        },
                        description: "Create time loops for infinite cookies",
                        requirements: ["timeCompression"],
                        icon: "🔄"
                    }
                ]
            },

            dimensionalStudies: {
                name: "Dimensional Studies",
                icon: "🌌",
                description: "Explore alternate cookie dimensions",
                nodes: [
                    {
                        id: "dimensionalRift",
                        name: "Dimensional Rift",
                        cost: 100000,
                        time: 3600,
                        effect: () => {
                            this.enableDimensionalRift();
                        },
                        description: "Open portals to cookie dimensions",
                        requirements: ["temporalLoop"],
                        icon: "🌀"
                    },
                    {
                        id: "multiverse",
                        name: "Cookie Multiverse",
                        cost: 500000,
                        time: 7200,
                        effect: () => {
                            this.enableMultiverse();
                        },
                        description: "Harness the power of infinite cookie universes",
                        requirements: ["dimensionalRift"],
                        icon: "🌍"
                    }
                ]
            }
        };
    }

    startResearch(nodeId) {
        // Find research node
        let node = null;
        for (const tree of Object.values(this.researchTrees)) {
            const found = tree.nodes.find(n => n.id === nodeId);
            if (found) {
                node = found;
                break;
            }
        }

        if (!node || this.completedResearch.has(nodeId)) return;
        if (this.activeResearch) {
            Utils.showNotification("Another research is already in progress!");
            return;
        }

        // Check requirements
        if (!this.checkRequirements(node)) {
            Utils.showNotification("Research requirements not met!");
            return;
        }

        // Check if we can afford it
        if (this.researchPoints >= node.cost) {
            this.researchPoints -= node.cost;
            this.activeResearch = node;
            this.researchProgress = 0;
            
            Utils.showNotification(`Started research: ${node.name}`);
            this.renderResearch();
        } else {
            Utils.showNotification("Not enough research points!");
        }
    }

    checkRequirements(node) {
        return node.requirements.every(reqId => this.completedResearch.has(reqId));
    }

    startResearchLoop() {
        setInterval(() => {
            // Generate research points based on buildings
            this.generateResearchPoints();

            // Progress active research
            if (this.activeResearch) {
                this.researchProgress += 1;
                
                // Check if research is complete
                if (this.researchProgress >= this.activeResearch.time) {
                    this.completeResearch();
                }
                
                this.renderResearch();
            }
        }, 1000);
    }

    generateResearchPoints() {
        // Generate points based on buildings owned
        let generation = 0;
        this.game.buildings.buildings.forEach(building => {
            generation += building.count * CONFIG.RESEARCH.POINTS_PER_BUILDING;
        });
        
        this.researchPoints += generation;
        this.renderResearch();
    }

    completeResearch() {
        if (!this.activeResearch) return;

        const completed = this.activeResearch;
        this.completedResearch.add(completed.id);
        completed.effect();
        
        // Show completion effect
        Utils.screenFlash('#4CAF50');
        Utils.showNotification(
            `Research Complete: ${completed.name}!<br>${completed.description}`,
            'research'
        );

        this.activeResearch = null;
        this.researchProgress = 0;
        this.renderResearch();
    }

    enableQuantumEffects() {
        this.game.globalMultiplier *= 2;
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% chance per second
                const bonus = this.game.cookiesPerSecond * 10;
                this.game.addCookies(bonus);
                Utils.createFloatingText(
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerHeight,
                    "Quantum Bonus!",
                    '#00ff00'
                );
            }
        }, 1000);
    }

    enableTunnelingEffects() {
        // Cookies can randomly multiply
        setInterval(() => {
            if (Math.random() < 0.05) { // 5% chance per second
                this.game.cookies *= 1.01;
                Utils.showNotification("Cookies tunneled through space-time!");
            }
        }, 1000);
    }

    enableTimeCompression() {
        // Production speeds up over time
        setInterval(() => {
            this.game.globalMultiplier *= 1.01;
            Utils.showNotification("Time compression increased production!");
        }, 60000); // Every minute
    }

    enableTemporalLoop() {
        // Get production from the future
        setInterval(() => {
            const futureProduction = this.game.cookiesPerSecond * 3600; // 1 hour worth
            this.game.addCookies(futureProduction);
            Utils.showNotification("Temporal loop brought cookies from the future!");
        }, 300000); // Every 5 minutes
    }

    enableDimensionalRift() {
        // Random dimensional portals
        setInterval(() => {
            if (Math.random() < 0.1) {
                const portal = document.createElement('div');
                portal.className = 'dimensional-portal';
                document.body.appendChild(portal);
                
                setTimeout(() => {
                    this.game.cookies *= 2;
                    Utils.showNotification("Dimensional rift doubled your cookies!");
                    portal.remove();
                }, 5000);
            }
        }, 30000);
    }

    enableMultiverse() {
        // Permanent massive boost
        this.game.globalMultiplier *= 10;
        Utils.showNotification("You have harnessed the power of the cookie multiverse!");
        
        // And continuing random bonuses
        setInterval(() => {
            const universes = Math.floor(Math.random() * 10) + 1;
            this.game.globalMultiplier *= (1 + (universes * 0.1));
            Utils.showNotification(`Connected to ${universes} new cookie universes!`);
        }, 600000); // Every 10 minutes
    }

    renderResearch() {
        const container = document.getElementById('research-tree');
        if (!container) return;

        container.innerHTML = `
            <div class="research-points">
                Research Points: ${Utils.formatNumber(this.researchPoints)}
            </div>
        `;

        // Create tabs for each research tree
        const tabsContainer = document.createElement('div');
        tabsContainer.className = 'research-tabs';
        Object.entries(this.researchTrees).forEach(([treeId, tree]) => {
            const tab = document.createElement('button');
            tab.className = 'research-tab';
            tab.innerHTML = `${tree.icon} ${tree.name}`;
            tab.onclick = () => this.showResearchTree(treeId);
            tabsContainer.appendChild(tab);
        });
        container.appendChild(tabsContainer);

        // Create research view container
        const researchView = document.createElement('div');
        researchView.id = 'research-view';
        container.appendChild(researchView);

        // Show first tree by default
        this.showResearchTree(Object.keys(this.researchTrees)[0]);
    }

    showResearchTree(treeId) {
        const container = document.getElementById('research-view');
        const tree = this.researchTrees[treeId];
        
        container.innerHTML = `
            <h3>${tree.icon} ${tree.name}</h3>
            <p>${tree.description}</p>
            <div class="research-nodes"></div>
        `;

        const nodesContainer = container.querySelector('.research-nodes');
        
        tree.nodes.forEach(node => {
            const isCompleted = this.completedResearch.has(node.id);
            const isAvailable = this.checkRequirements(node);
            const isActive = this.activeResearch?.id === node.id;

            const nodeElement = document.createElement('div');
            nodeElement.className = `research-node ${isCompleted ? 'completed' : ''} ${isAvailable ? 'available' : ''} ${isActive ? 'active' : ''}`;
            
            nodeElement.innerHTML = `
                <div class="node-icon">${node.icon}</div>
                <div class="node-info">
                    <h4>${node.name}</h4>
                    <p>${node.description}</p>
                    <div class="node-cost">Cost: ${Utils.formatNumber(node.cost)} research points</div>
                    <div class="node-time">Research time: ${Utils.formatTime(node.time)}</div>
                    ${isActive ? `
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${(this.researchProgress / node.time) * 100}%"></div>
                        </div>
                    ` : ''}
                </div>
            `;

            if (!isCompleted && isAvailable && !isActive) {
                nodeElement.onclick = () => this.startResearch(node.id);
            }

            nodesContainer.appendChild(nodeElement);
        });
    }

    save() {
        return {
            researchPoints: this.researchPoints,
            completedResearch: Array.from(this.completedResearch),
            activeResearch: this.activeResearch ? {
                id: this.activeResearch.id,
                progress: this.researchProgress
            } : null
        };
    }

    load(saveData) {
        if (!saveData) return;

        this.researchPoints = saveData.researchPoints || 0;
        this.completedResearch = new Set(saveData.completedResearch || []);
        
        if (saveData.activeResearch) {
            const node = this.findResearchNode(saveData.activeResearch.id);
            if (node) {
                this.activeResearch = node;
                this.researchProgress = saveData.activeResearch.progress;
            }
        }

        this.renderResearch();
    }

    findResearchNode(nodeId) {
        for (const tree of Object.values(this.researchTrees)) {
            const found = tree.nodes.find(n => n.id === nodeId);
            if (found) return found;
        }
        return null;
    }
}

// Export ResearchSystem
window.ResearchSystem = ResearchSystem;
