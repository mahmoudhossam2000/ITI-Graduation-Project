import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Chip, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function ComplaintCard({ 
  complaint, 
  onViewDetails, 
  onTakeAction,
  showActions = true 
}) {
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

  const formatDate = (date) => {
    if (typeof date === 'string') return date;
    if (date?.toDate) return date.toDate().toLocaleDateString('ar-EG');
    return new Date(date).toLocaleDateString('ar-EG');
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <Title style={styles.name}>{complaint.name}</Title>
          <Chip 
            style={[styles.statusChip, { backgroundColor: getStatusColor(complaint.status) }]}
            textStyle={styles.statusText}
          >
            {complaint.status}
          </Chip>
        </View>
        
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Icon name="fingerprint" size={16} color="#6B7280" />
            <Text style={styles.detailText}>
              الرقم القومي: {complaint.nationalId}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Icon name="business" size={16} color="#6B7280" />
            <Text style={styles.detailText}>
              الوزارة: {complaint.ministry}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Icon name="location-on" size={16} color="#6B7280" />
            <Text style={styles.detailText}>
              المحافظة: {complaint.governorate}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Icon name="calendar-today" size={16} color="#6B7280" />
            <Text style={styles.detailText}>
              تاريخ التقديم: {formatDate(complaint.createdAt)}
            </Text>
          </View>
        </View>
        
        <Paragraph style={styles.description}>
          الوصف: {complaint.description}
        </Paragraph>

        {showActions && (
          <View style={styles.actions}>
            <Button 
              mode="outlined" 
              compact 
              style={styles.actionButton}
              onPress={() => onViewDetails && onViewDetails(complaint)}
            >
              التفاصيل
            </Button>
            <Button 
              mode="contained" 
              compact 
              style={styles.actionButton}
              onPress={() => onTakeAction && onTakeAction(complaint)}
            >
              إجراء
            </Button>
          </View>
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    elevation: 2,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
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
  details: {
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
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    marginLeft: 8,
  },
});