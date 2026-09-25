# Bank360 — Product Requirements Document

## 1. Product Overview

Bank360 is an AI-assisted Customer Relationship Management and Banking Intelligence
platform designed for relationship managers and banking teams.

The platform combines:

- Customer 360 profiles
- Customer relationship management
- Customer segmentation
- Customer engagement analytics
- Churn analysis
- Risk indicators
- Follow-up management
- AI-assisted customer insights
- Banking analytics dashboards

The system uses a Kaggle banking dataset in CSV format as the initial
analytics dataset and MongoDB as the application's primary database.

---

## 2. Problem Statement

Relationship managers need a consolidated view of customers, their financial
relationships, engagement patterns, risk indicators, and follow-up activities.

Traditional dashboards often separate these areas.

Bank360 provides a unified interface where a relationship manager can:

1. Search customers
2. View a Customer 360 profile
3. Understand customer engagement
4. Review relationship history
5. Track follow-ups
6. View risk indicators
7. Analyze customer segments
8. Use an AI assistant to summarize customer information

The project is inspired by the Customer 360 and relationship-management
responsibilities described in the provided banking role material.

---

## 3. Goals

### Primary Goals

- Build a production-style Next.js banking CRM.
- Import and process Kaggle banking data.
- Store application data in MongoDB.
- Provide Customer 360 dashboards.
- Provide customer analytics.
- Provide segmentation and churn analytics.
- Provide AI-assisted customer insights.
- Implement authentication and authorization using Clerk.
- Use Redis for caching and rate limiting.
- Provide a responsive shadcn/ui + Tailwind interface.

### Secondary Goals

- Demonstrate full-stack TypeScript development.
- Demonstrate AI integration using LangChain.
- Demonstrate data-driven UI development.
- Demonstrate clean architecture and separation of concerns.

---

## 4. Target Users

### Relationship Manager

Can:

- View assigned customers
- Search customers
- View Customer 360
- Record interactions
- Create follow-ups
- Review customer insights
- Use AI assistant

### Analyst

Can:

- View analytics
- Analyze customer segments
- Analyze churn
- Review risk indicators
- Explore customer behavior

### Administrator

Can:

- Manage users
- View system analytics
- Manage customer records
- Review audit information

---

## 5. Core Features

## 5.1 Authentication

Use Clerk for:

- Sign in
- Sign up
- Session management
- Role-based access
- Protected routes

Roles:

- ADMIN
- RELATIONSHIP_MANAGER
- ANALYST

---

## 5.2 Customer Management

Features:

- Customer list
- Search
- Filtering
- Sorting
- Pagination
- Customer profile
- Customer status
- Customer segment

Example:

Customer
- ID
- Name
- Age
- Location
- Balance
- Credit Score
- Products
- Engagement
- Risk
- Churn status

---

## 5.3 Customer 360

Customer 360 provides a consolidated view of:

- Personal information
- Financial profile
- Banking products
- Engagement
- Interaction history
- Follow-ups
- Risk indicators
- AI-generated insights

---

## 5.4 Customer Segmentation

The platform categorizes customers using available behavioral and
financial attributes.

Example segments:

- New Customer
- Active Customer
- Low Engagement
- High Engagement
- Loan-focused
- Investment-focused
- Dormant

The segmentation implementation may use clustering or rule-based
segmentation depending on the final dataset.

---

## 5.5 Churn Analytics

The platform displays customer churn information.

Possible outputs:

- Churn probability
- Churn category
- Engagement level
- Customer activity
- Retention indicators

The application should clearly distinguish between a model prediction
and an actual historical churn label.

---

## 5.6 Risk Dashboard

Display:

- Risk score
- Risk category
- Relevant customer attributes
- Risk flags
- Compliance status

The system should present these as analytical indicators rather than
automatically making financial decisions.

---

## 5.7 Interaction Management

Relationship managers can record:

- Calls
- Meetings
- Emails
- Customer queries
- Notes
- Outcomes

Each interaction contains:

- Customer
- RM
- Interaction type
- Date
- Notes
- Outcome

---

## 5.8 Follow-up Management

Features:

- Create follow-up
- Assign follow-up
- Due date
- Priority
- Status
- Notes

Statuses:

- PENDING
- IN_PROGRESS
- COMPLETED
- CANCELLED

---

## 5.9 AI Assistant

LangChain-powered assistant.

The assistant can:

- Summarize customer information
- Explain customer engagement
- Summarize interaction history
- Generate customer profile summaries
- Answer questions about available customer data
- Help relationship managers understand dashboard information

Example:

"What are the important things to know about this customer?"

The AI response should be grounded in the customer's available application
data.

---

## 5.10 Dashboard

Dashboard KPIs:

- Total Customers
- Active Customers
- New Customers
- High-Risk Customers
- Churn Risk
- Customer Engagement
- Follow-ups
- Product Adoption

Charts:

- Customer segments
- Churn distribution
- Engagement distribution
- Customer acquisition
- Product adoption

---

## 5.11 Redis

Redis will be used for:

- Dashboard caching
- Frequently accessed customer data
- AI session data
- Rate limiting
- Temporary analytics results

---

## 6. Non-Functional Requirements

### Performance

- Fast dashboard loading
- Pagination for large datasets
- Redis caching
- Server-side data fetching where appropriate

### Security

- Clerk authentication
- Role-based authorization
- Environment variables for secrets
- Server-side validation
- API rate limiting
- Audit logging

### Scalability

The architecture should allow:

- More customers
- More relationship managers
- More analytics
- Additional AI capabilities

---

## 7. Data Source

Initial dataset:

Kaggle banking/customer dataset in CSV format.

Pipeline:

CSV
→ Data Validation
→ Data Cleaning
→ Transformation
→ MongoDB
→ Application APIs
→ Dashboard / Analytics / AI

The Kaggle dataset should be treated as development/demo data and not as
real bank customer information.

---

## 8. Success Criteria

The MVP is complete when:

- Users can authenticate.
- Users can access role-based dashboards.
- CSV data can be imported into MongoDB.
- Customers can be searched and filtered.
- Customer 360 works.
- Interactions can be created.
- Follow-ups can be created.
- Analytics dashboard works.
- Customer segmentation works.
- Churn analytics works.
- AI assistant can summarize customer data.
- Redis caching is implemented.
- Application is responsive.