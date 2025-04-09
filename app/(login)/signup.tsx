import React, { useState } from 'react';
import {StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Auth } from '../../components/Auth';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function SignupScreen() {  
  const router = useRouter();
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { signUpWithEmail, loading } = Auth()

  return (
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
      <LinearGradient
        colors={['#9A8997', '#665565']}
        style={styles.gradient}
      >
        <View style={styles.screen}>
          <Text style={styles.title}>Sign Up</Text>
          <Text style={styles.text}>Ready to track your TV adventures?</Text>
          <View style={styles.formContainer}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="email@address.com"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                placeholder="username"
                placeholderTextColor="#aaa"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="password"
                placeholderTextColor="#aaa"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
            <TouchableOpacity 
              style={styles.button} 
              onPress={() => {
                if (!email.trim() || !username.trim() || !password.trim()) {
                  Alert.alert('Please fill in all fields.')
                  return
                }
                signUpWithEmail(email, username, password)}}
            >
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bottomTextContainer}>
            <Text style={styles.bottomText}>
              Already have an account?{' '}
              <Text 
                style={styles.link} 
                onPress={() => router.push('/login')}
              >
                Sign in
              </Text>
            </Text>
          </View>
        </View>
        </LinearGradient>
      </KeyboardAvoidingView>
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
    width: windowWidth,
    height: windowHeight,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 50,
    textAlign: 'center',
    fontFamily: 'Inter',
  },
  text: {
    color: 'white',
    fontSize: 19,
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'Inter',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    marginVertical: 10,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    color: 'white',
    marginBottom: 5,
    fontSize: 14,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 12,
    width: '100%',
    fontFamily: 'Inter',
  },
  button: {
    backgroundColor: '#222',
    borderRadius: 5,
    paddingVertical: 12,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Inter',
  },
  bottomTextContainer: {
    marginTop: 15,
  },
  bottomText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Inter',
  },
  link: {
    textDecorationLine: 'underline',
    color: 'white',
  },
});
