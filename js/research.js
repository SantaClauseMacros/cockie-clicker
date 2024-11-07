// research.js - Research System and Technologies

class ResearchSystem {
    constructor(game) {
        this.game = game;
        this.activeResearch = null;
        this.completedResearch = new Set();
        this.researchPoints = 0;
        this.researchProgress = 0;
        
        this.researchTrees = {
            cookieScience: this.initCookieScience(),
            quantumPhysics: this.initQuantumPhysics(),
            dimensionalStudies: this.initDimensionalStudies(),
            timeManipulation: this.initTimeManipulation()
        };
        
        this.initializeUI();
    }

    initCookieScience() {
        return {
            name: "Cookie Science",
            icon: "🔬",
            description: "Basic cookie research",
            branches: [
                {
                    id: "improved_recipes",
                    name: "Improved Recipes",
                    cost: 100,
                    researchTime: 60,
                    effect: () => {
                        this.game.globalMultiplier *= 1.5;
                        Utils.showNotification("Research complete: Cookie production improved by 50%!");
                    },
                    description: "Better cookie recipes increase production by 50%",
                    requirements: [],
                    icon: "📝"
                },
                {
                    id: "cookie_chemistry",
                    name: "Cookie Chemistry",
                    cost: 500,
                    researchTime: 180,
                    effect: () => {
                        this.game.clickPower *= 2;
                        Utils.showNotification("Research complete: Click power doubled!");
                    },
                    description: "Chemical enhancement doubles click power",
                    requirements: ["improved_recipes"],
                    icon: "⚗️"
                },
                {
                    id: "molecular_gastronomy",
                    name: "Molecular Gastronomy",
                    cost: 2000,
                    researchTime: 300,
                    effect: () => {
                        this.game.globalMultiplier *= 2;
                        this.unlockSpecialUpgrades();
                    },
                    description: "Advanced cooking techniques revolutionize cookie production",
                    requirements: ["cookie_chemistry"],
                    icon: "🧪"
                }
            ]
        };
    }

    initQuantumPhysics() {
        return {
            name: "Quantum Physics",
            icon: "⚛️",
            description: "Harness quantum mechanics for cookie production",
            branches: [
                {
                    id: "quantum_tunneling",
                    name: "Quantum Tunneling",
                    cost: 5000,
                    researchTime: 600,
                    effect: () => {
                        this.enableQuantumEffects();
                    },
                    description: "Cookies occasionally phase through space-time",
                    requirements: ["molecular_gastronomy"],
                    icon: "🌀"
                },
                {
                    id: "quantum_entanglement",
                    name: "Cookie Entanglement",
                    cost: 10000,
                    researchTime: 900,
                    effect: () => {
                        this.enableEntanglementEffects();
                    },
                    description: "Link cookies across multiple dimensions",
                    requirements: ["quantum_tunneling"],
                    icon: "🔄"
                }
            ]
        };
    }

    initDimensionalStudies() {
        return {
            name: "Dimensional Studies",
            icon: "🌌",
            description: "Explore alternate cookie dimensions",
            branches: [
                {
                    id: "portal_research",
                    name: "Portal Research",
                    cost: 20000,
                    researchTime: 1200,
                    effect: () => {
                        this.unlockDimensionalPortal();
                    },
                    description: "Open gateways to cookie dimensions",
                    requirements: ["quantum_entanglement"],
                    icon: "🌐"
                }
            ]
        };
    }

    initTimeManipulation() {
        return {
            name: "Time Manipulation",
            icon: "⌛",
            description: "Control time itself for cookie production",
            branches: [
                {
                    id: "temporal_compression",
                    name: "Temporal Compression",
                    cost: 50000,
                    researchTime: 1800,
                    effect: () => {
                        this.enableTimeCompression();
                    },
                    description: "Compress time to speed up production",
                    requirements: ["portal_research"],
                    icon: "⏰"
                }
            ]
        };
    }

    initializeUI() {
        const container = document.getElementById('research-tree');
        if (!container) return;

        // Create tabs for different research trees
        const tabsContainer = document.createElement('div');
        tabsContainer.className = 'research-tabs';
        
        Object.entries(this.researchTrees).forEach(([treeId, tree]) => {
            const tab = document.createElement('div');
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
            <div class="research-branches"></div>
        `;

        const branchesContainer = container.querySelector('.research-branches');
        
        tree.branches.forEach(branch => {
            const isCompleted = this.completedResearch.has(branch.id);
            const isAvailable = this.checkRequirements(branch.requirements);
            const isActive = this.activeResearch?.id === branch.id;

            const branchElement = document.createElement('div');
            branchElement.className = `research-branch ${isCompleted ? 'completed' : ''} ${isAvailable ? 'available' : ''} ${isActive ? 'active' : ''}`;
            
            branchElement.innerHTML = `
                <div class="branch-icon">${branch.icon}</div>
                <div class="branch-info">
                    <h4>${branch.name}</h4>
                    <p>${branch.description}</p>
                    <div class="branch-cost">Cost: ${Utils.formatNumber(branch.cost)} research points</div>
                    <div class="branch-time">Research time: ${Utils.formatTime(branch.researchTime)}</div>
                    ${isActive ? `<div class="progress-bar"><div class="progress-fill" style="width: ${(this.researchProgress / branch.researchTime) * 100}%"></div></div>` : ''}
                </div>
            `;

            if (!isCompleted && isAvailable && !isActive) {
                branchElement.onclick = () => this.startResearch(branch.id);
            }

            branchesContainer.appendChild(branchElement);
        });
    }

    checkRequirements(requirements) {
        if (!requirements || requirements.length === 0) return true;
        return requirements.every(req => this.completedResearch.has(req));
    }

    startResearch(researchId) {
        if (this.activeResearch) {
            Utils.showNotification("Another research is already in progress!");
            return;
        }

        const research = this.findResearch(researchId);
        if (!research) return;

        if (this.researchPoints >= research.cost) {
            this.researchPoints -= research.cost;
            this.activeResearch = research;
            this.researchProgress = 0;
            Utils.showNotification(`Started research: ${research.name}`);
            this.updateUI();
        } else {
            Utils.showNotification("Not enough research points!");
        }
    }

    findResearch(researchId) {
        for (const tree of Object.values(this.researchTrees)) {
            const found = tree.branches.find(b => b.id === researchId);
            if (found) return found;
        }
        return null;
    }

    update(delta) {
        if (this.activeResearch) {
            this.researchProgress += delta;
            
            if (this.researchProgress >= this.activeResearch.researchTime) {
                this.completeResearch();
            }
            
            this.updateUI();
        }

        // Generate research points based on buildings
        this.generateResearchPoints(delta);
    }

    completeResearch() {
        if (!this.activeResearch) return;

        this.completedResearch.add(this.activeResearch.id);
        this.activeResearch.effect();
        Utils.showNotification(`Research completed: ${this.activeResearch.name}!`);
        
        this.activeResearch = null;
        this.researchProgress = 0;
        this.updateUI();
    }

    generateResearchPoints(delta) {
        // Generate research points based on buildings and upgrades
        const generation = this.calculateResearchGeneration();
        this.researchPoints += generation * delta;
        this.updateUI();
    }

    calculateResearchGeneration() {
        // Base generation from buildings
        let generation = 0;
        for (const building of this.game.buildings) {
            generation += building.count * 0.1; // 0.1 research points per building per second
        }
        return generation;
    }

    updateUI() {
        // Update research points display
        const pointsDisplay = document.getElementById('research-points');
        if (pointsDisplay) {
            pointsDisplay.textContent = `Research Points: ${Utils.formatNumber(this.researchPoints)}`;
        }

        // Update current research tree view
        const activeTab = document.querySelector('.research-tab.active');
        if (activeTab) {
            this.showResearchTree(activeTab.dataset.treeId);
        }
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
            this.activeResearch = this.findResearch(saveData.activeResearch.id);
            this.researchProgress = saveData.activeResearch.progress;
        }

        this.updateUI();
    }
}

// Export the ResearchSystem
window.ResearchSystem = ResearchSystem;
