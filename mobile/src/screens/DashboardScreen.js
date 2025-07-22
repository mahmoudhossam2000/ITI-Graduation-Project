import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Card,
  Title,
  Paragraph,
  Chip,
  Button,
  Searchbar,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function DashboardScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    rejected: 0,
  });

  // Mock data for demonstration
  const mockComplaints = [
    {
      id: '1',
      citizen: 'أحمد محمد',
      title: 'مستشفى الأحرار التعليمي',
      description: 'مشكلة في المستشفى',
      status: 'قيد المراجعة',
      priority: 'عادية',
      date: '2025-01-15',
      ministry: 'وزارة الصحة',
    },
    {
      id: '2',
      citizen: 'محمد علي',
      title: 'جامعة الزقازيق',
      description: 'انقطاع الكهرباء',
      status: 'تم الحل',
      priority: 'عالية',
      date: '2025-01-14',
      ministry: 'وزارة الكهرباء والطاقة',
    },
    {
      id: '3',
      citizen: 'سارة حسن',
      title: 'معاشات الزقازيق',
      description: 'تأخير صرف المعاش',
      status: 'مرفوضة',
      priority: 'عادية',
      date: '2025-01-13',
      ministry: 'وزارة التضامن الاجتماعي',
    },
  ];

  useEffect(() => {
    // Load complaints data
    setComplaints(mockComplaints);
    
    // Calculate stats
    const totalComplaints = mockComplaints.length;
    const pendingComplaints = mockComplaints.filter(c => c.status === 'قيد المراجعة').length;
    const resolvedComplaints = mockComplaints.filter(c => c.status === 'تم الحل').length;
    const rejectedComplaints = mockComplaints.filter(c => c.status === 'مرفوضة').length;
    
    setStats({
      total: totalComplaints,
      pending: pendingComplaints,
      resolved: resolvedComplaints,
      rejected: rejectedComplaints,
    });
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'عالية':
        return '#EF4444';
      case 'متوسطة':
        return '#F59E0B';
      case 'عادية':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const filteredComplaints = complaints.filter(complaint =>
    complaint.citizen.toLowerCase().includes(searchQuery.toLowerCase()) ||
    complaint.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderStatCard = (title, value, icon, color) => (
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

  const renderComplaintItem = ({ item }) => (
    <Card style={styles.complaintCard}>
      <Card.Content>
        <View style={styles.complaintHeader}>
          <View style={styles.complaintInfo}>
            <Title style={styles.complaintTitle}>{item.title}</Title>
            <Text style={styles.complaintCitizen}>المواطن: {item.citizen}</Text>
          </View>
          <View style={styles.complaintBadges}>
            <Chip 
              style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) }]}
              textStyle={styles.chipText}
              compact
            >
              {item.status}
            </Chip>
            <Chip 
              style={[styles.priorityChip, { backgroundColor: getPriorityColor(item.priority) }]}
              textStyle={styles.chipText}
              compact
            >
              {item.priority}
            </Chip>
          </View>
        </View>
        
        <Paragraph style={styles.complaintDescription}>
          {item.description}
        </Paragraph>
        
        <View style={styles.complaintFooter}>
          <Text style={styles.complaintDate}>{item.date}</Text>
          <Text style={styles.complaintMinistry}>{item.ministry}</Text>
        </View>
        
        <View style={styles.complaintActions}>
          <Button 
            mode="outlined" 
            compact 
            style={styles.actionButton}
            onPress={() => console.log('View details')}
          >
            التفاصيل
          </Button>
          <Button 
            mode="contained" 
            compact 
            style={styles.actionButton}
            onPress={() => console.log('Take action')}
          >
            إجراء
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

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
          {renderStatCard('إجمالي الشكاوى', stats.total, 'assessment', '#27548A')}
          {renderStatCard('قيد المراجعة', stats.pending, 'pending', '#F59E0B')}
          {renderStatCard('تم الحل', stats.resolved, 'check-circle', '#10B981')}
          {renderStatCard('مرفوضة', stats.rejected, 'cancel', '#EF4444')}
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
    color: '#183B4E',
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
    color: '#183B4E',
    marginBottom: 12,
  },
  complaintCard: {
    marginBottom: 12,
    elevation: 2,
  },
  complaintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  complaintInfo: {
    flex: 1,
    marginRight: 8,
  },
  complaintTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#183B4E',
    marginBottom: 2,
  },
  complaintCitizen: {
    fontSize: 12,
    color: '#6B7280',
  },
  complaintBadges: {
    alignItems: 'flex-end',
  },
  statusChip: {
    marginBottom: 4,
  },
  priorityChip: {
    marginBottom: 0,
  },
  chipText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  complaintDescription: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  complaintFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  complaintDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  complaintMinistry: {
    fontSize: 12,
    color: '#27548A',
    fontWeight: '500',
  },
  complaintActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    marginLeft: 8,
  },
});