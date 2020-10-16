import React, { useState } from "react";
import { View, Text } from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";
import { RectButton } from "react-native-gesture-handler";
import MapView, { MapEvent, Marker } from "react-native-maps";

import mapMarkerImg from "../../images/map-marker.png";
import styles from "./styles";

interface SelectMapPositionRouteParams {
  initialPosition: {
    latitude: number;
    longitude: number;
  };
}

export default function SelectMapPosition() {
  const route = useRoute();
  const params = route.params as SelectMapPositionRouteParams;

  const navigation = useNavigation();
  const [position, setPostition] = useState({ latitude: 0, longitude: 0 });

  function handleNextStep() {
    navigation.navigate("OrphanageData", { position });
  }

  function handleSelectedMapPosition(event: MapEvent) {
    setPostition(event.nativeEvent.coordinate);
  }

  return (
    <View style={styles.container}>
      <MapView
        initialRegion={{
          latitude: params.initialPosition.latitude,
          longitude: params.initialPosition.longitude,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008,
        }}
        style={styles.mapStyle}
        onPress={handleSelectedMapPosition}
      >
        {position.latitude !== 0 && (
          <Marker
            icon={mapMarkerImg}
            coordinate={{
              latitude: position.latitude,
              longitude: position.longitude,
            }}
          />
        )}
      </MapView>

      {position.latitude !== 0 && (
        <RectButton style={styles.nextButton} onPress={handleNextStep}>
          <Text style={styles.nextButtonText}>Próximo</Text>
        </RectButton>
      )}
    </View>
  );
}
