# Self-Service Management App

A modern React-based self-service management application with Redux state management and TypeScript support.

## Features

- Modern React with TypeScript
- Redux Toolkit for state management
- React Router for navigation
- Axios for API calls
- TailwindCSS for styling
- ESLint and Prettier for code quality

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── common/        # Shared components
│   └── layout/        # Layout components
├── features/          # Feature-specific components and logic
│   ├── auth/          # Authentication feature
│   ├── user/          # User management feature
│   └── settings/      # Application settings
├── services/          # API services and utilities
├── store/             # Redux store configuration
│   ├── features/      # Redux slices
│   └── store.ts       # Store configuration
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## State Management

The application uses Redux Toolkit for state management. Each feature has its own slice in the store:

- `authSlice`: Handles authentication state
- `userSlice`: Manages user-related state
- `settingsSlice`: Handles application settings

## API Integration

The application uses Axios for API calls. The base configuration is in `src/services/api.ts`. To add new API endpoints:

1. Create a new service file in `src/services/`
2. Import the base API instance
3. Define your API calls

Example:

```typescript
import api from "./api";

export const userService = {
  getProfile: () => api.get("/user/profile"),
  updateProfile: (data) => api.put("/user/profile", data),
};
```

## Styling

The application uses TailwindCSS for styling. You can find the configuration in `tailwind.config.js`.

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

MIT
