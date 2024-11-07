// config.js - Game Configuration and Constants

const CONFIG = {
    // Core Game Settings
    GAME_VERSION: '1.0.0',
    SAVE_KEY: 'hyperCookieGame',
    TICK_RATE: 50, // milliseconds
    AUTO_SAVE_INTERVAL: 30000, // 30 seconds

    // Production Settings
    BASE_CPS: 0.1,
    CLICK_MULTIPLIER: 1,
    GOLDEN_COOKIE_MULTIPLIER: 7,
    CRITICAL_CLICK_CHANCE: 0.01,
    CRITICAL_CLICK_MULTIPLIER: 10,

    // Prestige Settings
    PRESTIGE_REQUIREMENT: 1e12, // 1 trillion cookies
    PRESTIGE_SCALING: 0.5,
    HEAVENLY_CHIP_MULTIPLIER: 0.02, // 2% production boost per chip

    // Special Events
    GOLDEN_COOKIE: {
        MIN_SPAWN_TIME: 120000, // 2 minutes
        MAX_SPAWN_TIME: 300000, // 5 minutes
        DURATION: 13000, // 13 seconds
        EFFECTS: {
            FRENZY: {
                chance: 0.4,
                multiplier: 7,
                duration: 77
            },
            CLICK_FRENZY: {
                chance: 0.3,
                multiplier: 777,
                duration: 13
            },
            COOKIE_STORM: {
                chance: 0.2,
                duration: 30
            },
            DRAGON_HARVEST: {
                chance: 0.1,
                multiplier: 15,
                duration: 60
            }
        }
    },

    // Building Base Costs
    BUILDING_BASE_COSTS: {
        cursor: 15,
        grandma: 100,
        farm: 1100,
        mine: 12000,
        factory: 130000,
        bank: 1400000,
        temple: 20000000,
        wizard_tower: 330000000,
        shipment: 5100000000,
        alchemy_lab: 75000000000,
        portal: 1000000000000,
        time_machine: 14000000000000
    },

    // Research Costs and Requirements
    RESEARCH: {
        BASE_COST: 100,
        COST_MULTIPLIER: 1.5,
        TIME_MULTIPLIER: 1.2,
        MAX_ACTIVE_RESEARCH: 1
    },

    // Achievement Thresholds
    ACHIEVEMENTS: {
        COOKIE_AMOUNTS: [100, 1000, 10000, 100000, 1000000, 1000000000],
        BUILDING_AMOUNTS: [1, 5, 10, 25, 50, 100, 150, 200, 250, 300],
        CPS_AMOUNTS: [1, 10, 100, 1000, 10000, 100000],
        PRESTIGE_LEVELS: [1, 5, 10, 25, 50, 100]
    },

    // Dimension Settings
    DIMENSIONS: {
        PORTAL_COST: 1000000,
        ENERGY_GAIN_RATE: 0.1,
        MAX_ENERGY: 100,
        EFFECT_MULTIPLIER: 2
    },

    // Mini-game Settings
    MINI_GAMES: {
        UNLOCK_COSTS: {
            cookieClicker: 10000,
            cookieMatch: 50000,
            cookieDefense: 100000
        },
        REWARD_MULTIPLIERS: {
            cookieClicker: 1.5,
            cookieMatch: 2,
            cookieDefense: 3
        }
    },

    // Visual Effects
    PARTICLES: {
        MAX_PARTICLES: 25,
        LIFETIME: 1000,
        SIZE_RANGE: [5, 15],
        SPEED_RANGE: [2, 5]
    },

    // Sound Effects (if implemented)
    AUDIO: {
        ENABLED: true,
        VOLUME: 0.5,
        EFFECTS_VOLUME: 0.3,
        MUSIC_VOLUME: 0.2
    },

    // Development/Debug Settings
    DEBUG: {
        ENABLED: false,
        SHOW_FPS: false,
        GOD_MODE: false,
        FAST_PRESTIGE: false
    },

    // Upgrade Tiers and Multipliers
    UPGRADE_TIERS: [
        { requirement: 0, multiplier: 1 },
        { requirement: 5, multiplier: 1.1 },
        { requirement: 25, multiplier: 1.2 },
        { requirement: 50, multiplier: 1.3 },
        { requirement: 100, multiplier: 1.4 },
        { requirement: 150, multiplier: 1.5 },
        { requirement: 200, multiplier: 1.6 },
        { requirement: 250, multiplier: 1.7 },
        { requirement: 300, multiplier: 1.8 },
        { requirement: 350, multiplier: 1.9 },
        { requirement: 400, multiplier: 2.0 }
    ],

    // Time Manipulation
    TIME_MANIPULATION: {
        WARP_COST: 100,
        MAX_WARP_DURATION: 30,
        COOLDOWN: 300,
        SPEED_MULTIPLIER: 3
    }
};

// Freeze the config object to prevent modifications during runtime
Object.freeze(CONFIG);
