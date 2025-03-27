import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase'
import { Session } from '@supabase/supabase-js'
import Reviews from '@/components/Reviews';
import { router } from 'expo-router';

export default function TabFiveScreen() {
    const [session, setSession] = useState<Session | null>(null);
    const [email, setEmail] = useState("");
    const[reviewCount, setReviewCount] = useState(0);
    const[commentCount, setCommentCount] = useState(0);
    const[watchCount, setWatchCount] = useState(0);
    
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
    useEffect(() => {
        if (!session?.user?.id) return;

        const fetchReviewCount = async() => {
            const { error, count } = await supabase
                .from("Reviews")
                .select("id", { count: "exact", head: true })
                .eq("user", session?.user.id);

            if (error) {
                console.error("Error fetching review count:", JSON.stringify(error, null, 2));
                return;
            }
            console.log("Fetched review count:", count);
            setReviewCount(count || 0);
        };
        const fetchCommentCount = async() => {
            const { error, count } = await supabase
                .from("Comments")
                .select("id", { count: "exact", head: true })
                .eq("user", session?.user.id)
                .not("comment_text", "is", null);

            if (error) {
                console.error("Error fetching comment count:", error.message);
                return;
            }
            setCommentCount(count || 0);
        };
        const fetchWatchCount= async() => {
            const { error, count } = await supabase
                .from("UserShows")
                .select("id", { count: "exact", head: true })
                .eq("user", session?.user.id);

            if (error) {
                console.error("Error fetching watch count:", error.message);
                return;
            }
            setWatchCount(count || 0);
        };
        fetchReviewCount();
        fetchCommentCount();
        fetchWatchCount();
    }, [session]);

    return (
        <View style={styles.container}>
            <Text style={styles.username}>{email}</Text>
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
});

