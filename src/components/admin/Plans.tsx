'use client';
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  DollarSign,
  Plus,
  Loader2,
  AlertCircle,
  CheckCircle,
  Settings,
  X,
  Save,
  Edit3,
  MoreVertical,
  Power,
  PowerOff,
} from 'lucide-react';
import {
  createPlan,
  getAllPlans,
  Plan,
  CreatePlanRequest,
} from '@/services/admin-panelist-services/planService';

// Define proper error type
interface ApiError {
  message?: string;
  status?: number;
}

// Define form error type
interface FormError {
  message: string;
}

function PlanManagementPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [togglingPlanId, setTogglingPlanId] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<CreatePlanRequest>({
    name: '',
    description: '',
    price: 0,
    currency: 'usd',
    interval: 'month',
    features: [''],
    isActive: true,
  });

  // Load plans on component mount
  useEffect(() => {
    loadPlans();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (!(event.target as Element).closest('.dropdown-container')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const loadPlans = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAllPlans();
      console.log('API Response:', response);

      if (response && typeof response === 'object' && 'data' in response) {
        console.log('Plans data:', response.data);
        setPlans(response.data || []);
      } else if (Array.isArray(response)) {
        console.log('Direct array response:', response);
        setPlans(response);
      } else {
        console.log('Unexpected response structure:', response);
        setPlans([]);
      }
    } catch (error) {
      const apiError = error as ApiError;
      const errorMessage = apiError?.message || 'Failed to load plans';
      setError(errorMessage);
      console.error('Error loading plans:', error);

      toast.error(`Failed to load plans: ${errorMessage}`, {
        position: 'top-right',
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      currency: 'usd',
      interval: 'month',
      features: [''],
      isActive: true,
    });
  };

  const populateFormWithPlan = (plan: Plan) => {
    setFormData({
      name: plan.name || '',
      description: plan.description || '',
      price: parseFloat(plan.price) || 0,
      currency: plan.currency || 'usd',
      interval: plan.interval || 'month',
      features:
        plan.features && plan.features.length > 0 ? [...plan.features] : [''],
      isActive: plan.isActive !== undefined ? plan.isActive : true,
    });
  };

  const handleShowCreateForm = () => {
    setEditingPlan(null);
    resetForm();
    setShowForm(true);
    setError(null);
  };

  const handleShowEditForm = (plan: Plan) => {
    console.log('Editing plan:', plan); // Debug log
    setEditingPlan(plan);
    populateFormWithPlan(plan);
    setShowForm(true);
    setError(null);
    setActiveDropdown(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPlan(null);
    resetForm();
  };

  // UI-only toggle functionality (no API call)
  const handleTogglePlanStatus = async (planId: string) => {
    setTogglingPlanId(planId);

    // Simulate API call delay
    setTimeout(() => {
      // Update local state only
      setPlans(prevPlans =>
        prevPlans.map(plan =>
          plan.id === planId ? { ...plan, isActive: !plan.isActive } : plan
        )
      );

      const plan = plans.find(p => p.id === planId);
      const newStatus = plan ? !plan.isActive : true;

      toast.success(
        `Plan ${newStatus ? 'activated' : 'deactivated'} successfully! (UI only - no API call)`,
        {
          position: 'top-right',
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );

      setTogglingPlanId(null);
    }, 1000);
  };

  const handleDropdownToggle = (planId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveDropdown(activeDropdown === planId ? null : planId);
  };

  const updateFormField = (
    field: keyof CreatePlanRequest,
    value: string | number | boolean | string[]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, ''],
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) =>
        i === index ? value : feature
      ),
    }));
  };

  const removeFeature = (index: number) => {
    if (formData.features.length > 1) {
      setFormData(prev => ({
        ...prev,
        features: prev.features.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Filter out empty features
      const filteredFeatures = formData.features.filter(
        feature => feature.trim() !== ''
      );

      if (filteredFeatures.length === 0) {
        throw new Error('Please add at least one feature');
      }

      const planData: CreatePlanRequest = {
        ...formData,
        features: filteredFeatures,
      };

      if (editingPlan) {
        console.log('Updating plan:', editingPlan.id, 'with data:', planData); // Debug log

        // UI-only edit functionality (no actual API call)
        // Update local state with edited data
        setPlans(prevPlans =>
          prevPlans.map(plan =>
            plan.id === editingPlan.id
              ? {
                  ...plan,
                  name: planData.name,
                  description: planData.description,
                  price: planData.price.toString(),
                  currency: planData.currency,
                  interval: planData.interval,
                  features: [...planData.features],
                  isActive: planData.isActive,
                }
              : plan
          )
        );

        toast.success('✨ Plan updated successfully! (UI only - no API call)', {
          position: 'top-right',
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        // Create new plan (actual API call)
        await createPlan(planData);
        toast.success('🎉 Plan created successfully!', {
          position: 'top-right',
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Reload plans after creation
        await loadPlans();
      }

      handleCloseForm();
    } catch (error) {
      const formError = error as FormError;
      const errorMessage =
        formError?.message ||
        `Failed to ${editingPlan ? 'update' : 'create'} plan`;
      setError(errorMessage);

      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return isNaN(numPrice) ? '0' : numPrice.toFixed(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Plan Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Create, edit, and manage your subscription plans
                </p>
              </div>
            </div>
            {loading && (
              <div className="flex items-center text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span className="text-sm font-medium">Loading...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Alert Messages */}
        {error && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-400 rounded-lg p-6 shadow-sm">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-red-800 font-semibold text-lg">Error</h3>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Info Banner for UI-only features */}
        <div className="mb-8 bg-blue-50 border-l-4 border-blue-400 rounded-lg p-6 shadow-sm">
          <div className="flex items-start">
            <AlertCircle className="w-6 h-6 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-blue-800 font-semibold text-lg">Demo Mode</h3>
              <p className="text-blue-700 mt-1">
                Edit and toggle features work for UI demonstration only. Only
                &quot;Create Plan&quot; makes actual API calls.
              </p>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Pricing Plans</h2>
            <p className="text-gray-600 mt-1">
              {plans.length} plan{plans.length !== 1 ? 's' : ''} available
            </p>
          </div>
          <button
            onClick={handleShowCreateForm}
            disabled
            className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
          >
            <Plus className="w-5 h-5 mr-2" />
            <span className="font-semibold">Add New Plan</span>
          </button>
        </div>

        {/* Plans Display */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">
                Loading plans...
              </h3>
              <p className="text-gray-500 mt-2">
                Please wait while we fetch your data
              </p>
            </div>
          </div>
        ) : (
          <>
            {plans.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <DollarSign className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-600 mb-2">
                  No plans found
                </h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  Get started by creating your first pricing plan. Define your
                  features, pricing, and billing intervals.
                </p>
                <button
                  onClick={handleShowCreateForm}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create First Plan
                </button>
              </div>
            ) : (
              <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {plans.map(plan => (
                  <div
                    key={plan.id}
                    className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative group"
                  >
                    {/* Header with Status and Actions */}
                    <div className="absolute top-4 right-4 flex items-center space-x-2">
                      {/* Status Toggle */}
                      <button
                        onClick={() => handleTogglePlanStatus(plan.id)}
                        disabled={togglingPlanId === plan.id}
                        className={`flex items-center px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                          plan.isActive
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        } ${togglingPlanId === plan.id ? 'opacity-50' : ''}`}
                      >
                        {togglingPlanId === plan.id ? (
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        ) : plan.isActive ? (
                          <Power className="w-3 h-3 mr-1" />
                        ) : (
                          <PowerOff className="w-3 h-3 mr-1" />
                        )}
                        {plan.isActive ? 'Active' : 'Inactive'}
                      </button>

                      {/* More Actions Dropdown */}
                      <div className="relative dropdown-container">
                        <button
                          onClick={e => handleDropdownToggle(plan.id, e)}
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* Dropdown Menu */}
                        {activeDropdown === plan.id && (
                          <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[140px] z-20">
                            <button
                              onClick={e => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleShowEditForm(plan);
                              }}
                              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <Edit3 className="w-4 h-4 mr-2" />
                              Edit Plan
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Plan Content */}
                    <div className="mt-4">
                      {/* Plan Header */}
                      <div className="mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2 pr-20">
                          {plan.name}
                        </h3>
                        <p className="text-gray-600">{plan.description}</p>
                      </div>

                      {/* Price */}
                      <div className="mb-6">
                        <div className="flex items-baseline">
                          <span className="text-3xl font-bold text-gray-900">
                            ${formatPrice(plan.price)}
                          </span>
                          <span className="text-gray-500 ml-2">
                            /{plan.interval}
                          </span>
                          <span className="text-xs text-gray-400 ml-2 uppercase">
                            {plan.currency}
                          </span>
                        </div>
                      </div>

                      {/* Features */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">
                          Features
                        </h4>
                        <ul className="space-y-2">
                          {plan.features && plan.features.length > 0 ? (
                            plan.features.map((feature, index) => (
                              <li
                                key={index}
                                className="flex items-center text-gray-600"
                              >
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                <span className="text-sm">{feature}</span>
                              </li>
                            ))
                          ) : (
                            <li className="flex items-center text-gray-500">
                              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                              <span className="text-sm">
                                No features listed
                              </span>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white bg-opacity-5 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingPlan ? 'Edit Plan' : 'Create New Plan'}
                </h2>
                {editingPlan && (
                  <p className="text-gray-600 mt-1">
                    Updating &quot;{editingPlan.name}&quot; (UI only)
                  </p>
                )}
              </div>
              <button
                onClick={handleCloseForm}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                disabled={saving}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Plan Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Plan Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => updateFormField('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter plan name..."
                  required
                  disabled={saving}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={e => updateFormField('description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                  placeholder="Enter plan description..."
                  required
                  disabled={saving}
                />
              </div>

              {/* Price and Currency */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={formData.price}
                      onChange={e =>
                        updateFormField('price', parseInt(e.target.value) || 0)
                      }
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="0"
                      min="0"
                      required
                      disabled={saving}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    value={formData.currency}
                    onChange={e => updateFormField('currency', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    disabled={saving}
                  >
                    <option value="usd">USD</option>
                    <option value="eur">EUR</option>
                    <option value="gbp">GBP</option>
                    <option value="cad">CAD</option>
                    <option value="inr">INR</option>
                  </select>
                </div>
              </div>

              {/* Billing Interval */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Billing Interval
                </label>
                <select
                  value={formData.interval}
                  onChange={e => updateFormField('interval', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  disabled={saving}
                >
                  <option value="month">Monthly</option>
                  <option value="year">Yearly</option>
                  <option value="week">Weekly</option>
                  <option value="day">Daily</option>
                </select>
              </div>

              {/* Active Status */}
              <div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <label className="text-sm font-semibold text-gray-700">
                      Plan Status
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.isActive
                        ? 'Plan is active and available for subscription'
                        : 'Plan is inactive and hidden from users'}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={e =>
                        updateFormField('isActive', e.target.checked)
                      }
                      className="sr-only peer"
                      disabled={saving}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              {/* Features */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    Features *
                  </label>
                  <button
                    type="button"
                    onClick={addFeature}
                    disabled={saving}
                    className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-semibold bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Feature
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 group"
                    >
                      <input
                        type="text"
                        value={feature}
                        onChange={e => updateFeature(index, e.target.value)}
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                        placeholder="Feature description..."
                        disabled={saving}
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          disabled={saving}
                          className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg opacity-0 group-hover:opacity-100 disabled:opacity-25 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  disabled={saving}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    saving ||
                    !formData.name.trim() ||
                    !formData.description.trim() ||
                    formData.features.every(f => f.trim() === '')
                  }
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 shadow-lg"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {editingPlan ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      {editingPlan ? 'Update Plan' : 'Create Plan'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="mt-16"
      />
    </div>
  );
}

export default PlanManagementPage;
