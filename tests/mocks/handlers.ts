// This file is available for browser-side MSW handlers if you need them later.
// The API route tests in this repo now use a dedicated TEST_MODE mock provider
// inside the application itself, so external fetch requests are not made.

// Example:
// import { rest } from 'msw'
// export const handlers = [
//   rest.get('https://example.com/api', (req, res, ctx) => {
//     return res(ctx.json({ success: true }))
//   }),
// ]
