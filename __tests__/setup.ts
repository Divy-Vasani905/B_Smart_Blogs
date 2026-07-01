/** Minimal env for modules that validate secrets at import time. */
process.env.JWT_ACCESS_SECRET ??= "test-access-secret-min-32-chars-long";
process.env.JWT_REFRESH_SECRET ??= "test-refresh-secret-min-32-chars-long";
process.env.MONGODB_URI ??= "mongodb://127.0.0.1:27017/bsmart-test";
