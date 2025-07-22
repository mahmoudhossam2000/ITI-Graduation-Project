import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  TextInput,
  Button,
  Card,
  Title,
  HelperText,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../contexts/AuthContext';
import Toast from 'react-native-toast-message';

export default function SignupScreen({ navigation }) {
  const [formData, setFormData] = useState({
    name: '',
    nationalId: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();

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

  const handleInputChange = (field, value) => {
    // Only allow numbers for nationalId and phone
    if ((field === 'nationalId' || field === 'phone') && value !== '' && !/^\d*$/.test(value)) {
      return;
    }

    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const result = await signup(formData);
      if (result.success) {
        Toast.show({
          type: 'success',
          text1: 'تم إنشاء الحساب بنجاح',
          position: 'bottom',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: result.error,
          position: 'bottom',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'حدث خطأ أثناء إنشاء الحساب',
        position: 'bottom',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Card style={styles.card}>
              <Card.Content>
                <View style={styles.header}>
                  <Icon name="person-add" size={48} color="#27548A" />
                  <Title style={styles.title}>إنشاء حساب جديد</Title>
                </View>

                <TextInput
                  label="الاسم الكامل"
                  value={formData.name}
                  onChangeText={(value) => handleInputChange('name', value)}
                  style={styles.input}
                  error={!!errors.name}
                  mode="outlined"
                  left={<TextInput.Icon icon="person" />}
                />
                <HelperText type="error" visible={!!errors.name}>
                  {errors.name}
                </HelperText>

                <TextInput
                  label="الرقم القومي"
                  value={formData.nationalId}
                  onChangeText={(value) => handleInputChange('nationalId', value)}
                  style={styles.input}
                  error={!!errors.nationalId}
                  mode="outlined"
                  keyboardType="numeric"
                  maxLength={14}
                  left={<TextInput.Icon icon="fingerprint" />}
                />
                <HelperText type="error" visible={!!errors.nationalId}>
                  {errors.nationalId}
                </HelperText>

                <TextInput
                  label="رقم الهاتف"
                  value={formData.phone}
                  onChangeText={(value) => handleInputChange('phone', value)}
                  style={styles.input}
                  error={!!errors.phone}
                  mode="outlined"
                  keyboardType="numeric"
                  maxLength={11}
                  left={<TextInput.Icon icon="phone" />}
                />
                <HelperText type="error" visible={!!errors.phone}>
                  {errors.phone}
                </HelperText>

                <TextInput
                  label="البريد الإلكتروني"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  style={styles.input}
                  error={!!errors.email}
                  mode="outlined"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  left={<TextInput.Icon icon="email" />}
                />
                <HelperText type="error" visible={!!errors.email}>
                  {errors.email}
                </HelperText>

                <TextInput
                  label="كلمة المرور"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  style={styles.input}
                  error={!!errors.password}
                  mode="outlined"
                  secureTextEntry={!showPassword}
                  left={<TextInput.Icon icon="lock" />}
                  right={
                    <TextInput.Icon
                      icon={showPassword ? 'eye-off' : 'eye'}
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  }
                />
                <HelperText type="error" visible={!!errors.password}>
                  {errors.password}
                </HelperText>

                <TextInput
                  label="تأكيد كلمة المرور"
                  value={formData.confirmPassword}
                  onChangeText={(value) => handleInputChange('confirmPassword', value)}
                  style={styles.input}
                  error={!!errors.confirmPassword}
                  mode="outlined"
                  secureTextEntry={!showConfirmPassword}
                  left={<TextInput.Icon icon="lock-check" />}
                  right={
                    <TextInput.Icon
                      icon={showConfirmPassword ? 'eye-off' : 'eye'}
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                  }
                />
                <HelperText type="error" visible={!!errors.confirmPassword}>
                  {errors.confirmPassword}
                </HelperText>

                <Button
                  mode="contained"
                  onPress={handleSignup}
                  loading={loading}
                  disabled={loading}
                  style={styles.signupButton}
                >
                  إنشاء حساب
                </Button>

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>أو</Text>
                  <View style={styles.dividerLine} />
                </View>

                <Button
                  mode="outlined"
                  onPress={() => {/* Handle Google signup */}}
                  style={styles.googleButton}
                  icon="google"
                >
                  التسجيل باستخدام جوجل
                </Button>

                <View style={styles.footer}>
                  <Text style={styles.footerText}>لديك حساب بالفعل؟ </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginLink}>تسجيل الدخول</Text>
                  </TouchableOpacity>
                </View>
              </Card.Content>
            </Card>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 40,
  },
  card: {
    elevation: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#183B4E',
    marginTop: 8,
  },
  input: {
    marginBottom: 4,
    backgroundColor: '#FFFFFF',
  },
  signupButton: {
    backgroundColor: '#27548A',
    paddingVertical: 8,
    marginBottom: 16,
    marginTop: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
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
    borderColor: '#27548A',
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#6B7280',
    fontSize: 14,
  },
  loginLink: {
    color: '#27548A',
    fontSize: 14,
    fontWeight: 'bold',
  },
});