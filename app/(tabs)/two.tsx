import { StyleSheet } from 'react-native';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import Reviews from '@/components/Reviews';
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/utils/supabase";
import {useEffect, useState} from "react";
import {useRouter} from "expo-router";

export default function two() {
    const [session, setSession] = useState<Session | null>(null);
    const [userId, setUserId] = useState("");

    useEffect(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUserId(session?.user?.id || "");
      })

      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUserId(session?.user?.id || "");
      });
    }, [])

    return (
        <View style={styles.container}>
          <Text style={styles.title}>My Reviews</Text>
          <Reviews current_user={session?.user?.id || ""}/>
        </View>
    );
};

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
