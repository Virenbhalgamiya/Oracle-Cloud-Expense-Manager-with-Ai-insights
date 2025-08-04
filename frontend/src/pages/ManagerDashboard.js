import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { expenseService, analyticsService } from '../services/api';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign, 
  Users,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import ExpenseList from '../components/ExpenseList';
import AnalyticsCard from '../components/AnalyticsCard';

const ManagerDashboard = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [expensesData, analyticsData] = await Promise.all([
        expenseService.getAllExpenses(),
        analyticsService.getAllAnalytics(),
      ]);
      setExpenses(expensesData);
      setAnalytics(analyticsData);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveExpense = async (expenseId) => {
    setActionLoading(expenseId);
    try {
      await expenseService.approveExpense(expenseId);
      setExpenses(prev => 
        prev.map(expense => 
          expense.id === expenseId 
            ? { ...expense, status: 'approved' }
            : expense
        )
      );
      toast.success('Expense approved successfully!');
      loadDashboardData(); // Refresh analytics
    } catch (error) {
      toast.error('Failed to approve expense');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectExpense = async (expenseId) => {
    setActionLoading(expenseId);
    try {
      await expenseService.rejectExpense(expenseId);
      setExpenses(prev => 
        prev.map(expense => 
          expense.id === expenseId 
            ? { ...expense, status: 'rejected' }
            : expense
        )
      );
      toast.success('Expense rejected successfully!');
      loadDashboardData(); // Refresh analytics
    } catch (error) {
      toast.error('Failed to reject expense');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusCount = (status) => {
    return expenses.filter(expense => expense.status === status).length;
  };

  const getTotalAmount = () => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getPendingAmount = () => {
    return expenses
      .filter(expense => expense.status === 'pending')
      .reduce((sum, expense) => sum + expense.amount, 0);
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
          Manager Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
          Review and approve team expenses, and monitor overall spending analytics.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard
          title="Total Team Expenses"
          value={`$${getTotalAmount().toFixed(2)}`}
          icon={<DollarSign className="h-6 w-6" />}
          trend="up"
          trendValue="15%"
          color="primary"
        />
        <AnalyticsCard
          title="Pending Approvals"
          value={getStatusCount('pending')}
          icon={<Clock className="h-6 w-6" />}
          trend="neutral"
          color="warning"
        />
        <AnalyticsCard
          title="Pending Amount"
          value={`$${getPendingAmount().toFixed(2)}`}
          icon={<AlertCircle className="h-6 w-6" />}
          trend="up"
          trendValue="8%"
          color="warning"
        />
        <AnalyticsCard
          title="Approved Expenses"
          value={getStatusCount('approved')}
          icon={<CheckCircle className="h-6 w-6" />}
          trend="up"
          trendValue="12%"
          color="success"
        />
      </div>

      {/* All Expenses with Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Team Expenses</h2>
          <p className="text-sm text-gray-600 mt-1">
            Review and manage expense requests from your team
          </p>
        </div>
        <div className="p-6">
          {expenses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expense
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                              <Users className="h-4 w-4 text-primary-600" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {expense.user_name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {expense.title}
                        </div>
                        {expense.description && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {expense.description}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {expense.category_name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ${expense.amount.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(expense.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`status-badge ${
                          expense.status === 'approved' ? 'status-approved' :
                          expense.status === 'rejected' ? 'status-rejected' :
                          'status-pending'
                        }`}>
                          {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {expense.status === 'pending' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApproveExpense(expense.id)}
                              disabled={actionLoading === expense.id}
                              className="btn btn-success text-xs px-3 py-1"
                            >
                              {actionLoading === expense.id ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                              ) : (
                                <>
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Approve
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => handleRejectExpense(expense.id)}
                              disabled={actionLoading === expense.id}
                              className="btn btn-danger text-xs px-3 py-1"
                            >
                              {actionLoading === expense.id ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                              ) : (
                                <>
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Reject
                                </>
                              )}
                            </button>
                          </div>
                        )}
                        {expense.status !== 'pending' && (
                          <span className="text-gray-500">
                            {expense.status === 'approved' ? 'Approved' : 'Rejected'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No expenses found</h3>
              <p className="mt-1 text-sm text-gray-500">
                No expense requests to review at this time.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard; 