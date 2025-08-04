from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/expense_manager"
    
    # Security
    SECRET_KEY: str = "your-super-secret-key-change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Groq AI API
    GROQ_API_KEY: str = ""
    
    # Application
    DEBUG: bool = True
    ALLOWED_HOSTS: List[str] = ["localhost", "127.0.0.1"]
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    # API
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "OracleCloud Expense Manager"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings() 