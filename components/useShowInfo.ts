import { useEffect, useState } from "react";
import axios from "axios";
import { apiKey } from "./api_links";

export interface ShowInfoData {
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
  seasons: { season_number: number; name: string; episode_count: number }[];
}

export interface Episode {
  id: number;
  name: string;
  episode_number: number;
  season_number: number;
  vote_average: number;
}

export const useShowInfo = (showId: string | number, selectedSeason: number) => {
  const [showDetails, setShowDetails] = useState<ShowInfoData | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [episodeLoading, setEpisodeLoading] = useState(false);
  const [mainSeriesEpisodeCount, setMainSeriesEpisodeCount] = useState<number>(0);
  const [totalEpisodeCount, setTotalEpisodeCount] = useState<number>(0);

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/tv/${showId}`, {
          params: { language: "en-US" },
          headers: { accept: "application/json", Authorization: `Bearer ${apiKey}` },
        });
        setShowDetails(response.data);

        let mainCount = 0;
        let totalCount = 0;
        response.data.seasons.forEach((season: { season_number: number; episode_count: number }) => {
          totalCount += season.episode_count;
          if (season.season_number !== 0) {
            mainCount += season.episode_count;
          }
        });
        setMainSeriesEpisodeCount(mainCount);
        setTotalEpisodeCount(totalCount);

      } catch (error) {
        console.error("Error fetching show details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchShowDetails();
  }, [showId]);

  useEffect(() => {
    if (!showDetails) return;
    const fetchEpisodes = async () => {
      setEpisodeLoading(true);
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/tv/${showId}/season/${selectedSeason}`,
          {
            params: { language: "en-US" },
            headers: { accept: "application/json", Authorization: `Bearer ${apiKey}` },
          }
        );
        setEpisodes(response.data.episodes || []);
      } catch (error) {
        console.error("Error fetching episodes:", error);
      } finally {
        setEpisodeLoading(false);
      }
    };
    fetchEpisodes();
  }, [showId, selectedSeason, showDetails]);

  return { showDetails, episodes, loading, episodeLoading, mainSeriesEpisodeCount, totalEpisodeCount };
};
