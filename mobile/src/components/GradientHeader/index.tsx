import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar, View } from "react-native";

import styles from "./styles";

export default function GradientHeader() {
  return (
    <View>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={["rgba(0,0,0,0.8)", "transparent"]}
        style={styles.container}
      />
    </View>
  );
}
