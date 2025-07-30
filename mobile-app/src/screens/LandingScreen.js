import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Title, Paragraph } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../theme/theme';

const { width } = Dimensions.get('window');

export default function LandingScreen({ navigation }) {
  const { currentUser } = useAuth();

  const features = [
    {
      title: 'سهولة الاستخدام',
      description: 'واجهة بسيطة وسلسة لأي مستخدم',
      icon: 'touch-app',
    },
    {
      title: 'إرفق مستنداتك بسهولة',
      description: 'أضف صور أو ملفات داعمة مع الشكوى لتوضيح المشكلة بشكل أفضل.',
      icon: 'attach-file',
    },
    {
      title: 'متابعة الشكوى',
      description: 'تابع حالة الشكوى خطوة بخطوة حتى يتم حلها',
      icon: 'track-changes',
    },
  ];

  const ministries = [
    'وزارة الصحة', 'وزارة التعليم', 'وزارة الداخلية', 'وزارة التموين',
    'وزارة الكهرباء والطاقة', 'وزارة النقل', 'وزارة البيئة', 'وزارة التضامن الاجتماعي'
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroContent}>
            <Text style={styles.welcomeText}>مرحباً بك في</Text>
            <Text style={styles.titleText}>
              منصة <Text style={styles.brandText}>شكوتك</Text> لتقديم الشكاوى والمقترحات
            </Text>
            <Text style={styles.descriptionText}>
              سهّل على نفسك تقديم الشكاوى وربطها بالجهة المختصة، وتابع حالتها لحظة بلحظة من أي مكان.
            </Text>
            
            {currentUser ? (
              <Button
                mode="contained"
                style={styles.primaryButton}
                onPress={() => navigation.navigate('Submit')}
                icon="edit"
              >
                تقديم شكوى
              </Button>
            ) : (
              <Button
                mode="contained"
                style={styles.primaryButton}
                onPress={() => navigation.navigate('Login')}
                icon="login"
              >
                تسجيل الدخول
              </Button>
            )}
          </View>
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
                  color={colors.blue} 
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
            بياناتك مشفرة ومحفوظة بأعلى معايير الأمان – لا تتم مشاركة معلوماتك مع أي جهة غير مصرح لها.
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

        {/* About Section */}
        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>عن منصة شكوتك</Text>
          
          <Card style={styles.aboutCard}>
            <Card.Content>
              <Title style={styles.aboutCardTitle}>المشكلة الأساسية</Title>
              <View style={styles.aboutList}>
                <Text style={styles.aboutListItem}>
                  • معاناة المواطنين من مشاكل مستمرة في الخدمات اليومية (مياه– كهرباء– مستشفيات– مدارس– طرق...)
                </Text>
                <Text style={styles.aboutListItem}>
                  • عدم وجود نظام موحد لتقديم الشكاوى أو الاقتراحات
                </Text>
                <Text style={styles.aboutListItem}>
                  • عدم وجود وسيلة واضحة للمتابعة بعد تقديم الشكوى
                </Text>
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.aboutCard}>
            <Card.Content>
              <Title style={styles.aboutCardTitle}>الحل المقترح</Title>
              <View style={styles.aboutList}>
                <Text style={styles.aboutListItem}>
                  • منصة رقمية تمكِّن المواطن من تقديم الشكاوى والاقتراحات بسهولة
                </Text>
                <Text style={styles.aboutListItem}>
                  • ربط تلقائي بين الشكوى والجهة المختصة حسب نوعها وموقعها
                </Text>
                <Text style={styles.aboutListItem}>
                  • إتاحة الردود من الجهات مع إشعارات ومتابعة الحالة
                </Text>
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Ministries Section */}
        <View style={styles.ministriesSection}>
          <Text style={styles.ministriesTitle}>الجهات المشاركة في المنصة</Text>
          <View style={styles.ministriesGrid}>
            {ministries.map((ministry, index) => (
              <View key={index} style={styles.ministryCard}>
                <Icon name="business" size={24} color={colors.blue} />
                <Text style={styles.ministryText}>{ministry}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            جميع الحقوق محفوظة © 2025 - شكوتك
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  heroSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
    maxWidth: width - 40,
  },
  welcomeText: {
    fontSize: 20,
    color: colors.darkTeal,
    marginBottom: 8,
    textAlign: 'center',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.darkTeal,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 32,
  },
  brandText: {
    color: colors.blue,
  },
  descriptionText: {
    fontSize: 16,
    color: colors.darkTeal,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: colors.blue,
    paddingHorizontal: 24,
    paddingVertical: 4,
  },
  featuresSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.darkTeal,
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: colors.darkTeal,
    textAlign: 'center',
    marginBottom: 24,
  },
  featureCard: {
    marginBottom: 16,
    elevation: 2,
    backgroundColor: colors.background,
  },
  featureContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 8,
  },
  featureIcon: {
    marginRight: 16,
    marginTop: 4,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.blue,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.darkTeal,
    lineHeight: 20,
  },
  privacySection: {
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  privacyTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.darkTeal,
    textAlign: 'center',
    marginBottom: 16,
  },
  privacyText: {
    fontSize: 16,
    color: colors.darkTeal,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  privacyBadges: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  badge: {
    backgroundColor: colors.blue,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  aboutSection: {
    backgroundColor: colors.customBg,
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  aboutTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.darkTeal,
    textAlign: 'center',
    marginBottom: 24,
  },
  aboutCard: {
    marginBottom: 16,
    elevation: 2,
  },
  aboutCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.blue,
    marginBottom: 12,
  },
  aboutList: {
    paddingLeft: 8,
  },
  aboutListItem: {
    fontSize: 14,
    color: colors.darkTeal,
    lineHeight: 22,
    marginBottom: 8,
  },
  ministriesSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  ministriesTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.darkTeal,
    textAlign: 'center',
    marginBottom: 24,
  },
  ministriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  ministryCard: {
    width: '48%',
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 1,
  },
  ministryText: {
    fontSize: 12,
    color: colors.darkTeal,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },
  footer: {
    backgroundColor: colors.darkTeal,
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});