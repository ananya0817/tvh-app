import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

// logo
const TVLogo = require('../../assets/images/logo-Photoroom.png'); 
const WelcomeScreen: React.FC = () => {
const router = useRouter();
  
  const handleSignUp = () => {
    router.replace('/(login)/signup');
  };

  const handleSignIn = () => {
    router.replace('/(login)/login');
  };

  return (
    <LinearGradient
      colors={['#9A8997', '#665565']}
      style={styles.gradient}
    >
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
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  screen: {
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
    marginBottom: 80,
  },
  logo: {
    width: '300%',
    height: '300%',
  },
  text: {
    color: 'white',
    fontSize: 25,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
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
    borderRadius: 15,
    paddingVertical: 30,
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
    marginBottom: 70,
  },
});

export default WelcomeScreen;