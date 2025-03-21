import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { supabase } from "../utils/supabase";

interface Review {
    id: number;
    created_at: string;
    user: string;
    show_name: string;
    show_id: string;
    season: number | null;
    review_text: string;
    rating: number;
}
const Reviews = ({ current_user }: { current_user: string}) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            if (!current_user) return;
            try {
                const { data, error } = await supabase
                    .from("Reviews")
                    .select('id, season, review_text, rating, user, show_name, created_at, show_id')
                    .eq("user", current_user)
                    .order("created_at", {ascending: false})
                    .limit(3);


                if (error) throw error;
                console.log("Fetched reviews: ", data);
                setReviews([... data]);
                console.log("State, update, reviews: ", data);
            }catch (error){
                console.error("Error fetching reviews:", error);
            } finally {
                setLoading(false);
            }


        };
        fetchReviews();

    }, [current_user]);

    if (loading) return <Text>Loading...</Text>;
    if (!reviews.length) return <Text>No reviews found.</Text>;

    return (
        <View>
            {reviews.map((review) => (
                <View key={review.id} style={styles.reviewBox}>
                    <Text style={styles.reviewText}>Show Title {review.show_name}</Text>
                    <Text style={styles.reviewText}>Season # {review.season}</Text>
                    <Text style={styles.reviewText}>Rating: {review.rating}</Text>
                    <Text style={styles.reviewText}>{review.review_text}</Text>
                    <View style={styles.reviewDivider} />
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    reviewBox: {
        padding: 5,
    },
    reviewText: {
        fontSize: 14,
        color: '#fff',
    },
    reviewDivider: {
        backgroundColor: 'white',
        alignSelf: 'center',
        height: 1,
        width: '95%',
        marginTop: 5,
        marginBottom: 5,
    },
})

export default Reviews;
