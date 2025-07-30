import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Title, Searchbar } from 'react-native-paper';

// Components
import StatCard from '../components/complaint/StatCard';
import ComplaintCard from '../components/complaint/ComplaintCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

// Hooks
import { useComplaints } from '../hooks/useComplaints';

export default function DashboardScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    rejected: 0,
  });

  const { complaints, loading, error, refetch } = useComplaints();

  useEffect(() => {
    // Calculate stats
    const totalComplaints = complaints.length;
    const pendingComplaints = complaints.filter(c => 
      c.status === 'قيد المراجعة' || c.status === 'قيد المعالجة'
    ).length;
    const resolvedComplaints = complaints.filter(c => c.status === 'تم الحل').length;
    const rejectedComplaints = complaints.filter(c => c.status === 'مرفوضة').length;
    
    setStats({
      total: totalComplaints,
      pending: pendingComplaints,
      resolved: resolvedComplaints,
      rejected: rejectedComplaints,
    });
  }, [complaints]);

  const filteredComplaints = complaints.filter(complaint =>
    complaint.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    complaint.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetails = (complaint) => {
    console.log('View details:', complaint);
  };

  const handleTakeAction = (complaint) => {
    console.log('Take action:', complaint);
  };

  const renderComplaintItem = ({ item }) => (
    <ComplaintCard 
      complaint={item}
      onViewDetails={handleViewDetails}
      onTakeAction={handleTakeAction}
    />
  );

  if (loading) {
    return <LoadingSpinner message="جاري تحميل البيانات..." />;
  }

  if (error) {
    return (
      <ErrorMessage 
        message={error}
        onRetry={refetch}
      />
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
            color="#27548A" 
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
          <FlatList
            data={filteredComplaints}
            renderItem={renderComplaintItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
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
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#183B4E',
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
    color: '#183B4E',
    marginBottom: 12,
  },
});