import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function ImagePicker({ onImageSelected, selectedImage }) {
  const showImagePicker = () => {
    Alert.alert(
      'اختيار الصورة',
      'كيف تريد اختيار الصورة؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'الكاميرا', onPress: openCamera },
        { text: 'المعرض', onPress: openGallery },
      ]
    );
  };

  const openCamera = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchCamera(options, handleImageResponse);
  };

  const openGallery = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, handleImageResponse);
  };

  const handleImageResponse = (response) => {
    if (response.didCancel || response.error) {
      return;
    }

    if (response.assets && response.assets[0]) {
      onImageSelected(response.assets[0]);
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={showImagePicker}>
      <Icon 
        name={selectedImage ? 'check-circle' : 'camera-alt'} 
        size={24} 
        color={selectedImage ? '#10B981' : '#27548A'} 
      />
      <Text style={[
        styles.text, 
        selectedImage && styles.selectedText
      ]}>
        {selectedImage ? 'تم اختيار الصورة' : 'إرفاق صورة (اختياري)'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 16,
    marginVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  text: {
    marginLeft: 8,
    color: '#27548A',
    fontSize: 16,
  },
  selectedText: {
    color: '#10B981',
  },
});