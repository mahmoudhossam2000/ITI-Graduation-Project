import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import Toast from 'react-native-toast-message';

const SignupScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    nationalId: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { signup, signInWithGoogle } = useAuth();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'الاسم مطلوب';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'يجب أن يكون الاسم 3 أحرف على الأقل';
    }

    if (!formData.nationalId) {
      newErrors.nationalId = 'الرقم القومي مطلوب';
    } else if (!/^\d{14}$/.test(formData.nationalId)) {
      newErrors.nationalId = 'يجب أن يتكون الرقم القومي من 14 رقمًا';
    }

    if (!formData.phone) {
      newErrors.phone = 'رقم الهاتف مطلوب';
    } else if (!/^01[0125]\d{8}$/.test(formData.phone)) {
      newErrors.phone = 'رقم هاتف غير صالح';
    }

    if (!formData.email) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صالح';
    }

    if (!formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (formData.password.length < 6) {
      newErrors.password = 'يجب أن تكون كلمة المرور 6 أحرف على الأقل';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'كلمات المرور غير متطابقة';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    if ((field === 'nationalId' || field === 'phone') && value !== '' && !/^\d*$/.test(value)) {
      return;
    }

    setFormData({
      ...formData,
      [field]: value,
    });

    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: '',
      });
    }
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await signup(formData.email, formData.password);
      Toast.show({
        type: 'success',
        text1: 'تم إنشاء الحساب بنجاح',
        text1Style: { textAlign: 'right' },
      });
      navigation.navigate('Login');
    } catch (error) {
      console.error('Signup error:', error);
      Toast.show({
        type: 'error',
        text1: 'فشل إنشاء الحساب، حاول مرة أخرى',
        text1Style: { textAlign: 'right' },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await signInWithGoogle();
      Toast.show({
        type: 'success',
        text1: 'تم إنشاء الحساب باستخدام جوجل',
        text1Style: { textAlign: 'right' },
      });
      navigation.navigate('Home');
    } catch (error) {
      console.error('Google sign-up error:', error);
      Toast.show({
        type: 'error',
        text1: 'فشل إنشاء الحساب باستخدام جوجل',
        text1Style: { textAlign: 'right' },
      });
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>إنشاء حساب جديد</Text>
        <Text style={styles.subtitle}>انضم إلينا اليوم</Text>
      </View>

      <View style={styles.form}>
        <CustomInput
          label="الاسم الكامل"
          value={formData.name}
          onChangeText={(value) => handleChange('name', value)}
          placeholder="الاسم الكامل"
          error={errors.name}
        />

        <CustomInput
          label="الرقم القومي"
          value={formData.nationalId}
          onChangeText={(value) => handleChange('nationalId', value)}
          placeholder="الرقم القومي (14 رقم)"
          keyboardType="numeric"
          maxLength={14}
          error={errors.nationalId}
        />

        <CustomInput
          label="رقم الهاتف"
          value={formData.phone}
          onChangeText={(value) => handleChange('phone', value)}
          placeholder="رقم الهاتف (11 رقم)"
          keyboardType="numeric"
          maxLength={11}
          error={errors.phone}
        />

        <CustomInput
          label="البريد الإلكتروني"
          value={formData.email}
          onChangeText={(value) => handleChange('email', value)}
          placeholder="البريد الإلكتروني"
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
        />

        <CustomInput
          label="كلمة المرور"
          value={formData.password}
          onChangeText={(value) => handleChange('password', value)}
          placeholder="كلمة المرور (6 أحرف على الأقل)"
          secureTextEntry
          error={errors.password}
        />

        <CustomInput
          label="تأكيد كلمة المرور"
          value={formData.confirmPassword}
          onChangeText={(value) => handleChange('confirmPassword', value)}
          placeholder="تأكيد كلمة المرور"
          secureTextEntry
          error={errors.confirmPassword}
        />

        <CustomButton
          title={loading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
          onPress={handleSignup}
          disabled={loading}
          style={styles.signupButton}
        />

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>أو</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignUp}>
          <Ionicons name="logo-google" size={20} color="#DB4437" />
          <Text style={styles.googleButtonText}>التسجيل باستخدام جوجل</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>لديك حساب بالفعل؟</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.footerLink}>تسجيل الدخول</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#183B4E',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  form: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  signupButton: {
    marginTop: 10,
    marginBottom: 20,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#6B7280',
    fontSize: 14,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  googleButtonText: {
    marginRight: 12,
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  footerText: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 8,
  },
  footerLink: {
    fontSize: 16,
    color: '#27548A',
    fontWeight: '600',
  },
});

export default SignupScreen;