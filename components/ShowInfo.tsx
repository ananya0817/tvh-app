import React, { useState } from "react";
import { View, Text, Image, ActivityIndicator, FlatList, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import styles from "./showInfoStyles";
import { useShowInfo } from "./useShowInfo";

const ShowInfo = () => {
  const { showId } = useLocalSearchParams();
  const parsedShowId = Array.isArray(showId) ? showId[0] : showId;
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const { showDetails, episodes, loading, episodeLoading } = useShowInfo(parsedShowId, selectedSeason);

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
          {/* Poster & Basic Info */}
          <View style={styles.headerContainer}>
            {showDetails?.poster_path && (
              <Image
                source={{ uri: `https://image.tmdb.org/t/p/w500/${showDetails.poster_path}` }}
                style={styles.poster}
              />
            )}
            <View style={styles.detailsContainer}>
              <Text style={styles.title}>{showDetails?.name}</Text>
              <Text style={styles.subtitle}>
                {showDetails?.number_of_seasons} Seasons
              </Text>
              <Text style={styles.subtitle}>
                {showDetails?.first_air_date.substring(0, 4)} -{" "}
                {showDetails?.in_production ? "Present" : showDetails?.last_air_date.substring(0, 4)}
              </Text>
              <Text style={styles.subtitle}>
                {showDetails?.genres.map((g) => g.name).join(" | ")}
              </Text>
              <Text style={styles.subtitle}>
                IMDB: {showDetails?.vote_average ? Math.round(showDetails.vote_average * 10) : "N/A"}%
              </Text>
            </View>
          </View>

          {/* Overview, Networks, Progress Bar */}
          <View style={styles.fullWidthContainer}>
            <Text style={styles.overview}>{showDetails?.overview}</Text>
            <Text style={styles.networks}>
              Available on: {showDetails?.networks.map((n) => n.name).join(", ")}
            </Text>
            {showDetails?.vote_average !== undefined && (
              <View style={styles.progressBarContainer}>
                <View
                  style={{
                    width: `${(showDetails.vote_average / 10) * 100}%`,
                    height: 15,
                    backgroundColor: "#AF9FAE",
                    borderRadius: 50,
                  }}
                />
                <Text style={styles.progressText}>
                  {Math.round((showDetails.vote_average / 10) * 100)}%
                </Text>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <FontAwesome name="play-circle" size={30} color="white" />
              <Text style={styles.actionText}>Watchlist</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <FontAwesome name="pencil" size={30} color="white" />
              <Text style={styles.actionText}>Write Review</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <FontAwesome name="check-circle" size={30} color="white" />
              <Text style={styles.actionText}>Completed</Text>
            </TouchableOpacity>
          </View>

          {/* Container for Season Dropdown and Rating */}
          <View style={styles.seasonsAndEpisodesContainer}>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedSeason}
                onValueChange={(itemValue) => setSelectedSeason(itemValue)}
                style={styles.picker}
              >
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
                <TouchableOpacity style={styles.reviewButton}>
                  <FontAwesome name="pencil" style={styles.reviewIcon} />
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.sectionHeader}>Episodes</Text>
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
