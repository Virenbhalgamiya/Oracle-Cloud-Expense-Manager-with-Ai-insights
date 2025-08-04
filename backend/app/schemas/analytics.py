from pydantic import BaseModel
from typing import List, Dict, Any
from datetime import datetime


class CategoryBreakdown(BaseModel):
    category_name: str
    total_amount: float
    percentage: float
    count: int


class MonthlyTrend(BaseModel):
    month: str
    total_amount: float
    count: int


class AnalyticsResponse(BaseModel):
    total_expenses: float
    total_count: int
    average_amount: float
    top_categories: List[CategoryBreakdown]
    monthly_trends: List[MonthlyTrend]
    status_breakdown: Dict[str, int]
    recent_expenses: List[Dict[str, Any]] 