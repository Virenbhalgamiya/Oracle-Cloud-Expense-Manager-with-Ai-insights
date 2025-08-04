from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from app.models.expense import Expense, ExpenseStatus
from app.models.category import Category
from app.schemas.analytics import AnalyticsResponse, CategoryBreakdown, MonthlyTrend
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta


class AnalyticsService:
    @staticmethod
    def get_category_breakdown(db: Session, user_id: Optional[int] = None) -> List[CategoryBreakdown]:
        """Get expense breakdown by category."""
        query = db.query(
            Category.name,
            func.sum(Expense.amount).label('total_amount'),
            func.count(Expense.id).label('count')
        ).join(Expense, Category.id == Expense.category_id)
        
        if user_id:
            query = query.filter(Expense.user_id == user_id)
        
        results = query.group_by(Category.name).all()
        
        # Calculate total for percentage
        total_amount = sum(result.total_amount for result in results)
        
        breakdown = []
        for result in results:
            percentage = (result.total_amount / total_amount * 100) if total_amount > 0 else 0
            breakdown.append(CategoryBreakdown(
                category_name=result.name,
                total_amount=float(result.total_amount),
                percentage=round(percentage, 2),
                count=result.count
            ))
        
        return sorted(breakdown, key=lambda x: x.total_amount, reverse=True)
    
    @staticmethod
    def get_monthly_trends(db: Session, user_id: Optional[int] = None, months: int = 6) -> List[MonthlyTrend]:
        """Get monthly expense trends."""
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=months * 30)
        
        query = db.query(
            func.date_trunc('month', Expense.date).label('month'),
            func.sum(Expense.amount).label('total_amount'),
            func.count(Expense.id).label('count')
        ).filter(Expense.date >= start_date)
        
        if user_id:
            query = query.filter(Expense.user_id == user_id)
        
        results = query.group_by(func.date_trunc('month', Expense.date)).order_by(func.date_trunc('month', Expense.date)).all()
        
        trends = []
        for result in results:
            trends.append(MonthlyTrend(
                month=result.month.strftime('%Y-%m'),
                total_amount=float(result.total_amount),
                count=result.count
            ))
        
        return trends
    
    @staticmethod
    def get_status_breakdown(db: Session, user_id: Optional[int] = None) -> Dict[str, int]:
        """Get expense breakdown by status."""
        query = db.query(Expense.status, func.count(Expense.id))
        
        if user_id:
            query = query.filter(Expense.user_id == user_id)
        
        results = query.group_by(Expense.status).all()
        
        return {status.value: count for status, count in results}
    
    @staticmethod
    def get_recent_expenses(db: Session, user_id: Optional[int] = None, limit: int = 10) -> List[Dict[str, Any]]:
        """Get recent expenses for analytics."""
        query = db.query(Expense).join(Category, Expense.category_id == Category.id)
        
        if user_id:
            query = query.filter(Expense.user_id == user_id)
        
        expenses = query.order_by(Expense.created_at.desc()).limit(limit).all()
        
        recent_expenses = []
        for expense in expenses:
            recent_expenses.append({
                "id": expense.id,
                "title": expense.title,
                "amount": float(expense.amount),
                "category": expense.category.name,
                "status": expense.status.value,
                "date": expense.date.isoformat(),
                "created_at": expense.created_at.isoformat()
            })
        
        return recent_expenses
    
    @staticmethod
    def get_comprehensive_analytics(db: Session, user_id: Optional[int] = None) -> AnalyticsResponse:
        """Get comprehensive analytics for a user or all users."""
        # Get basic stats
        query = db.query(Expense)
        if user_id:
            query = query.filter(Expense.user_id == user_id)
        
        total_amount = query.with_entities(func.sum(Expense.amount)).scalar() or 0
        total_count = query.count()
        average_amount = total_amount / total_count if total_count > 0 else 0
        
        # Get breakdowns
        top_categories = AnalyticsService.get_category_breakdown(db, user_id)
        monthly_trends = AnalyticsService.get_monthly_trends(db, user_id)
        status_breakdown = AnalyticsService.get_status_breakdown(db, user_id)
        recent_expenses = AnalyticsService.get_recent_expenses(db, user_id)
        
        return AnalyticsResponse(
            total_expenses=float(total_amount),
            total_count=total_count,
            average_amount=float(average_amount),
            top_categories=top_categories,
            monthly_trends=monthly_trends,
            status_breakdown=status_breakdown,
            recent_expenses=recent_expenses
        ) 