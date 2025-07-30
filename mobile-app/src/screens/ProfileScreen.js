import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Card,
  Title,
  Button,
  Avatar,
  Divider,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useAuth } from '../contexts/AuthContext';
import { colors } from '../theme/theme';

export default function ProfileScreen({ navigation }) {
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'تسجيل الخروج',
      'هل أنت متأكد من أنك تريد تسجيل الخروج؟',
      [
        {
          text: 'إلغاء',
          style: 'cancel',
        },
        {
          text: 'تسجيل الخروج',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'حذف الحساب',
      'هل أنت متأكد من أنك تريد حذف حسابك؟ هذا الإجراء لا يمكن التراجع عنه.',
      [
        {
          text: 'إلغاء',
          style: 'cancel',
        },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: () => {
            console.log('Delete account');
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      title: 'تغيير كلمة المرور',
      icon: 'lock',
      onPress: () => console.log('Change password'),
    },
    {
      title: 'الإشعارات',
      icon: 'notifications',
      onPress: () => console.log('Notifications'),
    },
    {
      title: 'الخصوصية والأمان',
      icon: 'security',
      onPress: () => console.log('Privacy'),
    },
    {
      title: 'المساعدة والدعم',
      icon: 'help',
      onPress: () => console.log('Help'),
    },
    {
      title: 'حول التطبيق',
      icon: 'info',
      onPress: () => console.log('About'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <Card style={styles.profileCard}>
          <Card.Content style={styles.profileContent}>
            <Avatar.Icon 
              size={80} 
              icon="person" 
              style={styles.avatar}
              color="#FFFFFF"
            />
            <Title style={styles.userName}>
              {currentUser?.name || 'مستخدم'}
            </Title>
            <Text style={styles.userEmail}>
              {currentUser?.email || 'user@example.com'}
            </Text>
            <View style={styles.statusBadge}>
              <Icon name="verified" size={16} color="#10B981" />
              <Text style={styles.statusText}>حساب مفعل</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Account Information */}
        <Card style={styles.infoCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>معلومات الحساب</Title>
            
            <View style={styles.infoRow}>
              <Icon name="email" size={20} color="#6B7280" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>البريد الإلكتروني</Text>
                <Text style={styles.infoValue}>
                  {currentUser?.email || 'user@example.com'}
                </Text>
              </View>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.infoRow}>
              <Icon name="phone" size={20} color="#6B7280" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>رقم الهاتف</Text>
                <Text style={styles.infoValue}>
                  {currentUser?.phone || 'غير محدد'}
                </Text>
              </View>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.infoRow}>
              <Icon name="fingerprint" size={20} color="#6B7280" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>الرقم القومي</Text>
                <Text style={styles.infoValue}>
                  {currentUser?.nationalId || 'غير محدد'}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Menu Items */}
        <Card style={styles.menuCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>الإعدادات</Title>
            
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={item.onPress}
              >
                <Icon name={item.icon} size={24} color={colors.blue} />
                <Text style={styles.menuItemText}>{item.title}</Text>
                <Icon name="chevron-right" size={24} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            mode="outlined"
            onPress={handleLogout}
            style={styles.logoutButton}
            textColor="#EF4444"
            icon="logout"
          >
            تسجيل الخروج
          </Button>

          <Button
            mode="outlined"
            onPress={handleDeleteAccount}
            style={styles.deleteButton}
            textColor="#EF4444"
            icon="delete"
          >
            حذف الحساب
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  profileCard: {
    margin: 16,
    elevation: 4,
  },
  profileContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    backgroundColor: colors.blue,
    marginBottom: 12,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.darkTeal,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  infoCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  menuCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.darkTeal,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  divider: {
    marginVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
  },
  actionButtons: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  logoutButton: {
    borderColor: '#EF4444',
    marginBottom: 12,
  },
  deleteButton: {
    borderColor: '#EF4444',
  },
});