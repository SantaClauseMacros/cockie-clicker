// config.js - Game Configuration and Constants
const CONFIG = {
    // Core Game Settings
    GAME_VERSION: '2.0.0',
    SAVE_KEY: 'advancedCookieGame',
    TICK_RATE: 50, // milliseconds
    AUTO_SAVE_INTERVAL: 30000, // 30 seconds

    // Cookie Types
    COOKIE_TYPES: {
        standard: {
            name: "Standard Cookie",
            multiplier: 1,
            unlocked: true
        },
        chocolate: {
            name: "Chocolate Cookie",
            multiplier: 1.5,
            cost: 100000,
            unlocked: false
        },
        golden: {
            name: "Golden Cookie",
            multiplier: 2,
            cost: 1000000,
            unlocked: false
        },
        cosmic: {
            name: "Cosmic Cookie",
            multiplier: 3,
            cost: 10000000,
            unlocked: false
        },
        quantum: {
            name: "Quantum Cookie",
            multiplier: 5,
            cost: 100000000,
            unlocked: false
        }
    },

    // Buildings Base Settings
    BUILDINGS: {
        autoClicker: {
            name: "Auto Clicker",
            baseCost: 15,
            baseCPS: 0.1,
            description: "Automatically clicks the cookie"
        },
        robotArm: {
            name: "Robot Arm",
            baseCost: 100,
            baseCPS: 1,
            description: "A mechanical arm that bakes cookies"
        },
        cookieFactory: {
            name: "Cookie Factory",
            baseCost: 1100,
            baseCPS: 8,
            description: "Mass produces cookies"
        },
        megaProcessor: {
            name: "Mega Processor",
            baseCost: 12000,
            baseCPS: 47,
            description: "Computes the perfect cookie"
        },
        quantumOven: {
            name: "Quantum Oven",
            baseCost: 130000,
            baseCPS: 260,
            description: "Bakes cookies in multiple dimensions"
        },
        cookieCollider: {
            name: "Cookie Collider",
            baseCost: 1400000,
            baseCPS: 1400,
            description: "Smashes cookie particles together"
        },
        timeMachine: {
            name: "Time Machine",
            baseCost: 20000000,
            baseCPS: 7800,
            description: "Retrieves cookies from the past"
        },
        aiSupercomputer: {
            name: "AI Supercomputer",
            baseCost: 330000000,
            baseCPS: 44000,
            description: "Uses AI to optimize cookie production"
        }
    },

    // Golden Cookie Settings
    GOLDEN_COOKIE: {
        BASE_CHANCE: 0.05,
        MIN_TIME: 5000,  // 5 seconds
        MAX_TIME: 15000, // 15 seconds
        DURATION: 13000, // 13 seconds
        EFFECTS: {
            frenzy: {
                chance: 0.4,
                multiplier: 7,
                duration: 77,
                name: "Frenzy",
                description: "Cookie production x7 for 77 seconds!"
            },
            clickFrenzy: {
                chance: 0.3,
                multiplier: 777,
                duration: 13,
                name: "Click Frenzy",
                description: "Clicking power x777 for 13 seconds!"
            },
            cookieStorm: {
                chance: 0.15,
                duration: 7,
                name: "Cookie Storm",
                description: "Raining cookies!"
            },
            blab: {
                chance: 0.15,
                name: "Strange Effect",
                description: "Something weird happens..."
            }
        }
    },

    // Research Settings
    RESEARCH: {
        COST_MULTIPLIER: 1.5,
        MAX_ACTIVE: 1,
        BASE_TIME: 60, // seconds
        POINTS_PER_BUILDING: 0.1
    },

    // Prestige Settings
    PRESTIGE: {
        CHIPS_FORMULA: (cookies) => Math.floor(Math.pow(cookies/1e12, 0.5)),
        BONUS_MULTIPLIER: 0.02, // Each heavenly chip gives +2% CPS
        UNLOCK_REQUIREMENT: 1e12 // 1 trillion cookies
    },

    // Visual Effects
    PARTICLES: {
        CLICK: {
            COUNT: 5,
            LIFETIME: 1000,
            MIN_SIZE: 5,
            MAX_SIZE: 15,
            SPEED: 3
        },
        GOLDEN: {
            COUNT: 10,
            LIFETIME: 2000,
            MIN_SIZE: 10,
            MAX_SIZE: 20,
            SPEED: 5
        }
    },

    // Achievement Thresholds
    ACHIEVEMENTS: {
        COOKIES_BAKED: [100, 1000, 10000, 100000, 1000000, 10000000],
        COOKIES_CLICK: [100, 1000, 10000, 100000, 1000000],
        BUILDINGS_OWNED: [1, 5, 10, 25, 50, 100],
        GOLDEN_COOKIES: [1, 7, 27, 77, 777],
        RESEARCH_COMPLETE: [1, 5, 10, 25, 50],
        PRESTIGE_LEVEL: [1, 5, 10, 25, 50]
    },

    // Special Events
    EVENTS: {
        COOKIE_STORM: {
            DURATION: 10,
            COOKIES_PER_SECOND: 15,
            CLICK_VALUE: 10
        },
        RANDOM_BONUS: {
            MIN_MULTIPLIER: 2,
            MAX_MULTIPLIER: 10,
            DURATION: 30
        }
    }
};

// Export config
window.CONFIG = CONFIG;
