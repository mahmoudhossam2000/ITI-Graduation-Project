import { delay } from '../utils/helpers';

// Mock API service for demonstration
// In a real app, this would connect to your backend API

class ApiService {
  constructor() {
    this.baseUrl = 'https://your-api-url.com/api';
  }

  // Simulate network delay
  async simulateDelay(ms = 1000) {
    await delay(ms);
  }

  // Authentication
  async login(email, password) {
    await this.simulateDelay();
    
    // Mock successful login
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
    
    // Mock successful signup
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
    
    // Mock successful submission
    return {
      success: true,
      complaint: {
        id: Date.now().toString(),
        ...complaintData,
        status: 'قيد المعالجة',
        createdAt: new Date().toISOString(),
      },
    };
  }

  async searchComplaints(query) {
    await this.simulateDelay();
    
    // Mock search results
    const mockComplaints = [
      {
        id: '1',
        name: 'أحمد محمد',
        nationalId: '12345678901234',
        ministry: 'وزارة الصحة',
        governorate: 'القاهرة',
        description: 'مشكلة في المستشفى العام',
        status: 'قيد المعالجة',
        createdAt: '2025-01-15',
      },
      {
        id: '2',
        name: 'فاطمة علي',
        nationalId: '98765432109876',
        ministry: 'وزارة التعليم',
        governorate: 'الجيزة',
        description: 'مشكلة في المدرسة الابتدائية',
        status: 'تم الحل',
        createdAt: '2025-01-10',
      },
    ];

    const filteredResults = mockComplaints.filter(
      complaint => 
        complaint.nationalId.includes(query) ||
        complaint.id.includes(query)
    );

    return {
      success: true,
      complaints: filteredResults,
    };
  }

  async getComplaints(filters = {}) {
    await this.simulateDelay();
    
    // Mock complaints data
    const mockComplaints = [
      {
        id: '1',
        citizen: 'أحمد محمد',
        title: 'مستشفى الأحرار التعليمي',
        description: 'مشكلة في المستشفى',
        status: 'قيد المراجعة',
        priority: 'عادية',
        date: '2025-01-15',
        ministry: 'وزارة الصحة',
      },
      {
        id: '2',
        citizen: 'محمد علي',
        title: 'جامعة الزقازيق',
        description: 'انقطاع الكهرباء',
        status: 'تم الحل',
        priority: 'عالية',
        date: '2025-01-14',
        ministry: 'وزارة الكهرباء والطاقة',
      },
      {
        id: '3',
        citizen: 'سارة حسن',
        title: 'معاشات الزقازيق',
        description: 'تأخير صرف المعاش',
        status: 'مرفوضة',
        priority: 'عادية',
        date: '2025-01-13',
        ministry: 'وزارة التضامن الاجتماعي',
      },
    ];

    return {
      success: true,
      complaints: mockComplaints,
    };
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