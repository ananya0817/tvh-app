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
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === "ios" ? 10 : 0,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
