import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import Toast from 'react-native-toast-message';

const TrackComplaintScreen = () => {
  const [complaintId, setComplaintId] = useState('');
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'قيد المعالجة':
        return '#F59E0B';
      case 'تم القبول':
        return '#10B981';
      case 'مرفوض':
        return '#EF4444';
      case 'تم الحل':
        return '#3B82F6';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'قيد المعالجة':
        return 'time-outline';
      case 'تم القبول':
        return 'checkmark-circle-outline';
      case 'مرفوض':
        return 'close-circle-outline';
      case 'تم الحل':
        return 'checkmark-done-outline';
      default:
        return 'help-circle-outline';
    }
  };

  const handleSearch = async () => {
    if (!complaintId.trim()) {
      Toast.show({
        type: 'error',
        text1: 'من فضلك ادخل رقم الشكوى',
        text1Style: { textAlign: 'right' },
      });
      return;
    }

    setLoading(true);
    setComplaint(null);
    setNotFound(false);

    try {
      const complaintsRef = collection(db, 'complaints');
      const q = query(complaintsRef, where('complaintId', '==', complaintId.toString()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setNotFound(true);
      } else {
        const complaintData = querySnapshot.docs[0].data();
        setComplaint(complaintData);
      }
    } catch (error) {
      console.error('خطأ أثناء البحث:', error);
      Toast.show({
        type: 'error',
        text1: 'حدث خطأ أثناء البحث',
        text1Style: { textAlign: 'right' },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>متابعة حالة الشكوى</Text>
        <Text style={styles.subtitle}>أدخل رقم الشكوى الخاص بك لمعرفة حالتها الحالية</Text>
      </View>

      <View style={styles.searchSection}>
        <CustomInput
          label="رقم الشكوى"
          value={complaintId}
          onChangeText={(text) => {
            setComplaintId(text);
            setComplaint(null);
            setNotFound(false);
          }}
          placeholder="ادخل رقم الشكوى..."
          keyboardType="numeric"
        />
        
        <CustomButton
          title={loading ? "جاري البحث..." : "بحث"}
          onPress={handleSearch}
          disabled={loading}
          style={styles.searchButton}
        />
      </View>

      {notFound && (
        <View style={styles.notFoundContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text style={styles.notFoundTitle}>لم يتم العثور على الشكوى</Text>
          <Text style={styles.notFoundText}>
            لم يتم العثور على أي شكوى بهذا الرقم. يرجى التأكد من الرقم والمحاولة مرة أخرى.
          </Text>
        </View>
      )}

      {complaint && (
        <View style={styles.complaintContainer}>
          <View style={styles.statusHeader}>
            <View style={styles.statusBadge}>
              <Ionicons
                name={getStatusIcon(complaint.status)}
                size={20}
                color={getStatusColor(complaint.status)}
              />
              <Text style={[styles.statusText, { color: getStatusColor(complaint.status) }]}>
                {complaint.status}
              </Text>
            </View>
          </View>

          <View style={styles.complaintDetails}>
            <Text style={styles.sectionTitle}>تفاصيل الشكوى</Text>
            
            <View style={styles.detailRow}>
              <Ionicons name="person-outline" size={20} color="#27548A" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>اسم المواطن</Text>
                <Text style={styles.detailValue}>{complaint.name}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="mail-outline" size={20} color="#27548A" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>البريد الإلكتروني</Text>
                <Text style={styles.detailValue}>{complaint.email}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={20} color="#27548A" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>المحافظة</Text>
                <Text style={styles.detailValue}>{complaint.governorate}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="business-outline" size={20} color="#27548A" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>الوزارة</Text>
                <Text style={styles.detailValue}>{complaint.ministry}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="document-text-outline" size={20} color="#27548A" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>وصف الشكوى</Text>
                <Text style={styles.detailValue}>{complaint.description}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={20} color="#27548A" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>تاريخ التقديم</Text>
                <Text style={styles.detailValue}>
                  {complaint.createdAt?.toDate
                    ? complaint.createdAt.toDate().toLocaleDateString('ar-EG')
                    : new Date(complaint.createdAt.seconds * 1000).toLocaleDateString('ar-EG')}
                </Text>
              </View>
            </View>
          </View>

          {/* Progress Timeline */}
          <View style={styles.timelineContainer}>
            <Text style={styles.sectionTitle}>مراحل معالجة الشكوى</Text>
            
            <View style={styles.timeline}>
              <View style={[
                styles.timelineStep,
                complaint.status === 'قيد المعالجة' || 
                complaint.status === 'تم القبول' || 
                complaint.status === 'تم الحل' ? styles.activeStep : styles.inactiveStep
              ]}>
                <View style={styles.stepIcon}>
                  <Ionicons name="document-outline" size={16} color="#FFFFFF" />
                </View>
                <Text style={styles.stepText}>تم استلام الشكوى</Text>
              </View>

              <View style={[
                styles.timelineStep,
                complaint.status === 'تم القبول' || 
                complaint.status === 'تم الحل' ? styles.activeStep : styles.inactiveStep
              ]}>
                <View style={styles.stepIcon}>
                  <Ionicons name="eye-outline" size={16} color="#FFFFFF" />
                </View>
                <Text style={styles.stepText}>قيد المراجعة</Text>
              </View>

              <View style={[
                styles.timelineStep,
                complaint.status === 'تم الحل' ? styles.activeStep : styles.inactiveStep
              ]}>
                <View style={styles.stepIcon}>
                  <Ionicons name="checkmark-outline" size={16} color="#FFFFFF" />
                </View>
                <Text style={styles.stepText}>تم الحل</Text>
              </View>
            </View>
          </View>
        </View>
      )}
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
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#183B4E',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  searchSection: {
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
  searchButton: {
    marginTop: 10,
  },
  notFoundContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notFoundTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EF4444',
    marginTop: 16,
    marginBottom: 8,
  },
  notFoundText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  complaintContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  complaintDetails: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#183B4E',
    marginBottom: 16,
    textAlign: 'right',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  detailContent: {
    flex: 1,
    marginRight: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
    textAlign: 'right',
  },
  detailValue: {
    fontSize: 16,
    color: '#183B4E',
    fontWeight: '500',
    textAlign: 'right',
  },
  timelineContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  timeline: {
    marginTop: 16,
  },
  timelineStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  activeStep: {
    opacity: 1,
  },
  inactiveStep: {
    opacity: 0.5,
  },
  stepIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#27548A',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  stepText: {
    fontSize: 16,
    color: '#183B4E',
    fontWeight: '500',
    textAlign: 'right',
  },
});

export default TrackComplaintScreen;