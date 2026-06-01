import { CATEGORY_MAP } from "./category_map";

type Category = keyof typeof CATEGORY_MAP;

export const API_TO_CATEGORY_MAP: Record<string, Category> = {};

for (const key in CATEGORY_MAP) {
  const category = key as Category;

  const mapping = CATEGORY_MAP[category];

  API_TO_CATEGORY_MAP[mapping.guardian] = category;

  API_TO_CATEGORY_MAP[mapping.newsData] = category;
}