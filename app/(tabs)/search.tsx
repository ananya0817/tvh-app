import { Platform, StyleSheet } from 'react-native';
import { View } from '@/components/Themed';
import Shows from '@/components/Shows';

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <Shows/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: "#8d7a8e",
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Inter',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
