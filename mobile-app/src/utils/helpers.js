export const formatDate = (date) => {
  if (!date) return '';
  
  if (typeof date === 'string') return date;
  if (date?.toDate) return date.toDate().toLocaleDateString('ar-EG');
  
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'قيد المعالجة':
    case 'قيد المراجعة':
      return '#F59E0B';
    case 'تم الحل':
      return '#10B981';
    case 'مرفوضة':
      return '#EF4444';
    default:
      return '#6B7280';
  }
};

export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'عالية':
      return '#EF4444';
    case 'متوسطة':
      return '#F59E0B';
    case 'عادية':
      return '#10B981';
    default:
      return '#6B7280';
  }
};

export const generateComplaintId = () => {
  return Math.floor(Math.random() * 1000000).toString();
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const isNumericOnly = (text) => {
  return /^\d*$/.test(text);
};

export const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Convert file to base64 for mobile
export const fileToBase64 = (uri) => {
  return new Promise((resolve, reject) => {
    // For mobile, we'll use the URI directly
    // In a real app, you might want to convert to base64
    resolve(uri);
  });
};