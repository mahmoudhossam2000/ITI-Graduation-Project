import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
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

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'البريد الإلكتروني غير صالح';
    }

    if (!password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (password.length < 6) {
      newErrors.password = 'يجب أن تكون كلمة المرور 6 أحرف على الأقل';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        Toast.show({
          type: 'success',
          text1: 'تم تسجيل الدخول بنجاح',
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
        text1: 'حدث خطأ أثناء تسجيل الدخول',
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
        <View style={styles.content}>
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.header}>
                <Icon name="login" size={48} color="#27548A" />
                <Title style={styles.title}>تسجيل الدخول</Title>
              </View>

              <TextInput
                label="البريد الإلكتروني"
                value={email}
                onChangeText={setEmail}
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
                value={password}
                onChangeText={setPassword}
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

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>نسيت كلمة المرور؟</Text>
              </TouchableOpacity>

              <Button
                mode="contained"
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
                style={styles.loginButton}
              >
                تسجيل الدخول
              </Button>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>أو</Text>
                <View style={styles.dividerLine} />
              </View>

              <Button
                mode="outlined"
                onPress={() => {/* Handle Google login */}}
                style={styles.googleButton}
                icon="google"
              >
                تسجيل الدخول باستخدام جوجل
              </Button>

              <View style={styles.footer}>
                <Text style={styles.footerText}>ليس لديك حساب؟ </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                  <Text style={styles.signupLink}>إنشاء حساب جديد</Text>
                </TouchableOpacity>
              </View>
            </Card.Content>
          </Card>
        </View>
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
    flex: 1,
    justifyContent: 'center',
    padding: 16,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#27548A',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#27548A',
    paddingVertical: 8,
    marginBottom: 16,
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
  signupLink: {
    color: '#27548A',
    fontSize: 14,
    fontWeight: 'bold',
  },
});