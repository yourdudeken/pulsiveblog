# Pulsiveblog

Pulsiveblog is a modern, Git-powered blogging platform. It leverages GitHub repositories as a headless CMS, allowing users to own their content natively in Markdown while navigating a fast, beautiful frontend.

## Architecture

This project is organized into two distinct directories, establishing a clean separation of concerns:

- /backend: An Express.js REST API handling GitHub OAuth, repository interactions via Octokit, and minimal data caching via MongoDB.
- /frontend: A React application built with Vite and Tailwind CSS, featuring a rich Markdown editor and live community feeds.

## Getting Started

To run the application locally, refer to the respective README files in the frontend and backend directories.

### Environment Setup

Before running the application, ensure you have set up the necessary environment variables in both systems.

1. Navigate to the backend directory, copy the example environment file to `.env`, and fill in the required GitHub OAuth, MongoDB, and encryption keys.
2. Navigate to the frontend directory, copy the example environment file to `.env`, and ensure the API URL points to your specific local backend address.
