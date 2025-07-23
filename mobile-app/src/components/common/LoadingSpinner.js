import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';

export default function LoadingSpinner({ message = 'جاري التحميل...', size = 'large' }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator 
        animating={true} 
        color="#27548A" 
        size={size}
        style={styles.spinner}
      />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  spinner: {
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});