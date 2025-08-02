import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../components/CustomButton';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const features = [
    {
      icon: 'phone-portrait-outline',
      title: 'سهولة الاستخدام',
      description: 'واجهة بسيطة وسلسة لأي مستخدم',
    },
    {
      icon: 'document-attach-outline',
      title: 'إرفاق المستندات',
      description: 'أضف صور أو ملفات داعمة مع الشكوى',
    },
    {
      icon: 'notifications-outline',
      title: 'متابعة الشكوى',
      description: 'تابع حالة الشكوى خطوة بخطوة',
    },
    {
      icon: 'shield-checkmark-outline',
      title: 'أمان وحماية',
      description: 'بيانات محمية وفق أعلى معايير الأمان',
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <LinearGradient
        colors={['#27548A', '#183B4E']}
        style={styles.heroSection}
      >
        <View style={styles.heroContent}>
          <Text style={styles.welcomeText}>مرحباً بك في</Text>
          <Text style={styles.appTitle}>منصة شكوتك</Text>
          <Text style={styles.heroDescription}>
            سهّل على نفسك تقديم الشكاوى وربطها بالجهة المختصة، وتابع حالتها لحظة بلحظة
          </Text>
          <CustomButton
            title="تقديم شكوى"
            onPress={() => navigation.navigate('SubmitComplaint')}
            style={styles.heroButton}
          />
        </View>
      </LinearGradient>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>مميزات منصتنا</Text>
        <Text style={styles.sectionSubtitle}>
          كل ما تحتاجه لتقديم شكوى فعّالة وسريعة
        </Text>
        
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Ionicons
                  name={feature.icon}
                  size={32}
                  color="#27548A"
                />
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* How it Works Section */}
      <View style={styles.howItWorksSection}>
        <Text style={styles.sectionTitle}>كيف تعمل المنصة؟</Text>
        <View style={styles.stepsContainer}>
          {[
            { number: '1', title: 'تقديم الشكوى', desc: 'قم بملء نموذج الشكوى مع إرفاق أي مستندات' },
            { number: '2', title: 'توجيه الشكوى', desc: 'يتم توجيه الشكوى تلقائياً للجهة المختصة' },
            { number: '3', title: 'متابعة الحالة', desc: 'تستلم الجهة الشكوى وتبدأ في معالجتها' },
            { number: '4', title: 'إشعار الحل', desc: 'تصلك إشعارات بكل تحديث حتى يتم حل الشكوى' },
          ].map((step, index) => (
            <View key={index} style={styles.stepCard}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{step.number}</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDescription}>{step.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsSection}>
        <Text style={styles.sectionTitle}>إجراءات سريعة</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => navigation.navigate('SubmitComplaint')}
          >
            <Ionicons name="add-circle-outline" size={40} color="#27548A" />
            <Text style={styles.quickActionTitle}>تقديم شكوى جديدة</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => navigation.navigate('TrackComplaint')}
          >
            <Ionicons name="search-outline" size={40} color="#27548A" />
            <Text style={styles.quickActionTitle}>تتبع شكوى</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  heroSection: {
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
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  heroDescription: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
    opacity: 0.9,
  },
  heroButton: {
    minWidth: 200,
  },
  featuresSection: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#183B4E',
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 30,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: (width - 60) / 2,
    backgroundColor: '#F9FAFB',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#27548A',
  },
  featureIconContainer: {
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#183B4E',
    textAlign: 'center',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  howItWorksSection: {
    padding: 20,
    backgroundColor: '#F5EEDC',
  },
  stepsContainer: {
    marginTop: 20,
  },
  stepCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DAA853',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
  stepNumberText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#183B4E',
    marginBottom: 4,
    textAlign: 'right',
  },
  stepDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'right',
    lineHeight: 20,
  },
  quickActionsSection: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  quickActionCard: {
    width: (width - 60) / 2,
    backgroundColor: '#F9FAFB',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#183B4E',
    textAlign: 'center',
    marginTop: 12,
  },
});

export default HomeScreen;