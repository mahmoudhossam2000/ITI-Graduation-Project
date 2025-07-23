import { delay } from '../utils/helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ApiService {
  constructor() {
    this.baseUrl = 'https://your-api-url.com/api';
  }

  async simulateDelay(ms = 1000) {
    await delay(ms);
  }

  // Authentication
  async login(email, password) {
    await this.simulateDelay();
    
    return {
      success: true,
      user: {
        id: '1',
        email,
        name: 'مستخدم تجريبي',
      },
      token: 'mock-jwt-token',
    };
  }

  async signup(userData) {
    await this.simulateDelay();
    
    return {
      success: true,
      user: {
        id: Date.now().toString(),
        ...userData,
      },
      token: 'mock-jwt-token',
    };
  }

  // Complaints
  async submitComplaint(complaintData) {
    await this.simulateDelay();
    
    // Store complaint locally for demo
    try {
      const existingComplaints = await AsyncStorage.getItem('complaints');
      const complaints = existingComplaints ? JSON.parse(existingComplaints) : [];
      
      const newComplaint = {
        id: Date.now().toString(),
        complaintId: Math.floor(Math.random() * 1000000).toString(),
        ...complaintData,
        status: 'قيد المعالجة',
        createdAt: new Date().toISOString(),
      };
      
      complaints.push(newComplaint);
      await AsyncStorage.setItem('complaints', JSON.stringify(complaints));
      
      return {
        success: true,
        complaint: newComplaint,
      };
    } catch (error) {
      return {
        success: false,
        error: 'فشل في حفظ الشكوى',
      };
    }
  }

  async searchComplaints(query) {
    await this.simulateDelay();
    
    try {
      const existingComplaints = await AsyncStorage.getItem('complaints');
      const complaints = existingComplaints ? JSON.parse(existingComplaints) : [];
      
      const filteredResults = complaints.filter(
        complaint => 
          complaint.nationalId?.includes(query) ||
          complaint.complaintId?.includes(query)
      );

      return {
        success: true,
        complaints: filteredResults,
      };
    } catch (error) {
      return {
        success: false,
        complaints: [],
      };
    }
  }

  async getComplaints(filters = {}) {
    await this.simulateDelay();
    
    try {
      const existingComplaints = await AsyncStorage.getItem('complaints');
      const complaints = existingComplaints ? JSON.parse(existingComplaints) : [];
      
      return {
        success: true,
        complaints: complaints,
      };
    } catch (error) {
      return {
        success: false,
        complaints: [],
      };
    }
  }

  async updateComplaintStatus(complaintId, status) {
    await this.simulateDelay();
    
    return {
      success: true,
      message: 'تم تحديث حالة الشكوى بنجاح',
    };
  }
}

export default new ApiService();