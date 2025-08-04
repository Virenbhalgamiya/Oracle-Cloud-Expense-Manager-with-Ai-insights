import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const AnalyticsCard = ({ title, value, icon, trend, trendValue, color = 'primary' }) => {
  const getColorClasses = (color) => {
    switch (color) {
      case 'primary':
        return 'bg-primary-50 text-primary-600 border-primary-200';
      case 'success':
        return 'bg-success-50 text-success-600 border-success-200';
      case 'warning':
        return 'bg-warning-50 text-warning-600 border-warning-200';
      case 'danger':
        return 'bg-danger-50 text-danger-600 border-danger-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-success-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-danger-600" />;
      case 'neutral':
        return <Minus className="h-4 w-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'text-success-600';
      case 'down':
        return 'text-danger-600';
      case 'neutral':
        return 'text-gray-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg border ${getColorClasses(color)}`}>
            {icon}
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
        {trend && trendValue && (
          <div className={`flex items-center text-sm font-medium ${getTrendColor(trend)}`}>
            {getTrendIcon(trend)}
            <span className="ml-1">{trendValue}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsCard; 