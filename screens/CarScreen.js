import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '../services/supbaseClient';

const CarScreen = ({ navigation }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('cars').select('*');
      if (error) {
        console.error('Error fetching data from Supabase:', error);
      } else {
        const formattedData = data.map((item) => ({
          ...item,
          sustainability_score: calculateSustainabilityScore(item),
        }));
        setRecords(formattedData);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateSustainabilityScore = (item) => {
    const production = parseFloat(item.production_emissions) || 0;
    const usePhase = (parseFloat(item.use_phase_emissions) || 0) * (parseFloat(item.lifetime_years) || 1);
    const recyclingRate = parseFloat(item.recycling_rate) || 0;

    const rawScore = (production + usePhase) * (1 - recyclingRate);
    const maxImpact = 50000;
    const normalized = Math.max(0, 100 - (rawScore / maxImpact) * 100);

    return normalized.toFixed(2);
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image
        source={{
          uri: item.image_url || 'https://via.placeholder.com/200',
        }}
        style={styles.image}
      />
      <Text style={styles.text}>
        <Text style={styles.label}>Name: </Text>
        {item.name}
      </Text>
      <Text style={styles.text}>
        <Text style={styles.label}>Sustainability Score: </Text>
        {item.sustainability_score}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#2e8b57' }]}
          onPress={() => alert(`Redirecting to manufacturer of ${item.name}`)}
        >
          <Text style={styles.buttonText}>Buy From Us</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: 'blue' }]}
          onPress={() => navigation.navigate('WebviewScreen', { url: `https://priceoye.pk/search?q=${item.name}` })}
        >
          <Text style={styles.buttonText}>Buy From Others</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#228B22" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Car Sustainability Ratings</Text>
      <FlatList
        data={records}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  item: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
    color: '#222',
    marginBottom: 4,
  },
  label: {
    fontWeight: 'bold',
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CarScreen;
