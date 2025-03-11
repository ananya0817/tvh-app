import { StyleSheet } from 'react-native';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import Reviews from '@/components/Reviews';
import ShowInfo from "@/components/ShowInfo";


export default function TabFourScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Reviews</Text>
      <Reviews current_user={"436e520e-c3f4-4678-affa-2f6c33497c61"}/>
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
