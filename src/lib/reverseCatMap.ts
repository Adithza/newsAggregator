import { CATEGORY_MAP } from "./category_map";

type Category = keyof typeof CATEGORY_MAP;

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

export const API_TO_CATEGORY_MAP: Record<string, Category> = {
  ...CATEGORY_ALIASES
};

for (const key in CATEGORY_MAP) {
  const category = key as Category;

  const mapping = CATEGORY_MAP[category];

  API_TO_CATEGORY_MAP[mapping.guardian.toLowerCase()] = category;

  API_TO_CATEGORY_MAP[mapping.newsData.toLowerCase()] = category;

  API_TO_CATEGORY_MAP[mapping.currentNews.toLowerCase()] = category;
}