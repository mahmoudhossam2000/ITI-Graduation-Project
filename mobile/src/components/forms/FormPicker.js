import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HelperText } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';

export default function FormPicker({
  label,
  selectedValue,
  onValueChange,
  items = [],
  placeholder = 'اختر...',
  error,
  style,
}) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.picker, error && styles.pickerError]}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          style={styles.pickerStyle}
        >
          <Picker.Item label={placeholder} value="" />
          {items.map((item, index) => (
            <Picker.Item 
              key={index} 
              label={typeof item === 'string' ? item : item.label} 
              value={typeof item === 'string' ? item : item.value} 
            />
          ))}
        </Picker>
      </View>
      <HelperText type="error" visible={!!error}>
        {error}
      </HelperText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: '#183B4E',
    marginBottom: 8,
    fontWeight: '500',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  pickerError: {
    borderColor: '#EF4444',
  },
  pickerStyle: {
    height: 50,
  },
});