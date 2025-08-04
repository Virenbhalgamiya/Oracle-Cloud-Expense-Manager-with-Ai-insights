from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.expense import Expense, ExpenseStatus
from app.models.user import User, UserRole
from app.schemas.expense import ExpenseCreate, ExpenseUpdate
from typing import List, Optional
from datetime import datetime, timedelta


class ExpenseService:
    @staticmethod
    def create_expense(db: Session, expense: ExpenseCreate, user_id: int) -> Expense:
        """Create a new expense."""
        db_expense = Expense(
            title=expense.title,
            amount=expense.amount,
            description=expense.description,
            date=expense.date,
            category_id=expense.category_id,
            user_id=user_id,
            status=ExpenseStatus.PENDING
        )
        db.add(db_expense)
        db.commit()
        db.refresh(db_expense)
        return db_expense
    
    @staticmethod
    def get_user_expenses(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[Expense]:
        """Get expenses for a specific user."""
        return db.query(Expense).filter(Expense.user_id == user_id).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_all_expenses(db: Session, skip: int = 0, limit: int = 100) -> List[Expense]:
        """Get all expenses (for managers)."""
        return db.query(Expense).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_expense_by_id(db: Session, expense_id: int) -> Optional[Expense]:
        """Get expense by ID."""
        return db.query(Expense).filter(Expense.id == expense_id).first()
    
    @staticmethod
    def update_expense_status(db: Session, expense_id: int, status: ExpenseStatus, manager_id: int) -> Optional[Expense]:
        """Update expense status (approve/reject)."""
        expense = db.query(Expense).filter(Expense.id == expense_id).first()
        if expense:
            expense.status = status
            db.commit()
            db.refresh(expense)
        return expense
    
    @staticmethod
    def get_user_recent_expenses(db: Session, user_id: int, days: int = 30) -> List[Expense]:
        """Get recent expenses for a user (for AI analysis)."""
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        return db.query(Expense).filter(
            Expense.user_id == user_id,
            Expense.date >= cutoff_date
        ).all()
    
    @staticmethod
    def get_expenses_by_status(db: Session, status: ExpenseStatus, skip: int = 0, limit: int = 100) -> List[Expense]:
        """Get expenses by status."""
        return db.query(Expense).filter(Expense.status == status).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_expense_stats(db: Session, user_id: Optional[int] = None) -> dict:
        """Get expense statistics."""
        query = db.query(Expense)
        if user_id:
            query = query.filter(Expense.user_id == user_id)
        
        total_amount = query.with_entities(func.sum(Expense.amount)).scalar() or 0
        total_count = query.count()
        avg_amount = total_amount / total_count if total_count > 0 else 0
        
        return {
            "total_amount": total_amount,
            "total_count": total_count,
            "average_amount": avg_amount
        } 