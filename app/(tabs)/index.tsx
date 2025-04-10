import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { useRouter } from 'expo-router';
import axios from 'axios';
import { apiKey } from "@/components/api_links";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/utils/supabase";

const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const STATIC_CATEGORIES = [
  { title: "Trending", endpoint: "/trending/tv/week" },
  { title: "Top Rated", endpoint: "/tv/top_rated" },
  { title: "Airing Today", endpoint: "/tv/airing_today" },
];

export default function TVShowsScreen() {
  const router = useRouter();
  const [tvShows, setTvShows] = useState<{ title: string; data: any[] }[]>([]);
  const [loading, setLoading] = useState(true);
  const [usProviders, setUsProviders] = useState<string>("");

  const [session, setSession] = useState<Session | null>(null);
    const [userId, setUserId] = useState("");
  
    useEffect(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUserId(session?.user?.id || "");
      })
  
      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUserId(session?.user?.id || "");
      });
    }, [])

  useEffect(() => {
    const fetchUSProviders = async () => {
      try {
        const response = await axios.get(
          'https://api.themoviedb.org/3/watch/providers/tv',
          {
            params: { language: 'en-US', watch_region: 'US' },
            headers: { Authorization: `Bearer ${apiKey}` },
          }
        );
        const providers = response.data.results.map((p: { provider_id: string }) => p.provider_id).join('|');
        setUsProviders(providers);
      } catch (error) {
        console.error("Error fetching providers:", error);
      }
    };

    const fetchTVData = async () => {
      try {
        await fetchUSProviders();
        if (!usProviders) return;

        let categories = [...STATIC_CATEGORIES];

        // Fetch TV genres
        const genreResponse = await axios.get(`${BASE_URL}/genre/tv/list`, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const genres = genreResponse.data.genres.slice(0, 7);

        // Add genre categories
        categories = categories.concat(
          genres.map((genre: { name: string; id: number }) => ({
            title: genre.name,
            endpoint: `/discover/tv?with_genres=${genre.id}`,
          }))
        );

        // Fetch shows with US provider filter
        const results = await Promise.all(
          categories.map(async (category) => {
            const url = `${BASE_URL}${category.endpoint}`;
            const params = {
              watch_region: "US",
              with_watch_providers: usProviders,
              include_adult: "false",
              language: "en-US",
              page: 1,
            };

            const response = await axios.get(url, {
              params,
              headers: { Authorization: `Bearer ${apiKey}` },
            });
            
            return { title: category.title, data: response.data.results };
          })
        );

        setTvShows(results);
      } catch (error) {
        console.error("Error fetching TV shows:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTVData();
  }, [usProviders]);

  const handleShowPress = (showId: number) => {
    if(userId == "")
    {
      return;
    }
    router.push({
      pathname: "/showDetails",
      params: { 
        showId,
        userId1: userId
      }
    });
  };

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
    paddingTop: Platform.OS === "ios" ? 45: 10,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#A99BA7",
  },
  categoryContainer: {
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#ffffff",
    // marginTop: Platform.OS === "ios" ? 15 : 0,
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
});
