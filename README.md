# DailyPlanet - News Aggregator

DailyPlanet is a modern, high-performance news aggregator application built using Next.js 16 and React 19. It aggregates news from multiple third-party providers (The Guardian and NewsData.io), applies client-side infinite scrolling, and integrates server-side rate limiting.

Live URL: [https://news-aggregator-olive-delta.vercel.app/](https://news-aggregator-olive-delta.vercel.app/)

---

## Setup Instructions

### 1. Prerequisites
Ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v20+ recommended)
* npm, yarn, or pnpm

### 2. Obtain API Keys
You will need API keys and configuration credentials from:
1. **The Guardian Open Platform**: [Sign up here](https://open-platform.theguardian.com/access/) to get a free developer key.
2. **NewsData.io**: [Create an account here](https://newsdata.io/) to get a free API key.
3. **Upstash Redis**: [Create a database here](https://upstash.com/) and copy the REST API credentials.

### 3. Environment Configuration
Create a `.env` file in the root directory of the project and populate it with your keys:

```env
GUARDIANAPI_KEY="your-guardian-api-key"
NEWSDATA_API_KEY="your-newsdata-api-key"
UPSTASH_REDIS_REST_URL="your-upstash-redis-rest-url"
UPSTASH_REDIS_REST_TOKEN="your-upstash-redis-rest-token"
```

> [!WARNING]
> Do not commit the `.env` file to version control. It is ignored by default in `.gitignore`.

### 4. Installation and Running

To install dependencies:
```bash
npm install
```

To run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

To build and start the production build:
```bash
npm run build
npm run start
```

---

## API Integration Approach

DailyPlanet integrates articles from **The Guardian** and **NewsData.io** through serverless endpoints:

1. **Unified Schema Normalization**:
   Each API has its own response fields (e.g. `webTitle` vs `title`, `webUrl` vs `link`). In `src/lib/normalize.ts`, raw items are mapped to a standardized article schema:
   ```typescript
   {
       title: string;
       url: string;
       category: string[];
       source: string;
       publishedAt: string; // ISO 8601 Date
       content: string;
       byline?: string;
       thumbnail: string;
   }
   ```

2. **Unified Aggregation**:
   The fetched articles are combined and sorted chronologically (newest first) by publication date in `src/lib/aggregate.ts`.

3. **Composite Cursor Pagination**:
   To fetch the next pages of both APIs seamlessly, the system uses custom cursors (`src/lib/cursorEncoder.ts`). The page state is stored as a JSON object containing pagination parameters for both API endpoints (e.g., page numbers and cursors), base64-encoded, and returned to the client as a single `nextPage` token for continuous loading.

---

## API Endpoints Documentation

The application exposes internal API routes that aggregate results and can be accessed directly or by external services.

### 1. Fetch News Feed (`/api/news`)
Fetches top headlines across different categories aggregated from all news providers.

* **Method**: `GET`
* **URL Parameters**:
  * `category` *(optional)*: Filter articles by category. Supported options: `world`, `business`, `technology`, `science`, `sports`, `entertainment`.
  * `page` *(optional)*: The base64 composite cursor returned by a previous query for pagination.
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "articles": [
      {
        "title": "Example Headline",
        "url": "https://example.com/article",
        "category": ["World News"],
        "source": "Guardian",
        "publishedAt": "2026-05-22T08:00:00.000Z",
        "content": "Article summary content...",
        "byline": "Author Name",
        "thumbnail": "https://example.com/thumb.jpg"
      }
    ],
    "nextPage": "eyJndWFyZGlhblBhZ2UiOjIsIm5ld3NDdXJzb3IiOiJleGFtcGxlIn0="
  }
  ```
* **Rate Limited Response (200 OK)**:
  ```json
  {
    "success": false,
    "error": "Rate limit exceeded. Try again later."
  }
  ```
* **Error Response (400 / 500)**:
  ```json
  {
    "success": false,
    "error": "Invalid category"
  }
  ```

---

### 2. Search News (`/api/search`)
Performs a keyword search across all news providers.

* **Method**: `GET`
* **URL Parameters**:
  * `query` *(optional)*: The search term (e.g., `technology`, `science`).
  * `category` *(optional)*: Filter search results by category.
  * `page` *(optional)*: The base64 composite cursor for pagination.
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "articles": [ ... ],
    "nextPage": "eyJndWFyZGlhblBhZ2UiOjIsIm5ld3NDdXJzb3IiOiJleGFtcGxlIn0="
  }
  ```
* **Rate Limited Response (200 OK)**:
  ```json
  {
    "success": false,
    "error": "Rate limit exceeded. Try again later."
  }
  ```

---

## Caching Strategy & Rate Limiting

### Next.js Fetch Caching
To optimize third-party API usage and decrease load times:
* News fetches from external endpoints use Next.js fetch caching: `{ next: { revalidate: 300 } }`.
* This caches the responses on the server for 5 minutes, significantly reducing the usage of daily API key quotas.

### Rate Limiting (Upstash Redis)
To prevent API abuse and control hosting costs, server-side rate limits are enforced on the API endpoints using `@upstash/ratelimit` connected to an Upstash Redis database:
* **Search Route (`/api/search`)**: Limited to **5 requests per 20 seconds** per IP address.
* **News Route (`/api/news`)**: Limited to **20 requests per 60 seconds** per IP address.

---

