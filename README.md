# TransferPro – Global Money Transfer UI

A Vite + React + TypeScript single-page application that showcases a global money transfer experience. The interface highlights competitive currency conversion, onboarding flows, and account management hooks while using modern tooling for state, data, and theme management.

## Features
- **Hero landing page:** Marketing headline, conversion CTAs, and quick stats rendered with reusable UI primitives (`Hero`).
- **Interactive currency converter:** Supports currency selection, swap, transfer fee breakdown, and invokes transfer creation through Redux Toolkit/React Query powered actions (`CurrencyConverter`). Transfer initiation is gated behind authentication so visitors are guided to sign in before starting a send.
- **Authentication & onboarding:** Dedicated `/auth` route with shared sign-in/sign-up form logic powered by the auth hook. Header and hero CTAs deep-link into the experience, and once authenticated the marketing hero hides to focus on transfer tools.
- **Guided transfer steps:** Responsive cards outlining the three-step send flow with live completion stats driven by mocked transfer data (`TransferSteps`).
- **State & data layer:** Redux Toolkit slices for auth and transfer domains combined with TanStack Query for caching, mutations, and background revalidation (`useAuth`, `useTransfers`).
- **API abstractions:** REST and GraphQL clients with MSW-powered mocks to simulate login, transfer, recipient, and exchange-rate endpoints during development.
- **Design system:** Tailwind CSS and shadcn/ui components (buttons, cards, badges, inputs, etc.) with dark/light theme switching via `next-themes`.

## Tech Stack
- [Vite](https://vitejs.dev/) for lightning-fast dev server and build pipeline
- [React 18](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- [React Router](https://reactrouter.com/) for client-side routing
- [Redux Toolkit](https://redux-toolkit.js.org/) and [React Redux](https://react-redux.js.org/) for global state management
- [TanStack Query](https://tanstack.com/query/latest) for server-state caching and mutations
- [Apollo Client](https://www.apollographql.com/docs/react/) for optional GraphQL interactions
- [MSW](https://mswjs.io/) for API mocking in development
- [Tailwind CSS](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/) component patterns for styling
- [lucide-react](https://lucide.dev/) iconography

## Project Structure
```
├── public/                 # Static assets served by Vite
├── src/
│   ├── App.tsx             # Route configuration
│   ├── pages/              # Route-level components (Index, NotFound)
│   ├── components/
│   │   ├── Hero.tsx
│   │   ├── CurrencyConverter.tsx
│   │   ├── TransferSteps.tsx
│   │   ├── common/         # Shared UI (Header)
│   │   └── ui/             # shadcn-derived primitives
│   ├── providers/          # React Query, Redux, Apollo, theme providers
│   ├── hooks/              # Domain hooks (useAuth, useTransfers)
│   ├── store/              # Redux Toolkit slices & typed hooks
│   ├── services/           # REST/GraphQL clients & MSW mocks
│   ├── constants/          # App constants, endpoints, GraphQL documents
│   └── types/              # TypeScript interfaces shared across domains
└── vite.config.ts          # Vite configuration
```

## Getting Started
1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Start the development server**
   ```bash
   npm run dev
   ```
   - Opens the app with hot module reloading.
   - [MSW](https://mswjs.io/) mocks are automatically registered (see `src/services/api/mocks`). Set `VITE_ENABLE_API_MOCKS=false` in a `.env` file to disable mocks and forward requests to a live backend.
   - Configure REST and GraphQL endpoints with `VITE_API_BASE_URL` (REST) and `VITE_GRAPHQL_URL` (GraphQL). When `VITE_GRAPHQL_URL` is omitted, the client falls back to `/graphql` or derives an absolute URL from `VITE_API_BASE_URL` when it points to a remote host.
3. **Build for production**
   ```bash
   npm run build
   ```
4. **Preview the production build**
   ```bash
   npm run preview
   ```

## Quality & Tooling
- **Linting:** `npm run lint`
- **Type checking:** TypeScript runs during build; enable your editor's TS/ESLint integrations for the best DX.
- **React Query Devtools:** Enabled in development via `AppProviders` for inspecting cached queries/mutations.

## Data Layer & API Mocking
- REST requests are centralized in `src/services/api/restClient.ts` and GraphQL in `src/services/api/graphqlClient.ts`.
- Domain services (e.g., `transferService`, `authService`) expose typed methods used by Redux thunks and React Query hooks.
- During local development, MSW (`src/services/api/mocks`) intercepts network calls, returning mock auth, transfer, recipient, and exchange-rate data so the UI functions without a live backend.
- Swap out or extend mocks when integrating real APIs. Configure `VITE_API_BASE_URL` to point to your backend and set `VITE_ENABLE_API_MOCKS=false` to bypass the mock service worker.

## Customization Tips
- Update supported currencies in `src/constants/index.ts`.
- Extend Redux slices or add new ones under `src/store/slices` for additional domains (e.g., beneficiaries, transaction history).
- Reuse shadcn/ui primitives from `src/components/ui` to keep styling consistent.
- Theme settings (default theme, system preference) are configured in `AppProviders` via `next-themes`.

## License
This project is provided as-is for demonstration purposes. Integrate with your organization's licensing requirements as needed.
