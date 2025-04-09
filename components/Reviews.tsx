import React, { useEffect, useCallback, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, Image } from 'react-native';
import { supabase } from "../utils/supabase";
import { padding } from "aes-js";
import { router, useFocusEffect } from "expo-router";
import { Session } from "@supabase/supabase-js";
import { apiKey } from "./api_links";
import axios from "axios";

interface Review {
    id: number;
    created_at: string;
    user_id: string;
    show_name: string;
    show_id: string;
    season: number | null;
    review_text: string;
    rating: number;
    poster_path?: string | null;
}
interface ReviewsProps {
    current_user: string;
    more: boolean;
}

interface Show {
    id: number;
    name: string;
    poster_path: string | null;
}

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const Reviews: React.FC<ReviewsProps> = ({ current_user, more }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState<Session | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    

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


    const fetchReviews = useCallback(async () => {
        if (!current_user) return;
        try {
            let query = supabase
                .from("Reviews")
                .select('id, season, review_text, rating, user_id, show_name, created_at, show_id')
                .eq("user_id", current_user)
                .neq("review_text", null)
                .order("created_at", { ascending: false });
    
            if (!more) {
                query = query.limit(3);
            }
    
            const { data, error } = await query;
            if (error) throw error;
    
            const reviewsWithPosters = await Promise.all(
                data.map(async (review) => {
                    const details = await fetchShowDetails(review.show_id);
                    return {
                        ...review,
                        poster_path: details?.poster_path || null,
                    };
                })
            );
    
            setReviews(reviewsWithPosters);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setLoading(false);
        }
    }, [current_user, more]);
    

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
            fetchReviews();
        }, [fetchReviews])
    )

    if (loading) return <Text>Loading...</Text>;
    if (!reviews.length) return <Text>No reviews found.</Text>;

    return (
        <ScrollView style={styles.reviewContainer} contentContainerStyle={{ flexGrow: 1 }}>
            {reviews.map((review) => (
            <View key={review.id} style={styles.reviewBox}>
                <View style={styles.reviewContent}>
                <TouchableOpacity onPress={() => handleShowPress(Number(review.show_id))}>
                    <View style={styles.reviewContent}>
                        <Image
                            source={{ uri: `${IMAGE_BASE_URL}${review.poster_path}` }}
                            style={styles.posterImage}
                        />
                    </View>
                </TouchableOpacity>
                <View style={styles.reviewDetails}>
                    <Text style={styles.reviewShowTitle}>{review.show_name}</Text>
                    <Text style={[styles.reviewText, { fontStyle: "italic", fontWeight: "500"}]}>
                    {review.season ? `Season #${review.season} Review` : "Overall Show Review"}
                    </Text>
                    
                    <Text style={styles.reviewText}>{review.review_text}</Text>
                </View>
                </View>
                <View style={styles.reviewDivider} />
            </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    reviewContainer: {
        paddingTop: Platform.OS === "ios" ? 25 : 0,
    },
    reviewBox: {
        padding: 15,
    },
    reviewShowTitle:{
        fontSize: 15,
        color: '#fff',
        fontWeight: 'bold',
        fontFamily: 'Inter',
    },
    reviewText: {
        fontSize: 14,
        color: '#fff',
        fontFamily: 'Inter',
    },
    reviewDivider: {
        backgroundColor: 'white',
        height: 1,
        marginTop: 5,
        marginBottom: 5,
    },
    reviewContent: {
        flexDirection: "row",
        gap: 10,
      },
      posterImage: {
        width: 75,
        height: 110,
        borderRadius: 6,
        backgroundColor: "#ccc",
      },
      reviewDetails: {
        flex: 1,
        justifyContent: "center",
      },      
})

export default Reviews;
