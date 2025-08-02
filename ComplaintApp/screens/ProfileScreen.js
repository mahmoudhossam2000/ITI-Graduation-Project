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
import CustomButton from '../components/CustomButton';
import Toast from 'react-native-toast-message';

const ProfileScreen = ({ navigation }) => {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      'تسجيل الخروج',
      'هل أنت متأكد من رغبتك في تسجيل الخروج؟',
      [
        {
          text: 'إلغاء',
          style: 'cancel',
        },
        {
          text: 'تسجيل الخروج',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              Toast.show({
                type: 'success',
                text1: 'تم تسجيل الخروج بنجاح',
                text1Style: { textAlign: 'right' },
              });
              navigation.navigate('Home');
            } catch (error) {
              console.error('Logout error:', error);
              Toast.show({
                type: 'error',
                text1: 'حدث خطأ أثناء تسجيل الخروج',
                text1Style: { textAlign: 'right' },
              });
            }
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      icon: 'person-outline',
      title: 'معلومات الحساب',
      subtitle: 'عرض وتعديل معلومات الحساب',
      onPress: () => {},
    },
    {
      icon: 'document-text-outline',
      title: 'شكاويي',
      subtitle: 'عرض جميع الشكاوى المقدمة',
      onPress: () => navigation.navigate('MyComplaints'),
    },
    {
      icon: 'notifications-outline',
      title: 'الإشعارات',
      subtitle: 'إعدادات الإشعارات',
      onPress: () => {},
    },
    {
      icon: 'help-circle-outline',
      title: 'المساعدة والدعم',
      subtitle: 'الحصول على المساعدة',
      onPress: () => {},
    },
    {
      icon: 'settings-outline',
      title: 'الإعدادات',
      subtitle: 'إعدادات التطبيق',
      onPress: () => {},
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={40} color="#FFFFFF" />
        </View>
        <Text style={styles.userName}>
          {currentUser?.displayName || 'المستخدم'}
        </Text>
        <Text style={styles.userEmail}>{currentUser?.email}</Text>
        <View style={styles.statusBadge}>
          <Ionicons name="checkmark-circle" size={16} color="#10B981" />
          <Text style={styles.statusText}>حساب مفعل</Text>
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <View style={styles.menuItemContent}>
              <View style={styles.menuItemIcon}>
                <Ionicons name={item.icon} size={24} color="#27548A" />
              </View>
              <View style={styles.menuItemText}>
                <Text style={styles.menuItemTitle}>{item.title}</Text>
                <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
              </View>
            </View>
            <Ionicons name="chevron-back-outline" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Section */}
      <View style={styles.logoutSection}>
        <CustomButton
          title="تسجيل الخروج"
          onPress={handleLogout}
          variant="outline"
          style={styles.logoutButton}
        />
      </View>

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appInfoText}>شكوتك - الإصدار 1.0.0</Text>
        <Text style={styles.appInfoText}>جميع الحقوق محفوظة © 2025</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  profileHeader: {
    backgroundColor: '#27548A',
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#183B4E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 6,
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#183B4E',
    marginBottom: 2,
    textAlign: 'right',
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'right',
  },
  logoutSection: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  logoutButton: {
    borderColor: '#EF4444',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  appInfoText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 4,
  },
});

export default ProfileScreen;