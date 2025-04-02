import { StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from "react";
import { Text, View } from '@/components/Themed';
import { Button } from '@rneui/base';
import { supabase } from '../../utils/supabase';
import { apiKey } from "../../components/api_links";
import { Session } from '@supabase/supabase-js';
import axios from 'axios';
import { router } from 'expo-router';


interface Show {
  id: number;
  name: string;
  poster_path: string | null;
}

export default function Watchlists() {
  const [selected, setSelected] = useState<"toWatch" | "watched">("toWatch");
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

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

  const fetchUserShows = async () => {
    if(userId == "")
    {
      return;
    }
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('UserShows')
        .select('show_id')
        .eq('user', session?.user?.id || "")
        .eq(selected === 'toWatch' ? 'to_watch' : 'watching', true);

      if (error) throw error;

      const showIds = data?.map(item => item.show_id) || [];
      const showsData = await Promise.all(
        showIds.map(async (id) => await fetchShowDetails(id))
      );

      setShows(showsData.filter((show): show is Show => 
        show !== null && show.poster_path !== null
      ));
    } catch (error) {
      console.error('Error fetching shows:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserShows();
  }, [selected]);

  return (
    <View style={styles.container}>
      {/* Toggle Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          title="To Watch"
          onPress={() => setSelected("toWatch")}
          buttonStyle={[
            styles.button,
            { backgroundColor: selected === "toWatch" ? "#AF9FAE" : "#D9D9D9" },
          ]}
          titleStyle={styles.buttonText}
        />
        <Button
          title="Watched"
          onPress={() => setSelected("watched")}
          buttonStyle={[
            styles.button,
            { backgroundColor: selected === "watched" ? "#AF9FAE" : "#D9D9D9" },
          ]}
          titleStyle={styles.buttonText}
        />
      </View>

      {/* Shows Grid */}
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <FlatList
          data={shows}
          numColumns={3}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.show}>
              <TouchableOpacity 
                onPress={() => router.push({ 
                  pathname: "/showDetails", 
                  params: { 
                    showId: item.id, 
                    userId1: userId 
                  } 
                })}
              >
                <Image 
                  source={{ uri: `https://image.tmdb.org/t/p/w200/${item.poster_path}` }} 
                  style={styles.poster} 
                />
              </TouchableOpacity>
            </View>
          )}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No {selected === 'toWatch' ? 'shows to watch' : 'watched shows'}
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#625161",
    paddingTop: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: "#625161",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: 140,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  showContainer: {
    flex: 1,
    margin: 2,
    backgroundColor: 'none',
    borderRadius: 10,
    padding: 0,
    alignItems: 'center',
    maxWidth: '33%', // Changed from 45% to match 3-column layout
  },
  poster: {
    width: 110, // Match shows component
    height: 160, // Match shows component
    borderRadius: 10,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 35,
  },
  listContent: {
    paddingBottom: 20,
  },
  loadingText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
  emptyText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
  show: {
    flexDirection: "column",
    alignItems: "center",
    margin: 2,
    backgroundColor: 'none',
  },
  showCard: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
});