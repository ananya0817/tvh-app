import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase'
import { Session } from '@supabase/supabase-js'
import Reviews from '@/components/Reviews';

export default function TabFiveScreen() {
    const [session, setSession] = useState<Session | null>(null);
    const [email, setEmail] = useState("")
    
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
          setSession(session);
          setEmail(session?.user?.email || "");
        })
  
        supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session);
          setEmail(session?.user?.email || "");
        });
      }, [])

    return (
        <View style={styles.container}>
            <Text style={styles.username}>{email}</Text>
            <View style={styles.stats}>
                <View style={styles.statBox}>
                    <Text style={styles.statNum}>#</Text>
                    <Text style={styles.statText}>comments</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statNum}>#</Text>
                    <Text style={styles.statText}>reviews</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statNum}>#</Text>
                    <Text style={styles.statText}>shows</Text>
                </View>
            </View>
            
            <View style={styles.divider} />

            <Text style={styles.header}> Top Shows</Text>
            <View style={styles.showsBox}>

            </View>

            <View style={styles.divider} />

            <View style={styles.reviews}>
                <Text style={styles.header}>Recent Reviews</Text>
                <TouchableOpacity>
                    <Text style={styles.viewMore}>View More</Text>
                </TouchableOpacity>
            </View>
            <Reviews current_user={session?.user?.id || ""}/>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#8d7a8e',
        alignItems: 'flex-start',
        padding: 15,
    },
    username: {
        marginTop: 10,
        marginLeft: 20,
        fontSize: 35,
        fontWeight: 'bold',
        color: 'white',
    },
    stats: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
    },
    statBox: {
        flex: 1,
        alignItems: 'center',
    },
    statNum: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white',
    },
    statText: {
        fontSize: 20,
        color: 'white',
    },
    divider: {
        backgroundColor: 'white',
        alignSelf: 'center',
        height: 2,
        width: '95%',
        marginTop: 15,
        marginBottom: 15,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    showsBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 125,
    },
    reviews: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    viewMore: {
        fontSize: 16,
        color: 'white',
    },
    reviewBox: {
        padding: 10,
    },
    reviewText: {
        fontSize: 14,
        color: '#fff',
        marginTop: 5,
    },
    reviewDivider: {
        backgroundColor: 'white',
        alignSelf: 'center',
        height: 1,
        width: '95%',
        marginTop: 2,
        marginBottom: 2,
    },
});

