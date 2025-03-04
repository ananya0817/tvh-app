import { StyleSheet } from "react-native";

const reviewModalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#625161",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    height: "85%",
  },  
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  closeButton: {
    padding: 5,
  },
  reviewList: {
    maxHeight: 200,
    width: "100%",
  },
  reviewItem: {
    backgroundColor: "#998498",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: "100%",
  },
  reviewText: {
    fontSize: 14,
    color: "white",
  },
  reviewDate: {
    fontSize: 12,
    color: "white",
    marginTop: 5,
  },
  noReviewsText: {
    marginTop: "200%",
    textAlign: "center",
    fontSize: 14,
    color: "white",
    marginBottom: 10,
 },

  reviewListContainer: {
    flex: 1,  
  },  
  
  inputContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#5B4B5A",
    padding: 10,
  },
  
  reviewInput: {
    height: 40,
    borderRadius: 5,
    padding: 10,
    marginBottom: 5,
    backgroundColor: "#998498",
  },
  
  submitButton: {
    backgroundColor: "#645C6E",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },  
});

export default reviewModalStyles;
