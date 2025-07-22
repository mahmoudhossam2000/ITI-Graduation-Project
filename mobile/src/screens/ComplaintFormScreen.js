import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  TextInput,
  Button,
  Card,
  Title,
  HelperText,
} from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialIcons';

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

  const governorates = [
    'القاهرة', 'الجيزة', 'الإسكندرية', 'الدقهلية', 'الشرقية',
    'القليوبية', 'الغربية', 'المنوفية', 'البحيرة', 'كفر الشيخ',
    'دمياط', 'بورسعيد', 'الإسماعيلية', 'السويس', 'شمال سيناء',
    'جنوب سيناء', 'بني سويف', 'الفيوم', 'المنيا', 'أسيوط',
    'سوهاج', 'قنا', 'الأقصر', 'أسوان', 'الوادي الجديد',
    'مطروح', 'البحر الأحمر',
  ];

  const ministries = [
    'وزارة الصحة', 'وزارة التعليم', 'وزارة الداخلية', 'وزارة التموين',
    'وزارة الكهرباء والطاقة', 'وزارة النقل', 'وزارة البيئة',
    'وزارة التضامن الاجتماعي', 'وزارة الاتصالات وتكنولوجيا المعلومات',
    'وزارة الإسكان والمرافق', 'وزارة القوى العاملة', 'وزارة الثقافة',
    'وزارة التنمية المحلية', 'وزارة العدل', 'وزارة المالية',
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'الاسم مطلوب';
    }

    if (!formData.nationalId) {
      newErrors.nationalId = 'الرقم القومي مطلوب';
    } else if (!/^\d{14}$/.test(formData.nationalId)) {
      newErrors.nationalId = 'يجب أن يتكون الرقم القومي من 14 رقمًا بالضبط';
    }

    if (!formData.governorate) {
      newErrors.governorate = 'المحافظة مطلوبة';
    }

    if (!formData.ministry) {
      newErrors.ministry = 'الوزارة مطلوبة';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'وصف الشكوى مطلوب';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel || response.error) {
        return;
      }

      if (response.assets && response.assets[0]) {
        setFormData(prev => ({ ...prev, image: response.assets[0] }));
      }
    });
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
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

            {/* Name Input */}
            <TextInput
              label="الاسم"
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              style={styles.input}
              error={!!errors.name}
              mode="outlined"
            />
            <HelperText type="error" visible={!!errors.name}>
              {errors.name}
            </HelperText>

            {/* National ID Input */}
            <TextInput
              label="الرقم القومي"
              value={formData.nationalId}
              onChangeText={(value) => handleInputChange('nationalId', value)}
              style={styles.input}
              error={!!errors.nationalId}
              mode="outlined"
              keyboardType="numeric"
              maxLength={14}
            />
            <HelperText type="error" visible={!!errors.nationalId}>
              {errors.nationalId}
            </HelperText>

            {/* Governorate Picker */}
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>المحافظة</Text>
              <View style={[styles.picker, errors.governorate && styles.pickerError]}>
                <Picker
                  selectedValue={formData.governorate}
                  onValueChange={(value) => handleInputChange('governorate', value)}
                  style={styles.pickerStyle}
                >
                  <Picker.Item label="اختر المحافظة" value="" />
                  {governorates.map((gov) => (
                    <Picker.Item key={gov} label={gov} value={gov} />
                  ))}
                </Picker>
              </View>
              <HelperText type="error" visible={!!errors.governorate}>
                {errors.governorate}
              </HelperText>
            </View>

            {/* Ministry Picker */}
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>الوزارة المختصة</Text>
              <View style={[styles.picker, errors.ministry && styles.pickerError]}>
                <Picker
                  selectedValue={formData.ministry}
                  onValueChange={(value) => handleInputChange('ministry', value)}
                  style={styles.pickerStyle}
                >
                  <Picker.Item label="اختر الوزارة" value="" />
                  {ministries.map((ministry) => (
                    <Picker.Item key={ministry} label={ministry} value={ministry} />
                  ))}
                </Picker>
              </View>
              <HelperText type="error" visible={!!errors.ministry}>
                {errors.ministry}
              </HelperText>
            </View>

            {/* Description Input */}
            <TextInput
              label="وصف الشكوى"
              value={formData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              style={styles.input}
              error={!!errors.description}
              mode="outlined"
              multiline
              numberOfLines={4}
              placeholder="من فضلك ادخل تفاصيل الشكوى هنا..."
            />
            <HelperText type="error" visible={!!errors.description}>
              {errors.description}
            </HelperText>

            {/* Image Picker */}
            <TouchableOpacity style={styles.imagePicker} onPress={handleImagePicker}>
              <Icon name="camera-alt" size={24} color="#27548A" />
              <Text style={styles.imagePickerText}>
                {formData.image ? 'تم اختيار الصورة' : 'إرفاق صورة (اختياري)'}
              </Text>
            </TouchableOpacity>

            {/* Submit Button */}
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
  input: {
    marginBottom: 5,
    backgroundColor: '#FFFFFF',
  },
  pickerContainer: {
    marginBottom: 10,
  },
  pickerLabel: {
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
  imagePicker: {
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
  imagePickerText: {
    marginLeft: 8,
    color: '#27548A',
    fontSize: 16,
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: '#27548A',
    paddingVertical: 8,
  },
});