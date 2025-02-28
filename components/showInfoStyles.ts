import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#625161",
    padding: 15,
  },

  /* Header: Poster + Basic Info */
  headerContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    width: "100%",
    padding: 15,
  },

  poster: {
    width: 140,
    height: 210,
    marginRight: 15,
    elevation: 10,
  },

  detailsContainer: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    marginTop: 10,
    fontSize: 25,
    fontWeight: "bold",
    color: "white",
  },

  subtitle: {
    fontSize: 16,
    color: "white",
    marginTop: 2,
  },

  /* Full-Width Overview, Networks, Progress Bar */
  fullWidthContainer: {
    width: "100%",
    backgroundColor: "#625161",
    borderRadius: 10,
    padding: 15,
    paddingTop: 0,
  },

  overview: {
    fontSize: 14,
    color: "white",
    marginBottom: 10,
  },

  networks: {
    fontSize: 14,
    color: "white",
    fontWeight: "bold",
  },

  progressBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 15,
    backgroundColor: "#D9D9D9",
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 5,
    elevation: 3,
  },

  progressText: {
    fontSize: 10,
    color: "black",
    marginLeft: 10,
  },

  /* Action Buttons: Watchlist, Write Review, Completed */
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#998498",
    paddingVertical: 10,
    width: 415,
    marginTop: 10,
  },

  actionButton: {
    alignItems: "center",
    padding: 5,
  },

  actionText: {
    fontSize: 12,
    color: "white",
    marginTop: 5,
  },

  /* Container for Seasons & Episodes (Fixed Width) */
  seasonsAndEpisodesContainer: {
    width: 390,              // <=== FIXED WIDTH
    alignSelf: "center",     // center horizontally
    backgroundColor: "#625161",
    marginTop: 10,
    borderRadius: 10,
  },

  /* Season Dropdown (smaller, left-justified) */
  pickerContainer: {
    width: 180,  // <=== smaller width
    backgroundColor: "#D9D9D9",
    marginBottom: 10,
    padding: 5,
    paddingLeft: 5,
  },

  picker: {
    color: "black",
    height: 55,
    margin: -10,
  },

  /* Season Rating + Review Section */
  seasonRatingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#D9D9D9",
    padding: 10,
    marginBottom: 10,
  },

  leftSeasonBox: {
    flexDirection: "column",
    alignItems: "flex-start",
  },

  seasonRatingText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
  },

  starsRow: {
    flexDirection: "row",
    marginTop: 5,
  },

  rightReviewBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  reviewButton: {
    backgroundColor: "#D9D9D9",
    padding: 5,
    borderRadius: 5,
    marginLeft: 5,
  },

  reviewIcon: {
    color: "black",
    fontSize: 18,
  },

  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },

  /* Episode Container (two lines) */
  episodeContainer: {
    backgroundColor: "#998498",
    marginTop: 5,
    width: 390, // <=== FIXED WIDTH for episodes
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },

  episodeTitle: {
    fontSize: 14,
    color: "black",
    marginBottom: 5,
  },

  /* second line: comment icon, stars, checkmark */
  episodeSecondLine: {
    flexDirection: "row",
    alignItems: "center",
  },

  commentButton: {
    marginRight: 5,
  },

  ratingContainer: {
    flexDirection: "row",
    marginRight: 8,
  },

  checkmarkButton: {
    marginLeft: "auto",
  },
});

export default styles;
