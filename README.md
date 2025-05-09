# Movie App Frontend

A modern React Native application for browsing movies and managing watchlists.

## Features

- User authentication (login/register)
- Browse movies with details
- Create and manage watchlists
- Add/remove movies from watchlists
- User profile management
- Modern and responsive UI

## Tech Stack

- React Native
- Expo
- TypeScript
- Axios for API calls
- React Navigation
- Expo Router

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Emulator

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/movie-app-frontend.git
cd movie-app-frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

4. Run on your preferred platform:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Press `w` for web browser

## Project Structure

```
src/
├── app/                 # Main application screens
│   ├── _layout.tsx     # Navigation layout
│   ├── index.tsx       # Home screen
│   ├── login.tsx       # Login screen
│   ├── register.tsx    # Registration screen
│   ├── profile.tsx     # User profile screen
│   ├── movie/          # Movie-related screens
│   └── watchlist/      # Watchlist-related screens
├── api/                # API configuration and endpoints
├── components/         # Reusable components
├── constants/         # App constants and theme
├── hooks/             # Custom React hooks
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

## API Integration

The app integrates with a backend API for:
- User authentication
- Movie data
- Watchlist management
- User profile

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
