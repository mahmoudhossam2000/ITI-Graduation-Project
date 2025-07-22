import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Title, Paragraph } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../contexts/AuthContext';

export default function HomeScreen({ navigation }) {
  const { currentUser } = useAuth();

  const features = [
    {
      title: 'سهولة الاستخدام',
      description: 'واجهة بسيطة وسلسة لأي مستخدم',
      icon: 'touch-app',
    },
    {
      title: 'إرفق مستنداتك بسهولة',
      description: 'أضف صور أو ملفات داعمة مع الشكوى',
      icon: 'attach-file',
    },
    {
      title: 'متابعة الشكوى',
      description: 'تابع حالة الشكوى خطوة بخطوة حتى يتم حلها',
      icon: 'track-changes',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>مرحباً بك في</Text>
          <Text style={styles.titleText}>
            منصة <Text style={styles.brandText}>شكوتك</Text>
          </Text>
          <Text style={styles.subtitleText}>
            لتقديم الشكاوى والمقترحات
          </Text>
          <Text style={styles.descriptionText}>
            سهّل على نفسك تقديم الشكاوى وربطها بالجهة المختصة، وتابع حالتها لحظة
            بلحظة من أي مكان.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {currentUser ? (
            <>
              <Button
                mode="contained"
                style={styles.primaryButton}
                onPress={() => navigation.navigate('Submit')}
                icon="edit"
              >
                تقديم شكوى
              </Button>
              <Button
                mode="outlined"
                style={styles.secondaryButton}
                onPress={() => navigation.navigate('Search')}
                icon="search"
              >
                متابعة شكوى
              </Button>
            </>
          ) : (
            <>
              <Button
                mode="contained"
                style={styles.primaryButton}
                onPress={() => navigation.navigate('Login')}
                icon="login"
              >
                تسجيل الدخول
              </Button>
              <Button
                mode="outlined"
                style={styles.secondaryButton}
                onPress={() => navigation.navigate('Signup')}
                icon="person-add"
              >
                إنشاء حساب
              </Button>
            </>
          )}
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>مميزات منصتنا</Text>
          <Text style={styles.sectionSubtitle}>
            كل ما تحتاجه لتقديم شكوى فعّالة وسريعة
          </Text>
          
          {features.map((feature, index) => (
            <Card key={index} style={styles.featureCard}>
              <Card.Content style={styles.featureContent}>
                <Icon 
                  name={feature.icon} 
                  size={40} 
                  color="#27548A" 
                  style={styles.featureIcon}
                />
                <View style={styles.featureText}>
                  <Title style={styles.featureTitle}>{feature.title}</Title>
                  <Paragraph style={styles.featureDescription}>
                    {feature.description}
                  </Paragraph>
                </View>
              </Card.Content>
            </Card>
          ))}
        </View>

        {/* Privacy Section */}
        <View style={styles.privacySection}>
          <Text style={styles.privacyTitle}>نحافظ على خصوصيتك</Text>
          <Text style={styles.privacyText}>
            بياناتك مشفرة ومحفوظة بأعلى معايير الأمان – لا تتم مشاركة معلوماتك
            مع أي جهة غير مصرح لها.
          </Text>
          <View style={styles.privacyBadges}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>تشفير البيانات</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>اتصال آمن</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>خصوصية تامة</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 18,
    color: '#183B4E',
    marginBottom: 5,
    textAlign: 'center',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#183B4E',
    textAlign: 'center',
    marginBottom: 5,
  },
  brandText: {
    color: '#27548A',
  },
  subtitleText: {
    fontSize: 16,
    color: '#183B4E',
    textAlign: 'center',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  actionButtons: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  primaryButton: {
    marginBottom: 10,
    backgroundColor: '#27548A',
  },
  secondaryButton: {
    borderColor: '#27548A',
  },
  featuresSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#183B4E',
    textAlign: 'center',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  featureCard: {
    marginBottom: 15,
    elevation: 2,
  },
  featureContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    marginRight: 15,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27548A',
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
  },
  privacySection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 20,
  },
  privacyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#183B4E',
    textAlign: 'center',
    marginBottom: 10,
  },
  privacyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 15,
  },
  privacyBadges: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  badge: {
    backgroundColor: '#27548A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    margin: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
});