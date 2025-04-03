import { StyleSheet } from 'react-native';
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
    marginTop: 50,
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
