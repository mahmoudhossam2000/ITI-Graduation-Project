import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import Toast from 'react-native-toast-message';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('الاسم مطلوب'),
  email: Yup.string()
    .required('البريد الإلكتروني مطلوب')
    .email('من فضلك أدخل بريدًا إلكترونيًا صحيحًا'),
  governorate: Yup.string().required('المحافظة مطلوبة'),
  ministry: Yup.string().required('الوزارة مطلوبة'),
  description: Yup.string().required('وصف الشكوى مطلوب'),
});

const SubmitComplaintScreen = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [complaintId, setComplaintId] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const governorates = [
    'القاهرة', 'الجيزة', 'الإسكندرية', 'الدقهلية', 'الشرقية',
    'القليوبية', 'الغربية', 'المنوفية', 'البحيرة', 'كفر الشيخ',
    'دمياط', 'بورسعيد', 'الإسماعيلية', 'السويس', 'شمال سيناء',
    'جنوب سيناء', 'بني سويف', 'الفيوم', 'المنيا', 'أسيوط',
    'سوهاج', 'قنا', 'الأقصر', 'أسوان', 'الوادي الجديد',
    'مطروح', 'البحر الأحمر'
  ];

  const ministries = [
    'وزارة الصحة', 'وزارة التعليم', 'وزارة الداخلية', 'وزارة التموين',
    'وزارة الكهرباء والطاقة', 'وزارة النقل', 'وزارة البيئة',
    'وزارة التضامن الاجتماعي', 'وزارة الاتصالات وتكنولوجيا المعلومات',
    'وزارة الإسكان والمرافق', 'وزارة القوى العاملة', 'وزارة الثقافة',
    'وزارة التنمية المحلية', 'وزارة العدل', 'وزارة المالية'
  ];

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('خطأ', 'نحتاج إلى إذن للوصول إلى الصور');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const newComplaintId = Math.floor(Math.random() * 1000000).toString();

    try {
      await addDoc(collection(db, 'complaints'), {
        name: values.name,
        email: values.email,
        governorate: values.governorate,
        ministry: values.ministry,
        description: values.description,
        imageUri: selectedImage?.uri || null,
        createdAt: new Date(),
        status: 'قيد المعالجة',
        complaintId: newComplaintId,
      });

      setComplaintId(newComplaintId);
      setShowSuccessModal(true);
      Toast.show({
        type: 'success',
        text1: 'تم إرسال الشكوى بنجاح',
        text1Style: { textAlign: 'right' },
      });
      
      resetForm();
      setSelectedImage(null);
    } catch (error) {
      console.error('خطأ أثناء إرسال الشكوى:', error);
      Toast.show({
        type: 'error',
        text1: 'حدث خطأ أثناء إرسال الشكوى',
        text1Style: { textAlign: 'right' },
      });
    }

    setSubmitting(false);
  };

  const SuccessModal = () => (
    showSuccessModal && (
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Ionicons name="checkmark-circle" size={60} color="#22C55E" />
          <Text style={styles.modalTitle}>شكراً لك!</Text>
          <Text style={styles.modalText}>تم إرسال الشكوى بنجاح</Text>
          <Text style={styles.complaintIdText}>
            رقم الشكوى: <Text style={styles.complaintId}>{complaintId}</Text>
          </Text>
          <CustomButton
            title="تم"
            onPress={() => {
              setShowSuccessModal(false);
              navigation.goBack();
            }}
            style={styles.modalButton}
          />
        </View>
      </View>
    )
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>قدم شكوتك</Text>
          <Text style={styles.subtitle}>املأ النموذج أدناه لتقديم شكواك</Text>
        </View>

        <Formik
          initialValues={{
            name: '',
            email: '',
            governorate: '',
            ministry: '',
            description: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
            <View style={styles.form}>
              <CustomInput
                label="الاسم"
                value={values.name}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                placeholder="من فضلك ادخل الاسم"
                error={touched.name && errors.name}
              />

              <CustomInput
                label="البريد الإلكتروني"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                placeholder="من فضلك ادخل بريدك الالكتروني"
                keyboardType="email-address"
                error={touched.email && errors.email}
              />

              <View style={styles.inputContainer}>
                <Text style={styles.label}>اختر المحافظة</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={values.governorate}
                    onValueChange={handleChange('governorate')}
                    style={styles.picker}
                  >
                    <Picker.Item label="اختر المحافظة" value="" />
                    {governorates.map((gov) => (
                      <Picker.Item key={gov} label={gov} value={gov} />
                    ))}
                  </Picker>
                </View>
                {touched.governorate && errors.governorate && (
                  <Text style={styles.errorText}>{errors.governorate}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>اختر الوزارة المختصة</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={values.ministry}
                    onValueChange={handleChange('ministry')}
                    style={styles.picker}
                  >
                    <Picker.Item label="اختر الوزارة" value="" />
                    {ministries.map((ministry) => (
                      <Picker.Item key={ministry} label={ministry} value={ministry} />
                    ))}
                  </Picker>
                </View>
                {touched.ministry && errors.ministry && (
                  <Text style={styles.errorText}>{errors.ministry}</Text>
                )}
              </View>

              <CustomInput
                label="وصف الشكوى"
                value={values.description}
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                placeholder="من فضلك ادخل تفاصيل الشكوى هنا..."
                multiline
                numberOfLines={4}
                error={touched.description && errors.description}
              />

              <View style={styles.inputContainer}>
                <Text style={styles.label}>(اختياري) ارفق صورة الشكوى</Text>
                <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
                  <Ionicons name="camera-outline" size={24} color="#27548A" />
                  <Text style={styles.imagePickerText}>اختر صورة</Text>
                </TouchableOpacity>
                {selectedImage && (
                  <View style={styles.selectedImageContainer}>
                    <Image source={{ uri: selectedImage.uri }} style={styles.selectedImage} />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => setSelectedImage(null)}
                    >
                      <Ionicons name="close-circle" size={24} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <CustomButton
                title={isSubmitting ? "جارٍ الإرسال..." : "إرسال الشكوى"}
                onPress={handleSubmit}
                disabled={isSubmitting}
                style={styles.submitButton}
              />
            </View>
          )}
        </Formik>

        <View style={styles.footer}>
          <Text style={styles.footerText}>هل قدمت شكوى بالفعل؟</Text>
          <TouchableOpacity onPress={() => navigation.navigate('TrackComplaint')}>
            <Text style={styles.footerLink}>اضغط هنا لمتابعة الشكوى</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <SuccessModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#183B4E',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#183B4E',
    marginBottom: 8,
    textAlign: 'right',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
  },
  picker: {
    height: 50,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 4,
    textAlign: 'right',
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#27548A',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  imagePickerText: {
    marginRight: 8,
    fontSize: 16,
    color: '#27548A',
    fontWeight: '600',
  },
  selectedImageContainer: {
    marginTop: 12,
    position: 'relative',
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  submitButton: {
    marginTop: 20,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  footerLink: {
    fontSize: 16,
    color: '#27548A',
    fontWeight: '600',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    marginHorizontal: 20,
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#22C55E',
    marginTop: 16,
    marginBottom: 8,
  },
  modalText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  complaintIdText: {
    fontSize: 16,
    color: '#183B4E',
    marginBottom: 20,
  },
  complaintId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27548A',
  },
  modalButton: {
    minWidth: 120,
  },
});

export default SubmitComplaintScreen;