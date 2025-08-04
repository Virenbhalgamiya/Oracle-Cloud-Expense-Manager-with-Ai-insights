import json
from typing import List, Dict, Any
from groq import Groq
from app.core.config import settings
from app.models.expense import Expense
from app.models.category import Category


class AIService:
    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY)
    
    def analyze_user_expenses(self, expenses: List[Expense], user_name: str) -> str:
        """Analyze user expenses and generate financial insights using Groq."""
        if not expenses:
            return "No expenses found for analysis."
        
        # Prepare expense data for AI analysis
        expense_data = []
        total_amount = 0
        
        for expense in expenses:
            expense_data.append({
                "title": expense.title,
                "amount": float(expense.amount),
                "category": expense.category.name,
                "date": expense.date.strftime("%Y-%m-%d"),
                "description": expense.description or "No description"
            })
            total_amount += expense.amount
        
        # Create prompt for Groq
        prompt = f"""
        Analyze the following expense data for {user_name} and provide financial insights.
        
        Total expenses: ${total_amount:.2f}
        Number of expenses: {len(expenses)}
        
        Expense Details:
        {json.dumps(expense_data, indent=2)}
        
        Please provide:
        1. A summary of spending patterns
        2. Top spending categories and amounts
        3. 2-3 specific tips to reduce overspending
        4. Budget recommendations for the next month
        5. Any unusual spending patterns or concerns
        
        Format your response in a clear, actionable manner suitable for a business expense management system.
        """
        
        try:
            response = self.client.chat.completions.create(
                model="llama3-8b-8192",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a financial advisor specializing in expense analysis and budget optimization. Provide clear, actionable insights based on expense data."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.7,
                max_tokens=1000
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            return f"Unable to generate AI insights at this time. Error: {str(e)}"
    
    def predict_expense_category(self, expense_title: str, amount: float, description: str = "") -> str:
        """Predict the most likely category for an expense using AI."""
        prompt = f"""
        Based on the following expense information, predict the most appropriate category:
        
        Title: {expense_title}
        Amount: ${amount:.2f}
        Description: {description}
        
        Choose from these common expense categories:
        - Travel
        - Meals & Entertainment
        - Office Supplies
        - Software & Subscriptions
        - Transportation
        - Utilities
        - Marketing & Advertising
        - Professional Services
        - Training & Education
        - Miscellaneous
        
        Respond with only the category name.
        """
        
        try:
            response = self.client.chat.completions.create(
                model="llama3-8b-8192",
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expense categorization expert. Respond with only the category name."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.3,
                max_tokens=50
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            return "Miscellaneous"
    
    def generate_budget_recommendations(self, user_expenses: List[Expense], monthly_budget: float) -> str:
        """Generate budget recommendations based on spending patterns."""
        if not user_expenses:
            return "No expense data available for budget recommendations."
        
        total_spent = sum(expense.amount for expense in user_expenses)
        remaining_budget = monthly_budget - total_spent
        
        prompt = f"""
        Generate budget recommendations based on the following data:
        
        Monthly Budget: ${monthly_budget:.2f}
        Total Spent: ${total_spent:.2f}
        Remaining Budget: ${remaining_budget:.2f}
        
        Recent Expenses:
        {json.dumps([{
            "title": exp.title,
            "amount": float(exp.amount),
            "category": exp.category.name
        } for exp in user_expenses], indent=2)}
        
        Provide:
        1. Budget status assessment
        2. Recommendations for remaining budget allocation
        3. Suggestions for cost-cutting if over budget
        4. Next month's budget planning tips
        """
        
        try:
            response = self.client.chat.completions.create(
                model="llama3-8b-8192",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a budget planning expert. Provide practical budget recommendations."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.6,
                max_tokens=800
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            return f"Unable to generate budget recommendations. Error: {str(e)}" 