# OracleCloud Expense Manager API Documentation

## Overview

The OracleCloud Expense Manager API is a RESTful service built with FastAPI that provides expense management functionality with AI-powered insights. The API supports user authentication, expense management, analytics, and AI integration.

## Base URL

```
http://localhost:8000/api/v1
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "username",
  "full_name": "Full Name",
  "password": "password123",
  "role": "employee"
}
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "username",
  "full_name": "Full Name",
  "role": "employee",
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### POST /auth/login
Login and get access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer"
}
```

#### GET /auth/me
Get current user information.

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "username",
  "full_name": "Full Name",
  "role": "employee",
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Expenses

#### POST /expenses/
Create a new expense.

**Request Body:**
```json
{
  "title": "Business Lunch",
  "amount": 85.50,
  "description": "Client meeting lunch",
  "date": "2024-01-15T12:30:00Z",
  "category_id": 2
}
```

**Response:**
```json
{
  "id": 1,
  "title": "Business Lunch",
  "amount": 85.50,
  "description": "Client meeting lunch",
  "date": "2024-01-15T12:30:00Z",
  "category_id": 2,
  "status": "pending",
  "user_id": 1,
  "created_at": "2024-01-15T12:30:00Z",
  "category_name": "Meals & Entertainment",
  "user_name": "John Doe"
}
```

#### GET /expenses/user
Get expenses for the current user.

**Query Parameters:**
- `skip` (optional): Number of records to skip (default: 0)
- `limit` (optional): Number of records to return (default: 100)

**Response:**
```json
[
  {
    "id": 1,
    "title": "Business Lunch",
    "amount": 85.50,
    "description": "Client meeting lunch",
    "date": "2024-01-15T12:30:00Z",
    "category_id": 2,
    "status": "approved",
    "user_id": 1,
    "created_at": "2024-01-15T12:30:00Z",
    "category_name": "Meals & Entertainment",
    "user_name": "John Doe"
  }
]
```

#### GET /expenses/
Get all expenses (managers only).

**Query Parameters:**
- `skip` (optional): Number of records to skip (default: 0)
- `limit` (optional): Number of records to return (default: 100)

#### GET /expenses/{expense_id}
Get a specific expense.

#### PUT /expenses/{expense_id}/approve
Approve an expense (managers only).

**Response:**
```json
{
  "message": "Expense approved successfully"
}
```

#### PUT /expenses/{expense_id}/reject
Reject an expense (managers only).

**Response:**
```json
{
  "message": "Expense rejected successfully"
}
```

#### GET /expenses/status/{status}
Get expenses by status (managers only).

**Path Parameters:**
- `status`: pending, approved, or rejected

### Analytics

#### GET /analytics/monthly
Get monthly analytics for the current user.

**Response:**
```json
{
  "total_expenses": 1250.75,
  "total_count": 15,
  "average_amount": 83.38,
  "top_categories": [
    {
      "category_name": "Meals & Entertainment",
      "total_amount": 450.00,
      "percentage": 36.0,
      "count": 5
    }
  ],
  "monthly_trends": [
    {
      "month": "2024-01",
      "total_amount": 1250.75,
      "count": 15
    }
  ],
  "status_breakdown": {
    "approved": 10,
    "pending": 3,
    "rejected": 2
  },
  "recent_expenses": [
    {
      "id": 1,
      "title": "Business Lunch",
      "amount": 85.50,
      "category": "Meals & Entertainment",
      "status": "approved",
      "date": "2024-01-15T12:30:00Z",
      "created_at": "2024-01-15T12:30:00Z"
    }
  ]
}
```

#### GET /analytics/all
Get analytics for all users (managers only).

#### GET /analytics/categories
Get expense breakdown by category.

#### GET /analytics/trends
Get monthly expense trends.

#### GET /analytics/status
Get expense breakdown by status.

#### GET /analytics/recent
Get recent expenses for analytics.

### AI Insights

#### POST /ai/summary
Get AI-generated financial insights.

**Request Body:**
```json
{
  "days": 30
}
```

**Response:**
```json
{
  "insights": "Based on your recent expenses, I can see that you've spent $1,250.75 over the last 30 days...",
  "total_expenses": 15,
  "total_amount": 1250.75
}
```

#### POST /ai/predict-category
Predict the most likely category for an expense.

**Request Body:**
```json
{
  "title": "Business Lunch",
  "amount": 85.50,
  "description": "Client meeting"
}
```

**Response:**
```json
{
  "predicted_category": "Meals & Entertainment",
  "confidence": "high"
}
```

#### POST /ai/budget-recommendations
Get AI-generated budget recommendations.

**Request Body:**
```json
{
  "monthly_budget": 2000.00
}
```

**Response:**
```json
{
  "recommendations": "Based on your spending patterns...",
  "monthly_budget": 2000.00,
  "total_spent": 1250.75,
  "remaining_budget": 749.25
}
```

### Categories

#### GET /categories/
Get all expense categories.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Travel",
    "description": "Business travel expenses",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

#### POST /categories/
Create a new category.

**Request Body:**
```json
{
  "name": "New Category",
  "description": "Category description"
}
```

#### GET /categories/{category_id}
Get a specific category.

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "detail": "Could not validate credentials"
}
```

### 403 Forbidden
```json
{
  "detail": "Not enough permissions"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```

## Data Models

### User
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "username",
  "full_name": "Full Name",
  "role": "employee",
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Expense
```json
{
  "id": 1,
  "title": "Business Lunch",
  "amount": 85.50,
  "description": "Client meeting lunch",
  "date": "2024-01-15T12:30:00Z",
  "category_id": 2,
  "status": "pending",
  "user_id": 1,
  "created_at": "2024-01-15T12:30:00Z",
  "category_name": "Meals & Entertainment",
  "user_name": "John Doe"
}
```

### Category
```json
{
  "id": 1,
  "name": "Travel",
  "description": "Business travel expenses",
  "created_at": "2024-01-01T00:00:00Z"
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:
- 100 requests per minute per IP address
- 1000 requests per hour per user

## CORS

The API supports CORS for frontend integration:
- Allowed origins: http://localhost:3000, http://127.0.0.1:3000
- Allowed methods: GET, POST, PUT, DELETE, OPTIONS
- Allowed headers: Content-Type, Authorization

## WebSocket Support

The API also supports WebSocket connections for real-time updates:
- Endpoint: `/ws`
- Protocol: WebSocket
- Events: expense_created, expense_updated, expense_approved, expense_rejected

## Testing

### Demo Credentials

**Employee:**
- Email: john.doe@company.com
- Password: password123

**Manager:**
- Email: jane.smith@company.com
- Password: password123

### Test Data

The API includes seed data with sample expenses, categories, and users for testing purposes.

## Deployment

### Environment Variables

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: JWT secret key
- `GROQ_API_KEY`: Groq API key for AI features
- `DEBUG`: Enable debug mode (true/false)
- `CORS_ORIGINS`: Comma-separated list of allowed origins

### Docker Deployment

```bash
# Build and run backend
cd backend
docker build -t expense-manager-backend .
docker run -p 8000:8000 expense-manager-backend

# Build and run frontend
cd frontend
docker build -t expense-manager-frontend .
docker run -p 3000:3000 expense-manager-frontend
```

## Support

For API support and questions:
- Email: support@oraclecloud-expense-manager.com
- Documentation: https://docs.oraclecloud-expense-manager.com
- GitHub: https://github.com/oraclecloud/expense-manager 