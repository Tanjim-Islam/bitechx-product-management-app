# BiTechX Product Management App

A Next.js App Router app to browse, create, edit, view, and delete products using the BiTechX API.

## Overview
- Auth via POST `/auth` (email only), executed through an RTK Query mutation. JWT persists in `localStorage` under `btx_auth` and is injected on all API calls.
- Products: list, search (debounced), filter by category, paginate, create, edit, delete (simulated) with confirmation.
- Strict color palette with Tailwind theme. Responsive and accessible UI.
- Redux Toolkit + RTK Query for state, caching, and tag-based invalidation.

## Tech Stack
- Next.js 15 (App Router), React 18, TypeScript
- Redux Toolkit + RTK Query
- TailwindCSS
- react-hook-form + zod
- sonner (toasts), lucide-react (icons)
- ESLint + Prettier

## Color Palette
- rich_black: #0d1821
- anti_flash_white: #eff1f3
- hookers_green: #4e6e5d
- lion: #ad8a64
- chestnut: #a44a3f

Tailwind extends these with 100–900 scales exactly as defined in `tailwind.config.ts`.

## Environment Variables
- `NEXT_PUBLIC_API_BASE` (required): defaults to `https://api.bitechx.com` if not set.

Create `.env.local`:
```
NEXT_PUBLIC_API_BASE="https://api.bitechx.com"
```

## Running Locally
1. Install dependencies: `npm install`
2. Dev server: `npm run dev`
3. Lint: `npm run lint`
4. Format: `npm run format`
5. Build: `npm run build`

## Auth and Headers
- Login screen posts `{ email }` to `/auth` and stores `{ email, token }` in Redux + `localStorage` (`btx_auth`).
- All RTK Query requests automatically set:
  - `Authorization: Bearer <jwt>`
  - `Content-Type: application/json`
- No multipart or form-data anywhere.

## API Outline (from assignment)
Base URL: https://api.bitechx.com
- Auth: `POST /auth` -> `{ token }`
- Products:
  - `GET /products`
  - `GET /products?offset=<n>&limit=<m>`
  - `GET /products?categoryId=<uuid>`
  - `GET /products/search?searchedText=<q>`
  - `GET /products/:slug`
  - `POST /products`
  - `PUT /products/:id`
  - `DELETE /products/:id` (simulates 200, returns id)
- Categories:
  - `GET /categories`
  - `GET /categories?offset=<n>&limit=<m>`
  - `GET /categories/search?searchedText=<q>`

## Manual Test Flows
- Login persists token and adds Authorization header to all requests.
- Products list (12 per page), paginate Prev/Next.
- Search (debounced 350 ms), clears back to list.
- Category filter works with pagination.
- Create validates fields; invalid price shows inline error.
- Edit pre-fills values, re-validates, and redirects to the updated product slug so the details page shows fresh data immediately.
- Delete confirms; page navigates to list. List is optimistically updated and refetched.