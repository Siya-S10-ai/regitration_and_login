# Customer Portal

A small Node.js customer registration and login application built with Express, MongoDB/Mongoose, bcrypt, and sessions.

## Prerequisites

- Node.js 18 or newer
- npm
- A reachable MongoDB or MongoDB Atlas database

## Setup

From the repository root:

```bash
npm install
```

Create a `.env` file in the repository root. Add your MongoDB connection string:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
```

Do not commit `.env` or share database credentials.

Start the application with:

```bash
node customer_app.js
```

Open [http://localhost:3001](http://localhost:3001) in a browser.

## Application URLs

- `/` serves the home page.
- `/static/login.html` displays the login form.
- `/static/register.html` displays the registration form.

## API Routes

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/api/login` | Authenticates an existing customer. |
| `POST` | `/api/register` | Creates a customer with a bcrypt-hashed password. |
| `GET` | `/api/logout` | Ends the current session and redirects home. |

Customer records contain a username, password, email address, and age. The application uses the `customerDB` database name when connecting through Mongoose.

## Project Structure

```text
customer_app.js       Express server and routes
customer.js           Mongoose customer model
frontend/             HTML pages and static assets
package.json          Dependencies and npm scripts
.env                  Local MongoDB configuration (not committed)
```

## Current Limitations

- `npm test` is a placeholder script and currently exits with an error because automated tests have not been added.
- The session uses an in-memory store and a hard-coded secret, so the current configuration is intended for development rather than production.