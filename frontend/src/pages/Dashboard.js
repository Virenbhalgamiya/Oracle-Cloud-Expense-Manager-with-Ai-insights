import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { expenseService, aiService, analyticsService } from '../services/api';
import { 
  Plus, 
  Brain, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import AISummaryModal from '../components/AISummaryModal';
import AnalyticsCard from '../components/AnalyticsCard';

const Dashboard = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showAISummary, setShowAISummary] = useState(false);
  const [aiSummary, setAiSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [expensesData, analyticsData] = await Promise.all([
        expenseService.getUserExpenses(),
        analyticsService.getMonthlyAnalytics(),
      ]);
      setExpenses(expensesData);
      setAnalytics(analyticsData);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleExpenseSubmit = async (expenseData) => {
    try {
      const newExpense = await expenseService.createExpense(expenseData);
      setExpenses(prev => [newExpense, ...prev]);
      setShowExpenseForm(false);
      toast.success('Expense submitted successfully!');
      loadDashboardData(); // Refresh analytics
    } catch (error) {
      toast.error('Failed to submit expense');
    }
  };

  const handleAIAnalysis = async () => {
    setAiLoading(true);
    try {
      const summary = await aiService.getAISummary(30);
      setAiSummary(summary);
      setShowAISummary(true);
    } catch (error) {
      toast.error('Failed to generate AI insights');
    } finally {
      setAiLoading(false);
    }
  };

  const getStatusCount = (status) => {
    return expenses.filter(expense => expense.status === status).length;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-success-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-warning-600" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4 text-danger-600" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.full_name}!
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your expenses and get AI-powered insights to optimize your spending.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard
          title="Total Expenses"
          value={`$${analytics?.total_expenses?.toFixed(2) || '0.00'}`}
          icon={<DollarSign className="h-6 w-6" />}
          trend="up"
          trendValue="12%"
          color="primary"
        />
        <AnalyticsCard
          title="Pending Expenses"
          value={getStatusCount('pending')}
          icon={<Clock className="h-6 w-6" />}
          trend="neutral"
          color="warning"
        />
        <AnalyticsCard
          title="Approved Expenses"
          value={getStatusCount('approved')}
          icon={<CheckCircle className="h-6 w-6" />}
          trend="up"
          trendValue="8%"
          color="success"
        />
        <AnalyticsCard
          title="Average Amount"
          value={`$${analytics?.average_amount?.toFixed(2) || '0.00'}`}
          icon={<TrendingUp className="h-6 w-6" />}
          trend="down"
          trendValue="5%"
          color="primary"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => setShowExpenseForm(true)}
          className="btn btn-primary flex items-center justify-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Submit New Expense
        </button>
        <button
          onClick={handleAIAnalysis}
          disabled={aiLoading}
          className="btn btn-secondary flex items-center justify-center gap-2"
        >
          {aiLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
          ) : (
            <Brain className="h-5 w-5" />
          )}
          Analyze My Spending
        </button>
      </div>

      {/* Recent Expenses */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Expenses</h2>
        </div>
        <div className="p-6">
          {expenses.length > 0 ? (
            <ExpenseList expenses={expenses.slice(0, 5)} />
          ) : (
            <div className="text-center py-8">
              <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No expenses yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by submitting your first expense.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setShowExpenseForm(true)}
                  className="btn btn-primary"
                >
                  Submit Expense
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Expense Form Modal */}
      {showExpenseForm && (
        <ExpenseForm
          onSubmit={handleExpenseSubmit}
          onClose={() => setShowExpenseForm(false)}
        />
      )}

      {/* AI Summary Modal */}
      {showAISummary && aiSummary && (
        <AISummaryModal
          summary={aiSummary}
          onClose={() => setShowAISummary(false)}
        />
      )}
    </div>
  );
};

export default Dashboard; 