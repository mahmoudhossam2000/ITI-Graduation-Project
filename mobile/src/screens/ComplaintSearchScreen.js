import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button, Card, Title } from 'react-native-paper';

// Components
import ComplaintCard from '../components/complaint/ComplaintCard';
import ErrorMessage from '../components/common/ErrorMessage';

// Hooks
import { useComplaintSearch } from '../hooks/useComplaints';

export default function ComplaintSearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { results, loading, error, searchComplaints } = useComplaintSearch();

  const handleSearch = () => {
    searchComplaints(searchQuery);
  };

  const renderComplaintItem = ({ item }) => (
    <ComplaintCard 
      complaint={item} 
      showActions={false}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.searchCard}>
          <Card.Content>
            <Title style={styles.title}>متابعة حالة الشكوى</Title>
            
            <TextInput
              label="رقم الشكوى أو الرقم القومي"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
              mode="outlined"
              left={<TextInput.Icon icon="search" />}
            />
            
            <Button
              mode="contained"
              onPress={handleSearch}
              loading={loading}
              disabled={loading}
              style={styles.searchButton}
            >
              {loading ? 'جاري البحث...' : 'بحث'}
            </Button>
          </Card.Content>
        </Card>

        {error && (
          <ErrorMessage 
            message={error}
            onRetry={() => searchComplaints(searchQuery)}
            showRetry={false}
          />
        )}

        {results.length > 0 && (
          <FlatList
            data={results}
            renderItem={renderComplaintItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            style={styles.resultsList}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  searchCard: {
    elevation: 4,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#183B4E',
    textAlign: 'center',
    marginBottom: 16,
  },
  searchInput: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  searchButton: {
    backgroundColor: '#27548A',
    paddingVertical: 4,
  },
  resultsList: {
    flex: 1,
  },
});