# NodeTS Starter Kit

A robust, production-ready starter kit for building RESTful APIs using **Node.js**, **TypeScript**, **Express**, and **MongoDB**. This project is designed for scalability, maintainability, and best practices, with batteries-included features for authentication, validation, linting, and more.

---

## Features

- **TypeScript-first**: Full type safety across the codebase
- **Express.js**: Fast, unopinionated, minimalist web framework
- **MongoDB with Mongoose**: ODM for MongoDB
- **Authentication & Authorization**: JWT-based, with roles and permissions
- **Validation**: Joi-based request validation
- **Security**: Helmet, rate limiting, CORS, XSS & NoSQL injection protection
- **Linting & Formatting**: ESLint (Airbnb + Security + Prettier)
- **Error Handling**: Centralized, consistent error responses
- **Environment Configuration**: dotenv
- **PM2**: Production process management
- **Nodemon**: Auto-reload in development
- **Pre-commit Hooks**: lint-staged + Husky ready

---

## Getting Started

### 1. Clone the repository
```sh
git clone https://github.com/mayanxoni/nodets-starter-kit.git
cd nodets-starter-kit
```

### 2. Install dependencies
```sh
npm install
```

### 3. Environment setup
Copy `.env.example` to `.env` and adjust the variables as needed:
```sh
cp .env.example .env
```

### 4. Build the project
```sh
npm run build
```

### 5. Run in development mode (auto-reloads on save)
```sh
npm run dev
```

### 6. Run in production mode
```sh
npm start
```

---

## Project Structure

```
nodejs-starter-kit/
├── src/
│   ├── config/           # App configuration (env, tokens, logger, etc)
│   ├── controllers/      # Express route controllers
│   ├── middlewares/      # Custom Express middlewares
│   ├── models/           # Mongoose models
│   ├── routes/           # Express routes (v1, auth, user, etc)
│   ├── services/         # Business logic & database interaction
│   ├── utils/            # Utility functions and helpers
│   └── app.ts            # Express app setup
│   └── index.ts          # App entrypoint
├── types/                # Custom type definitions
├── dist/                 # Compiled JS output (after build)
├── .env                  # Environment variables
├── package.json          # Project metadata & scripts
├── tsconfig.json         # TypeScript configuration
├── .eslintrc.json        # ESLint configuration
├── .prettierrc           # Prettier configuration
└── README.md             # This file
```

---

## Scripts

| Script         | Description                        |
|----------------|------------------------------------|
| `npm run dev`  | Start server with auto-reload      |
| `npm run build`| Compile TypeScript to `dist/`      |
| `npm start`    | Start server with PM2 (production) |
| `npm run lint` | Run ESLint                         |
| `npm run lint:fix` | Auto-fix lint errors           |
| `npm run prettier` | Check code formatting           |
| `npm run prettier:fix` | Auto-format code            |

---

## Linting & Formatting
- ESLint and Prettier are enforced on staged files via lint-staged (see `.lintstagedrc.json`).
- Linting patterns and rules are managed in `.eslintrc.json`.

---

## Environment Variables
See `.env.example` for all available environment variables and their descriptions.

---

## Extending the Starter Kit
- Add new models to `src/models/` and services to `src/services/`.
- Add new routes/controllers under `src/routes/` and `src/controllers/`.
- Use middlewares in `src/middlewares/` for authentication, validation, etc.
- Add custom types to `types/` and include them in `tsconfig.json`.

---

## License

MIT © Mayank Soni

---

## Credits
Inspired by best practices from the Node.js, TypeScript, and Express communities.
