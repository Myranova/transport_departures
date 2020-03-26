import React, { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import base64 from 'react-native-base64';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

const API_URL = 'https://api.navitia.io/v1';
const API_TOKEN = 'dcd52907-06f0-49dc-8bd8-f25670939644';

/* - récuprer coordonnées( longitude latitude  ) (fait)
- récupérer les places nearby qui sont des stop_area - grace aux coordonnées récupérées avant
 exemple api :  'https://api.navitia.io/v1/coverage/fr-idf/stop_points/{coordonnées}/places_nearby?'
- récupérer les départ imminents grâce au label des stop area récupérer (un fetch par stop area)
- afficher heure, transport de chaque départ
*/

export default function App() {

  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState('');
  const [places_nearby, setPlaces_nearby] = useState(null);
  const [listStopPoints, setStopPoints] = useState([]);

  React.useEffect(() => {
    if (location != null) {
      const { coords } = location;
      const { latitude, longitude } = coords;
      fetch((`https://api.navitia.io/v1/coverage/fr-idf/stop_points/${longitude};${latitude}/places_nearby`), {
        headers: {
          'Authorization': `Basic ${base64.encode(`${API_TOKEN}:''`)}`,
          'Content-Type': 'application/json'
        }
      })
      .then((response) => response.json())
      .then(responseJson => {
        setPlaces_nearby(responseJson);
      }).catch(error => {
        console.log(error);
      })
    }
  }, [location])

  React.useEffect(() => {
    let listStopPoints = [];
    let i = 0;
    if (places_nearby !== null) {
      places_nearby.places_nearby.map((place) => {
        if (place.embedded_type === "stop_point") {
          const p = {
            id : i,
            name : place.name
          }
          listStopPoints.push(p);
          i += 0;
        }
      })
      setStopPoints(listStopPoints);
    }
  }, [places_nearby]) 

  React.useEffect(() => {
    if (listStopPoints !== []) {

    }
  })

  _getLocationAsync = async() => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      setStatus('permission to location not granted');
    } else {
      setStatus(status);
      let location = await Location.getCurrentPositionAsync({timeout : 10000});
      if (location == 0) {
        alert('error for get location ');
      }
      setLocation(location);
    }
    console.log(location);
  }

  return (
    <View style={styles.container}>
      {listStopPoints.map((stopPoint, id) => {
        return (<Text key={id}> points d'arrêt proche : {stopPoint.name} </Text>)
      })}
      <Text> GPS Location Permission :  {status}</Text>
      <Button
        onPress={this._getLocationAsync}
        title="Get New GPS Location"
        color="green"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
