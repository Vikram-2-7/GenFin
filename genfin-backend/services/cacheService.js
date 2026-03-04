/**
 * Cache Service
 * 
 * High-performance in-memory caching with TTL
 * Dramatically reduces response latency for repeated analyses
 */

class CacheService {
  constructor(defaultTTL = 3600000) { // 1 hour default
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Generate cache key from profile data
   * Uses hash of normalized financial metrics
   */
  generateKey(data) {
    // Normalize data to avoid cache misses for equivalent profiles
    const normalized = {
      income: Math.round(data.monthlyIncome / 1000) * 1000,
      expenses: Math.round(data.expenses / 1000) * 1000,
      savings: Math.round(data.savings / 1000) * 1000,
      debt: Math.round(data.debt / 10000) * 10000,
      emergency: Math.round(data.emergencyFundMonths),
      risk: data.riskTolerance?.toLowerCase() || 'moderate'
    };

    // Simple hash function
    return JSON.stringify(normalized);
  }

  /**
   * Get value from cache
   */
  get(key) {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.misses++;
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }

    this.hits++;
    entry.lastAccessed = Date.now();
    return entry.value;
  }

  /**
   * Set value in cache
   */
  set(key, value, ttl = this.defaultTTL) {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttl,
      createdAt: Date.now(),
      lastAccessed: Date.now(),
      accessCount: 0
    });
  }

  /**
   * Cache hit rate percentage
   */
  getHitRate() {
    const total = this.hits + this.misses;
    return total === 0 ? 0 : Math.round((this.hits / total) * 100);
  }

  /**
   * Get cache stats
   */
  getStats() {
    return {
      size: this.cache.size,
      hits: this.hits,
      misses: this.misses,
      hitRate: `${this.getHitRate()}%`,
      memory: this.estimateMemory()
    };
  }

  /**
   * Estimate memory usage
   */
  estimateMemory() {
    let bytes = 0;
    for (const [key, entry] of this.cache) {
      bytes += key.length * 2; // String in JavaScript
      bytes += JSON.stringify(entry.value).length * 2;
    }
    return `${(bytes / 1024 / 1024).toFixed(2)}MB`;
  }

  /**
   * Clear entire cache
   */
  clear() {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Clear expired entries
   */
  cleanup() {
    const now = Date.now();
    let removed = 0;

    for (const [key, entry] of this.cache) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        removed++;
      }
    }

    return removed;
  }

  /**
   * Get cache details (for debugging)
   */
  getDetails() {
    const entries = [];
    for (const [key, entry] of this.cache) {
      entries.push({
        key: key.substring(0, 50) + (key.length > 50 ? '...' : ''),
        age: Date.now() - entry.createdAt,
        expiresIn: Math.max(0, entry.expiresAt - Date.now()),
        accesses: entry.accessCount
      });
    }
    return entries;
  }
}

// Create singleton instance
const cacheService = new CacheService();

// Periodic cleanup (every 5 minutes)
setInterval(() => {
  cacheService.cleanup();
}, 300000);

module.exports = cacheService;
