import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import Toast from 'react-native-toast-message';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signInWithGoogle } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'يرجى إدخال البريد الإلكتروني وكلمة المرور',
        text1Style: { textAlign: 'right' },
      });
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      Toast.show({
        type: 'success',
        text1: 'تم تسجيل الدخول بنجاح',
        text1Style: { textAlign: 'right' },
      });
      navigation.navigate('Home');
    } catch (error) {
      console.error('Login error:', error);
      Toast.show({
        type: 'error',
        text1: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
        text1Style: { textAlign: 'right' },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      Toast.show({
        type: 'success',
        text1: 'تم تسجيل الدخول باستخدام جوجل',
        text1Style: { textAlign: 'right' },
      });
      navigation.navigate('Home');
    } catch (error) {
      console.error('Google sign-in error:', error);
      Toast.show({
        type: 'error',
        text1: 'فشل تسجيل الدخول باستخدام جوجل',
        text1Style: { textAlign: 'right' },
      });
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>تسجيل الدخول</Text>
        <Text style={styles.subtitle}>مرحباً بك مرة أخرى</Text>
      </View>

      <View style={styles.form}>
        <CustomInput
          label="البريد الإلكتروني"
          value={email}
          onChangeText={setEmail}
          placeholder="البريد الإلكتروني"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <CustomInput
          label="كلمة المرور"
          value={password}
          onChangeText={setPassword}
          placeholder="كلمة المرور"
          secureTextEntry
        />

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>نسيت كلمة المرور؟</Text>
        </TouchableOpacity>

        <CustomButton
          title={loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          onPress={handleLogin}
          disabled={loading}
          style={styles.loginButton}
        />

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>أو</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
          <Ionicons name="logo-google" size={20} color="#DB4437" />
          <Text style={styles.googleButtonText}>تسجيل الدخول باستخدام جوجل</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>ليس لديك حساب؟</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.footerLink}>إنشاء حساب جديد</Text>
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
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#27548A',
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
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

export default LoginScreen;