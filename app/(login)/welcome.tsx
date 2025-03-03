import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import { useRouter } from 'expo-router';

// logo
const TVLogo = require('../../assets/images/logo.png'); 
const WelcomeScreen: React.FC = () => {
const router = useRouter();
  
  const handleSignUp = () => {
    router.replace('/(login)/signup');
  };

  const handleSignIn = () => {
    router.replace('/(login)/login');
  };

  return (
    <View style={styles.screen}>
      <View style={styles.logoContainer}>
        <Image source={TVLogo} style={styles.logo} resizeMode="contain" />
      </View>
      <Text style={styles.text}>Track your favorite TV shows.</Text>
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleSignUp}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.button, styles.secondaryButton]} 
        onPress={handleSignIn}
      >
        <Text style={styles.buttonText}>Sign In</Text>
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
  logoContainer: {
    width: 150,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  text: {
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#222',
    borderRadius: 5,
    paddingVertical: 12,
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});

export default WelcomeScreen;