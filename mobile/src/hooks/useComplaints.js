import { useState, useEffect } from 'react';
import ApiService from '../services/api';

export const useComplaints = (filters = {}) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ApiService.getComplaints(filters);
      
      if (response.success) {
        setComplaints(response.complaints);
      } else {
        setError('فشل في تحميل الشكاوى');
      }
    } catch (err) {
      setError('حدث خطأ أثناء تحميل الشكاوى');
      console.error('Error fetching complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const refetch = () => {
    fetchComplaints();
  };

  return {
    complaints,
    loading,
    error,
    refetch,
  };
};

export const useComplaintSearch = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchComplaints = async (query) => {
    if (!query.trim()) {
      setError('من فضلك ادخل رقم الشكوى أو رقمك القومي');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResults([]);

      const response = await ApiService.searchComplaints(query);
      
      if (response.success) {
        setResults(response.complaints);
        if (response.complaints.length === 0) {
          setError('لم يتم العثور على أي شكوى بهذا الرقم');
        }
      } else {
        setError('فشل في البحث عن الشكاوى');
      }
    } catch (err) {
      setError('حدث خطأ أثناء البحث');
      console.error('Error searching complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    results,
    loading,
    error,
    searchComplaints,
  };
};