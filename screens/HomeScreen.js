import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';

const categories = [
  {
    id: '1',
    name: 'Mobile',
    image: require('../pictures/mobile.jpeg'),
    screen: 'MobileScreen',
  },
  {
    id: '2',
    name: 'Car',
    image: require('../pictures/Car.jpeg'),
    screen: 'CarScreen',
  },
  {
    id: '3',
    name: 'Bike',
    image: require('../pictures/Bike.jpeg'),
    screen: 'BikeScreen',
  },
  {
    id: '4',
    name: 'Air Conditioner',
    image: require('../pictures/AC.jpeg'),
    screen: 'ACScreen',
  },
];

const HomeScreen = ({ navigation }) => {
  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryContainer}
      onPress={() => navigation.navigate(item.screen)}
    >
      <Image source={item.image} style={styles.categoryImage} />
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categories</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={renderCategory}
        numColumns={2} // Show two categories in each row
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 20,
    textAlign: 'center',
  },
  list: {
    justifyContent: 'center',
  },
  categoryContainer: {
    flex: 1,
    alignItems: 'center',
    margin: 8,
    backgroundColor: 'green',
    borderRadius: 10,
    padding: 10,
  },
  categoryImage: {
    width: 100,
    height: 100,
    marginBottom: 8,
    borderRadius: 10,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
});
