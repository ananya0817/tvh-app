import { StyleSheet } from 'react-native';
import ShowInfo from '@/components/ShowInfo';
import { View } from '@/components/Themed';

export default function ShowDetailsScreen() {
  return (
    <View style={styles.container}>
        <ShowInfo/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#625161',
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
