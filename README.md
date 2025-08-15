# Authentication App

A complete authentication system built with SvelteKit, Auth.js, Drizzle ORM, and Tailwind CSS. This application provides email/password authentication, role-based access control, user management, and profile settings.

## Features

- 🔐 Secure email/password authentication
- 👤 User registration and login
- 🛡️ Role-based access control (user and admin roles)
- 🔑 Password hashing with bcrypt
- 📊 Admin dashboard for user management
- ⚙️ User profile management
- 🎨 Modern UI with Tailwind CSS
- 🗃️ PostgreSQL database with Drizzle ORM

## Tech Stack

- **Frontend**: SvelteKit, Tailwind CSS
- **Authentication**: Auth.js (formerly NextAuth.js)
- **Database**: PostgreSQL with Drizzle ORM
- **Password Hashing**: bcrypt

## Prerequisites

- Node.js (v18 or later)
- PostgreSQL database

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd authentication-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/auth_app
AUTH_SECRET=your-secret-key-at-least-32-chars-long

# Optional: For AI Chatbot (Gemini API)
GEMINI_API_KEY=your-gemini-api-key
```

Replace the database URL with your PostgreSQL connection string and generate a secure random string for AUTH_SECRET.

**For AI Chatbot**: To enable the real AI chatbot, get a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey) and add it to your `.env` file. Without the API key, the chatbot will use mock responses.

### 4. Set up the database

Run the database migrations to create the necessary tables:

```bash
npm run db:generate
npm run db:migrate
```

### 5. Start the development server

```bash
npm run dev
```

The application will be available at http://localhost:5173

## Project Structure

```
├── src/
│   ├── app.css                 # Global CSS with Tailwind directives
│   ├── app.d.ts                # TypeScript declarations
│   ├── app.html                # HTML template
│   ├── hooks.server.ts         # SvelteKit hooks for authentication
│   ├── lib/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ui/             # Base UI components
│   │   │   └── Navbar.svelte   # Navigation component
│   │   └── server/
│   │       ├── auth.ts         # Auth.js configuration
│   │       ├── db/             # Database configuration and schema
│   │       └── services/       # Business logic services
│   └── routes/                 # SvelteKit routes
│       ├── +layout.svelte      # Root layout
│       ├── +layout.server.ts   # Server-side layout load function
│       ├── +page.svelte        # Home page
│       ├── +page.server.ts     # Server-side home page load function
│       ├── admin/              # Admin dashboard routes
│       ├── api/                # API endpoints
│       ├── dashboard/          # User dashboard routes
│       ├── login/              # Login page
│       ├── profile/            # User profile page
│       └── register/           # Registration page
├── static/                     # Static assets
├── drizzle.config.ts          # Drizzle ORM configuration
├── postcss.config.js          # PostCSS configuration for Tailwind
├── svelte.config.js           # SvelteKit configuration
├── tailwind.config.js         # Tailwind CSS configuration
└── package.json               # Project dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run db:generate` - Generate Drizzle migrations
- `npm run db:migrate` - Apply Drizzle migrations

## Features

### Authentication Flow
1. **Registration**: Users register with name, email, and password
2. **Login**: Users login with email and password
3. **Session**: Auth.js creates and manages sessions
4. **Authorization**: Role-based access control for protected routes

### AI Chatbot
- **Intelligent Responses**: Powered by Google's Gemini AI
- **User-Friendly Interface**: Modern chat UI with real-time messaging
- **Fallback Support**: Works with mock responses if no API key is configured
- **Session Integration**: Maintains user context throughout conversations
- **Responsive Design**: Works on desktop and mobile devices

For detailed chatbot documentation, see [CHATBOT_README.md](./CHATBOT_README.md).

## License

MIT
