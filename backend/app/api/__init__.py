from .auth import router as auth_router
from .expenses import router as expenses_router
from .analytics import router as analytics_router
from .ai import router as ai_router
from .categories import router as categories_router

__all__ = ["auth_router", "expenses_router", "analytics_router", "ai_router", "categories_router"] 