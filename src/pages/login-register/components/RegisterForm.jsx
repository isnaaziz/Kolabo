import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../contexts/ToastContext';

const RegisterForm = ({ onSuccess }) => {
  const { register } = useAuth();
  const { showSuccessToast, showErrorToast } = useToast();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: []
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Check password strength in real-time
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    const feedback = [];
    let score = 0;

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('At least 8 characters');
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One uppercase letter');
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One lowercase letter');
    }

    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('One number');
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One special character');
    }

    setPasswordStrength({ score, feedback });
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength.score) {
      case 0:
      case 1: return 'bg-error';
      case 2:
      case 3: return 'bg-warning';
      case 4:
      case 5: return 'bg-success';
      default: return 'bg-secondary-300';
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength.score) {
      case 0:
      case 1: return 'Weak';
      case 2:
      case 3: return 'Medium';
      case 4:
      case 5: return 'Strong';
      default: return '';
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters long';
    } else if (formData.username.length > 50) {
      newErrors.username = 'Username must not exceed 50 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (passwordStrength.score < 3) {
      newErrors.password = 'Password is too weak';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      // Registration successful, show success message and redirect to login
      showSuccessToast('Account created successfully! Please login to continue.', {
        title: 'Registration Successful',
        duration: 5000
      });

      // Call onSuccess to switch to login form (don't auto-login)
      onSuccess();

    } catch (error) {
      console.error('Registration error:', error);

      // Show error toast
      showErrorToast(error.message || 'Registration failed. Please try again.', {
        title: 'Registration Failed',
        duration: 6000
      });

      setErrors({
        general: error.message || 'Registration failed. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* General Error */}
      {errors.general && (
        <div className="p-4 bg-error-50 border border-error-100 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} color="var(--color-error)" />
            <p className="text-sm text-error">{errors.general}</p>
          </div>
        </div>
      )}

      {/* Username Field */}
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-text-primary mb-2">
          Username
        </label>
        <div className="relative">
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 pl-12 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${errors.username ? 'border-error' : 'border-border'
              }`}
            placeholder="john_doe"
            minLength={3}
            maxLength={50}
          />
          <Icon
            name="User"
            size={20}
            color={errors.username ? 'var(--color-error)' : 'var(--color-secondary-400)'}
            className="absolute left-4 top-1/2 transform -translate-y-1/2"
          />
        </div>
        {errors.username && (
          <p className="mt-1 text-sm text-error flex items-center space-x-1">
            <Icon name="AlertCircle" size={14} />
            <span>{errors.username}</span>
          </p>
        )}
        <p className="mt-1 text-xs text-text-secondary">
          Username must be 3-50 characters long. Use letters, numbers, and underscores.
        </p>
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
          Email address
        </label>
        <div className="relative">
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 pl-12 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${errors.email ? 'border-error' : 'border-border'
              }`}
            placeholder="john.doe@company.com"
          />
          <Icon
            name="Mail"
            size={20}
            color={errors.email ? 'var(--color-error)' : 'var(--color-secondary-400)'}
            className="absolute left-4 top-1/2 transform -translate-y-1/2"
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-sm text-error flex items-center space-x-1">
            <Icon name="AlertCircle" size={14} />
            <span>{errors.email}</span>
          </p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 pl-12 pr-12 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${errors.password ? 'border-error' : 'border-border'
              }`}
            placeholder="Create a strong password"
          />
          <Icon
            name="Lock"
            size={20}
            color={errors.password ? 'var(--color-error)' : 'var(--color-secondary-400)'}
            className="absolute left-4 top-1/2 transform -translate-y-1/2"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-text-primary transition-colors duration-200"
          >
            <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={20} />
          </button>
        </div>

        {/* Password Strength Indicator */}
        {formData.password && (
          <div className="mt-2">
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex-1 bg-secondary-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                  style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium text-text-secondary">
                {getPasswordStrengthText()}
              </span>
            </div>
            {passwordStrength.feedback.length > 0 && (
              <div className="text-xs text-text-secondary">
                <p>Password needs:</p>
                <ul className="list-disc list-inside ml-2">
                  {passwordStrength.feedback.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {errors.password && (
          <p className="mt-1 text-sm text-error flex items-center space-x-1">
            <Icon name="AlertCircle" size={14} />
            <span>{errors.password}</span>
          </p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary mb-2">
          Confirm password
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 pl-12 pr-12 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${errors.confirmPassword ? 'border-error' : 'border-border'
              }`}
            placeholder="Confirm your password"
          />
          <Icon
            name="Lock"
            size={20}
            color={errors.confirmPassword ? 'var(--color-error)' : 'var(--color-secondary-400)'}
            className="absolute left-4 top-1/2 transform -translate-y-1/2"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-text-primary transition-colors duration-200"
          >
            <Icon name={showConfirmPassword ? 'EyeOff' : 'Eye'} size={20} />
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-error flex items-center space-x-1">
            <Icon name="AlertCircle" size={14} />
            <span>{errors.confirmPassword}</span>
          </p>
        )}
      </div>

      {/* Terms Agreement */}
      <div>
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleInputChange}
            className="w-4 h-4 text-primary border-border rounded focus:ring-primary-500 mt-1"
          />
          <span className="text-sm text-text-secondary">
            I agree to the{' '}
            <button type="button" className="text-primary hover:text-primary-700 transition-colors duration-200">
              Terms of Service
            </button>{' '}
            and{' '}
            <button type="button" className="text-primary hover:text-primary-700 transition-colors duration-200">
              Privacy Policy
            </button>
          </span>
        </label>
        {errors.agreeToTerms && (
          <p className="mt-1 text-sm text-error flex items-center space-x-1">
            <Icon name="AlertCircle" size={14} />
            <span>{errors.agreeToTerms}</span>
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Creating Account...</span>
          </>
        ) : (
          <>
            <Icon name="UserPlus" size={20} />
            <span>Create Account</span>
          </>
        )}
      </button>
    </form>
  );
};

export default RegisterForm;