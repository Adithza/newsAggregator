# DailyPlanet - News Aggregator

DailyPlanet is a modern, high-performance news aggregation platform built using Next.js 16 and React 19.

The application aggregates news from multiple providers including The Guardian, NewsData.io, and Currents API through a provider-based architecture. Articles are normalized into a unified schema, deduplicated, sorted chronologically, and served through a single API.

DailyPlanet supports:

* Cross-provider news aggregation
* Global article search
* Category filtering
* Country filtering
* Date-range filtering
* Infinite scrolling
* Composite cursor pagination
* Provider failover
* Server-side caching
* Redis-backed rate limiting

Live URL: https://news-aggregator-olive-delta.vercel.app/

---

## Setup Instructions

### 1. Prerequisites

Ensure you have the following installed:

* Node.js (v20+ recommended)
* npm, yarn, or pnpm

### 2. Obtain API Keys

You will need API keys and configuration credentials from:

1. **The Guardian Open Platform**
2. **NewsData.io**
3. **Currents API**
4. **Upstash Redis**

### 3. Environment Configuration

Create a `.env` file in the root directory of the project and populate it with your keys:

```env
GUARDIANAPI_KEY="your-guardian-api-key"

NEWSDATA_API_KEY="your-newsdata-api-key"

CURRENTNEWS_API_KEY="your-currents-api-key"

UPSTASH_REDIS_REST_URL="your-upstash-redis-rest-url"

UPSTASH_REDIS_REST_TOKEN="your-upstash-redis-rest-token"
```

> [!WARNING]
> Do not commit the `.env` file to version control. It is ignored by default in `.gitignore`.

### 4. Installation and Running

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Build and run production:

```bash
npm run build
npm run start
```

---

## Architecture Overview

DailyPlanet uses a provider-based architecture that separates provider-specific logic from aggregation logic.

### Provider Registry

All providers implement a shared interface and are registered through a central registry.

Current providers:

* The Guardian
* NewsData.io
* Currents API

This architecture allows new providers to be added without modifying the orchestration layer.

### Unified Orchestration

Both the news feed and search endpoints use the same orchestration pipeline.

The orchestrator:

1. Selects compatible providers
2. Executes requests in parallel
3. Normalizes provider responses
4. Removes duplicate articles
5. Sorts articles chronologically
6. Generates a unified pagination cursor

### Capability-Based Filtering

Providers advertise supported capabilities:

* Country filtering
* Date filtering

The registry automatically excludes providers that cannot satisfy the requested filters.

| Filter Applied       | Active Providers             |
| -------------------- | ---------------------------- |
| None                 | Guardian, NewsData, Currents |
| Country              | NewsData, Currents           |
| Date Range           | Guardian, Currents           |
| Country + Date Range | Currents                     |

### Unified Article Schema

```typescript
{
  title: string;
  url: string;
  category: string[];
  source: string;
  publishedAt: string;
  content: string;
  byline?: string;
  thumbnail: string;
}
```

### Parallel Aggregation

Providers are queried concurrently to reduce response times.

If one provider fails, the application continues operating using the remaining providers.

---

## API Integration Approach

### Unified Schema Normalization

Each provider exposes different response formats.

Examples:

* `webTitle` vs `title`
* `webUrl` vs `link`

Provider responses are normalized into a shared article schema in `src/lib/normalize.ts`.

### Unified Aggregation

Normalized articles are:

1. Combined into a single collection
2. Deduplicated
3. Sorted chronologically

This logic is handled in `src/lib/aggregate.ts`.

### Composite Cursor Pagination

Provider-specific pagination state is combined into a single cursor.

The cursor stores:

```json
{
  "guardianPage": 2,
  "newsCursor": "abc123",
  "currentNewsCursor": 3
}
```

The state is Base64 encoded and returned to the client as a single `nextPage` token.

---

## API Endpoints Documentation

The application exposes internal API routes that aggregate results and can also be consumed externally.

### 1. Fetch News Feed (`/api/news`)

Fetches aggregated headlines across all compatible providers.

#### Method

```http
GET
```

#### URL Parameters

| Parameter | Required | Description                 |
| --------- | -------- | --------------------------- |
| category  | No       | Category filter             |
| country   | No       | ISO country code            |
| startDate | No       | Start date (YYYY-MM-DD)     |
| endDate   | No       | End date (YYYY-MM-DD)       |
| page      | No       | Composite pagination cursor |

#### Example Requests

```http
GET /api/news?category=technology
```

```http
GET /api/news?country=us
```

```http
GET /api/news?startDate=2026-01-01&endDate=2026-01-31
```

```http
GET /api/news?category=technology&country=us
```

#### Success Response

```json
{
  "success": true,
  "articles": [
    {
      "title": "Example Headline",
      "url": "https://example.com/article",
      "category": ["technology"],
      "source": "Guardian",
      "publishedAt": "2026-05-22T08:00:00.000Z",
      "content": "Article content...",
      "byline": "Author Name",
      "thumbnail": "https://example.com/image.jpg"
    }
  ],
  "nextPage": "eyJndWFyZGlhblBhZ2UiOjIsIm5ld3NDdXJzb3IiOiJhYmMxMjMifQ=="
}
```

#### Rate Limited Response

```json
{
  "success": false,
  "error": "Rate limit exceeded. Try again later."
}
```

#### Error Response

```json
{
  "success": false,
  "error": "Invalid category"
}
```

---

### 2. Search News (`/api/search`)

Performs keyword searches across all compatible providers.

#### Method

```http
GET
```

#### URL Parameters

| Parameter | Required | Description                 |
| --------- | -------- | --------------------------- |
| query     | Yes      | Search term                 |
| category  | No       | Category filter             |
| country   | No       | Country filter              |
| startDate | No       | Start date (YYYY-MM-DD)     |
| endDate   | No       | End date (YYYY-MM-DD)       |
| page      | No       | Composite pagination cursor |

#### Example Requests

```http
GET /api/search?query=artificial+intelligence
```

```http
GET /api/search?query=ai&category=technology
```

```http
GET /api/search?query=election&country=us
```

```http
GET /api/search?query=tesla&startDate=2026-01-01&endDate=2026-01-31
```

#### Success Response

```json
{
  "success": true,
  "articles": [],
  "nextPage": "eyJndWFyZGlhblBhZ2UiOjIsIm5ld3NDdXJzb3IiOiJhYmMxMjMifQ=="
}
```

---

### 3. Pagination (`nextPage` Cursor)

Different providers use different pagination systems:

| Provider    | Pagination Type |
| ----------- | --------------- |
| Guardian    | Page Numbers    |
| NewsData.io | Cursor Tokens   |
| Currents    | Page Numbers    |

DailyPlanet combines provider-specific pagination state into a single Base64-encoded cursor.

Clients should treat this value as opaque and simply pass it back through the `page` query parameter.

Example:

```http
GET /api/news?page=<nextPage>
```

---

## Provider Compatibility

Not all providers support the same filters.

| Provider    | Search | Categories | Country Filter | Date Filter |
| ----------- | ------ | ---------- | -------------- | ----------- |
| Guardian    | ✅      | ✅          | ❌              | ✅           |
| NewsData.io | ✅      | ✅          | ✅              | ❌           |
| Currents    | ✅      | ✅          | ✅              | ✅           |

The provider registry automatically excludes incompatible providers.

Examples:

### Country Filter

```http
GET /api/news?country=us
```

Active Providers:

```text
NewsData.io
Currents
```

### Date Range Filter

```http
GET /api/news?startDate=2026-01-01&endDate=2026-01-31
```

Active Providers:

```text
Guardian
Currents
```

### Country + Date Filter

```http
GET /api/news?country=us&startDate=2026-01-01&endDate=2026-01-31
```

Active Providers:

```text
Currents
```

---

## Project Structure

```text
src
├── app
│   ├── api
│   │   ├── news
│   │   └── search
│   ├── page.tsx
│   └── searchPage
│
├── components
│   ├── CatTabs.tsx
│   ├── CountryFilter.tsx
│   ├── GlobalSearchBar.tsx
│   ├── localSearch.tsx
│   ├── Navbar.tsx
│   ├── NewsCard.tsx
│   ├── NewsFeed.tsx
│   └── searchContext.tsx
│
└── lib
    ├── aggregate.ts
    ├── category_map.ts
    ├── cursorEncoder.ts
    ├── getNews.ts
    ├── normalize.ts
    ├── rateLimit.ts
    ├── reverseCatMap.ts
    ├── searchNews.ts
    └── news
        ├── orchestrator.ts
        ├── pagination.ts
        ├── registry.ts
        ├── types.ts
        └── providers
            ├── guardian.ts
            ├── newsdata.ts
            ├── currents.ts
            └── types.ts
```

---

## Caching Strategy & Rate Limiting

### Next.js Fetch Caching

To optimize third-party API usage and decrease load times:

```ts
{
  next: {
    revalidate: 300
  }
}
```

Responses are cached for 5 minutes, reducing API quota usage and improving response times.

### Rate Limiting (Upstash Redis)

Server-side rate limiting is implemented using:

* Upstash Redis
* @upstash/ratelimit

#### Search Route (`/api/search`)

```text
5 requests per 20 seconds per IP
```

#### News Route (`/api/news`)

```text
20 requests per 60 seconds per IP
```

---


