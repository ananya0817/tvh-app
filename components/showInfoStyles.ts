import { Platform, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#625161",
    padding: 15,
  },

  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(98, 81, 97, 0.5)",
    zIndex: 999, 
  },

  /* poster and overview */
  headerContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    width: "100%",
    padding: 15,
    marginTop: Platform.OS === 'ios' ? 35 : 10,
  },

  poster: {
    //marginTop: Platform.OS === 'ios' ? 30: 10,
    width: 140,
    height: 210,
    marginRight: 15,
    elevation: 10,
    borderRadius: 10,
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
    fontFamily: 'Inter',
  },

  subtitle: {
    fontSize: 16,
    color: "white",
    marginTop: 2,
    fontFamily: 'Inter',
  },

  /* overview, networks, & progress bar */
  fullWidthContainer: {
    width: "100%",
    backgroundColor: "#625161",
    borderRadius: 10,
    padding: 15,
    paddingTop: 0,
  },

  overview: {
    fontSize: 14,
    color: "#FFFFFF",
    marginBottom: 10,
    fontFamily: 'Inter',
  },

  networks: {
    fontSize: 12,
    color: "#FFFFFF",
    marginBottom: 10,
    fontFamily: 'Inter',
  },

  progressBarWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: 5,
  },

  progressBarContainer: {
    width: "90%",
    height: 15,
    backgroundColor: "#D9D9D9",
    borderRadius: 20,
    overflow: "hidden",
    elevation: 3,
    zIndex: 5,
  },

  progressText: {
    fontSize: 11,
    color: "white",
    marginLeft: 8,
    elevation: 3,
    fontFamily: 'Inter',
  },

  /* action buttons */
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
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
    fontFamily: 'Inter',
  },

  /* seasons and episodes container */
  seasonsAndEpisodesContainer: {
    width: 390,
    alignSelf: "center",
    backgroundColor: "#625161",
    marginTop: 10,
    borderRadius: 10,
  },

  /* dropdown for seasons */
  pickerContainer: {
    width: 180,
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

  /* season rating & review */
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
    fontFamily: 'Inter',
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

  /* episode container */
  episodeContainer: {
    backgroundColor: "#998498",
    marginTop: 5,
    width: 390,
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },

  episodeTitle: {
    fontSize: 14,
    color: "black",
    marginBottom: 5,
    fontFamily: 'Inter',
  },

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
