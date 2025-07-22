export const validateEmail = (email) => {
  const emailRegex = /\S+@\S+\.\S+/;
  if (!email.trim()) {
    return 'البريد الإلكتروني مطلوب';
  }
  if (!emailRegex.test(email)) {
    return 'البريد الإلكتروني غير صالح';
  }
  return null;
};

export const validatePassword = (password) => {
  if (!password) {
    return 'كلمة المرور مطلوبة';
  }
  if (password.length < 6) {
    return 'يجب أن تكون كلمة المرور 6 أحرف على الأقل';
  }
  return null;
};

export const validateName = (name) => {
  if (!name.trim()) {
    return 'الاسم مطلوب';
  }
  if (name.trim().length < 3) {
    return 'يجب أن يكون الاسم 3 أحرف على الأقل';
  }
  return null;
};

export const validateNationalId = (nationalId) => {
  if (!nationalId) {
    return 'الرقم القومي مطلوب';
  }
  if (!/^\d{14}$/.test(nationalId)) {
    return 'يجب أن يتكون الرقم القومي من 14 رقمًا';
  }
  return null;
};

export const validatePhone = (phone) => {
  if (!phone) {
    return 'رقم الهاتف مطلوب';
  }
  if (!/^01[0125]\d{8}$/.test(phone)) {
    return 'رقم هاتف غير صالح';
  }
  return null;
};

export const validateRequired = (value, fieldName) => {
  if (!value || !value.toString().trim()) {
    return `${fieldName} مطلوب`;
  }
  return null;
};

export const validatePasswordMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return 'كلمات المرور غير متطابقة';
  }
  return null;
};