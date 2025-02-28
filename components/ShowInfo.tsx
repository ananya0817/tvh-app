import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import styles from "./showInfoStyles";
import reviewModalStyles from "./reviewModalStyles";
import { useShowInfo } from "./useShowInfo";
import { supabase } from "@/utils/supabase";

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

const ShowInfo = () => {
  const { showId } = useLocalSearchParams();
  const parsedShowId = Array.isArray(showId) ? showId[0] : showId;
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const { showDetails, episodes, loading, episodeLoading } = useShowInfo(parsedShowId, selectedSeason);

  const [modalVisible, setModalVisible] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewType, setReviewType] = useState<"show" | "season">("season");
  const [reviews, setReviews] = useState<Review[]>([]);

  // ananya userid
  const userId = "478e8522-4b96-4542-b33c-0c801796df68"; 

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("Reviews")
        .select("*")
        .eq("show_id", Number(parsedShowId))
        .order("created_at", { ascending: false });
  
      if (error) throw error;  
      setReviews(data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };
  
  

  useEffect(() => {
    fetchReviews();
  }, [parsedShowId, selectedSeason]);

  const submitReview = async () => {
    if (reviewText.trim().length === 0) return;

    const newReview: Review = {
      id: Date.now(),
      created_at: new Date().toISOString(),
      user: userId,
      show_name: showDetails?.name || "Unknown Show",
      show_id: parsedShowId,
      season: reviewType === "show" ? null : selectedSeason,
      review_text: reviewText,
      rating: 5,
    };

    try {
      const { error } = await supabase.from("Reviews").insert([newReview]);

      if (error) throw error;

      // shows reviews
      setReviews((prevReviews) => [newReview, ...prevReviews]);
      setReviewText("");
      setModalVisible(false);
    } catch (error) {
      console.error("Error submitting review:", (error as Error).message);
    }
  };

  // opens modal
  const openReviewModal = (type: "show" | "season") => {
    setReviewType(type);
    setModalVisible(true);
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <FlatList
      data={episodes}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{ paddingBottom: 10 }}
      ListHeaderComponent={
        <>
          {/* Poster & Overview */}
          <View style={styles.headerContainer}>
            {showDetails?.poster_path && (
              <Image source={{ uri: `https://image.tmdb.org/t/p/w500/${showDetails.poster_path}` }} style={styles.poster} />
            )}
            <View style={styles.detailsContainer}>
              <Text style={styles.title}>{showDetails?.name}</Text>
              <Text style={styles.subtitle}>{showDetails?.number_of_seasons} Seasons</Text>
              <Text style={styles.subtitle}>
                {showDetails?.first_air_date.substring(0, 4)} - {showDetails?.in_production ? "Present" : showDetails?.last_air_date.substring(0, 4)}
              </Text>
              <Text style={styles.subtitle}>{showDetails?.genres.map((g) => g.name).join(" | ")}</Text>
              <Text style={styles.subtitle}>IMDB: {showDetails?.vote_average ? Math.round(showDetails.vote_average * 10) : "N/A"}%</Text>
            </View>
          </View>

          {/* Review Modal */}
          <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
            <View style={reviewModalStyles.modalOverlay}>
              <View style={reviewModalStyles.modalContainer}>
                <View style={reviewModalStyles.modalHeader}>
                  <Text style={reviewModalStyles.modalTitle}>Reviews</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)} style={reviewModalStyles.closeButton}>
                    <FontAwesome name="times" size={24} color="white" />
                  </TouchableOpacity>
                </View>

                {/* Scrollable Reviews Container */}
                <View style={reviewModalStyles.reviewListContainer}>
                  <FlatList
                    data={reviews}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                      <View style={reviewModalStyles.reviewItem}>
                        <Text style={reviewModalStyles.reviewText}>{item.review_text}</Text>
                        <Text style={reviewModalStyles.reviewDate}>
                          {new Date(item.created_at).toLocaleDateString("en-US", {
                            month: "2-digit",
                            day: "2-digit",
                            year: "2-digit",
                          })} @{new Date(item.created_at).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })} - {item.season ? `Season ${item.season}` : "Show"}
                        </Text>
                      </View>
                    )}
                    ListEmptyComponent={<Text style={reviewModalStyles.noReviewsText}>No reviews yet...</Text>}
                    contentContainerStyle={{ paddingBottom: 100 }}
                  />
                </View>


                {/* Input & Submit Button */}
                <View style={reviewModalStyles.inputContainer}>
                  <TextInput 
                    style={reviewModalStyles.reviewInput} 
                    placeholder="Write your review..." 
                    multiline 
                    maxLength={500} 
                    value={reviewText} 
                    onChangeText={setReviewText} 
                    placeholderTextColor="white"
                  />
                  <TouchableOpacity style={reviewModalStyles.submitButton} onPress={submitReview}>
                    <Text style={reviewModalStyles.submitButtonText}>Submit Review</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <FontAwesome name="play-circle" size={30} color="white" />
              <Text style={styles.actionText}>Watchlist</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => openReviewModal("show")}>
              <FontAwesome name="pencil" size={30} color="white" />
              <Text style={styles.actionText}>Write Review</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <FontAwesome name="check-circle" size={30} color="white" />
              <Text style={styles.actionText}>Completed</Text>
            </TouchableOpacity>
          </View>

          {/* Season Dropdown and Rating */}
          <View style={styles.seasonsAndEpisodesContainer}>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={selectedSeason} onValueChange={(itemValue) => setSelectedSeason(itemValue)} style={styles.picker}>
                {showDetails?.seasons.map((season) => (
                  <Picker.Item key={season.season_number} label={season.name} value={season.season_number} />
                ))}
              </Picker>
            </View>
            <View style={styles.seasonRatingContainer}>
              <View style={styles.leftSeasonBox}>
                <Text style={styles.seasonRatingText}>Season Rating:</Text>
                <View style={styles.starsRow}>
                  {[...Array(5)].map((_, i) => (
                    <FontAwesome key={i} name="star-o" size={25} color="black" style={{ marginRight: 8 }} />
                  ))}
                </View>
              </View>
              <View style={styles.rightReviewBox}>
                <Text style={styles.seasonRatingText}>Review Season:</Text>
                <TouchableOpacity style={styles.reviewButton} onPress={() => openReviewModal("season")}>
                  <FontAwesome name="pencil" style={styles.reviewIcon} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </>
      }
      renderItem={({ item }) => (
        <View style={styles.episodeContainer}>
          <Text style={styles.episodeTitle} numberOfLines={1} ellipsizeMode="tail">
            {item.episode_number}. {item.name}
          </Text>
          <View style={styles.episodeSecondLine}>
            <TouchableOpacity style={styles.commentButton}>
              <FontAwesome name="comment" size={25} color="black" />
            </TouchableOpacity>
            <View style={styles.ratingContainer}>
              {[...Array(5)].map((_, i) => (
                <FontAwesome key={i} name="star-o" size={25} color="black" style={{ marginLeft: 8 }} />
              ))}
            </View>
            <TouchableOpacity style={styles.checkmarkButton}>
              <FontAwesome name="check" size={25} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      )}
      ListFooterComponent={episodeLoading ? <ActivityIndicator size="large" color="black" /> : null}
    />
  );
};

export default ShowInfo;
