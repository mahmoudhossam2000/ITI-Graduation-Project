import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  TextInput,
  Button,
  Card,
  Title,
  Paragraph,
  Chip,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function ComplaintSearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // Mock data for demonstration
  const mockComplaints = [
    {
      id: '1',
      name: 'أحمد محمد',
      nationalId: '12345678901234',
      ministry: 'وزارة الصحة',
      governorate: 'القاهرة',
      description: 'مشكلة في المستشفى العام',
      status: 'قيد المعالجة',
      createdAt: '2025-01-15',
    },
    {
      id: '2',
      name: 'فاطمة علي',
      nationalId: '98765432109876',
      ministry: 'وزارة التعليم',
      governorate: 'الجيزة',
      description: 'مشكلة في المدرسة الابتدائية',
      status: 'تم الحل',
      createdAt: '2025-01-10',
    },
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      alert('من فضلك ادخل رقم الشكوى أو رقمك القومي');
      return;
    }

    setLoading(true);
    setResults([]);
    setNotFound(false);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Filter mock data based on search query
      const filteredResults = mockComplaints.filter(
        complaint => 
          complaint.nationalId.includes(searchQuery) ||
          complaint.id.includes(searchQuery)
      );

      if (filteredResults.length === 0) {
        setNotFound(true);
      } else {
        setResults(filteredResults);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'قيد المعالجة':
        return '#F59E0B';
      case 'تم الحل':
        return '#10B981';
      case 'مرفوضة':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const renderComplaintItem = ({ item }) => (
    <Card style={styles.complaintCard}>
      <Card.Content>
        <View style={styles.complaintHeader}>
          <Title style={styles.complaintName}>{item.name}</Title>
          <Chip 
            style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) }]}
            textStyle={styles.statusText}
          >
            {item.status}
          </Chip>
        </View>
        
        <View style={styles.complaintDetails}>
          <View style={styles.detailRow}>
            <Icon name="fingerprint" size={16} color="#6B7280" />
            <Text style={styles.detailText}>الرقم القومي: {item.nationalId}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Icon name="business" size={16} color="#6B7280" />
            <Text style={styles.detailText}>الوزارة: {item.ministry}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Icon name="location-on" size={16} color="#6B7280" />
            <Text style={styles.detailText}>المحافظة: {item.governorate}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Icon name="calendar-today" size={16} color="#6B7280" />
            <Text style={styles.detailText}>تاريخ التقديم: {item.createdAt}</Text>
          </View>
        </View>
        
        <Paragraph style={styles.description}>
          الوصف: {item.description}
        </Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.searchCard}>
          <Card.Content>
            <Title style={styles.title}>متابعة حالة الشكوى</Title>
            
            <TextInput
              label="رقم الشكوى أو الرقم القومي"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
              mode="outlined"
              left={<TextInput.Icon icon="search" />}
            />
            
            <Button
              mode="contained"
              onPress={handleSearch}
              loading={loading}
              disabled={loading}
              style={styles.searchButton}
            >
              {loading ? 'جاري البحث...' : 'بحث'}
            </Button>
          </Card.Content>
        </Card>

        {notFound && (
          <Card style={styles.notFoundCard}>
            <Card.Content style={styles.notFoundContent}>
              <Icon name="search-off" size={48} color="#EF4444" />
              <Text style={styles.notFoundText}>
                لم يتم العثور على أي شكوى بهذا الرقم
              </Text>
            </Card.Content>
          </Card>
        )}

        {results.length > 0 && (
          <FlatList
            data={results}
            renderItem={renderComplaintItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            style={styles.resultsList}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  searchCard: {
    elevation: 4,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#183B4E',
    textAlign: 'center',
    marginBottom: 16,
  },
  searchInput: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  searchButton: {
    backgroundColor: '#27548A',
    paddingVertical: 4,
  },
  notFoundCard: {
    elevation: 2,
  },
  notFoundContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  notFoundText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 8,
  },
  resultsList: {
    flex: 1,
  },
  complaintCard: {
    elevation: 2,
    marginBottom: 12,
  },
  complaintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  complaintName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#183B4E',
    flex: 1,
  },
  statusChip: {
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
  description: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    fontWeight: '500',
  },
});