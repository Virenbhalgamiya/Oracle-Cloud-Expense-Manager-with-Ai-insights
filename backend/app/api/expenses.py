from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.services.expense_service import ExpenseService
from app.schemas.expense import ExpenseCreate, ExpenseResponse, ExpenseUpdate
from app.models.expense import ExpenseStatus
from app.models.user import User, UserRole
from app.api.dependencies import get_current_active_user, get_current_manager

router = APIRouter(prefix="/expenses", tags=["Expenses"])


@router.post("/", response_model=ExpenseResponse)
def create_expense(
    expense: ExpenseCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new expense."""
    db_expense = ExpenseService.create_expense(db=db, expense=expense, user_id=current_user.id)
    
    # Add category and user names for response
    db_expense.category_name = db_expense.category.name
    db_expense.user_name = current_user.full_name
    
    return db_expense


@router.get("/user", response_model=List[ExpenseResponse])
def get_user_expenses(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get expenses for the current user."""
    expenses = ExpenseService.get_user_expenses(db=db, user_id=current_user.id, skip=skip, limit=limit)
    
    # Add category and user names for response
    for expense in expenses:
        expense.category_name = expense.category.name
        expense.user_name = current_user.full_name
    
    return expenses


@router.get("/", response_model=List[ExpenseResponse])
def get_all_expenses(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_manager),
    db: Session = Depends(get_db)
):
    """Get all expenses (managers only)."""
    expenses = ExpenseService.get_all_expenses(db=db, skip=skip, limit=limit)
    
    # Add category and user names for response
    for expense in expenses:
        expense.category_name = expense.category.name
        expense.user_name = expense.user.full_name
    
    return expenses


@router.get("/{expense_id}", response_model=ExpenseResponse)
def get_expense(
    expense_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get a specific expense."""
    expense = ExpenseService.get_expense_by_id(db=db, expense_id=expense_id)
    
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found"
        )
    
    # Check if user can access this expense
    if current_user.role != UserRole.MANAGER and expense.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    # Add category and user names for response
    expense.category_name = expense.category.name
    expense.user_name = expense.user.full_name
    
    return expense


@router.put("/{expense_id}/approve")
def approve_expense(
    expense_id: int,
    current_user: User = Depends(get_current_manager),
    db: Session = Depends(get_db)
):
    """Approve an expense (managers only)."""
    expense = ExpenseService.update_expense_status(
        db=db, expense_id=expense_id, status=ExpenseStatus.APPROVED, manager_id=current_user.id
    )
    
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found"
        )
    
    return {"message": "Expense approved successfully"}


@router.put("/{expense_id}/reject")
def reject_expense(
    expense_id: int,
    current_user: User = Depends(get_current_manager),
    db: Session = Depends(get_db)
):
    """Reject an expense (managers only)."""
    expense = ExpenseService.update_expense_status(
        db=db, expense_id=expense_id, status=ExpenseStatus.REJECTED, manager_id=current_user.id
    )
    
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found"
        )
    
    return {"message": "Expense rejected successfully"}


@router.get("/status/{status}", response_model=List[ExpenseResponse])
def get_expenses_by_status(
    status: ExpenseStatus,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_manager),
    db: Session = Depends(get_db)
):
    """Get expenses by status (managers only)."""
    expenses = ExpenseService.get_expenses_by_status(db=db, status=status, skip=skip, limit=limit)
    
    # Add category and user names for response
    for expense in expenses:
        expense.category_name = expense.category.name
        expense.user_name = expense.user.full_name
    
    return expenses 