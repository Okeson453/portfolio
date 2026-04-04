# Local Development Setup

Get this portfolio running on your machine in 5 minutes.

## System Requirements

- **Node.js:** 18.17.0 or higher ([download](https://nodejs.org))
- **npm:** 9.0.0 or higher
- **PostgreSQL:** 14+ (local or cloud) — [PostgreSQL docs](https://www.postgresql.org/download/)
- **Git:** Latest version

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/okeson453/portfolio.git
cd portfolio
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in all required variables. See [docs/ENVIRONMENT.md](./ENVIRONMENT.md) for details.

### 4. Set Up the Database

If using a local PostgreSQL instance:

```bash
npm run db:push
npm run db:seed  # Optional: populate with sample data
```

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run test` | Run tests |
| `npm run lint` | Check code style |
| `npm run type-check` | Check TypeScript types |
| `npm run format` | Format code with Prettier |

## Troubleshooting

### Port 3000 Already in Use

```bash
# Kill the process using port 3000
npx kill-port 3000

# Or specify a different port
npm run dev -- -p 3001
```

### Database Connection Error

```bash
# Verify PostgreSQL is running
# Update DATABASE_URL in .env.local with correct credentials
# Then re-run:
npm run db:push
```

### Build Fails

```bash
# Clear Next.js cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

## VS Code Extensions (Recommended)

- **ES7+ React/Redux/React-Native snippets** — dsznajder.es7-react-js-snippets
- **Prettier** — esbenp.prettier-vscode
- **ESLint** — dbaeumer.vscode-eslint
- **Thunder Client** or **REST Client** — for API testing
- **PostgreSQL** — cweijan.vscode-postgresql (optional)

## Next Steps

1. Read [docs/ARCHITECTURE.md](./ARCHITECTURE.md) to understand the project structure
2. Read [docs/CONTRIBUTING.md](./CONTRIBUTING.md) to understand development workflow
3. Check out [docs/SECURITY.md](./SECURITY.md) to understand security practices
