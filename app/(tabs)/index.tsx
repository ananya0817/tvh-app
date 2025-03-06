import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet } from "react-native";

const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmNzNkNTIwZGJiZTBkM2Y4OTkxZDQyNzE0Nzc3OTg0MiIsIm5iZiI6MTc0MDA3Nzg3My4yOTUsInN1YiI6IjY3Yjc3YjMxNzQzNDIwMGMyODIyMjg5NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FxaiajUg3femit8Gz5qPKAk2e7jNv5GizkRRPbE99TQ'; // Replace with your TMDB API Key
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const CATEGORIES = [
  { title: "Popular TV Shows", endpoint: "/tv/popular" },
  { title: "Top Rated", endpoint: "/tv/top_rated" },
  { title: "Airing Today", endpoint: "/tv/airing_today" },
  { title: "Trending", endpoint: "/trending/tv/week" },
  { title: "On The Air", endpoint: "/tv/on_the_air" },
];

export default function TVShowsScreen() {
  const [tvShows, setTvShows] = useState<{ title: string; data: any[] }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTVShows = async () => {
      try {
        const results = await Promise.all(
          CATEGORIES.map(async (category) => {
            const response = await fetch(`${BASE_URL}${category.endpoint}`, {
              headers: { Authorization: `Bearer ${API_KEY}` },
            });
            const data = await response.json();
            return { title: category.title, data: data.results };
          })
        );
        setTvShows(results);
      } catch (error) {
        console.error("Error fetching TV shows:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTVShows();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={styles.loader} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={tvShows}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>{item.title}</Text>
            <FlatList
              data={item.data}
              keyExtractor={(tv) => tv.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item: tv }) => (
                <View style={styles.tvItem}>
                  <Image source={{ uri: `${IMAGE_BASE_URL}${tv.poster_path}` }} style={styles.poster} />
                  <Text numberOfLines={1} style={styles.tvTitle}>{tv.name}</Text>
                </View>
              )}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#625161",
    paddingVertical: 10,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#A99BA7",
  },
  categoryContainer: {
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#ffffff",
  },
  tvItem: {
    width: 110,
    marginRight: 2,
    alignItems: "center",
  },
  poster: {
    width: 100,
    height: 140,
    borderRadius: 10,
  },
  tvTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 5,
    textAlign: "center",
    color: "#ffffff", // ✅ White text for visibility
  },
});
