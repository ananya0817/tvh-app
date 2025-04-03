import { StyleSheet, Text, View, TouchableOpacity, Platform, FlatList, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase'
import { Session } from '@supabase/supabase-js'
import Reviews from '@/components/Reviews';
import { router } from 'expo-router';
import {apiKey} from "@/components/api_links";
import axios from "axios";

interface Show {
    id: number;
    name: string;
    poster_path: string | null;
}

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export default function TabFiveScreen() {
    const [session, setSession] = useState<Session | null>(null);
    const [email, setEmail] = useState("");
    const[reviewCount, setReviewCount] = useState(0);
    const[commentCount, setCommentCount] = useState(0);
    const[watchCount, setWatchCount] = useState(0);
    const [shows, setShows] = useState<Show[]>([]);
    const [loading, setLoading] = useState(true);
    const [favorite, setFavorite] = useState(0);
    
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

        const fetchUserShows = async () => {
            try {
                setLoading(true);

                const {data, error} = await supabase
                    .from('UserShows')
                    .select('show_id')
                    .eq('user_id', session.user.id)
                    .eq("favorite", true);

                if (error) throw error;

                const showIds = data?.map(item => item.show_id) || [];
                const showsData = await Promise.all(showIds.map(fetchShowDetails));

                // console.log("Fetched Shows:", showsData);
                setShows(showsData.filter((show): show is Show => show !== null && show.poster_path !== null));


            } catch (error) {
                console.error('Error fetching shows:', error);
            } finally {
                setLoading(false);
            }
        };
        const fetchReviewCount = async() => {
            const { error, count } = await supabase
                .from("Reviews")
                .select("id", { count: "exact", head: true })
                .eq("user_id", session?.user.id);

            if (error) {
                console.error("Error fetching review count:", JSON.stringify(error, null, 2));
                return;
            }
            setReviewCount(count || 0);
        };
        const fetchCommentCount = async() => {
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
        };
        const fetchWatchCount= async() => {
            const { error, count } = await supabase
                .from("UserShows")
                .select("id", { count: "exact", head: true })
                .eq("user_id", session?.user.id)
                .eq("completed", true);

            if (error) {
                console.error("Error fetching watch count:", error.message);
                return;
            }
            setWatchCount(count || 0);
        };
        fetchUserShows();
        fetchReviewCount();
        fetchCommentCount();
        fetchWatchCount();
    }, [session, favorite]);

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
                <FlatList
                    contentContainerStyle={{paddingBottom:100}}
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
                                <Text numberOfLines={1} style={styles.tvTitle}>{tv.name}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
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
        alignItems: 'flex-start',
        padding: 15,
    },
    username: {
        marginTop: Platform.OS === 'ios' ? 25 : 10,
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
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        // marginBottom: 5,
    },
    showsBox: {
        marginBottom: 15,
        marginTop:10,
        paddingHorizontal: 5,
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

