import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Calendar, DollarSign, FileText, Tag } from 'lucide-react';
import { categoryService, aiService } from '../services/api';
import toast from 'react-hot-toast';

const ExpenseForm = ({ onSubmit, onClose }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [predicting, setPredicting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm();

  const title = watch('title');
  const amount = watch('amount');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const categoriesData = await categoryService.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      toast.error('Failed to load categories');
    }
  };

  const predictCategory = async () => {
    if (!title || !amount) {
      toast.error('Please enter title and amount first');
      return;
    }

    setPredicting(true);
    try {
      const prediction = await aiService.predictCategory(title, parseFloat(amount));
      const category = categories.find(cat => 
        cat.name.toLowerCase() === prediction.predicted_category.toLowerCase()
      );
      
      if (category) {
        setValue('category_id', category.id);
        toast.success(`AI suggested category: ${category.name}`);
      } else {
        toast.info('AI prediction available, but category not found in system');
      }
    } catch (error) {
      toast.error('Failed to predict category');
    } finally {
      setPredicting(false);
    }
  };

  const handleFormSubmit = async (data) => {
    setLoading(true);
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Submit New Expense</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="input pl-10"
                placeholder="Enter expense title"
                {...register('title', {
                  required: 'Title is required',
                  minLength: {
                    value: 3,
                    message: 'Title must be at least 3 characters',
                  },
                })}
              />
            </div>
            {errors.title && (
              <p className="mt-1 text-sm text-danger-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                step="0.01"
                min="0"
                className="input pl-10"
                placeholder="0.00"
                {...register('amount', {
                  required: 'Amount is required',
                  min: {
                    value: 0.01,
                    message: 'Amount must be greater than 0',
                  },
                })}
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-sm text-danger-600">{errors.amount.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  className="input pl-10"
                  {...register('category_id', {
                    required: 'Category is required',
                  })}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={predictCategory}
                disabled={predicting || !title || !amount}
                className="btn btn-secondary px-3 py-2 text-sm"
              >
                {predicting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                ) : (
                  'AI'
                )}
              </button>
            </div>
            {errors.category_id && (
              <p className="mt-1 text-sm text-danger-600">{errors.category_id.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                className="input pl-10"
                {...register('date', {
                  required: 'Date is required',
                })}
              />
            </div>
            {errors.date && (
              <p className="mt-1 text-sm text-danger-600">{errors.date.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              className="input"
              rows="3"
              placeholder="Enter additional details..."
              {...register('description')}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex-1"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Submit Expense'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm; 