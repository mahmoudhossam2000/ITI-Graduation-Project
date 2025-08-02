import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

const MyComplaintsScreen = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser?.email) return;

    const q = query(
      collection(db, 'complaints'),
      where('email', '==', currentUser.email)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const complaintList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComplaints(complaintList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const onRefresh = () => {
    setRefreshing(true);
    // The onSnapshot listener will automatically update the data
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'تم الحل':
        return '#10B981';
      case 'قيد المعالجة':
        return '#F59E0B';
      case 'مرفوض':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'تم الحل':
        return 'checkmark-circle-outline';
      case 'قيد المعالجة':
        return 'time-outline';
      case 'مرفوض':
        return 'close-circle-outline';
      default:
        return 'help-circle-outline';
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>جاري تحميل الشكاوى...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>شكاويي</Text>
        <Text style={styles.subtitle}>
          {complaints.length} شكوى مقدمة
        </Text>
      </View>

      {complaints.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-outline" size={64} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>لا توجد شكاوى</Text>
          <Text style={styles.emptyText}>لم تقم بتقديم أي شكاوى حتى الآن</Text>
        </View>
      ) : (
        <View style={styles.complaintsContainer}>
          {complaints.map((complaint, index) => (
            <View key={complaint.id || index} style={styles.complaintCard}>
              <View style={styles.complaintHeader}>
                <View style={styles.complaintInfo}>
                  <Text style={styles.complaintTitle}>
                    {complaint.ministry || 'غير محدد'}
                  </Text>
                  <Text style={styles.complaintId}>
                    رقم الشكوى: {complaint.complaintId}
                  </Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(complaint.status) + '20' }
                ]}>
                  <Ionicons
                    name={getStatusIcon(complaint.status)}
                    size={16}
                    color={getStatusColor(complaint.status)}
                  />
                  <Text style={[
                    styles.statusText,
                    { color: getStatusColor(complaint.status) }
                  ]}>
                    {complaint.status}
                  </Text>
                </View>
              </View>

              <Text style={styles.complaintDescription} numberOfLines={3}>
                {complaint.description}
              </Text>

              <View style={styles.complaintFooter}>
                <View style={styles.complaintMeta}>
                  <Ionicons name="location-outline" size={16} color="#6B7280" />
                  <Text style={styles.metaText}>{complaint.governorate}</Text>
                </View>
                <Text style={styles.complaintDate}>
                  {formatDate(complaint.createdAt)}
                </Text>
              </View>

              <TouchableOpacity style={styles.viewButton}>
                <Text style={styles.viewButtonText}>عرض التفاصيل</Text>
                <Ionicons name="chevron-back-outline" size={16} color="#27548A" />
              </TouchableOpacity>
            </View>
          ))}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  complaintsContainer: {
    padding: 16,
  },
  complaintCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  complaintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  complaintInfo: {
    flex: 1,
  },
  complaintTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#183B4E',
    marginBottom: 4,
    textAlign: 'right',
  },
  complaintId: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'right',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginRight: 4,
  },
  complaintDescription: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 16,
    textAlign: 'right',
  },
  complaintFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  complaintMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 4,
  },
  complaintDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  viewButtonText: {
    fontSize: 16,
    color: '#27548A',
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default MyComplaintsScreen;