# Brainweave

Brainweave is a modern web application built with Next.js, TypeScript, and pnpm. It features modular architecture, authentication, and a clean UI.

## Features

- Next.js 14 app directory structure
- TypeScript for type safety
- Modular components and hooks
- Authentication (sign-in, sign-up, email verification)
- Dashboard and notes modules
- UI components (cards, buttons, forms, etc.)
- Linting and build workflows via GitHub Actions

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm

### Installation

```fish
pnpm install
```

### Development

```fish
pnpm dev
```

### Lint

```fish
pnpm lint
```

### Build

```fish
pnpm build
```

## Project Structure

- `src/app` - Application pages and layouts
- `src/components` - Shared UI components
- `src/db` - Database helpers and schema
- `src/hooks` - Custom React hooks
- `src/lib` - Utility libraries
- `src/modules` - Feature modules (app, auth, notes)
- `src/trpc` - tRPC client/server setup
- `public` - Static assets

## Contributing

Pull requests are welcome! Please lint and build before submitting.

## License

MIT
