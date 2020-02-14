import React from "react";

import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
const CartItem = props => {
  return (
    <View style={styles.cartItem}>
      <View style={styles.description}>
        <Text style={styles.quantity}>{props.quantity}</Text>
        <Text style={styles.title}>{props.title}</Text>
      </View>

      <View style={styles.itemData}>
        <Text style={styles.ammount}>${props.amount.toFixed(2)}</Text>

        {props.deletable && (
          <TouchableOpacity
            onPress={props.onRemove}
            style={styles.deleteButton}
          >
            <Ionicons
              name={Platform.OS === "android" ? "md-trash" : "ios-trash"}
              size={23}
              color="red"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cartItem: {
    padding: 10,
    backgroundColor: "white",
    justifyContent: "space-between",
    marginHorizontal: 20,
    flexDirection: "row",
    borderColor: "#eee",
    borderWidth: 1,
    marginVertical: 10,
    borderRadius: 5
  },
  itemData: {
    flexDirection: "row",
    alignItems: "center"
  },
  quantity: {
    fontFamily: "open-sans",
    color: "#888",
    fontSize: 16,
    marginHorizontal: 10
  },
  title: {
    fontFamily: "open-sans-bold",
    fontSize: 16
  },
  amount: {
    fontFamily: "open-sans-bold",
    fontSize: 16
  },
  deleteButton: {
    marginLeft: 20
  },
  description: {
    flexDirection: "row"
  }
});

export default CartItem;
