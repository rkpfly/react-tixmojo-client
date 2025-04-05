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