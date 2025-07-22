import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Title } from 'react-native-paper';
import Toast from 'react-native-toast-message';

// Components
import FormInput from '../components/forms/FormInput';
import FormPicker from '../components/forms/FormPicker';
import ImagePicker from '../components/forms/ImagePicker';

// Utils
import { GOVERNORATES, MINISTRIES } from '../utils/constants';
import { 
  validateName, 
  validateNationalId, 
  validateRequired 
} from '../utils/validation';
import { isNumericOnly } from '../utils/helpers';
import ApiService from '../services/api';

export default function ComplaintFormScreen({ navigation }) {
  const [formData, setFormData] = useState({
    name: '',
    nationalId: '',
    governorate: '',
    ministry: '',
    description: '',
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    const nameError = validateName(formData.name);
    if (nameError) newErrors.name = nameError;
    
    const nationalIdError = validateNationalId(formData.nationalId);
    if (nationalIdError) newErrors.nationalId = nationalIdError;
    
    const governorateError = validateRequired(formData.governorate, 'المحافظة');
    if (governorateError) newErrors.governorate = governorateError;
    
    const ministryError = validateRequired(formData.ministry, 'الوزارة');
    if (ministryError) newErrors.ministry = ministryError;
    
    const descriptionError = validateRequired(formData.description, 'وصف الشكوى');
    if (descriptionError) newErrors.description = descriptionError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    // Only allow numbers for nationalId
    if (field === 'nationalId' && value !== '' && !isNumericOnly(value)) {
      return;
    }

    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageSelected = (image) => {
    setFormData(prev => ({ ...prev, image }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await ApiService.submitComplaint(formData);
      
      Toast.show({
        type: 'success',
        text1: 'تم إرسال الشكوى بنجاح ✅',
        position: 'bottom',
      });

      // Reset form
      setFormData({
        name: '',
        nationalId: '',
        governorate: '',
        ministry: '',
        description: '',
        image: null,
      });

      navigation.navigate('Search');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'حدث خطأ أثناء إرسال الشكوى',
        position: 'bottom',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>قدم شكوتك</Title>

            <FormInput
              label="الاسم"
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              error={!!errors.name}
              placeholder="من فضلك ادخل الاسم"
            />

            <FormInput
              label="الرقم القومي"
              value={formData.nationalId}
              onChangeText={(value) => handleInputChange('nationalId', value)}
              error={!!errors.nationalId}
              placeholder="من فضلك ادخل الرقم القومي"
              keyboardType="numeric"
              maxLength={14}
            />

            <FormPicker
              label="المحافظة"
              selectedValue={formData.governorate}
              onValueChange={(value) => handleInputChange('governorate', value)}
              items={GOVERNORATES}
              placeholder="اختر المحافظة"
              error={errors.governorate}
            />

            <FormPicker
              label="الوزارة المختصة"
              selectedValue={formData.ministry}
              onValueChange={(value) => handleInputChange('ministry', value)}
              items={MINISTRIES}
              placeholder="اختر الوزارة"
              error={errors.ministry}
            />

            <FormInput
              label="وصف الشكوى"
              value={formData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              error={!!errors.description}
              placeholder="من فضلك ادخل تفاصيل الشكوى هنا..."
              multiline
              numberOfLines={4}
            />

            <ImagePicker
              onImageSelected={handleImageSelected}
              selectedImage={formData.image}
            />

            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
              style={styles.submitButton}
            >
              {loading ? 'جارٍ الإرسال...' : 'إرسال الشكوى'}
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  card: {
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#183B4E',
    textAlign: 'center',
    marginBottom: 20,
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: '#27548A',
    paddingVertical: 8,
  },
});