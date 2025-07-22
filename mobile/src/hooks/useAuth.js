import { useState } from 'react';
import { useAuth as useAuthContext } from '../contexts/AuthContext';
import ApiService from '../services/api';
import { 
  validateEmail, 
  validatePassword, 
  validateName, 
  validateNationalId, 
  validatePhone,
  validatePasswordMatch 
} from '../utils/validation';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuthContext();

  const validateForm = (email, password) => {
    const newErrors = {};
    
    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;
    
    const passwordError = validatePassword(password);
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (email, password) => {
    if (!validateForm(email, password)) {
      return { success: false, errors };
    }

    setLoading(true);
    try {
      const result = await login(email, password);
      return result;
    } catch (error) {
      return { 
        success: false, 
        error: 'حدث خطأ أثناء تسجيل الدخول' 
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    errors,
    handleLogin,
    setErrors,
  };
};

export const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { signup } = useAuthContext();

  const validateForm = (formData) => {
    const newErrors = {};
    
    const nameError = validateName(formData.name);
    if (nameError) newErrors.name = nameError;
    
    const nationalIdError = validateNationalId(formData.nationalId);
    if (nationalIdError) newErrors.nationalId = nationalIdError;
    
    const phoneError = validatePhone(formData.phone);
    if (phoneError) newErrors.phone = phoneError;
    
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;
    
    const passwordMatchError = validatePasswordMatch(
      formData.password, 
      formData.confirmPassword
    );
    if (passwordMatchError) newErrors.confirmPassword = passwordMatchError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (formData) => {
    if (!validateForm(formData)) {
      return { success: false, errors };
    }

    setLoading(true);
    try {
      const result = await signup(formData);
      return result;
    } catch (error) {
      return { 
        success: false, 
        error: 'حدث خطأ أثناء إنشاء الحساب' 
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    errors,
    handleSignup,
    setErrors,
  };
};