import { StyleSheet } from 'react-native';
import ShowInfo from '@/components/Shows';
import { Text, View } from '@/components/Themed';

export default function ShowInfoScreen() {
  return (
    <View style={styles.container}>
        <Text>
            <ShowInfo/>
        </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
