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
import { BlurView } from "expo-blur"
import { Session } from "@supabase/supabase-js";

// review object
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

// comment object
interface Comment {
  id: number;
  created_at: string;
  comment_text: string | null; // entry with null comment_text is for general episode rating/completion
  rating: number;
  user: string;
  season: number;
  episode: number;
  show_name: string;
  show_id: number;
  completed: boolean;
}

// rating row object
interface RatingRow {
  id: number;
  rating: number;
  completed: boolean;
}

const ShowInfo = () => {
  // states for season info/ratings
  const { showId } = useLocalSearchParams();
  const parsedShowId = Array.isArray(showId) ? showId[0] : showId;
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const {
    showDetails,
    episodes,
    loading,
    episodeLoading,
    mainSeriesEpisodeCount,
    totalEpisodeCount,
  } = useShowInfo(parsedShowId, selectedSeason);
  const [seasonRatings, setSeasonRatings] = useState<{ [season: number]: number | null }>({});

  // states for review modal
  const [modalVisible, setModalVisible] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewType, setReviewType] = useState<"show" | "season">("season");
  const [reviews, setReviews] = useState<Review[]>([]);

  // states for comments modal
  const [commentsModalVisible, setCommentsModalVisible] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);

  // states for episode ratings/completion
  const [episodeRatings, setEpisodeRatings] = useState<{ [episode: number]: number }>({});
  const [episodeCompletionStatus, setEpisodeCompletionStatus] = useState<{ [episode: number]: boolean }>({});
  const [completionPercentage, setCompletionPercentage] = useState<number>(0);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // get user id
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  // dynamic user id initialization
  const userId = session?.user.id || "";

  // gets episode rating (entry with null comment_text) of episode
  const getEpisodeRatingRow = async (episodeNumber: number, seasonNumber: number): Promise<RatingRow | null> => {
  const showIdNum = Number(parsedShowId);
  const { data, error } = await supabase
    .from("Comments")
    .select("id, rating, completed")
    .eq("show_id", showIdNum)
    .eq("season", seasonNumber)
    .eq("episode", episodeNumber)
    .is("comment_text", null)
    .order("created_at", { ascending: false })
    .limit(1);
  if (error) {
    console.error(`getEpisodeRatingRow: Error fetching row for Episode ${episodeNumber} of Season ${seasonNumber}:`, error);
    return null;
  }
  if (!data || data.length === 0) return null;
  return data[0] as RatingRow;
};

// fetch rating for given season
const fetchSeasonRating = async (seasonNumber: number) => {
  try {
    const { data, error } = await supabase
      .from("Reviews")
      .select("rating")
      .eq("show_id", Number(parsedShowId))
      .eq("season", seasonNumber)
      .is("review_text", null)  // only gets entry with rating (null review_text)
      .maybeSingle();

    if (error) {
      console.error(`Error fetching season ${seasonNumber} rating:`, error);
      return;
    }

    setSeasonRatings((prevRatings) => ({
      ...prevRatings,
      [seasonNumber]: data?.rating ?? null,
    }));
  } catch (error) {
    console.error(`Error fetching season ${seasonNumber} rating:`, error);
  }
};

useEffect(() => {
  fetchSeasonRating(selectedSeason);
}, [parsedShowId, selectedSeason]);


// upsert (insert/update) season rating selected season
const submitSeasonRating = async (seasonNumber: number, rating: number) => {
  try {
    const showIdNum = Number(parsedShowId);

    // check if an entry w/ rating (null review_text) exists for season
    const { data: existingRating, error: fetchError } = await supabase
      .from("Reviews")
      .select("id, rating")
      .eq("show_id", showIdNum)
      .eq("season", seasonNumber)
      .is("review_text", null)
      .maybeSingle();

    if (fetchError) {
      console.error(`Error checking existing rating for Season ${seasonNumber}:`, fetchError);
      return;
    }

    if (existingRating) {
      // update the existing entry
      const { error: updateError } = await supabase
        .from("Reviews")
        .update({ rating })
        .eq("id", existingRating.id);
      if (updateError) {
        console.error(`Error updating rating for Season ${seasonNumber}:`, updateError);
        return;
      }
      console.log(`Successfully updated rating for Season ${seasonNumber} to ${rating}.`);
    } else {
      // insert new entry with rating
      const { error: insertError } = await supabase
        .from("Reviews")
        .insert([
          {
            created_at: new Date().toISOString(),
            review_text: null, // null comment_text means it is the season rating row
            rating,
            user: userId,
            season: seasonNumber,
            show_name: showDetails?.name || "Unknown Show",
            show_id: showIdNum,
          },
        ]);
      if (insertError) {
        console.error(`Error inserting rating for Season ${seasonNumber}:`, insertError);
        return;
      }
      console.log(`Successfully inserted new rating for Season ${seasonNumber} with value ${rating}.`);
    }

    // fetch updated season rating to update local state
    await fetchSeasonRating(seasonNumber);
  } catch (error) {
    console.error(`Error saving rating for Season ${seasonNumber}:`, error);
  }
};


// fetch updated rating and completion for an episode and update local state 
const fetchEpisodeRatingAndCompletion = async (episodeNumber: number) => {
  try {
    // Updated call: pass selectedSeason as second argument.
    const row = await getEpisodeRatingRow(episodeNumber, selectedSeason);
    if (!row) {
      setEpisodeRatings((prev) => ({ ...prev, [episodeNumber]: 0 }));
      setEpisodeCompletionStatus((prev) => ({ ...prev, [episodeNumber]: false }));
      return;
    }
    setEpisodeRatings((prev) => ({ ...prev, [episodeNumber]: row.rating ?? 0 }));
    setEpisodeCompletionStatus((prev) => ({ ...prev, [episodeNumber]: row.completed ?? false }));
  } catch (error) {
    console.error(`Error in fetchEpisodeRatingAndCompletion for ep ${episodeNumber}:`, error);
  }
};

// update/insert episode rating row (null comment_text)
const submitEpisodeRating = async (episodeNumber: number, newRating: number) => {
  try {
    setIsUpdating(true);
    const showIdNum = Number(parsedShowId);

    const existing = await getEpisodeRatingRow(episodeNumber, selectedSeason);
    if (existing) {
      console.log(`✅ Found rating row (ID: ${existing.id}) for ep ${episodeNumber} of Season ${selectedSeason}. Updating rating to ${newRating}...`);
      const { error: updateError } = await supabase
        .from("Comments")
        .update({ rating: newRating })
        .eq("id", existing.id);
      if (updateError) {
        console.error(`Error updating rating for ep ${episodeNumber} of Season ${selectedSeason}:`, updateError);
        return;
      }
    } else {
      console.log(`⚠️ No rating row found for ep ${episodeNumber} of Season ${selectedSeason}. Inserting new rating row with rating ${newRating}...`);
      const { error: insertError } = await supabase
        .from("Comments")
        .insert([
          {
            created_at: new Date().toISOString(),
            comment_text: null,
            rating: newRating,
            completed: false,
            user: userId,
            season: selectedSeason,
            episode: episodeNumber,
            show_name: showDetails?.name || "Unknown Show",
            show_id: showIdNum,
          },
        ]);
      if (insertError) {
        console.error(`Error inserting rating for ep ${episodeNumber} of Season ${selectedSeason}:`, insertError);
        return;
      }
    }
    await fetchEpisodeRatingAndCompletion(episodeNumber);
  } catch (error) {
    console.error(`Error submitting rating for Episode ${episodeNumber}:`, error);
  } finally {
    setIsUpdating(false);
  }
};

// toggle episode completion by updating w/ opposite of current value
const toggleEpisodeCompletion = async (episodeNumber: number) => {
  try {
    setIsUpdating(true);
    const showIdNum = Number(parsedShowId);

    const existing = await getEpisodeRatingRow(episodeNumber, selectedSeason);
    if (existing) {
      const newStatus = !existing.completed;
      console.log(`✅ Toggling completion for ep ${episodeNumber} of Season ${selectedSeason} to ${newStatus}...`);
      const { error: updateError } = await supabase
        .from("Comments")
        .update({ completed: newStatus })
        .eq("id", existing.id);
      if (updateError) {
        console.error(`Error toggling completion for Episode ${episodeNumber} of Season ${selectedSeason}:`, updateError);
        return;
      }
    } else {
      console.log(`⚠️ No rating row for ep ${episodeNumber} of Season ${selectedSeason}. Inserting new row with completed=true...`);
      const { error: insertError } = await supabase
        .from("Comments")
        .insert([
          {
            created_at: new Date().toISOString(),
            comment_text: null,
            rating: 0,
            completed: true,
            user: userId,
            season: selectedSeason,
            episode: episodeNumber,
            show_name: showDetails?.name || "Unknown Show",
            show_id: showIdNum,
          },
        ]);
      if (insertError) {
        console.error(`Error inserting completion row for Episode ${episodeNumber} of Season ${selectedSeason}:`, insertError);
        return;
      }
    }
    await fetchEpisodeRatingAndCompletion(episodeNumber);
  } catch (error) {
    console.error(`Error in toggleEpisodeCompletion for Episode ${episodeNumber}:`, error);
  } finally {
    setIsUpdating(false);
  }
};

// toggle all episodes as completed by updating/inserting completed column  
const toggleAllEpisodesCompletion = async () => {
  try {
    setIsUpdating(true);
    const showIdNum = Number(parsedShowId);

    // select all rows with null comment_text for show
    const { data, error } = await supabase
      .from("Comments")
      .select("completed")
      .eq("show_id", showIdNum)
      .is("comment_text", null);

    if (error) {
      console.error("Error fetching overall completion:", error);
      return;
    }

    // check if every rating row is complete
    const allCompleted = data && data.length > 0 && data.every((row) => row.completed === true);
    const newStatus = !allCompleted;

    // loop through each season
    const seasons = showDetails?.seasons || [];
    for (const seasonObj of seasons) {
      const seasonNumber = seasonObj.season_number;
      // loop through each episode
      const episodeCount = seasonObj.episode_count;
      for (let epNum = 1; epNum <= episodeCount; epNum++) {
        // check if rating row exists
        const existing = await getEpisodeRatingRow(epNum, seasonNumber);
        if (existing) {
          // reset rating to 0 if marking whole show as uncompleted
          const updatedRating = newStatus ? existing.rating : 0;
          const { error: updateError } = await supabase
            .from("Comments")
            .update({ completed: newStatus, rating: updatedRating })
            .eq("id", existing.id);
          if (updateError) {
            console.error(
              `Error updating completion for Season ${seasonNumber} Episode ${epNum}:`,
              updateError
            );
          } else {
            console.log(
              `Updated Season ${seasonNumber} Episode ${epNum} to completed=${newStatus} (rating=${updatedRating})`
            );
          }
        } else {
          // insert new row if it doesn't exist
          console.log(
            `⚠️ No rating row for Season ${seasonNumber} Episode ${epNum}. Inserting new row with completed=${newStatus}...`
          );
          const { error: insertError } = await supabase
            .from("Comments")
            .insert([
              {
                created_at: new Date().toISOString(),
                comment_text: null,
                rating: 0,
                completed: newStatus,
                user: userId,
                season: seasonNumber,
                episode: epNum,
                show_name: showDetails?.name || "Unknown Show",
                show_id: showIdNum,
              },
            ]);
          if (insertError) {
            console.error(
              `Error inserting rating row for Season ${seasonNumber} Episode ${epNum}:`,
              insertError
            );
          } else {
            console.log(
              `Inserted new row for Season ${seasonNumber} Episode ${epNum} with completed=${newStatus}`
            );
          }
        }
      }
    }

    // refresh local state for the current season and recalculate overall completion
    episodes.forEach((episode) => {
      fetchEpisodeRatingAndCompletion(episode.episode_number);
    });
    await calculateCompletionPercentage();
  } catch (error) {
    console.error("Error toggling all episodes completion:", error);
  } finally {
    setIsUpdating(false);
  }
};

// calculates overall completion percentage based on rating row
  const calculateCompletionPercentage = async () => {
    try {
        const showIdNum = Number(parsedShowId);

        // fetch all rating rows w/ null comment_text for whole show
        const { data, error } = await supabase
            .from("Comments")
            .select("episode, completed, season")
            .eq("show_id", showIdNum)
            .is("comment_text", null);

        if (error) {
            console.error("Error fetching completion data from Supabase:", error);
            return;
        }

        // create a map without anything from season 0
        const uniqueRowsMap = new Map<string, any>();
        data?.forEach((row: any) => {
            if (row.season !== 0) { 
                const key = `${row.season}-${row.episode}`;
                if (!uniqueRowsMap.has(key)) {
                    uniqueRowsMap.set(key, row);
                }
            }
        });
        const uniqueRows = Array.from(uniqueRowsMap.values());

        // count completed episodes
        const completedCount = uniqueRows.filter((row) => row.completed === true).length;

        const percent =
            mainSeriesEpisodeCount > 0
                ? Math.min(100, Math.floor((completedCount / mainSeriesEpisodeCount) * 100))
                : 0;

        setCompletionPercentage(percent);
    } catch (error) {
        console.error("Error calculating completion percentage:", error);
    }
  };

  // fetch all reviews w/ review_text isn't null
  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("Reviews")
        .select("*")
        .eq("show_id", Number(parsedShowId))
        .order("created_at", { ascending: false });
      console.log("hi");
      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  // insert new review
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
      setReviews(prev => [newReview, ...prev]);
      setReviewText("");
      setModalVisible(false);
    } catch (error) {
      console.error("Error submitting review:", (error as Error).message);
    }
  };

  // fetch comments where comment_text is not null
  const fetchComments = async (episodeNumber: number) => {
    try {
      const { data, error } = await supabase
        .from("Comments")
        .select("*")
        .eq("show_id", Number(parsedShowId))
        .eq("season", selectedSeason)
        .neq("comment_text", null)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error(`Error fetching comments for Episode ${episodeNumber}:`, error);
    }
  };

  // insert new comment with not null comment_text
  const submitComment = async () => {
    if (commentText.trim().length === 0 || selectedEpisode === null) return;
    try {
      const newComment = {
        created_at: new Date().toISOString(),
        season: selectedSeason,
        episode: selectedEpisode,
        comment_text: commentText,
        rating: 0,
        user: userId,
        show_name: showDetails?.name || "Unknown Show",
        show_id: Number(parsedShowId),
        completed: false,
      };
      const { data, error } = await supabase.from("Comments").insert([newComment]).select();
      if (error) throw error;
      if (data && data.length > 0) {
        setComments(prev => [data[0], ...prev]);
      }
      setCommentText("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  // fetch rating and completion for each episode in current season
  useEffect(() => {
    episodes.forEach((episode) => {
      fetchEpisodeRatingAndCompletion(episode.episode_number);
    });
  }, [parsedShowId, selectedSeason, episodes]);

  // recalculate overal completion percentage when any episodes are toggled
  useEffect(() => {
    calculateCompletionPercentage();
  }, [episodeCompletionStatus, parsedShowId, selectedSeason]);

  
  // update local state for "all completed" based on episodeCompletionStatus
  const [allEpisodesCompleted, setAllEpisodesCompleted] = useState<boolean>(false);
  useEffect(() => {
    const allCompleted = Object.values(episodeCompletionStatus).every(status => status === true);
    setAllEpisodesCompleted(allCompleted);
  }, [episodeCompletionStatus]);

  // open/close review & comments modal
  const openReviewModal = async (type: "show" | "season") => {
    setReviewType(type);
    setModalVisible(true);
    await fetchReviews();
  };

  const openCommentsModal = async (episodeNumber: number) => {
    setSelectedEpisode(episodeNumber);
    setCommentsModalVisible(true);
    await fetchComments(episodeNumber);
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={episodes}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 10 }}
        ListHeaderComponent={
          <>
            {/* poster & overview */}
            <View style={styles.headerContainer}>
              {showDetails?.poster_path && (
                <Image
                  source={{ uri: `https://image.tmdb.org/t/p/w500/${showDetails.poster_path}` }}
                  style={styles.poster}
                />
              )}
              <View style={styles.detailsContainer}>
                <Text style={styles.title}>{showDetails?.name}</Text>
                <Text style={styles.subtitle}>{showDetails?.number_of_seasons} Seasons</Text>
                <Text style={styles.subtitle}>
                  {showDetails?.first_air_date.substring(0, 4)} -{" "}
                  {showDetails?.in_production ? "Present" : showDetails?.last_air_date.substring(0, 4)}
                </Text>
                <Text style={styles.subtitle}>{showDetails?.genres.map((g) => g.name).join(" | ")}</Text>
                <Text style={styles.subtitle}>
                  IMDB: {showDetails?.vote_average ? Math.round(showDetails.vote_average * 10) : "N/A"}%
                </Text>
              </View>
            </View>

            {/* overview, networks, progress Bar */}
            <View style={styles.fullWidthContainer}>
              <Text style={styles.overview}>{showDetails?.overview}</Text>
              <Text style={styles.networks}>
                Available on: {showDetails?.networks.map((n) => n.name).join(", ")}
              </Text>
              {showDetails?.vote_average !== undefined && (
                <View style={styles.progressBarWrapper}>
                  <View style={styles.progressBarContainer}>
                    <View
                      style={{
                        width: `${completionPercentage}%`,
                        height: "100%",
                        backgroundColor: "#AF9FAE",
                        borderRadius: 50,
                      }}
                    />
                  </View>
                  <Text style={styles.progressText}>{completionPercentage}%</Text>
                </View>
              )}
            </View>

            {/* review modal */}
            <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
              <View style={reviewModalStyles.modalOverlay}>
                <View style={reviewModalStyles.modalContainer}>
                  <View style={reviewModalStyles.modalHeader}>
                    <Text style={reviewModalStyles.modalTitle}>Reviews</Text>
                    <TouchableOpacity onPress={() => setModalVisible(false)} style={reviewModalStyles.closeButton}>
                      <FontAwesome name="times" size={24} color="white" />
                    </TouchableOpacity>
                  </View>
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
                            })}{" "}
                            @{" "}
                            {new Date(item.created_at).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}{" "}
                            - {item.season ? `Season ${item.season}` : "Show"}
                          </Text>
                        </View>
                      )}
                      ListEmptyComponent={<Text style={reviewModalStyles.noReviewsText}>No reviews yet...</Text>}
                      contentContainerStyle={{ paddingBottom: 100 }}
                    />
                  </View>
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
                    <TouchableOpacity
                      style={reviewModalStyles.submitButton}
                      onPress={async () => {
                        setIsUpdating(true);
                        await submitReview();
                        setIsUpdating(false);
                      }}
                    >
                      <Text style={reviewModalStyles.submitButtonText}>Submit Review</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            {/* comments modal */}
            <Modal animationType="slide" transparent visible={commentsModalVisible} onRequestClose={() => setCommentsModalVisible(false)}>
              <View style={reviewModalStyles.modalOverlay}>
                <View style={reviewModalStyles.modalContainer}>
                  <View style={reviewModalStyles.modalHeader}>
                    <Text style={reviewModalStyles.modalTitle}>Episode Comments</Text>
                    <TouchableOpacity onPress={() => setCommentsModalVisible(false)} style={reviewModalStyles.closeButton}>
                      <FontAwesome name="times" size={24} color="white" />
                    </TouchableOpacity>
                  </View>
                  <View style={reviewModalStyles.reviewListContainer}>
                    <FlatList
                      data={comments}
                      keyExtractor={(item) => item.id.toString()}
                      renderItem={({ item }) => (
                        <View style={reviewModalStyles.reviewItem}>
                          <Text style={reviewModalStyles.reviewText}>{item.comment_text}</Text>
                          <Text style={reviewModalStyles.reviewDate}>
                            {new Date(item.created_at).toLocaleDateString("en-US", {
                              month: "2-digit",
                              day: "2-digit",
                              year: "2-digit",
                            })}{" "}
                            @{" "}
                            {new Date(item.created_at).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}{" "}
                            - Episode {item.episode}
                          </Text>
                        </View>
                      )}
                      ListEmptyComponent={<Text style={reviewModalStyles.noReviewsText}>No comments yet...</Text>}
                      contentContainerStyle={{ paddingBottom: 100 }}
                    />
                  </View>
                  <View style={reviewModalStyles.inputContainer}>
                    <TextInput
                      style={reviewModalStyles.reviewInput}
                      placeholder="Write your comment..."
                      multiline
                      maxLength={500}
                      value={commentText}
                      onChangeText={setCommentText}
                      placeholderTextColor="white"
                    />
                    <TouchableOpacity
                      style={reviewModalStyles.submitButton}
                      onPress={async () => {
                        setIsUpdating(true);
                        await submitComment();
                        setIsUpdating(false);
                      }}
                    >
                      <Text style={reviewModalStyles.submitButtonText}>Submit Comment</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            {/* action buttons */}
            <View style={styles.actionContainer}>
              <TouchableOpacity style={styles.actionButton}>
                <FontAwesome name="play-circle" size={30} color="white" />
                <Text style={styles.actionText}>Watchlist</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={() => openReviewModal("show")}>
                <FontAwesome name="pencil" size={30} color="white" />
                <Text style={styles.actionText}>Write Review</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={async () => {
                  setIsUpdating(true);
                  await toggleAllEpisodesCompletion();
                  setIsUpdating(false);
                }}
              >
                <FontAwesome
                  name={allEpisodesCompleted ? "check-circle" : "check"}
                  size={30}
                  color="white"
                />
                <Text style={styles.actionText}>Completed</Text>
              </TouchableOpacity>
            </View>

            {/* season dropdown and rating */}
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
                    <TouchableOpacity key={i} onPress={() => submitSeasonRating(selectedSeason, i + 1)}>
                      <FontAwesome
                        name={i < (seasonRatings[selectedSeason] || 0) ? "star" : "star-o"}
                        size={25}
                        color="black"
                        style={{ marginRight: 8 }}
                      />
                    </TouchableOpacity>
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
              <TouchableOpacity style={styles.commentButton} onPress={() => openCommentsModal(item.episode_number)}>
                <FontAwesome name="comment" size={25} color="black" />
              </TouchableOpacity>
              <View style={styles.ratingContainer}>
                {[...Array(5)].map((_, i) => (
                  <TouchableOpacity key={i} onPress={() => submitEpisodeRating(item.episode_number, i + 1)}>
                    <FontAwesome
                      name={i < (episodeRatings[item.episode_number] || 0) ? "star" : "star-o"}
                      size={25}
                      color="black"
                      style={{ marginRight: 8 }}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                style={styles.checkmarkButton}
                onPress={() => toggleEpisodeCompletion(item.episode_number)}
              >
                <FontAwesome
                  name={episodeCompletionStatus[item.episode_number] ? "check-circle" : "check"}
                  size={25}
                  color="black"
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListFooterComponent={episodeLoading ? <ActivityIndicator size="large" color="black" /> : null}
      />
      {/* loading screen */}
      {isUpdating && (
        <BlurView style={styles.loadingContainer}
          tint="dark"
          intensity={35}
          experimentalBlurMethod="dimezisBlurView">
          <Text style={{color:"white", elevation:0, fontSize: 35}}> Updating... </Text>
          <ActivityIndicator size="large" color="white" />
        </BlurView>
      )}
    </View>
  );
};

export default ShowInfo;
