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

const MobileScreen = ({ navigation }) => {
  const [records, setRecords] = useState([]); // ✅ Hook 1
  const [loading, setLoading] = useState(true); // ✅ Hook 2

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('record').select('*');
        if (error) {
          console.error('Error fetching data from Supabase:', error);
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

  const calculateSustainabilityScore = (item) => {
    const materialImpact = {
        "Plastic": 60,  // High carbon footprint, low recyclability
        "Metal": 80,    // Lower footprint, but mining impact
        "Glass": 90     // Recyclable, lower mining impact
    };

    const batteryImpact = {
        "Li-Ion": 70,   // Medium impact (recyclable but resource-intensive)
        "NiMH": 85,     // Lower impact (better recyclability)
        "Li-Poly": 60   // Higher impact (more mining required)
    };

    const weightFactor = parseFloat(item.body_weight) || 0;  // More weight = more materials used
    const energyFactor = parseFloat(item.energy_consumption) || 50;  // Power used in device lifetime
    const recyclabilityFactor = parseFloat(item.recyclability) || 50;  // Percentage of materials that can be recycled

    // Final weighted score (weights based on LCA importance)
    return (
        (materialImpact[item.body_material] || 50) * 0.25 +  // 25% weight
        (batteryImpact[item.battery_type] || 50) * 0.30 +    // 30% weight
        (100 - weightFactor) * 0.15 +                        // 15% weight (lower is better)
        (100 - energyFactor) * 0.15 +                        // 15% weight (lower is better)
        recyclabilityFactor * 0.15                           // 15% weight (higher is better)
    ).toFixed(2);
};


  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Mobile Specifications</Text>

      {/* Product List */}
      <FlatList
        data={records}
        keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            {item.image_url && (
              <Image
                source={{ uri: item.image_url || 'https://via.placeholder.com/200' }}
                style={styles.image}
              />
            )}
            <Text style={styles.text}>
              <Text style={styles.label}>Name: </Text>{item.name}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.label}>Sustainability Score: </Text>{item.sustainability_score}
            </Text>

            {/* Two Buttons for Purchasing */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={() => alert(`Redirecting to our site for ${item.name}`)}>
                <Text style={styles.buttonText}>Buy from Our Site</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: 'blue' }]}
                onPress={() => navigation.navigate('WebviewScreen', { url: `https://priceoye.pk/search?q=${item.name}` })}
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
  heading: { fontSize: 30, fontWeight: 'bold', color: 'gray', textAlign: 'center', marginBottom: 10 },
  text: { fontSize: 16, color: 'black' },
  label: { fontWeight: 'bold', color: 'gray' },
  item: { padding: 15, borderBottomWidth: 1, borderColor: '#ccc', marginBottom: 10 },
  image: { width: '100%', height: 200, resizeMode: 'contain' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  button: { backgroundColor: 'green', padding: 10, borderRadius: 5, alignItems: 'center', flex: 1, marginHorizontal: 5 },
  buttonText: { color: 'white', fontWeight: 'bold' },
});

export default MobileScreen;
