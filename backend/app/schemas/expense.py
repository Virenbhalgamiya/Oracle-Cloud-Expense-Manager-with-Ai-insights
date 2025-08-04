from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.expense import ExpenseStatus


class ExpenseBase(BaseModel):
    title: str
    amount: float
    description: Optional[str] = None
    date: datetime
    category_id: int


class ExpenseCreate(ExpenseBase):
    pass


class ExpenseUpdate(BaseModel):
    title: Optional[str] = None
    amount: Optional[float] = None
    description: Optional[str] = None
    date: Optional[datetime] = None
    category_id: Optional[int] = None
    status: Optional[ExpenseStatus] = None


class ExpenseResponse(ExpenseBase):
    id: int
    status: ExpenseStatus
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    # Include related data
    category_name: Optional[str] = None
    user_name: Optional[str] = None
    
    class Config:
        from_attributes = True 