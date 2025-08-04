# OracleCloud Expense Manager

A full-stack SaaS expense management application with integrated AI insights using the Groq API.

## 🚀 Features

- **User Authentication**: JWT-based login/register system
- **Expense Management**: Submit, track, and approve expenses
- **AI Insights**: Groq LLM-powered financial analysis and recommendations
- **Analytics Dashboard**: Visual charts and spending analytics
- **Role-based Access**: Employee and Manager roles with different permissions

## 🛠 Tech Stack

- **Backend**: Python (FastAPI) with PostgreSQL
- **Frontend**: React.js with TailwindCSS
- **AI**: Groq LLM API for financial insights
- **Authentication**: JWT tokens
- **Charts**: Chart.js for data visualization

## 📁 Project Structure

```
oracle_cloud_expense_manager/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── core/           # Configuration and security
│   │   ├── models/         # Database models
│   │   ├── services/       # Business logic
│   │   └── main.py         # FastAPI app entry point
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── utils/          # Utilities
│   ├── package.json
│   └── Dockerfile
├── database/               # Database scripts
│   └── seed.sql
└── docs/                   # Documentation
    └── api.md
```

## 🚀 Quick Start

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database and Groq API credentials
```

5. Run the backend:
```bash
uvicorn app.main:app --reload
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm start
```

## 🔐 Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/expense_manager
SECRET_KEY=your-secret-key-here
GROQ_API_KEY=your-groq-api-key-here
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8000
```

## 📊 API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 🐳 Docker Deployment

### Backend
```bash
cd backend
docker build -t expense-manager-backend .
docker run -p 8000:8000 expense-manager-backend
```

### Frontend
```bash
cd frontend
docker build -t expense-manager-frontend .
docker run -p 3000:3000 expense-manager-frontend
```

## 🤖 AI Features

The application integrates with Groq LLM API to provide:

- **Spending Analysis**: Analyze user's expense patterns
- **Financial Insights**: Generate personalized recommendations
- **Category Suggestions**: AI-powered expense categorization
- **Budget Recommendations**: Smart spending tips and advice

## 👥 User Roles

### Employee
- Submit expense requests
- Track expense status
- View personal analytics
- Access AI-generated insights

### Manager
- Approve/reject expense requests
- View team analytics
- Access comprehensive reports
- Manage expense categories

## 📈 Analytics Features

- Monthly spending trends
- Category-wise expense breakdown
- Top spending categories
- Budget vs actual analysis
- AI-powered spending insights

## 🔧 Development

### Database Migrations
```bash
# Create new migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head
```

### Testing
```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## 📝 License

MIT License - see LICENSE file for details. 