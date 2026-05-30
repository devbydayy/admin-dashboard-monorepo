const redis = require('./redis');

async function getOrSetCache(keyPrefix, ttlSeconds, fetchFn) {
  try {
    const cached = await redis.get(keyPrefix);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (err) {
    console.warn(`[Cache] Read error for ${keyPrefix}:`, err.message);
  }

  const data = await fetchFn();
  try {
    await redis.setex(keyPrefix, ttlSeconds, JSON.stringify(data));
  } catch (err) {
    console.warn(`[Cache] Write error for ${keyPrefix}:`, err.message);
  }
  return data;
}

async function invalidateCache(pattern) {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`[Cache] Invalidated ${keys.length} keys matching "${pattern}"`);
    }
  } catch (err) {
    console.warn(`[Cache] Invalidation error for ${pattern}:`, err.message);
  }
}

module.exports = { getOrSetCache, invalidateCache };