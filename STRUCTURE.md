# Global Price System Structure

This document outlines the high-level architecture and folder structure for the Global Price project.

## Directory Layout

The repository is organized into a clean, modern separation of concerns, splitting the user interface (frontend) and server logic (backend).

```text
Global-Price/
├── backend/                  # Server-side application logic (Planned)
│   ├── middleware/           # Custom Express middlewares (auth, validation, etc.)
│   ├── models/               # Database schemas and data models
│   ├── routes/               # API endpoint definitions
│   ├── services/             # Core business logic (GP calculation engine)
│   ├── .env                  # Backend environment variables
│   ├── package.json          # Backend dependencies
│   └── server.js             # Main backend application entry point
│
├── frontend/                 # Client-side user interface (React + Vite)
│   ├── public/               # Static assets (3D textures, sounds, favicon)
│   ├── src/                  # React source code
│   │   ├── components/       # Reusable UI components (GlobeBackground, etc.)
│   │   ├── data/             # Mock data or static constants
│   │   ├── pages/            # Main application views (Home, Calculator, etc.)
│   │   ├── types.ts          # TypeScript type definitions
│   │   ├── index.css         # Global styles and Tailwind configuration
│   │   ├── App.tsx           # Main application routing and wrapper
│   │   └── main.tsx          # React DOM mounting point
│   ├── .env.example          # Frontend environment variables template
│   ├── package.json          # Frontend dependencies
│   ├── tsconfig.json         # TypeScript configuration
│   └── vite.config.ts        # Vite bundler configuration
│
├── .gitignore                # Root git ignore file
├── README.md                 # Project vision and feature documentation
└── STRUCTURE.md              # This file (Architectural documentation)
```

## Separation of Concerns

1. **Frontend (`/frontend`)**:
   - Contains all the 3D rendering logic (Three.js) for the interactive globe.
   - Built using React for component-based UI architecture.
   - Vite is used as the lightning-fast build tool and development server.
   - TailwindCSS powers the styling, providing a highly customizable utility-first approach.

2. **Backend (`/backend`)**:
   - Designed to host the API services that calculate the GP metric.
   - Will integrate with external live data APIs (World Bank, Frankfurter).
   - Responsible for the heavier calculation pipelines (Friction Stripping, PPP/CPI inflation correction).

## How it works internally

When the application runs, the **Frontend** serves as the interactive dashboard for the user. As users input their local prices into the calculator, it triggers the **Engine Pipeline**:

1. **Local State**: The frontend captures the value.
2. **API Request (Future)**: Sends the local price and region data to the backend API.
3. **Engine Logic**: The backend strips frictions and calculates the GP anchor value using its live data feeds.
4. **Response & Projection**: The calculated data is sent back to the frontend, which renders the 195-country projection instantly.
