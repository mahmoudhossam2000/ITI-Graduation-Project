import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Title, TextInput, HelperText } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { GOVERNORATES, MINISTRIES } from '../utils/constants';
import { colors } from '../theme/theme';
import ApiService from '../services/api';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('الاسم مطلوب'),
  nationalId: Yup.string()
    .required('الرقم القومي مطلوب')
    .matches(/^\d{14}$/, 'يجب أن يتكون الرقم القومي من 14 رقمًا بالضبط'),
  governorate: Yup.string().required('المحافظة مطلوبة'),
  ministry: Yup.string().required('الوزارة مطلوبة'),
  description: Yup.string().required('ادخال الوصف مطلوب'),
});

export default function ComplaintFormScreen({ navigation }) {
  const [selectedImage, setSelectedImage] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: '',
      nationalId: '',
      governorate: '',
      ministry: '',
      description: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const complaintData = {
          ...values,
          image: selectedImage,
        };

        const result = await ApiService.submitComplaint(complaintData);
        
        if (result.success) {
          Toast.show({
            type: 'success',
            text1: 'تم إرسال الشكوى بنجاح ✅',
            position: 'bottom',
          });
          resetForm();
          setSelectedImage(null);
          navigation.navigate('Search');
        } else {
          Toast.show({
            type: 'error',
            text1: 'حدث خطأ أثناء إرسال الشكوى',
            position: 'bottom',
          });
        }
      } catch (error) {
        console.error('خطأ أثناء إرسال الشكوى:', error);
        Toast.show({
          type: 'error',
          text1: 'حدث خطأ أثناء إرسال الشكوى',
          position: 'bottom',
        });
      }
      setSubmitting(false);
    },
  });

  const handleImagePicker = () => {
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
      setSelectedImage(response.assets[0]);
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
              value={formik.values.name}
              onChangeText={formik.handleChange('name')}
              onBlur={formik.handleBlur('name')}
              error={formik.touched.name && formik.errors.name}
              mode="outlined"
              style={styles.input}
              placeholder="من فضلك ادخل الاسم"
            />
            <HelperText type="error" visible={formik.touched.name && formik.errors.name}>
              {formik.errors.name}
            </HelperText>

            {/* National ID Input */}
            <TextInput
              label="الرقم القومي"
              value={formik.values.nationalId}
              onChangeText={formik.handleChange('nationalId')}
              onBlur={formik.handleBlur('nationalId')}
              error={formik.touched.nationalId && formik.errors.nationalId}
              mode="outlined"
              style={styles.input}
              placeholder="من فضلك ادخل الرقم القومي"
              keyboardType="numeric"
              maxLength={14}
            />
            <HelperText type="error" visible={formik.touched.nationalId && formik.errors.nationalId}>
              {formik.errors.nationalId}
            </HelperText>

            {/* Governorate Picker */}
            <View style={styles.pickerContainer}>
              <Title style={styles.pickerLabel}>اختر المحافظة</Title>
              <View style={[styles.picker, formik.touched.governorate && formik.errors.governorate && styles.pickerError]}>
                <Picker
                  selectedValue={formik.values.governorate}
                  onValueChange={formik.handleChange('governorate')}
                  style={styles.pickerStyle}
                >
                  <Picker.Item label="اختر المحافظة" value="" />
                  {GOVERNORATES.map((gov) => (
                    <Picker.Item key={gov} label={gov} value={gov} />
                  ))}
                </Picker>
              </View>
              <HelperText type="error" visible={formik.touched.governorate && formik.errors.governorate}>
                {formik.errors.governorate}
              </HelperText>
            </View>

            {/* Ministry Picker */}
            <View style={styles.pickerContainer}>
              <Title style={styles.pickerLabel}>اختر الوزارة المختصة</Title>
              <View style={[styles.picker, formik.touched.ministry && formik.errors.ministry && styles.pickerError]}>
                <Picker
                  selectedValue={formik.values.ministry}
                  onValueChange={formik.handleChange('ministry')}
                  style={styles.pickerStyle}
                >
                  <Picker.Item label="اختر الوزارة" value="" />
                  {MINISTRIES.map((ministry) => (
                    <Picker.Item key={ministry} label={ministry} value={ministry} />
                  ))}
                </Picker>
              </View>
              <HelperText type="error" visible={formik.touched.ministry && formik.errors.ministry}>
                {formik.errors.ministry}
              </HelperText>
            </View>

            {/* Description Input */}
            <TextInput
              label="وصف الشكوى"
              value={formik.values.description}
              onChangeText={formik.handleChange('description')}
              onBlur={formik.handleBlur('description')}
              error={formik.touched.description && formik.errors.description}
              mode="outlined"
              style={styles.textArea}
              placeholder="من فضلك ادخل تفاصيل الشكوي هنا..."
              multiline
              numberOfLines={4}
            />
            <HelperText type="error" visible={formik.touched.description && formik.errors.description}>
              {formik.errors.description}
            </HelperText>

            {/* Image Picker */}
            <Button
              mode="outlined"
              onPress={handleImagePicker}
              style={styles.imageButton}
              icon={selectedImage ? "check-circle" : "camera"}
            >
              {selectedImage ? 'تم اختيار الصورة' : '(اختياري) ارفق صورة الشكوى'}
            </Button>

            {/* Submit Button */}
            <Button
              mode="contained"
              onPress={formik.handleSubmit}
              loading={formik.isSubmitting}
              disabled={formik.isSubmitting}
              style={styles.submitButton}
            >
              {formik.isSubmitting ? 'جارٍ الإرسال...' : 'إرسال الشكوى'}
            </Button>
          </Card.Content>
        </Card>

        {/* Link to Search */}
        <View style={styles.linkContainer}>
          <Button
            mode="text"
            onPress={() => navigation.navigate('Search')}
            style={styles.linkButton}
          >
            هل قدمت شكوى بالفعل؟ اضغط هنا لمتابعة الشكوى
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.darkTeal,
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    marginBottom: 8,
    backgroundColor: colors.background,
  },
  textArea: {
    marginBottom: 8,
    backgroundColor: colors.background,
    minHeight: 100,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 16,
    color: colors.blue,
    marginBottom: 8,
    fontWeight: '500',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    backgroundColor: colors.background,
  },
  pickerError: {
    borderColor: '#EF4444',
  },
  pickerStyle: {
    height: 50,
  },
  imageButton: {
    marginVertical: 16,
    borderColor: colors.blue,
  },
  submitButton: {
    marginTop: 16,
    backgroundColor: colors.blue,
    paddingVertical: 8,
  },
  linkContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  linkButton: {
    color: colors.blue,
  },
});