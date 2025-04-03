import { useState } from 'react'
import { Alert } from "react-native";
import { supabase } from '../utils/supabase'
import { useRouter } from 'expo-router';

export function Auth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false)

  async function signInWithEmail(email: string, password: string) {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) { 
      Alert.alert(error.message)
    }
    else {
      Alert.alert('Logged in!')
      router.replace('/(tabs)');
    }
    setLoading(false)
  }

  async function signUpWithEmail(email: string, username: string, password: string) {
    setLoading(true)
    const { data: userExists } = await supabase
      .from('Profiles')
      .select('id')
      .eq('username', username)
      .single()
    
    if (userExists) {
      Alert.alert('Username is unavailable.')
      setLoading(false)
      return
    }

    const { data, error, } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      Alert.alert(error.message);
      setLoading(false)
    } 

    if (data.user) {
      const { error: error } = await supabase
      .from('Profiles') 
      .insert([{ id: data.user.id, username }])

      if (error) { 
        Alert.alert(error.message)
      }
      else {
        Alert.alert('Signed up!')
        router.replace('/(tabs)');
      }
      setLoading(false);
    }
    setLoading(false);
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert(error.message);
    } 
    else {
      Alert.alert('Logged out.')
      router.replace('/welcome');
    }
  }

  return {
    signInWithEmail, signUpWithEmail, signOut, loading
  };
};
