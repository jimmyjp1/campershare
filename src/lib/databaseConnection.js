/**
 * CamperShare - Datenbankverbindung (databaseConnection.js)
 * 
 * Zentrale Datenbankverbindungs-Utilities für PostgreSQL und Redis.
 * Optimiert für Performance, Sicherheit und Connection-Pooling.
 * 
 * Features:
 * - PostgreSQL Connection Pool mit optimierten Einstellungen
 * - Redis-Cache für Session- und Performance-Optimierung
 * - Environment-spezifische Konfiguration (Dev/Prod)
 * - Automatisches Retry und Error Handling
 * - Query-Timeouts und Connection-Monitoring
 * - SSL-Support für Production
 * 
 * Verwendung:
 * const result = await query('SELECT * FROM users WHERE id = $1', [userId])
 * 
 * Connection Pool Benefits:
 * - Wiederverwendung von DB-Verbindungen
 * - Reduzierte Latenz
 * - Begrenzte Ressourcennutzung
 * - Automatisches Timeout-Management
 */

// PostgreSQL Client für Connection Pooling
const { Pool } = require('pg');

/**
 * Redis-Import (nur Server-seitig)
 * Client-side wird Redis nicht benötigt
 */
let createClient = null;
const isServer = typeof window === 'undefined';

// Redis nur auf Server-Seite importieren
if (isServer) {
  try {
    const redis = require('redis');
    createClient = redis.createClient;
  } catch (error) {
    console.warn('⚠️ Redis not available:', error.message);
  }
}

/**
 * PostgreSQL Connection Pool
 * Optimiert für hohe Performance und Stabilität
 */
const pool = new Pool({
  // Verbindungsstring (Environment-abhängig)
  connectionString: process.env.DATABASE_URL || 'postgresql://campershare_user:campershare_pass@localhost:5432/campershare',
  
  // SSL für Production (Heroku, AWS, etc.)
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  
  // Connection Pool Optimierung
  max: 20,                      // Maximale Anzahl gleichzeitiger Verbindungen
  idleTimeoutMillis: 30000,     // Idle-Verbindungen nach 30s schließen
  connectionTimeoutMillis: 2000, // Timeout für neue Verbindungen (2s)
  
  // Query Performance & Sicherheit
  query_timeout: 20000,         // 20s Timeout für Standard-Queries
  statement_timeout: 60000      // 60s für komplexe Queries (Analytics, Reports)
});

/**
 * Connection-Monitoring für Debugging
 * Hilft bei der Identifikation von Connection-Problemen
 */
pool.on('connect', (client) => {
  console.log('✅ New PostgreSQL client connected');
});

pool.on('error', (err, client) => {
  console.error('❌ Unexpected PostgreSQL client error:', err);
});

// Redis connection with error handling
let redisClient = null;

if (isServer && createClient) {
  redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    retry_strategy: (times) => {
      // Exponential backoff with max delay
      const delay = Math.min(times * 50, 2000);
      return delay;
    }
  });

  redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
  });

  redisClient.on('connect', () => {
    console.log('Connected to Redis');
  });

  // Connect to Redis with error handling
  (async () => {
    try {
      await redisClient.connect();
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      redisClient = null; // Disable Redis if connection fails
    }
  })();
}

// Optimized database query helper with connection reuse
async function query(text, params = []) {
  const start = Date.now();
  
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    
    // Log slow queries (over 1 second)
    if (duration > 1000) {
      console.warn(`Slow query (${duration}ms): ${text.substring(0, 100)}...`);
    }
    
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    console.error('Query:', text);
    console.error('Params:', params);
    throw error;
  }
}

// Redis helpers with null checks
const redis = {
  get: async (key) => {
    if (!redisClient || !isServer) return null;
    try {
      return await redisClient.get(key);
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  },
  
  set: async (key, value, expireInSeconds = 3600) => {
    if (!redisClient || !isServer) return false;
    try {
      if (expireInSeconds) {
        await redisClient.setEx(key, expireInSeconds, value);
      } else {
        await redisClient.set(key, value);
      }
      return true;
    } catch (error) {
      console.error('Redis set error:', error);
      return false;
    }
  },
  
  del: async (key) => {
    if (!redisClient || !isServer) return false;
    try {
      await redisClient.del(key);
      return true;
    } catch (error) {
      console.error('Redis del error:', error);
      return false;
    }
  }
};

// Close connections gracefully
if (isServer) {
  process.on('SIGINT', async () => {
    console.log('Closing database connections...');
    await pool.end();
    if (redisClient) {
      await redisClient.quit();
    }
    process.exit(0);
  });
}

module.exports = { query, redis };
