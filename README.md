# Vite React Shadcn TypeScript Starter

A modern, full-stack financial transfer application built with React, TypeScript, and shadcn/ui components. This starter template provides a robust foundation for building complex web applications with state management, API integration, and comprehensive UI components.

## 🔐 Authentication

This application supports two authentication modes:

- **WSO2 Identity Server** (Production): OAuth2 + SCIM2 integration
- **Mock Authentication** (Development): Local testing without WSO2

Toggle between modes using `VITE_USE_MOCK_AUTH` in `.env` file.

📖 **Quick Start**: See [LOGIN_FIX_SUMMARY.md](./LOGIN_FIX_SUMMARY.md) for setup instructions.

## 🚀 Key Features

- **Modern React Architecture**: React 18 with TypeScript for type-safe development
- **State Management**: Redux Toolkit with React-Redux for global state management
- **Server State**: TanStack Query for efficient data fetching, caching, and synchronization
- **UI Components**: shadcn/ui component library with Tailwind CSS styling
- **Authentication UX**: Modal-based sign-in and sign-up dialog that can be triggered from anywhere in the app
- **API Integration**: REST and GraphQL clients for real API communication
- **Theme Support**: Dark/light mode with next-themes
- **Development Tools**: ESLint, TypeScript, hot module reloading

## 🛠 Tech Stack

| Category | Technologies |
|----------|-------------|
| **Build Tool** | [Vite](https://vitejs.dev/) |
| **Frontend** | [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Routing** | [React Router](https://reactrouter.com/) |
| **State Management** | [Redux Toolkit](https://redux-toolkit.js.org/) + [React Redux](https://react-redux.js.org/) |
| **Server State** | [TanStack Query](https://tanstack.com/query/latest) |
| **GraphQL** | [Apollo Client](https://www.apollographql.com/docs/react/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Forms** | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |

## 📁 Project Structure

```
├── public/                 # Static assets served by Vite
├── src/
│   ├── App.tsx             # Main app component with route configuration
│   ├── main.tsx            # Application entry point
│   ├── pages/              # Route-level components
│   │   ├── Index.tsx       # Home page component
│   │   └── NotFound.tsx    # 404 page component
│   ├── components/
│   │   ├── Hero.tsx        # Landing page hero section
│   │   ├── CurrencyConverter.tsx  # Currency conversion component
│   │   ├── TransferSteps.tsx      # Transfer workflow component
│   │   ├── auth/
│   │   │   └── AuthDialog.tsx     # Modal experience for sign-in and sign-up
│   │   ├── common/         # Shared components
│   │   │   └── Header.tsx  # Navigation header with auth triggers
│   │   └── ui/             # shadcn/ui primitives
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       └── ...
│   ├── providers/          # Context providers
│   │   ├── AppProviders.tsx     # Root provider wrapper
│   │   ├── AuthDialogProvider.tsx # Global controls for the auth dialog modal
│   │   ├── ReactQueryProvider.tsx
│   │   ├── ReduxProvider.tsx
│   │   ├── ApolloProvider.tsx
│   │   └── ThemeProvider.tsx
│   ├── hooks/              # Custom hooks
│   │   ├── useAuth.ts      # Authentication hook
│   │   ├── useTransfers.ts # Transfer operations hook
│   │   └── ...
│   ├── store/              # Redux store configuration
│   │   ├── index.ts        # Store setup
│   │   ├── hooks.ts        # Typed hooks
│   │   └── slices/         # Redux slices
│   │       ├── authSlice.ts
│   │       └── transferSlice.ts
│   ├── services/           # API services and clients
│   │   ├── api/
│   │   │   ├── restClient.ts    # REST API client
│   │   │   └── graphqlClient.ts # GraphQL client
│   │   ├── authService.ts
│   │   ├── wso2AuthService.ts
│   │   └── transferService.ts
│   ├── constants/          # Application constants
│   │   ├── index.ts        # General constants
│   │   ├── endpoints.ts    # API endpoints
│   │   └── graphqlDocuments.ts
│   ├── types/              # TypeScript type definitions
│   │   ├── auth.ts
│   │   ├── transfer.ts
│   │   └── api.ts
│   ├── lib/                # Utility functions
│   │   └── utils.ts        # shadcn/ui utilities
│   └── styles/             # Global styles
│       └── globals.css
├── vite.config.ts          # Vite configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Project dependencies and scripts
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)

### Installation & Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment configuration** (optional)
   Create a `.env` file in the root directory:
   ```bash
   # API Configuration
   VITE_API_BASE_URL=http://localhost:3001/api
   VITE_GRAPHQL_URL=http://localhost:3001/graphql
   
   # WSO2 Authentication (optional)
   VITE_WSO2_CLIENT_ID=your_client_id
   VITE_WSO2_CLIENT_SECRET=your_client_secret
   VITE_USERMANAGEMENTPORT=9444
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   - Opens at `http://localhost:5173` with hot module reloading
   - React Query Devtools available in development mode

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 📋 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run build:dev` | Build with development mode |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code linting |

## 🎨 UI Components

This project uses [shadcn/ui](https://ui.shadcn.com/) components built on top of Radix UI primitives:

- **Layout**: Cards, Separators, Aspect Ratio
- **Navigation**: Dropdown Menu, Navigation Menu, Tabs
- **Inputs**: Form controls, Select, Checkbox, Radio Group
- **Feedback**: Alerts, Toast, Progress, Tooltips
- **Overlays**: Dialog, Popover, Hover Card
- **Data Display**: Avatar, Badge, Table

All components are fully customizable and follow consistent design patterns.

## 🔧 State Management Architecture

### Global State (Redux Toolkit)
- **Auth Slice**: User authentication, session management
- **Transfer Slice**: Transfer operations, form state
- Centralized store with typed hooks (`useAppDispatch`, `useAppSelector`)

### Server State (TanStack Query)
- Automatic caching and background revalidation
- Optimistic updates for better UX
- Error handling and retry logic
- Development tools for query inspection

### Local State (React Hook Form + Zod)
- Form validation with TypeScript-first schema validation
- Optimized re-renders with controlled components
- Built-in error handling and field validation

## 🌐 API Integration

### REST API Client
- Centralized HTTP client with interceptors
- Authentication token management
- Error handling and retry logic
- TypeScript interfaces for all endpoints

### GraphQL Client (Apollo)
- Optional GraphQL integration with Apollo Client
- Automatic query caching and normalization
- Real-time subscriptions support
- Developer tools integration


## 🎨 Theming & Styling

### Tailwind CSS
- Utility-first CSS framework
- Responsive design patterns
- Custom design system integration

### Dark/Light Mode
- Automatic system preference detection
- Manual theme switching
- Persistent theme selection
- CSS variables for dynamic theming

## 📦 Key Dependencies

### Core Dependencies
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "@reduxjs/toolkit": "^2.9.0",
  "@tanstack/react-query": "^5.83.0",
  "react-router-dom": "^6.30.1"
}
```

### UI & Styling
```json
{
  "tailwindcss": "^3.4.17",
  "@radix-ui/react-*": "^1.x.x",
  "lucide-react": "^0.462.0",
  "next-themes": "^0.3.0"
}
```

### Development Tools
```json
{
  "vite": "^5.4.19",
  "typescript": "^5.8.3",
  "eslint": "^9.32.0"
}
```

## 🔧 Configuration Files

### Vite Configuration
- React plugin with SWC for fast refresh
- Path aliases (@/ for src/)
- Development server configuration

### TypeScript Configuration
- Strict mode enabled
- Path mapping for clean imports
- Modern target (ES2020)

### Tailwind Configuration
- Custom color scheme
- shadcn/ui integration
- Animation utilities

## 🚀 Deployment

This application can be deployed to any static hosting service:

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting provider:
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - GitHub Pages

### Environment Variables
Make sure to configure environment variables in your deployment platform:
- `VITE_API_BASE_URL`: Your production API URL
- `VITE_GRAPHQL_URL`: Your GraphQL endpoint
- `VITE_WSO2_CLIENT_ID`: WSO2 client ID (if using WSO2 authentication)
- `VITE_WSO2_CLIENT_SECRET`: WSO2 client secret (if using WSO2 authentication)
- `VITE_USERMANAGEMENTPORT`: WSO2 user management port

## 🤝 Development Workflow

### Adding New Features
1. Create feature components in `src/components/`
2. Add necessary types in `src/types/`
3. Implement API services in `src/services/`
4. Create Redux slices if global state is needed
5. Add React Query hooks for server state management

### Code Quality
- ESLint enforces coding standards
- TypeScript ensures type safety
- Consistent import organization
- Component composition patterns

## 📄 License

This project is provided as-is for demonstration and educational purposes. Please review and comply with individual package licenses and your organization's requirements before production use.

---