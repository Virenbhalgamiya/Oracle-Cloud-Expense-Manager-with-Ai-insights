from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.ai_service import AIService
from app.services.expense_service import ExpenseService
from app.models.user import User
from app.api.dependencies import get_current_active_user
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/ai", tags=["AI Insights"])


class AISummaryRequest(BaseModel):
    days: Optional[int] = 30


class AISummaryResponse(BaseModel):
    insights: str
    total_expenses: int
    total_amount: float


@router.post("/summary", response_model=AISummaryResponse)
def get_ai_summary(
    request: AISummaryRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get AI-generated financial insights for the current user."""
    # Get recent expenses for analysis
    expenses = ExpenseService.get_user_recent_expenses(
        db=db, user_id=current_user.id, days=request.days
    )
    
    if not expenses:
        return AISummaryResponse(
            insights="No expenses found for analysis. Start by adding some expenses to get personalized insights.",
            total_expenses=0,
            total_amount=0.0
        )
    
    # Generate AI insights
    ai_service = AIService()
    insights = ai_service.analyze_user_expenses(expenses, current_user.full_name)
    
    # Calculate totals
    total_amount = sum(expense.amount for expense in expenses)
    
    return AISummaryResponse(
        insights=insights,
        total_expenses=len(expenses),
        total_amount=float(total_amount)
    )


@router.post("/predict-category")
def predict_expense_category(
    title: str,
    amount: float,
    description: Optional[str] = "",
    current_user: User = Depends(get_current_active_user)
):
    """Predict the most likely category for an expense using AI."""
    ai_service = AIService()
    predicted_category = ai_service.predict_expense_category(title, amount, description)
    
    return {
        "predicted_category": predicted_category,
        "confidence": "high"  # Placeholder for confidence score
    }


@router.post("/budget-recommendations")
def get_budget_recommendations(
    monthly_budget: float,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get AI-generated budget recommendations."""
    # Get recent expenses for budget analysis
    expenses = ExpenseService.get_user_recent_expenses(db=db, user_id=current_user.id, days=30)
    
    if not expenses:
        return {
            "recommendations": "No expense data available for budget recommendations. Start by adding some expenses.",
            "monthly_budget": monthly_budget,
            "total_spent": 0.0,
            "remaining_budget": monthly_budget
        }
    
    # Generate budget recommendations
    ai_service = AIService()
    recommendations = ai_service.generate_budget_recommendations(expenses, monthly_budget)
    
    # Calculate totals
    total_spent = sum(expense.amount for expense in expenses)
    remaining_budget = monthly_budget - total_spent
    
    return {
        "recommendations": recommendations,
        "monthly_budget": monthly_budget,
        "total_spent": float(total_spent),
        "remaining_budget": float(remaining_budget)
    } 