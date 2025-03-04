import React, { useState } from 'react'
import { Alert, View, Text, Button, StyleSheet, TextInput, ScrollView, TouchableOpacity, Dimensions, Image, KeyboardAvoidingView, Platform } from "react-native";
import { supabase } from '../utils/supabase'
import { Input } from '@rneui/themed'
import { useRouter } from 'expo-router';

export default function Auth() {
  const router = useRouter();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) { 
      Alert.alert(error.message)
    }
    else {
      router.replace('/(tabs)');
    }
    setLoading(false)
  }

  async function signUpWithEmail() {
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) {
      Alert.alert(error.message);
    } else {
      router.replace('/(tabs)');
    }
    setLoading(false);
  }

  return (
    <><ScrollView contentContainerStyle={{ flexGrow: 1 }}>
       <KeyboardAvoidingView
         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
         style={{ flex: 1 }}
       >
        <View style={styles.screen}>
          <Text style={styles.title}>Sign In</Text>
          <Text style={styles.text}>Welcome back!</Text>
          <View style={styles.formContainer}>
            <View style={styles.formGroup}>
            <View style={[styles.verticallySpaced, styles.mt20]}></View>
              <Text style={styles.label}>Email</Text>
              <Input
                style={styles.input}
                placeholderTextColor="#aaa"
                leftIcon={{ type: 'font-awesome', name: 'envelope' }}
                onChangeText={(text: string) => setEmail(text)}
                value={email}
                placeholder="email@address.com"
                autoCapitalize={'none'}
              />
            </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Password</Text>
            <Input
              style={styles.input}
              //label="Password"
              leftIcon={{ type: 'font-awesome', name: 'lock' }}
              onChangeText={(text: string) => setPassword(text)}
              value={password}
              secureTextEntry={true}
              placeholder="Password"
              autoCapitalize={'none'}
            />
          </View>
          <View style={styles.bottomTextContainer}>
             <Text style={styles.bottomText}>
               Don't have an account?{' '}
               <Text
                style={styles.link}
                onPress={() => router.push('/(login)/signup')}
              >
                Sign up
              </Text>
            </Text>
          </View>
          <TouchableOpacity
               style={styles.button}
               onPress={() => signInWithEmail()}
             >
               <Text style={styles.buttonText}>Sign In</Text>
             </TouchableOpacity>
             
          </View>
        </View>
        </KeyboardAvoidingView>
     </ScrollView>
     </>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#8d7a8e',
    flex: 1,
    padding: 150,
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
    padding: 0,
    borderRadius: 10,
    width: '350%',
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
  centered: {
    textAlign: 'center',
  },
  container: {
    marginTop: 40,
    backgroundColor: '#8d7a8e',
    flex: 1,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  }
});