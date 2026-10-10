# Stock Portfolio Pro Backend

Express API and market-data proxy for Stock Portfolio Pro.

## Local development

From the repository root, run `npm start --prefix backend`; the backend serves the built frontend and API at `http://localhost:3001`.

## Firebase deployment

The repository root `render.yaml` configures a Render web service. Set `MONGODB_URI` in the Render service environment to enable database-backed authentication. Set `REACT_APP_API_BASE_URL` in the frontend build environment to the deployed API URL.

Set `MONGODB_URI` in `backend/.env` to a local MongoDB URL or a reachable MongoDB Atlas connection string. The server still serves market quotes if MongoDB is unavailable; authentication requires MongoDB.
