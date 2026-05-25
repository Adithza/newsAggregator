export const CATEGORY_MAP = {
  sports: {
    guardian: "sport",
    newsData: "sports",
    currentNews: "sport",
  },
  business: {
    guardian: "business",
    newsData: "business",
    currentNews: "economy_business_finance",
  },
  technology: {
    guardian: "technology",
    newsData: "technology",
    currentNews: "science_technology",
  },
  science: {
    guardian: "science",
    newsData: "science",
    currentNews: "science_technology",
  },
  health: {
    guardian: "society",
    newsData: "health",
    currentNews: "health",
  },
  entertainment: {
    guardian: "culture",
    newsData: "entertainment",
    currentNews: "arts_culture_entertainment",
  },
  politics: {
    guardian: "politics",
    newsData: "politics",
    currentNews: "politics_government",
  },
  world: {
    guardian: "world",
    newsData: "world",
    currentNews: "general",
  },
} as const;