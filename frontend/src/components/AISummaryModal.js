import React from 'react';
import { X, Brain, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';

const AISummaryModal = ({ summary, onClose }) => {
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-primary-100">
              <Brain className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-3">
              AI Financial Insights
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-primary-50 rounded-lg p-4">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-primary-600 mr-2" />
              <span className="text-sm font-medium text-primary-700">Total Expenses</span>
            </div>
            <p className="text-2xl font-bold text-primary-900 mt-1">
              {formatAmount(summary.total_amount)}
            </p>
            <p className="text-sm text-primary-600">
              {summary.total_expenses} expenses analyzed
            </p>
          </div>
          <div className="bg-warning-50 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-warning-600 mr-2" />
              <span className="text-sm font-medium text-warning-700">Analysis Period</span>
            </div>
            <p className="text-2xl font-bold text-warning-900 mt-1">30 Days</p>
            <p className="text-sm text-warning-600">
              Recent spending patterns
            </p>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Lightbulb className="h-5 w-5 text-warning-600 mr-2" />
            <h4 className="text-lg font-semibold text-gray-900">AI Analysis</h4>
          </div>
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {summary.insights}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="btn btn-secondary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AISummaryModal; 