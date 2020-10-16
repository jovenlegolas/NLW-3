import React, { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { Feather } from "@expo/vector-icons";

import mapMaker from "../../images/map-marker.png";

import { useFocusEffect, useNavigation } from "@react-navigation/native";

import styles from "./styles";
import { RectButton } from "react-native-gesture-handler";

import api from "../../services/axios";

interface Orphanage {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export default function OrphangesMap() {
  const navigation = useNavigation();
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);

  const [initialPosition, setInitialPosition] = useState({
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    async function loadPosition() {
      const { status } = await Location.requestPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Ops!",
          "Precisamos de sua permissão para obter a localização."
        );

        return;
      }

      const location = await Location.getCurrentPositionAsync();

      const { latitude, longitude } = location.coords;

      setInitialPosition({ latitude, longitude });
    }

    loadPosition();
  }, []);

  useFocusEffect(() => {
    async function loadOrphanages() {
      const response = await api.get("orphanages");

      setOrphanages(response.data);
    }

    loadOrphanages();
  });

  function handleNavigateToOrphanageDetails(id: number) {
    navigation.navigate("OrphanageDetails", { id });
  }

  function handleNavigateToCreateOrphanage() {
    navigation.navigate("SelectMapPosition", { initialPosition });
  }

  return (
    <View style={styles.container}>
      {initialPosition.latitude !== 0 && (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.mapStyle}
          loadingEnabled={initialPosition.latitude === 0}
          initialRegion={{
            latitude: initialPosition.latitude,
            longitude: initialPosition.longitude,
            latitudeDelta: 0.014,
            longitudeDelta: 0.014,
          }}
        >
          {orphanages.map((orphanage) => {
            return (
              <Marker
                key={orphanage.id}
                icon={mapMaker}
                calloutAnchor={{
                  x: 0.75,
                  y: -0.1,
                }}
                coordinate={{
                  latitude: orphanage.latitude,
                  longitude: orphanage.longitude,
                }}
              >
                <Callout
                  tooltip
                  onPress={() => handleNavigateToOrphanageDetails(orphanage.id)}
                >
                  <View style={styles.calloutContainer}>
                    <Text style={styles.calloutText}>{orphanage.name}</Text>
                  </View>
                </Callout>
              </Marker>
            );
          })}
        </MapView>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {orphanages.length} orfanato(s) encontrado(s)
        </Text>

        <RectButton
          style={styles.createOrphanageButton}
          onPress={handleNavigateToCreateOrphanage}
        >
          <Feather name="plus" size={20} color="#fff" />
        </RectButton>
      </View>
    </View>
  );
}
