import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const redis = Redis.fromEnv();

export const searchRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(5, "20 s"),
  prefix: "@news-app/searchRatelimit",
});

export const newsRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(20, "60 s"),
  prefix: "@news-app/newsRatelimit",
});