# TixMojo Events Platform

A full-stack event booking platform built with React and Node.js.

## Project Structure

- `/src` - React frontend
- `/server` - Express API server

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Running the Application

#### Option 1: Run Both Frontend and Backend Together

```bash
# In the root directory
npm install --legacy-peer-deps
cd server && npm install
cd ..
npm run dev:all
```

This will start both the frontend and backend concurrently:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

#### Option 2: Run Separately

1. Start the API Server with nodemon (auto-restarts on changes):

```bash
cd server
npm install
npm run dev
```

The server will run on http://localhost:5000.

2. Start the Frontend:

In a separate terminal:

```bash
# In the root directory
npm install --legacy-peer-deps
npm run dev
```

The React app will run on http://localhost:5173.

## Features

- Browse and search events
- View event details
- Filter events by location
- Featured events and carousel
- Responsive design
- API-driven architecture

## Frontend Technologies

- React
- React Router
- Vite
- React Icons
- React Slick (carousel)
- i18next (internationalization)

## Backend Technologies

- Express
- Node.js
- Cors
- Helmet (security)
- Morgan (logging)

## API Endpoints

- `GET /api/events` - Get all events (supports location filter)
- `GET /api/events/spotlight` - Get spotlight/featured events
- `GET /api/events/flyers` - Get carousel flyers
- `GET /api/events/locations` - Get available locations
- `GET /api/events/locations/:location` - Get location details
- `GET /api/events/location/:location` - Get location-specific events
- `GET /api/events/server-data` - Get raw events data
- `GET /api/events/:id` - Get event details by ID

## Development

### Environment Variables

This application uses environment variables for configuration. Create a `.env` file in the project root based on the provided `.env.example`. Key variables include:

```bash
# API URL for backend connection
VITE_API_URL=http://localhost:5000/api

# Google OAuth Client ID (required for authentication)
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com

# Development environment indicator
VITE_ENV=development

# Enable detailed logging
VITE_ENABLE_LOGGING=true
```

### Google OAuth Setup

To configure Google OAuth for the application, follow these steps:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Select "Web application" as the application type
6. Add the following authorized JavaScript origins:
   - `http://localhost:3000` (local development with npm run dev)
   - `http://localhost:5173` (local development with Vite)
   - Your production URL (if applicable)
7. Add the following authorized redirect URIs:
   - `http://localhost:3000`
   - `http://localhost:5173`
   - `http://localhost:3000/login`
   - `http://localhost:5173/login`
   - Your production URLs (if applicable)
8. Click "Create" and note your Client ID
9. Add your Client ID to the `.env` file:
   ```
   VITE_GOOGLE_CLIENT_ID=123456789012-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
   ```

**Important Notes:**
- The "redirect_uri_mismatch" error occurs when Google OAuth doesn't recognize the redirect URI being used.
- The application uses "popup" mode which should work without explicit redirect URIs, but adding them in the Google console improves reliability.
- Never commit your `.env` file to version control - it's included in .gitignore for security.
- If using Netlify or other hosting platforms, set these environment variables in their deployment settings.

### Backend Auto-Restart with Nodemon

The server uses nodemon for development which automatically restarts when files change. Key features:

- Watches all JavaScript files in the server directory
- Ignores node_modules and test files
- 500ms delay to prevent excessive restarts
- Nodemon configuration in `/server/nodemon.json`

### Using the API

All API endpoints return data in the following format:

```json
{
  "success": true,
  "data": [...] or {...}
}
```

For errors:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error message in development"
}
```