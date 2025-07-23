import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Title, Searchbar, Text, Card, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { colors } from '../theme/theme';
import { formatDate } from '../utils/helpers';
import ApiService from '../services/api';

export default function ComplaintsScreen() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await ApiService.getComplaints();
      if (response.success) {
        setComplaints(response.complaints);
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredComplaints = complaints.filter(complaint =>
    complaint.complaintId?.includes(searchQuery) ||
    complaint.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'قيد المعالجة':
      case 'قيد المراجعة':
        return '#F59E0B';
      case 'تم الحل':
        return '#10B981';
      case 'مرفوضة':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const ComplaintCard = ({ complaint, index }) => (
    <Card style={styles.complaintCard}>
      <Card.Content>
        <View style={styles.complaintHeader}>
          <Text style={styles.complaintIndex}>#{index + 1}</Text>
          <Text style={styles.complaintName}>{complaint.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(complaint.status) }]}>
            <Text style={styles.statusText}>قيد المراجعة</Text>
          </View>
        </View>
        
        <View style={styles.complaintDetails}>
          <View style={styles.detailRow}>
            <Icon name="business" size={16} color={colors.blue} />
            <Text style={styles.detailText}>{complaint.governorate}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Icon name="account-balance" size={16} color={colors.blue} />
            <Text style={styles.detailText}>{complaint.ministry}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Icon name="calendar-today" size={16} color={colors.blue} />
            <Text style={styles.detailText}>
              {formatDate(complaint.createdAt)}
            </Text>
          </View>
        </View>
        
        <View style={styles.actionButtons}>
          <Button 
            mode="outlined" 
            compact 
            style={styles.actionButton}
            onPress={() => console.log('View details:', complaint)}
          >
            التفاصيل
          </Button>
          <Button 
            mode="contained" 
            compact 
            style={[styles.actionButton, { backgroundColor: '#10B981' }]}
            onPress={() => console.log('Take action:', complaint)}
          >
            إجراء
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>جاري تحميل الشكاوى...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>إدارة الشكاوى</Title>
        <Text style={styles.headerSubtitle}>
          عرض وإدارة جميع الشكاوى المقدمة
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="ابحث برقم الشكوى أو اسم المواطن..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>

      <ScrollView style={styles.complaintsContainer}>
        {filteredComplaints.map((complaint, index) => (
          <ComplaintCard 
            key={complaint.id || index} 
            complaint={complaint} 
            index={index}
          />
        ))}
        
        {filteredComplaints.length === 0 && (
          <View style={styles.emptyContainer}>
            <Icon name="inbox" size={64} color="#9CA3AF" />
            <Text style={styles.emptyText}>لا توجد شكاوى</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.darkTeal,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  searchBar: {
    elevation: 2,
  },
  complaintsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  complaintCard: {
    marginBottom: 12,
    elevation: 2,
  },
  complaintHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  complaintIndex: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.blue,
    marginRight: 8,
    minWidth: 30,
  },
  complaintName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.darkTeal,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  complaintDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 16,
  },
});