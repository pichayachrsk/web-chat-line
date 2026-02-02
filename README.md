# LINE Web Chat Console

A comprehensive chat management system for LINE Official Account (OA) that supports both Admin Console and User Simulation (User Mode) in a single interface. Built with Next.js, Drizzle ORM, and LINE Messaging API.

**Live Demo:** [https://web-chat-line.vercel.app/](https://web-chat-line.vercel.app/)

## Key Features

- **Real-time Synchronization**: Powered by Server-Sent Events (SSE) to keep messages in sync across devices without polling.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop viewing with an adaptive layout.
- **Dual Simulation Mode**:
  - **Admin Mode**: Full administrator console to manage active chats and reply via LINE Messaging API.
  - **User Mode**: Developer-friendly simulation to act as any user (configurable via `LINE_USER_ID`) for testing end-to-end flows.
- **Automated Profile Fetching**: Automatically retrieves and updates user display names from the LINE Platform.
- **Persistent Storage**: Robust data management using Drizzle ORM and Turso (Edge SQLite).

## Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Database**: [Turso](https://turso.tech/) (Edge-ready SQLite)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **UI & Styling**: Tailwind CSS 4 & Headless UI
- **API**: [LINE Messaging API SDK](https://github.com/line/line-bot-sdk-nodejs)
- **Real-time**: Server-Sent Events (SSE)

## Getting Started

### 1. Prerequisites

- Node.js 18 or higher
- [LINE Developers](https://developers.line.biz/) account (for Messaging API credentials)

### 2. Installation

```bash
npm install
# or
yarn install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory and add the following variables:

```dotenv
LINE_CHANNEL_ACCESS_TOKEN=your_access_token
LINE_CHANNEL_SECRET=your_channel_secret
LINE_USER_ID=your_test_user_id
DATABASE_URL=libsql://your-db-name-user.turso.io
DATABASE_AUTH_TOKEN=your_auth_token
```

### 4. Database Setup

Run the following command to sync your database schema:

```bash
npx drizzle-kit push
```

### 5. Running the Application

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/app/api/`: API Routes for Webhooks and message management.
- `src/components/`: UI Components (ChatWindow, Sidebar, ChatBubble).
- `src/services/`: Business Logic for LINE and Message services.
- `src/repositories/`: Data Access Layer (Drizzle Repository).
- `src/config/`: Configuration files (API Paths, LINE Config).
- `src/lib/`: Helper utilities (e.g., ApiResponse).

## Usage Guide

- **ADMIN Mode**: Used for actual administration. Replying in this mode sends a real Push Message via the LINE API to the user's device.
- **USER Mode**: Simulated environment for the user defined in `LINE_USER_ID`. Typing here simulates an incoming message, allowing you to test the console's reception of messages without needing a physical device.

## Additional Information

- **Webhook URL**: Set this in the LINE Developers Console to `https://your-domain.com/api/webhook`
- **SSE**: The system utilizes a stream at `/api/messages/stream` to push new events from the server to the client instantly.

## Deployment on Vercel

1. **Database**: Create a database on [Turso](https://turso.tech/) and obtain your `DATABASE_URL` and `DATABASE_AUTH_TOKEN`.
2. **Repository**: Push your code to a private GitHub repository.
3. **Vercel Setup**:
   - Import the project into Vercel.
   - Configure all environment variables listed in `.env.local`.
4. **Finalize**: Update your **Webhook URL** in the LINE Developers Console with your new Vercel production domain.
