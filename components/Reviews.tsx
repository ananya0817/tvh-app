import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { supabase } from "../utils/supabase";
import { useFocusEffect } from "expo-router";

interface Review {
    id: number;
    created_at: string;
    user_id: string;
    show_name: string;
    show_id: string;
    season: number | null;
    review_text: string;
    rating: number;
}
interface ReviewsProps {
    current_user: string;
    more: boolean;
}
const Reviews: React.FC<ReviewsProps> = ({ current_user, more }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchReviews = useCallback(async () => {
        if (!current_user) return;
        try {
            let query = supabase
                .from("Reviews")
                .select('id, season, review_text, rating, user_id, show_name, created_at, show_id')
                .eq("user_id", current_user)
                .order("created_at", {ascending: false})

            if (!more){
                query = query.limit(3);
            }

            const { data, error } = await query;

            if (error) throw error;
            setReviews([... data]);
        }catch (error){
            console.error("Error fetching reviews:", error);
        } finally {
            setLoading(false);
        } 
    }, [current_user, more]);

    useFocusEffect(
        useCallback(() => {
            fetchReviews();
        }, [fetchReviews])
    )

    if (loading) return <Text>Loading...</Text>;
    if (!reviews.length) return <Text>No reviews found.</Text>;

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            {reviews.map((review) => (
                <View key={review.id} style={styles.reviewBox}>
                    <Text style={styles.reviewShowTitle}>{review.show_name}</Text>
                    <Text style={styles.reviewText}>Season # {review.season}</Text>
                    <Text style={styles.reviewText}>Rating: {review.rating}</Text>
                    <Text style={styles.reviewText}>{review.review_text}</Text>
                    <View style={styles.reviewDivider} />
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    reviewBox: {
        padding: 15,
    },
    reviewShowTitle:{
        fontSize: 15,
        color: '#fff',
        fontWeight: 'bold',
    },
    reviewText: {
        fontSize: 14,
        color: '#fff',
    },
    reviewDivider: {
        backgroundColor: 'white',
        height: 1,
        marginTop: 5,
        marginBottom: 5,
    },
})

export default Reviews;
