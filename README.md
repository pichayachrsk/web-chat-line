# LINE Web Chat Console

A real-time chat management system for LINE Official Account (OA) designed for administrators to manage conversations and reply to users directly. Built with Next.js, Drizzle ORM, and LINE Messaging API.

## Key Features

- **Real-time Synchronization**: Powered by Server-Sent Events (SSE) to keep messages in sync across the dashboard instantly.
- **Admin Dashboard**: A clean interface to manage active chats, view message history, and send real-time replies.
- **Direct Messaging**: Sends authentic Push Messages via the LINE Messaging API to users' devices.
- **Automated Profile Fetching**: Automatically retrieves user display names and profiles from the LINE Platform when they message the account.
- **Persistent Storage**: Robust data management using Drizzle ORM and SQLite (Turso-ready).
- **Responsive Design**: Fully optimized for mobile and desktop viewing with an adaptive layout.

## Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Database**: SQLite / [Turso](https://turso.tech/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **UI & Styling**: Tailwind CSS & Headless UI
- **API**: [LINE Messaging API SDK](https://github.com/line/line-bot-sdk-nodejs)
- **Real-time**: Server-Sent Events (SSE)

## Getting Started

### 1. Prerequisites

- Node.js 18 or higher
- [LINE Developers](https://developers.line.biz/) account
- A Messaging API Channel with a Channel Access Token and Channel Secret

### 2. Installation

```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```dotenv
LINE_CHANNEL_ACCESS_TOKEN=your_access_token
LINE_CHANNEL_SECRET=your_channel_secret
DATABASE_URL=file:./local.db (or your Turso URL)
DATABASE_AUTH_TOKEN=your_auth_token (if using Turso)
```

### 4. Database Setup

Initialize your database schema:

```bash
npx drizzle-kit push
```

### 5. Running the Application

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to access the console.

## Project Structure

- `src/app/api/`: API Routes for Webhooks, SSE streams, and sending messages.
- `src/components/`: UI Components for the chat interface.
- `src/services/`: Business logic for LINE interactions and message handling.
- `src/repositories/`: Data access layer using Drizzle.
- `src/config/`: Configuration for API routes and LINE SDK.

## Webhook Configuration

1. In your **LINE Developers Console**, navigate to your Messaging API settings.
2. Set the **Webhook URL** to `https://your-domain.com/api/webhook`.
3. Enable **Use webhook**.
4. (Optional) Disable **Auto-response messages** and **Greeting messages** in the [LINE Official Account Manager](https://chat.line.biz/) to use this console exclusively.

## Additional Information

- **SSE Stream**: The client connects to `/api/messages/stream` for real-time updates.
- **Administration**: Every message sent from the console is a real Push Message charged against your LINE Messaging API quota.
