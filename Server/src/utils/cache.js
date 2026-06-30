const store = new Map();

export function cacheResponse(ttlMs = 60000) {
  return (req, res, next) => {
    if (req.method !== "GET") return next();

    const key = `${req.originalUrl}`;
    const cached = store.get(key);

    if (cached && Date.now() - cached.createdAt < ttlMs) {
      res.set("X-Cache", "HIT");
      return res.json(cached.data);
    }

    const originalJson = res.json.bind(res);
    res.json = (data) => {
      if (res.statusCode < 400) {
        store.set(key, { createdAt: Date.now(), data });
        res.set("X-Cache", "MISS");
      }

      return originalJson(data);
    };

    next();
  };
}

export function clearCache(prefix = "") {
  for (const key of store.keys()) {
    if (!prefix || key.startsWith(prefix)) {
      store.delete(key);
    }
  }
}
