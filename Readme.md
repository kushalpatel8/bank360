# Bank360 🏦

Bank360 is a cutting-edge, AI-powered banking dashboard and CRM designed to empower bank agents and managers. It provides comprehensive tools for customer relationship management, risk assessment, churn prediction, and intelligent assistance via advanced AI integrations.

## 🌟 Key Features

- **Comprehensive Dashboard:** High-level overview of essential banking metrics and performance indicators.
- **Customer Management:** Detailed views of customer profiles, interactions, and financial standing.
- **AI Assistant:** Integrated Groq and Langchain-powered chatbot to assist agents with customer queries, data retrieval, and task automation.
- **Churn Prediction:** Proactively identify and manage at-risk customers to improve retention.
- **Risk Assessment:** Advanced risk profiling and segmentation tools.
- **Interaction & Follow-up Tracking:** Log customer interactions and schedule follow-ups seamlessly.
- **Rich Analytics:** Interactive data visualization and reporting powered by Recharts.
- **Role-based Authentication:** Secure access control using Clerk authentication.

## 💻 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **UI & Styling:** React 19, [Tailwind CSS v4](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/), [Base UI](https://base-ui.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) (with Mongoose)
- **Caching & Data Storage:** [Upstash Redis](https://upstash.com/)
- **Authentication:** [Clerk](https://clerk.com/)
- **AI Integration:** [Langchain](https://js.langchain.com/) + [Groq](https://groq.com/)
- **Utilities:** Date-fns, Papaparse (CSV), Recharts

## 🚀 Getting Started

### Prerequisites

Ensure you have Node.js (v20+) installed on your machine.

### 1. Clone the repository and install dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root of your project and populate it with the required keys. You must provide your own API keys for external services.

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Upstash Redis
UPSTASH_REDIS_REST_URL=your_upstash_rest_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_rest_token
REDIS_URL=your_redis_url

# AI Integration
GROQ_API_KEY=your_groq_api_key

# Application Settings
ADMIN_TOKEN=your_admin_token
```

### 3. Import Sample Data (Optional)

If you need to seed your database with initial customer data from a CSV, run the following script:

```bash
npm run import:csv
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 📂 Project Structure

- `/app`: Next.js App Router pages (Dashboard, Admin, Customers, AI Assistant, etc.)
- `/components`: Reusable UI components (Shadcn UI, custom elements)
- `/models`: Mongoose database schemas (User, Customer, Interaction, FollowUp, AIConversation)
- `/lib`: Utility functions and configuration files
- `/scripts`: Custom scripts (e.g., CSV imports)
- `/public`: Static assets

## 🛠️ Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint to check for code issues.
- `npm run import:csv`: Executes the CSV import script using ts-node.
