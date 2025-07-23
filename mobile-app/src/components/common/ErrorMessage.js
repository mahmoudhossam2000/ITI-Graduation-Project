import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function ErrorMessage({ 
  message = 'حدث خطأ غير متوقع', 
  onRetry,
  showRetry = true 
}) {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <Icon name="error-outline" size={48} color="#EF4444" />
          <Text style={styles.message}>{message}</Text>
          {showRetry && onRetry && (
            <Button 
              mode="contained" 
              onPress={onRetry}
              style={styles.retryButton}
            >
              إعادة المحاولة
            </Button>
          )}
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    elevation: 4,
  },
  content: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  message: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    marginVertical: 16,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#27548A',
    marginTop: 8,
  },
});