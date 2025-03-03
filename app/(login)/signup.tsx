import React, { useState } from 'react';
import {StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../utils/supabase';

const SignupScreen: React.FC = () => {
  const router = useRouter();
  const [signupForm, setSignupForm] = useState({
    email: '',
    username: '',
    password: ''
  });
  
  const handleSignupChange = (key: string, value: string) => {
    setSignupForm(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleSignup = async () => {
    // seeing if all fields are filled
    if (!signupForm.email || !signupForm.password) { // CHANGE BEFORE PUSHING
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupForm.email,
        password: signupForm.password,
      });
  
      if (error) {
        Alert.alert('Signup Error', error.message);
        return;
      }
  
      console.log('Signup successful:', data);
      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => router.push('/(login)/login') }
      ]);
    } catch (err) {
      console.error('Signup failed:', err);
      Alert.alert('Signup Error', 'Something went wrong. Please try again.');
    }
  };
  
  
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.screen}>
          <Text style={styles.title}>Sign Up</Text>
          <Text style={styles.text}>Ready to track your TV adventures?</Text>
          <View style={styles.formContainer}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Value"
                placeholderTextColor="#aaa"
                value={signupForm.email}
                onChangeText={(text) => handleSignupChange('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                placeholder="Value"
                placeholderTextColor="#aaa"
                value={signupForm.username}
                onChangeText={(text) => handleSignupChange('username', text)}
                autoCapitalize="none"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Value"
                placeholderTextColor="#aaa"
                value={signupForm.password}
                onChangeText={(text) => handleSignupChange('password', text)}
                secureTextEntry
              />
            </View>
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleSignup}
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
      </KeyboardAvoidingView>
    </ScrollView>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  text: {
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
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
  },
  bottomTextContainer: {
    marginTop: 15,
  },
  bottomText: {
    color: 'white',
    fontSize: 14,
  },
  link: {
    textDecorationLine: 'underline',
    color: 'white',
  },
});

export default SignupScreen;