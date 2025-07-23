import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function StatCard({ title, value, icon, color, onPress }) {
  return (
    <Card 
      style={[styles.card, { borderLeftColor: color }]}
      onPress={onPress}
    >
      <Card.Content style={styles.content}>
        <View style={styles.info}>
          <Text style={styles.value}>{value}</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
        <Icon name={icon} size={32} color={color} />
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    marginBottom: 12,
    elevation: 2,
    borderLeftWidth: 4,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#183B4E',
    marginBottom: 4,
  },
  title: {
    fontSize: 12,
    color: '#6B7280',
  },
});