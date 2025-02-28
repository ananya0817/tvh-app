import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet } from 'react-native';

const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmNzNkNTIwZGJiZTBkM2Y4OTkxZDQyNzE0Nzc3OTg0MiIsIm5iZiI6MTc0MDA3Nzg3My4yOTUsInN1YiI6IjY3Yjc3YjMxNzQzNDIwMGMyODIyMjg5NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FxaiajUg3femit8Gz5qPKAk2e7jNv5GizkRRPbE99TQ';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const CATEGORIES = [
  { title: 'Popular', endpoint: '/tv/popular' },
  { title: 'Top Rated', endpoint: '/tv/top_rated' },
  { title: 'Airing Today', endpoint: '/tv/airing_today' },
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
        console.error('Error fetching TV shows:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTVShows();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={styles.loader} />;

  return (
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
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryContainer: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tvItem: {
    width: 120,
    marginRight: 10,
    alignItems: 'center',
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 10,
  },
  tvTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 5,
    textAlign: 'center',
  },
});
