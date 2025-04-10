import { Platform, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: 10,
    elevation: 10,
    backgroundColor: "#8d7a8e",
    paddingBottom: 1,
    paddingTop: Platform.OS === 'ios' ? 25 : 0,
  },

  showCard: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },

  show: {
    flexDirection: "column",
    alignItems: "center",
    margin: 2,
  },

  showImg: {
    overflow: "hidden",
  },

  poster: {
    width: 110,
    height: 160,
    borderRadius: 10,
    padding: 0,
    elevation: 5,
  },

  showInfo: {
    alignItems: "center",
    maxWidth: 200,
  },

  searchInput: {
    width: "85%",
    height: 40,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 9,
    paddingBottom: 10,
    backgroundColor: "#AF9FAE",
    marginBottom: 10,
    marginVertical: 35,
    //marginVertical: Platform.OS === "ios" ? 25 : 5,
    //top: Platform.OS === "ios" ? 1 : 10,
    //alignSelf: "center",
    textAlign: "center",
    textAlignVertical: 'center',
    alignItems: "center",
    fontWeight: "bold",
    fontSize: 16,
    flexDirection: "row",
    justifyContent: "center",
    fontFamily: 'Inter',
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#AF9FAE",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 10,
    elevation: 3,
    borderColor: "black",
    borderWidth: 1,
  },
  filterButton: {
    flex: 1,
    alignItems: "center",
    padding: 5,
  },
  filterText: {
    fontSize: 16,
    color: "black",
    fontFamily: 'Inter',
  },
  divider: {
    height: "80%",
    width: 1.2,
    backgroundColor: "black",
  },  
  dropdown: {
    backgroundColor: "#AF9FAE",
    position: "absolute",
    top: 81,
    left: 10,
    right: 10,
    borderRadius: 10,
    paddingVertical: 5,
    zIndex: 1,
    borderWidth: 1,
    
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#625161",
  },
  dropdownText: {
    fontSize: 16,
    color: "#000",
    fontFamily: 'Inter',
  },
  header: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  selectedFilterButton: {
    backgroundColor: "#625161",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "black",
  },
  selectedFilterText: {
    color: "#000",
    fontWeight: "bold",
    fontFamily: 'Inter',
  },
  searchIcon: {
    paddingTop: 27,
    position: "absolute",
    zIndex: 100,
    left: 50,
    top: Platform.OS === 'ios' ? 41 : 0,
  },
});

export default styles;
