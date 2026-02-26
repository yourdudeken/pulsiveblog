# Pulsiveblog Frontend

The user interface for the Pulsiveblog platform. Built with React, it features dynamic Markdown editing, live repository syncing, and a modern aesthetic powered by Tailwind CSS and Framer Motion.

## Tech Stack

- React (via Vite)
- Tailwind CSS
- React Router DOM
- Framer Motion
- Axios
- Lucide React
- Markdown to JSX

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- A running instance of the Pulsiveblog Backend API.

### Installation

1. Navigate to the frontend directory:
   cd frontend
2. Install dependencies:
   npm install

### Configuration

Create an environment file:
cp .env.example .env

Update the `.env` file with your backend API URL if different from the default:
VITE_API_URL=http://localhost:8080/api

### Running the Development Server

To start the frontend application wrapper:
npm run dev

The application will typically be available at http://localhost:5173.

## Features

- Seamless GitHub OAuth login integration.
- Live-preview split pane Markdown editor.
- Drag and drop image uploading with base64 conversion and GitHub repo committing.
- Automated public repository generation.
- Responsive, dark-mode optimized glassmorphism design.
