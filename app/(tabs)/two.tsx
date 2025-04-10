import { Platform, StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/utils/supabase";
import React, {useEffect, useState} from "react";
import Reviews from '@/components/Reviews';

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
            <Reviews current_user={session?.user?.id || ""} more={true}/>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8d7a8e',
    paddingTop: Platform.OS === "ios" ? 60 : 30,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    fontFamily: 'Inter',
    color: "white",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
