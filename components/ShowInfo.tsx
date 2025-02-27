import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, ActivityIndicator } from "react-native";
import axios from "axios";
import styles from "./styles";
import { apiKey } from "./api_links";
import { useLocalSearchParams } from "expo-router"; // ✅ Get passed showId

interface ShowInfoData {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  first_air_date: string;
  last_air_date: string;
  in_production: boolean;
  number_of_seasons: number;
  number_of_episodes: number;
  genres: { name: string }[];
  networks: { name: string }[];
}

const ShowInfo = () => {
  const { showId } = useLocalSearchParams(); // ✅ Retrieve the show ID from navigation
  const [showDetails, setShowDetails] = useState<ShowInfoData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShowDetails();
  }, []);

  const fetchShowDetails = async () => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/tv/${showId}`, {
        params: { language: "en-US" },
        headers: { accept: "application/json", Authorization: `Bearer ${apiKey}` },
      });

      setShowDetails(response.data);
    } catch (error) {
      console.error("Error fetching show details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { flex: 1, justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
      {showDetails?.poster_path && (
        <Image source={{ uri: `https://image.tmdb.org/t/p/w500/${showDetails.poster_path}` }} style={{ width: "100%", height: 400, borderRadius: 10 }} />
      )}
      <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 10 }}>{showDetails?.name}</Text>
      <Text style={{ fontSize: 16, marginTop: 5 }}>⭐ {showDetails?.vote_average.toFixed(1)} | {showDetails?.number_of_seasons} Seasons</Text>
      <Text style={{ fontSize: 14, marginTop: 5 }}>{showDetails?.overview}</Text>
    </ScrollView>
  );
};

export default ShowInfo;
