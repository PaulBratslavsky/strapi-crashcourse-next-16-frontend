# Next.js Migration

This is the Next.js version of the TanStack Start application, migrated to use Next.js 16+ with App Router and Turbopack.

## Features

- **Next.js 16+** with App Router
- **Turbopack** for fast development builds
- **TypeScript** with strict configuration
- **Tailwind CSS** with identical styling to the original app
- **Vitest** for testing
- **ESLint & Prettier** for code quality
- **React Query** for client-side data fetching
- **Strapi SDK** integration

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment variables:
   ```bash
   cp .env.local.example .env.local
   ```

3. Update the environment variables in `.env.local` with your Strapi configuration.

4. Run the development server with Turbopack:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run test` - Run tests with Vitest
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run check` - Format and lint code

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # React components
│   ├── ui/             # UI components (Radix UI)
│   ├── retroui/        # Custom UI components
│   ├── blocks/         # Content block components
│   └── custom/         # Custom application components
├── data/               # Data fetching utilities
├── lib/                # Utility functions
├── types/              # TypeScript type definitions
└── middleware/         # Next.js middleware
```

## Migration Status

This project structure is ready for component and functionality migration from the TanStack Start application.# strapi-crashcourse-next-16-frontend
