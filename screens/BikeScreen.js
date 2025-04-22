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

const BikeScreen = ({ navigation }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('bikes').select('*');
        if (error) {
          console.error('Error fetching bikes:', error);
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

    fetchRecords();
  }, []);

  const calculateSustainabilityScore = (bike) => {
    const mileage = parseFloat(bike.mileage_kmpl); // km/l
    const lifetimeKm = parseFloat(bike.lifetime_km) || 50000;
    const co2PerLiter = 2.31;

    const isElectric =
      parseFloat(bike.engine_capacity_cc) === 0 ||
      parseFloat(bike.fuel_tank_liters) === 0;

    if (isElectric) {
      return 200; // Electric bikes have fixed low score
    }

    if (!mileage || mileage <= 0) return 9999; // Invalid data fallback

    const totalCO2 = (lifetimeKm / mileage) * co2PerLiter;
    return totalCO2.toFixed(2); // lower = better
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
      <Text style={styles.heading}>Bike Specifications</Text>
      <FlatList
        data={records}
        keyExtractor={(item, index) =>
          item.id ? item.id.toString() : index.toString()
        }
        renderItem={({ item }) => (
          <View style={styles.item}>
            {item.image_url && (
              <Image source={{ uri: item.image_url }} style={styles.image} />
            )}
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
                style={styles.button}
                onPress={() => alert(`Buy ${item.name} from our site`)}
              >
                <Text style={styles.buttonText}>Buy from Our Site</Text>
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
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', padding: 30 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'gray',
    textAlign: 'center',
    marginBottom: 10,
  },
  text: { fontSize: 16, color: 'black' },
  label: { fontWeight: 'bold', color: 'gray' },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  image: { width: '100%', height: 200, resizeMode: 'contain' },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
});

export default BikeScreen;
