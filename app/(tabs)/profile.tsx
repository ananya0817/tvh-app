import { StyleSheet, Text, View, TouchableOpacity, Platform, FlatList, Image } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../utils/supabase'
import { Session } from '@supabase/supabase-js'
import Reviews from '@/components/Reviews';
import { router } from 'expo-router';
import { Auth } from '../../components/Auth';
import { useFocusEffect } from '@react-navigation/native';
import {apiKey} from "@/components/api_links";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import axios from "axios";

interface Show {
    id: number;
    name: string;
    poster_path: string | null;
}

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export default function TabFiveScreen() {
    const [session, setSession] = useState<Session | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const { signOut } = Auth();
    const[reviewCount, setReviewCount] = useState(0);
    const[commentCount, setCommentCount] = useState(0);
    const[watchCount, setWatchCount] = useState(0);
    const [shows, setShows] = useState<Show[]>([]);
    const [favorite, setFavorite] = useState(0);
    
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
    const fetchUserShows = useCallback(async () => {
        if (!session?.user?.id) return;
        setLoading(true);
        try {
            const {data, error} = await supabase
                .from('UserShows')
                .select('show_id')
                .eq('user_id', session.user.id)
                .eq("favorite", true);

            if (error) throw error;

            const showIds = data?.map(item => item.show_id) || [];
            const showsData = await Promise.all(showIds.map(fetchShowDetails));
            const filtered = showsData.filter(
                (show): show is Show => show !== null && show.poster_path !== null
            );
            setShows(filtered);

        } catch (error) {
            console.error('Error fetching shows:', error);
        } finally {
            setLoading(false);
        }
    }, [session]);
    const fetchReviewCount = useCallback(async() => {
        if (!session?.user?.id) return;
        const { error, count } = await supabase
            .from("Reviews")
            .select("id", { count: "exact", head: true })
            .eq("user_id", session.user.id)
            .not("review_text", "is", null);

        if (error) {
            console.error("Error fetching review count:", JSON.stringify(error, null, 2));
            return;
        }
        setReviewCount(count || 0);
    }, [session]);

    const fetchCommentCount = useCallback(async() => {
        if (!session?.user?.id) return;
        const { error, count } = await supabase
            .from("Comments")
            .select("id", { count: "exact", head: true })
            .eq("user_id", session.user.id)
            .not("comment_text", "is", null);

        if (error) {
            console.error("Error fetching comment count:", error.message);
            return;
        }
        setCommentCount(count || 0);
    }, [session]);
  
    const fetchWatchCount= useCallback(async() => {
        if (!session?.user?.id) return;
        const { error, count } = await supabase
            .from("UserShows")
            .select("id", { count: "exact", head: true })
            .eq("user_id", session.user.id)
            .eq("completed", true);

        if (error) {
            console.error("Error fetching watch count:", error.message);
            return;
        }
        setWatchCount(count || 0);
    }, [session]);

   

    const fetchShowDetails = async (showId: number): Promise<Show | null> => {
        try {
            const options = {
                method: 'GET',
                url: `https://api.themoviedb.org/3/tv/${showId}`,
                params: { language: 'en-US' },
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${apiKey}`
                }
            };

            const response = await axios.request(options);
            const data = response.data;

            return {
                id: showId,
                name: data.name || 'Unknown Show',
                poster_path: data.poster_path
            };
        } catch (error) {
            console.error('Error fetching show details:', error);
            return null;
        }
    };

    const handleShowPress = (showId: number) => {
        if(session?.user.id == "")
        {
            return;
        }
        router.push({
            pathname: "/showDetails",
            params: {
                showId,
                userId1: session?.user.id
            }
        });
    };

    useFocusEffect(
        useCallback(() => {
            if (session?.user?.id) {
                fetchUsername(session.user.id);
                fetchUserShows();
                fetchReviewCount();
                fetchCommentCount();
                fetchWatchCount();
            }
        }, [session, fetchReviewCount, fetchCommentCount, fetchWatchCount])
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerTop}>
                <Text style={styles.username}>{username}</Text>
                <TouchableOpacity onPress={signOut} style={styles.signOutButton}>
                    <FontAwesome name="sign-out" size={25} color="white" />
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
                    <Text style={styles.statText}>completed</Text>
                </View>
            </View>
            
            <View style={styles.divider} />

            <Text style={styles.header}> Favorite Shows</Text>
            <View style={styles.showsBox }>
                {loading ? (<Text style={styles.loadText}>Loading...</Text>
                ) : shows.length === 0 ? (
                    <Text style={styles.noShowsText}>Star your favorite shows to showcase them! </Text>
                ) : (
                    <FlatList
                        contentContainerStyle={{paddingBottom:180}}
                        style={{maxHeight:180}}
                        data={shows}
                        keyExtractor={(tv) => tv.id.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item: tv }) => (
                            <TouchableOpacity onPress={() => handleShowPress(tv.id)}>
                                <View style={styles.tvItem}>
                                    <Image
                                        source={{ uri: `${IMAGE_BASE_URL}${tv.poster_path}` }}
                                        style={styles.poster}
                                    />
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                )}


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
            <Reviews current_user={session?.user?.id || ""} more={false} />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#8d7a8e',
        padding: 15,
        paddingTop: Platform.OS === "ios" ? 50 : 10,
        paddingBottom: 1,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    username: {
        marginTop: Platform.OS === 'ios' ? 25 : 10,
        marginLeft: 20,
        fontSize: 35,
        fontWeight: 'bold',
        color: 'white',
        fontFamily: 'Inter',
    },
    signOutButton: {
        marginRight: 10,
    },
    signOutText: {
        fontSize: 16,
        color: 'white',
        fontFamily: 'Inter',
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
        fontFamily: 'Inter',
    },
    statText: {
        fontSize: 20,
        color: 'white',
        fontFamily: 'Inter',
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
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        fontFamily: 'Inter',
        // marginBottom: 5,
    },
    showsBox: {
        marginTop:10,
        paddingHorizontal: 5,
        height: 180,
    },
    tvItem: {
        width: 110,
        marginRight: 5,
        alignItems: "center",
    },
    poster: {
        width: 110,
        height: 160,
        borderRadius: 10,
    },
    tvTitle: {
        fontSize: 14,
        fontWeight: "600",
        marginTop: 5,
        textAlign: "center",
        color: "#ffffff",
        fontFamily: 'Inter',
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
        fontFamily: 'Inter',
    },
    loadText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Inter',
        textAlign: 'center',
        marginTop: 20,
    },
    noShowsText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Inter',
        textAlign: 'center',
        marginTop: 20,
    },
});

