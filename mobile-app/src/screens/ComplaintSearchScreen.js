import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Title, TextInput, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { colors } from '../theme/theme';
import { formatDate } from '../utils/helpers';
import ApiService from '../services/api';

export default function ComplaintSearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      alert('من فضلك ادخل رقم الشكوى او رقمك القومي');
      return;
    }

    setLoading(true);
    setResults([]);
    setNotFound(false);

    try {
      const response = await ApiService.searchComplaints(searchQuery);
      
      if (response.success) {
        if (response.complaints.length === 0) {
          setNotFound(true);
        } else {
          setResults(response.complaints);
        }
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error('Error searching complaints:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Card style={styles.searchCard}>
          <Card.Content>
            <Title style={styles.title}>متابعة حالة الشكوى</Title>
            
            <TextInput
              label="رقم الشكوى أو الرقم القومي"
              value={searchQuery}
              onChangeText={setSearchQuery}
              mode="outlined"
              style={styles.searchInput}
              left={<TextInput.Icon icon="search" />}
              placeholder="ادخل رقم الشكوى أو الرقم القومي"
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

        {/* Error Message */}
        {notFound && (
          <Card style={styles.errorCard}>
            <Card.Content style={styles.errorContent}>
              <Icon name="error-outline" size={48} color="#EF4444" />
              <Text style={styles.errorText}>
                لم يتم العثور على أي شكوى بهذا الرقم.
              </Text>
            </Card.Content>
          </Card>
        )}

        {/* Results */}
        {results.map((complaint, index) => (
          <Card key={index} style={styles.resultCard}>
            <Card.Content>
              <View style={styles.resultHeader}>
                <Text style={styles.complaintId}>
                  رقم الشكوى: {complaint.complaintId}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(complaint.status) }]}>
                  <Text style={styles.statusText}>{complaint.status}</Text>
                </View>
              </View>
              
              <View style={styles.resultDetails}>
                <View style={styles.detailRow}>
                  <Icon name="person" size={20} color={colors.blue} />
                  <Text style={styles.detailText}>الاسم: {complaint.name}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Icon name="fingerprint" size={20} color={colors.blue} />
                  <Text style={styles.detailText}>الرقم القومي: {complaint.nationalId}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Icon name="business" size={20} color={colors.blue} />
                  <Text style={styles.detailText}>الوزارة: {complaint.ministry}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Icon name="location-on" size={20} color={colors.blue} />
                  <Text style={styles.detailText}>المحافظة: {complaint.governorate}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Icon name="calendar-today" size={20} color={colors.blue} />
                  <Text style={styles.detailText}>
                    التاريخ: {formatDate(complaint.createdAt)}
                  </Text>
                </View>
              </View>
              
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionLabel}>الوصف:</Text>
                <Text style={styles.descriptionText}>{complaint.description}</Text>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchCard: {
    margin: 16,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.darkTeal,
    textAlign: 'center',
    marginBottom: 16,
  },
  searchInput: {
    marginBottom: 16,
    backgroundColor: colors.background,
  },
  searchButton: {
    backgroundColor: colors.blue,
    paddingVertical: 4,
  },
  errorCard: {
    margin: 16,
    elevation: 2,
  },
  errorContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 12,
  },
  resultCard: {
    margin: 16,
    marginTop: 8,
    elevation: 2,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  complaintId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.darkTeal,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  resultDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: colors.darkTeal,
    marginLeft: 8,
    flex: 1,
  },
  descriptionContainer: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
  },
  descriptionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.blue,
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: colors.darkTeal,
    lineHeight: 20,
  },
});