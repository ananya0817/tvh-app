import { StyleSheet } from 'react-native';
import React, { useState } from "react";
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { Button } from '@rneui/base';

export default function TabThreeScreen() {
    const [selected, setSelected] = useState<"toWatch" | "watched">("toWatch");
  
    return (
      <View style={styles.container}>
        {/* Button Container */}
        <View style={styles.buttonContainer}>
          <Button
            title="To Watch"
            onPress={() => setSelected("toWatch")}
            buttonStyle={[
              styles.button,
              { backgroundColor: selected === "toWatch" ? "#AF9FAE" : "#D9D9D9" },
            ]}
            titleStyle={styles.buttonText}
          />
          <Button
            title="Watched"
            onPress={() => setSelected("watched")}
            buttonStyle={[
              styles.button,
              { backgroundColor: selected === "watched" ? "#AF9FAE" : "#D9D9D9" },
            ]}
            titleStyle={styles.buttonText}
          />
        </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-start",
      backgroundColor: "#625161",
      paddingTop: 50,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "80%",
      position: "absolute",
      top: 40,
      backgroundColor: "#625161",
    },
    button: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
      width: 140,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "black",
    },
  });