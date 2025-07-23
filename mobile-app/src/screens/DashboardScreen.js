import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Title, Searchbar, Text, Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { colors } from '../theme/theme';
import ApiService from '../services/api';

export default function DashboardScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    rejected: 0,
  });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await ApiService.getComplaints();
      if (response.success) {
        setComplaints(response.complaints);
        calculateStats(response.complaints);
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (complaintsData) => {
    const total = complaintsData.length;
    const pending = complaintsData.filter(c => 
      c.status === 'قيد المراجعة' || c.status === 'قيد المعالجة'
    ).length;
    const resolved = complaintsData.filter(c => c.status === 'تم الحل').length;
    const rejected = complaintsData.filter(c => c.status === 'مرفوضة').length;
    
    setStats({ total, pending, resolved, rejected });
  };

  const filteredComplaints = complaints.filter(complaint =>
    complaint.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    complaint.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const StatCard = ({ title, value, icon, color }) => (
    <Card style={[styles.statCard, { borderLeftColor: color }]}>
      <Card.Content style={styles.statContent}>
        <View style={styles.statInfo}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
        </View>
        <Icon name={icon} size={32} color={color} />
      </Card.Content>
    </Card>
  );

  const ComplaintCard = ({ complaint }) => (
    <Card style={styles.complaintCard}>
      <Card.Content>
        <View style={styles.complaintHeader}>
          <Text style={styles.complaintName}>{complaint.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(complaint.status) }]}>
            <Text style={styles.statusText}>{complaint.status}</Text>
          </View>
        </View>
        
        <View style={styles.complaintDetails}>
          <Text style={styles.complaintText}>الوزارة: {complaint.ministry}</Text>
          <Text style={styles.complaintText}>المحافظة: {complaint.governorate}</Text>
          <Text style={styles.complaintDescription}>{complaint.description}</Text>
        </View>
      </Card.Content>
    </Card>
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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>جاري تحميل البيانات...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Title style={styles.headerTitle}>لوحة التحكم</Title>
          <Text style={styles.headerSubtitle}>إدارة الشكاوى والمقترحات</Text>
        </View>

        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <StatCard 
            title="إجمالي الشكاوى" 
            value={stats.total} 
            icon="assessment" 
            color={colors.blue} 
          />
          <StatCard 
            title="قيد المراجعة" 
            value={stats.pending} 
            icon="pending" 
            color="#F59E0B" 
          />
          <StatCard 
            title="تم الحل" 
            value={stats.resolved} 
            icon="check-circle" 
            color="#10B981" 
          />
          <StatCard 
            title="مرفوضة" 
            value={stats.rejected} 
            icon="cancel" 
            color="#EF4444" 
          />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="البحث في الشكاوى..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
          />
        </View>

        {/* Complaints List */}
        <View style={styles.complaintsContainer}>
          <Title style={styles.sectionTitle}>الشكاوى الحديثة</Title>
          {filteredComplaints.map((complaint, index) => (
            <ComplaintCard key={index} complaint={complaint} />
          ))}
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
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    marginBottom: 12,
    elevation: 2,
    borderLeftWidth: 4,
  },
  statContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.darkTeal,
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchBar: {
    elevation: 2,
  },
  complaintsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.darkTeal,
    marginBottom: 12,
  },
  complaintCard: {
    marginBottom: 12,
    elevation: 2,
  },
  complaintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
    marginTop: 8,
  },
  complaintText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  complaintDescription: {
    fontSize: 14,
    color: colors.darkTeal,
    marginTop: 8,
    fontStyle: 'italic',
  },
});