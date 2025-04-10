// components/resetAlertModal.tsx
import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";

type Props = {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const ResetAlertModal = ({ visible, onConfirm, onCancel }: Props) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Are you sure?</Text>
          <Text style={styles.message}>
            Clicking this button will reset all episode ratings and completion data.
          </Text>
          <View style={styles.buttons}>
            <TouchableOpacity onPress={onCancel} style={[styles.button, styles.cancel]}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm} style={[styles.button, styles.confirm]}>
              <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "rgb(98, 81, 97)",
    padding: 24,
    borderRadius: 12,
    width: "80%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
    color: "white"
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: "white"
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  cancel: {
    backgroundColor: "#AF9FAE",
  },
  confirm: {
    backgroundColor: "#AF9FAE",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ResetAlertModal;
