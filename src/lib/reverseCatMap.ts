import { CATEGORY_MAP } from "./category_map";

type Category = keyof typeof CATEGORY_MAP;
type ApiCategory = Category | Category[];

const CATEGORY_ALIASES: Record<string, Category> = {
  top: "world",
  other: "world",
  environment: "science",
  education: "science",
  crime: "politics",
  domestic: "world",
  food: "health",
  lifestyle: "entertainment",
  tourism: "world",
  society: "health",
  lifestyle_leisure: "entertainment",
  human_interest: "world",
  crime_law_justice: "politics",
  labour: "business",
  automotive: "technology",
  real_estate: "business",
  breaking: "world",
};

export const API_TO_CATEGORY_MAP: Record<string, ApiCategory> = {
  ...CATEGORY_ALIASES
};

function addCategoryMapping(key: string, category: Category) {
  const normalizedKey = key.toLowerCase();
  const existing = API_TO_CATEGORY_MAP[normalizedKey];

  if (!existing) {
    API_TO_CATEGORY_MAP[normalizedKey] = category;
    return;
  }

  if (Array.isArray(existing)) {
    if (!existing.includes(category)) {
      API_TO_CATEGORY_MAP[normalizedKey] = [...existing, category];
    }
    return;
  }

  if (existing !== category) {
    API_TO_CATEGORY_MAP[normalizedKey] = [existing, category];
  }
}

for (const key in CATEGORY_MAP) {
  const category = key as Category;

  const mapping = CATEGORY_MAP[category];

  addCategoryMapping(mapping.guardian, category);
  addCategoryMapping(mapping.newsData, category);
  addCategoryMapping(mapping.currentNews, category);
}