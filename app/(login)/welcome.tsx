import { Button, View } from 'react-native';
    
    const MyButton = () => {
      return (
        <View>
          <Button
            title="Press me"
            onPress={() => console.log("Button pressed")}
          />
        </View>
      );
    };