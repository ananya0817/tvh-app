import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../utils/supabase'
import { Session } from '@supabase/supabase-js'
import Reviews from '@/components/Reviews';
import { router } from 'expo-router';
import { Auth } from '../../components/Auth';
import { useFocusEffect } from '@react-navigation/native';

export default function TabFiveScreen() {
    const [session, setSession] = useState<Session | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const { signOut } = Auth();
    const[reviewCount, setReviewCount] = useState(0);
    const[commentCount, setCommentCount] = useState(0);
    const[watchCount, setWatchCount] = useState(0);
    
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session?.user?.id) {
                fetchUsername(session.user.id);
            }
        });
    
        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session?.user?.id) {
                fetchUsername(session.user.id);
            }
        });
    }, []);
    
    const fetchUsername = useCallback(async(userId: string) => {
        const { data, error } = await supabase
            .from('Profiles')
            .select('username')
            .eq('id', userId)
            .single();
    
        if (error) {
            console.error("Error fetching username:", error.message);
            setUsername("Unknown");
        } else {
            setUsername(data.username);
        }
    }, [session]);
    
    const fetchReviewCount = useCallback(async() => {
        const { error, count } = await supabase
            .from("Reviews")
            .select("id", { count: "exact", head: true })
            .eq("user_id", session?.user.id);

        if (error) {
            console.error("Error fetching review count:", JSON.stringify(error, null, 2));
            return;
        }
        console.log("Fetched review count:", count);
        setReviewCount(count || 0);
    }, [session]);

    const fetchCommentCount = useCallback(async() => {
        const { error, count } = await supabase
            .from("Comments")
            .select("id", { count: "exact", head: true })
            .eq("user_id", session?.user.id)
            .not("comment_text", "is", null);

        if (error) {
            console.error("Error fetching comment count:", error.message);
            return;
        }
        setCommentCount(count || 0);
    }, [session]);
    const fetchWatchCount= useCallback(async() => {
        const { error, count } = await supabase
            .from("UserShows")
            .select("id", { count: "exact", head: true })
            .eq("user_id", session?.user.id);

        if (error) {
            console.error("Error fetching watch count:", error.message);
            return;
        }
        setWatchCount(count || 0);
    }, [session]);

    useFocusEffect(
        useCallback(() => {
            if (session?.user?.id) {
                fetchUsername(session.user.id);
                fetchReviewCount();
                fetchCommentCount();
                fetchWatchCount();
            }
        }, [session, fetchReviewCount, fetchCommentCount, fetchWatchCount])
    );

    return (
        <View style={styles.container}>
            <View style={styles.top}>
                <Text style={styles.username}>{username}</Text>
                <TouchableOpacity onPress={signOut} style={styles.signOutButton}>
                    <Text style={styles.signOutText}>Sign Out</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.stats}>
                <View style={styles.statBox}>
                    <Text style={styles.statNum}>{commentCount}</Text>
                    <Text style={styles.statText}>comments</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statNum}>{reviewCount}</Text>
                    <Text style={styles.statText}>reviews</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statNum}>{watchCount}</Text>
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
                <TouchableOpacity
                onPress={() => router.push('/two')}
                >
                    <Text style={styles.viewMore}>View More</Text>
                </TouchableOpacity>
            </View>
            <Reviews current_user={session?.user?.id || ""} more={false}/>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#8d7a8e',
        padding: 15,
        paddingTop: 50,
    },
    top: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
        marginTop: 10,
    },
    username: {
        marginTop: 10,
        marginLeft: 20,
        fontSize: 35,
        fontWeight: 'bold',
        color: 'white',
    },
    signOutButton: {
        backgroundColor: '#6c5875',
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10,
        padding: 5,
    },
    signOutText: {
        fontSize: 16,
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
});

