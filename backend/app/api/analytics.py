from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.analytics_service import AnalyticsService
from app.schemas.analytics import AnalyticsResponse
from app.models.user import User, UserRole
from app.api.dependencies import get_current_active_user, get_current_manager

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/monthly", response_model=AnalyticsResponse)
def get_monthly_analytics(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get monthly analytics for the current user."""
    analytics = AnalyticsService.get_comprehensive_analytics(db=db, user_id=current_user.id)
    return analytics


@router.get("/all", response_model=AnalyticsResponse)
def get_all_analytics(
    current_user: User = Depends(get_current_manager),
    db: Session = Depends(get_db)
):
    """Get analytics for all users (managers only)."""
    analytics = AnalyticsService.get_comprehensive_analytics(db=db)
    return analytics


@router.get("/categories")
def get_category_breakdown(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get expense breakdown by category."""
    breakdown = AnalyticsService.get_category_breakdown(db=db, user_id=current_user.id)
    return breakdown


@router.get("/trends")
def get_monthly_trends(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get monthly expense trends."""
    trends = AnalyticsService.get_monthly_trends(db=db, user_id=current_user.id)
    return trends


@router.get("/status")
def get_status_breakdown(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get expense breakdown by status."""
    breakdown = AnalyticsService.get_status_breakdown(db=db, user_id=current_user.id)
    return breakdown


@router.get("/recent")
def get_recent_expenses(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get recent expenses for analytics."""
    recent = AnalyticsService.get_recent_expenses(db=db, user_id=current_user.id)
    return recent 