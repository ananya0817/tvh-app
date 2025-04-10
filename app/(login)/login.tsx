import 'react-native-url-polyfill/auto'
import { useState } from 'react'
import { Auth } from '../../components/Auth'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, KeyboardAvoidingView, Platform } from "react-native";
import { Input } from '@rneui/themed'
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function SigninScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signInWithEmail, loading } = Auth();
  const router = useRouter();

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
          <Text style={styles.title}>Sign In</Text>
          <Text style={styles.text}>Welcome!</Text>
          <View style={styles.formContainer}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Email</Text>
              <Input
                style={styles.input}
                placeholderTextColor="#aaa"
                //leftIcon={{ type: 'font-awesome', name: 'envelope' }}
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
              placeholderTextColor="#aaa"
              //label="Password"
              // leftIcon={{ type: 'font-awesome', name: 'lock' }}
              onChangeText={(text: string) => setPassword(text)}
              value={password}
              secureTextEntry={true}
              placeholder="password"
              autoCapitalize={'none'}
            />
          </View>
          <TouchableOpacity
               style={styles.button}
               onPress={() => signInWithEmail(email, password)}
             >
               <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
          </View>
          <View style={styles.bottomTextContainer}>
             <Text numberOfLines={1} style={styles.bottomText}>
               Don't have an account?{' '}
               <Text
                style={styles.link}
                onPress={() => router.push('/(login)/signup')}
              >
                Sign up
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
    fontSize: 20,
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
    fontFamily: 'Inter',
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
  centered: {
    textAlign: 'center',
  },
  // container: {
  //   marginTop: 40,
  //   backgroundColor: '#8d7a8e',
  //   flex: 1,
  //   padding: 30,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  // verticallySpaced: {
  //   paddingTop: 4,
  //   paddingBottom: 4,
  //   alignSelf: 'stretch',
  // },
  // mt20: {
  //   marginTop: 20,
  // }
});