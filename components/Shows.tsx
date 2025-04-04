import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import styles from "./showStyles";
import { apiKey } from "./api_links";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/utils/supabase";

interface ShowTypes {
  id: number;
  name: string;
  poster_path: string;
  vote_average: number;
  first_air_date: string;
  last_air_date: string;
  genre_ids: number[];
}

const Shows = () => {
  const [showItems, setShowItems] = useState<ShowTypes[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    year: "Year",
    genre: "Genre",
    ratings: "Ratings",
    service: "Service",
  });
  const [dropdownVisible, setDropdownVisible] = useState("");

  const [years, setYears] = useState<string[]>([]);
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [networks, setNetworks] = useState<{ id: number; name: string }[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const numColumns = 3;

  const [session, setSession] = useState<Session | null>(null);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUserId(session?.user?.id || "");
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUserId(session?.user?.id || "");
    });
  }, []);

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    setShowItems([]);
    setCurrentPage(1);
    fetchShows(true);
  }, [searchQuery, selectedFilters]);

  useFocusEffect(
    React.useCallback(() => {
      resetFilters();
    }, [])
  );

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedFilters({
      year: "Year",
      genre: "Genre",
      ratings: "Ratings",
      service: "Service",
    });
    setShowItems([]);
    setCurrentPage(1);
  };

  const fetchFilters = async () => {
    try {
      const genreResponse = await axios.get("https://api.themoviedb.org/3/genre/tv/list", {
        params: { language: "en-US" },
        headers: { accept: "application/json", Authorization: `Bearer ${apiKey}` },
      });
      setGenres(genreResponse.data.genres);

      const networksResponse = await axios.get("https://api.themoviedb.org/3/watch/providers/tv", {
        params: { language: "en-US", watch_region: "US" },
        headers: { accept: "application/json", Authorization: `Bearer ${apiKey}` },
      });

      type ProviderType = { provider_id: number; provider_name: string };
      const validNetworks = networksResponse.data.results
        .filter((provider: ProviderType) => provider.provider_id && provider.provider_name)
        .map((provider: ProviderType) => ({ id: provider.provider_id, name: provider.provider_name }));
      setNetworks(validNetworks);
      setYears(Array.from({ length: 80 }, (_, i) => (2025 - i).toString()));
    } catch (error) {
      console.error("Error fetching filters:", error);
    }
  };

  const ratingOptions = [
    { label: "Top Rated", value: "8" },
    { label: "Popular", value: "6" },
    { label: "All", value: "" },
  ];

  const fetchShows = async (initialLoad = false) => {
    if (loading || currentPage > totalPages) return;
    try {
        setLoading(true);
        const endpoint = searchQuery
            ? "https://api.themoviedb.org/3/search/tv"
            : "https://api.themoviedb.org/3/discover/tv";

        const params: any = {
            include_adult: "false",
            include_null_first_air_dates: "false",
            language: "en-US",
            sort_by: "popularity.desc",
            page: initialLoad ? 1 : currentPage,
            watch_region: "US",
        };

        if (searchQuery) {
            params.query = searchQuery;
        } else {
            if (selectedFilters.year !== "Year") params.first_air_date_year = selectedFilters.year;
            if (selectedFilters.genre !== "Genre") {
                const genre = genres.find((g) => g.name === selectedFilters.genre);
                if (genre) params.with_genres = genre.id.toString();
            }
            if (selectedFilters.ratings !== "Ratings" && selectedFilters.ratings !== "")
                params["vote_average.gte"] = selectedFilters.ratings;

            if (selectedFilters.service !== "Service") {
                const network = networks.find((n) => n.name === selectedFilters.service);
                if (network && network.id !== undefined) {
                    params.with_watch_providers = network.id.toString();
                }
            } else {
                if (!searchQuery){
                  const providersResponse = await axios.get(
                    'https://api.themoviedb.org/3/watch/providers/tv?language=en-US&watch_region=US',
                    {
                      headers: { accept: "application/json", Authorization: `Bearer ${apiKey}` },
                    }
                  );
                  const usProviders = providersResponse.data.results.map((provider: { provider_id: any; }) => provider.provider_id).join('|');
                  params.with_watch_providers = usProviders;
                }
            }
        }

        const response = await axios.get(endpoint, {
            params,
            headers: { accept: "application/json", Authorization: `Bearer ${apiKey}` },
        });

        let newResults: ShowTypes[] = response.data.results;

        if (searchQuery) {
            let filteredResults = newResults;

            if (selectedFilters.year !== "Year") {
                const selectedYear = parseInt(selectedFilters.year, 10);
                filteredResults = filteredResults.filter((item) => {
                    if (!item.first_air_date) return false;
                    const startYear = parseInt(item.first_air_date.substring(0, 4), 10);
                    const endYear = item.last_air_date
                        ? parseInt(item.last_air_date.substring(0, 4), 10)
                        : new Date().getFullYear();
                    return selectedYear >= startYear && selectedYear <= endYear;
                });
            }

            if (selectedFilters.genre !== "Genre") {
                const genre = genres.find((g) => g.name === selectedFilters.genre);
                if (genre) {
                    filteredResults = filteredResults.filter(
                        (item) => item.genre_ids && item.genre_ids.includes(genre.id)
                    );
                }
            }

            if (selectedFilters.ratings !== "Ratings" && selectedFilters.ratings !== "") {
                filteredResults = filteredResults.filter(
                    (item) => item.vote_average >= parseFloat(selectedFilters.ratings)
                );
            }

            newResults = filteredResults;
        }

        setShowItems((prevItems) => {
            const existingIds = new Set(prevItems.map((item) => item.id));
            const nonDuplicates = newResults.filter((item) => !existingIds.has(item.id));
            return initialLoad ? nonDuplicates : [...prevItems, ...nonDuplicates];
        });

        setTotalPages(response.data.total_pages);
        setCurrentPage((prevPage) => prevPage + 1);
    } catch (error) {
        console.error("Error fetching shows:", error);
    } finally {
        setLoading(false);
    }
  };

  const toggleDropdown = (filterType: keyof typeof selectedFilters) => {
    setDropdownVisible(dropdownVisible === filterType ? "" : filterType);
  };

  const applyFilter = (filterType: keyof typeof selectedFilters, value: string) => {
    const newVal = value === "" ? defaultText[filterType] : value;
    setSelectedFilters({ ...selectedFilters, [filterType]: newVal });
    setDropdownVisible("");

    if (value === "") {
      setShowItems([]);
      setCurrentPage(1);
      fetchShows(true);
    }
  };

  const defaultText = {
    year: "Year",
    genre: "Genre",
    ratings: "Ratings",
    service: "Service",
  };

  return (
    <View style={styles.container}>
      <FontAwesome name="search" size={20} color="black" style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search Show Title"
        value={searchQuery}
        onChangeText={setSearchQuery}
        autoCapitalize="none"
        autoCorrect={false}
        placeholderTextColor={"black"}
      />

      {/* filters */}
      <View style={styles.filterContainer}>
        {["year", "genre", "ratings", "service"].map((filterType, index) => (
          <React.Fragment key={filterType}>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => toggleDropdown(filterType as keyof typeof selectedFilters)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilters[filterType as keyof typeof selectedFilters] !== defaultText[filterType as keyof typeof defaultText]
                    ? styles.selectedFilterText
                    : {},
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {selectedFilters[filterType as keyof typeof selectedFilters]}
              </Text>
            </TouchableOpacity>
            {index < 3 && <View style={styles.divider} />}
          </React.Fragment>
        ))}
      </View>

      {/* dropdown list */}
      {dropdownVisible !== "" && (
        <ScrollView style={styles.dropdown} nestedScrollEnabled>
          <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled>
            <TouchableOpacity style={styles.dropdownItem} onPress={() => applyFilter(dropdownVisible as keyof typeof selectedFilters, "")}>
              <Text style={styles.dropdownText}>None</Text>
            </TouchableOpacity>
            {(dropdownVisible === "year" ? years :
              dropdownVisible === "genre" ? genres.map((g) => g.name) :
              dropdownVisible === "ratings" ? ratingOptions.map((r) => r.label) :
              networks.map((n) => n.name)
            ).map((option) => (
              <TouchableOpacity key={option} style={styles.dropdownItem} onPress={() => applyFilter(dropdownVisible as keyof typeof selectedFilters, option)}>
                <Text style={styles.dropdownText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </ScrollView>
      )}

      <Text style={styles.header}>
        {searchQuery ||
        Object.keys(selectedFilters).some(
          (filterType) =>
            selectedFilters[filterType as keyof typeof selectedFilters] !==
            defaultText[filterType as keyof typeof defaultText]
        )
          ? "Search Results"
          : "Popular Shows This Week"}
      </Text>

      <FlatList
        data={showItems.filter((item) => item.poster_path)}
        numColumns={numColumns}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => (
          <View style={styles.show}>
            <TouchableOpacity onPress={() => router.push({ pathname: "/showDetails", params: { showId: item.id, userId1: userId } })}>
              <Image source={{ uri: `https://image.tmdb.org/t/p/w200/${item.poster_path}` }} style={styles.poster} />
            </TouchableOpacity>
          </View>
        )}
        onEndReached={() => fetchShows()}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator size="large" color="black" /> : null}
      />
    </View>
  );
};

export default Shows;
