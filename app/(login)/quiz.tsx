import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import { useRouter } from 'expo-router';

const QuizScreen: React.FC = () => {
const router = useRouter();
  
  const handleGetStarted = () => {
    router.replace('/(tabs)');
  };


  return (
    <View style={styles.screen}>
      <Text style={styles.text}>Welcome to TVH!</Text>
      <Text style={styles.smalltext}>Complete this short quiz to get started.</Text>
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleGetStarted}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#8d7a8e',
    flex: 1,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 35,
    marginBottom: 20,
    textAlign: 'center',
  },
  smalltext: {
    color: 'white',
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
    paddingVertical: 30,
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
    marginBottom: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '500',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
    paddingVertical: 30,
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
    marginBottom: 70,
  },
});

export default QuizScreen;