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

const AcScreen = ({ navigation }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('air_conditioners').select('*');
      if (error) {
        console.error('Error fetching ACs:', error);
      } else {
        setRecords(
          data.map((item) => ({
            ...item,
            sustainability_score: calculateSustainabilityScore(item),
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSustainabilityScore = (ac) => {
    const power = parseFloat(ac.power_kw) || 1.5;
    const usagePerDay = parseFloat(ac.hours_per_day) || 8;
    const years = parseFloat(ac.lifetime_years) || 10;
    const co2PerKWh = 0.5;

    const totalKWh = power * usagePerDay * 365 * years;
    const totalCO2 = totalKWh * co2PerKWh;
    const maxImpact = 10000;

    return Math.max(0, 100 - (totalCO2 / maxImpact) * 100).toFixed(2);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>AC Sustainability Ratings</Text>
      <FlatList
        data={records}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image
              source={{
                uri: item.image_url || 'https://via.placeholder.com/200',
              }}
              style={styles.image}
            />
            <Text style={styles.text}>
              <Text style={styles.label}>Name: </Text>{item.name}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.label}>Sustainability Score: </Text>{item.sustainability_score}
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#2e8b57' }]}
                onPress={() => alert(`Buy ${item.name} from our site`)}
              >
                <Text style={styles.buttonText}>Buy From Us</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: 'blue' }]}
                onPress={() =>
                  navigation.navigate('WebviewScreen', {
                    url: `https://priceoye.pk/search?q=${item.name}`,
                  })
                }
              >
                <Text style={styles.buttonText}>Buy From Others</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  heading: { fontSize: 28, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 20 },
  text: { fontSize: 16, color: '#222', marginBottom: 4 },
  label: { fontWeight: 'bold', color: '#666' },
  item: { marginBottom: 20, paddingBottom: 10, borderBottomWidth: 1, borderColor: '#ddd' },
  image: { width: '100%', height: 200, resizeMode: 'cover', marginBottom: 10, borderRadius: 10 },
  buttonContainer: { flexDirection: 'row', marginTop: 10, justifyContent: 'space-between' },
  button: { flex: 1, marginHorizontal: 5, padding: 10, borderRadius: 6, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold' },
});

export default AcScreen;
